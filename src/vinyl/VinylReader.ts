import { isDataPixel } from '../util/Pixel';
import { Point } from '../util/Point';
import Vinyl from './Vinyl';

export default class VinylReader {
  constructor(private readonly vinyl: Vinyl) {
  }

  public detectStartingPoint(): Point | null {
    const options: Point[] = [];

    for (let x = 0; x < this.vinyl.width; x++) {
      for (let y = 0; y < this.vinyl.height; y++) {
        const pos = { x, y };
        const pixel = this.vinyl.getPixel(pos);

        if (isDataPixel(pixel)) {
          continue;
        }

        let hits = -1;
        for (let dX = -1; dX <= 1; dX++) {
          for (let dY = -1; dY <= 1; dY++) {
            const nextPoint = ({
              x: pos.x + dX,
              y: pos.y + dY,
            });

            // Check if the point is in bounds.
            if (!this.vinyl.isInBounds(nextPoint)) {
              continue;
            }

            // Get the pixel data, check if it is valid.
            const data = this.vinyl.getPixel(nextPoint);
            if (isDataPixel(data)) {
              hits++;
            }
          }
        }

        if (hits === 1) {
          options.push(pos);
        }
      }
    }

    let closest: Point = options[0];
    let closestDist = this.getDistanceToEdge(options[0]);
    for (let i = 1; i < options.length; i++) {
      let dist = this.getDistanceToEdge(options[i]);
      if (dist < closestDist) {
        closestDist = dist;
        closest = options[i];
      }
    }

    return closest;
  }

  private getDistanceToEdge(pos: Point): number {
    let minDist = pos.x < pos.y ? pos.x : pos.y;
    if (this.vinyl.width - pos.x < minDist) {
      minDist = this.vinyl.width - pos.x;
    }
    if (this.vinyl.height - pos.y < minDist) {
      minDist = this.vinyl.height - pos.y;
    }
    return minDist;
  }
}
