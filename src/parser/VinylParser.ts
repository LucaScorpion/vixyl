import { Pixel } from './Pixel';
import { isSamePoint, Point } from './Point';
import Vinyl from './Vinyl';

export default class VinylParser {
  private readonly vinyl: Vinyl;

  constructor(context: CanvasRenderingContext2D) {
    this.vinyl = new Vinyl(context);
  }

  public parseVinyl(startX: number, startY: number): Uint8Array {
    const data: number[] = [];

    let prevPos = { x: startX, y: startY };
    let pos: Point | null = { x: startX, y: startY };

    while (pos) {
      // Read the pixel data, push it.
      let pixel = this.vinyl.getPixel(pos);
      data.push(pixel.red);

      // Get the next pixel position.
      const nextPos = this.findNextPixel(prevPos, pos);
      prevPos = pos;
      pos = nextPos;
    }

    return new Uint8Array(data);
  }

  public detectStartingPoint(): Point | null {
    const options: Point[] = [];

    for (let x = 0; x < this.vinyl.width; x++) {
      for (let y = 0; y < this.vinyl.height; y++) {
        const pos = { x, y };
        const pixel = this.vinyl.getPixel(pos);

        if (!this.isDataPixel(pixel)) {
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
            if (this.isDataPixel(data)) {
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

  private findNextPixel(previous: Point, current: Point): Point | null {
    for (let dX = -1; dX <= 1; dX++) {
      for (let dY = -1; dY <= 1; dY++) {
        const nextPoint = ({
          x: current.x + dX,
          y: current.y + dY,
        });

        // Check if the point is the same as the previous or current point.
        if (isSamePoint(nextPoint, previous) || isSamePoint(nextPoint, current)) {
          continue;
        }

        // Check if the point is in bounds.
        if (!this.vinyl.isInBounds(nextPoint)) {
          continue;
        }

        // Get the pixel data, check if it is valid.
        const data = this.vinyl.getPixel(nextPoint);
        if (this.isDataPixel(data)) {
          return nextPoint;
        }
      }
    }

    return null;
  }

  private isDataPixel(data: Pixel): boolean {
    return (data.red !== 0 || data.green !== 0 || data.blue !== 0) && data.alpha !== 0;
  }
}
