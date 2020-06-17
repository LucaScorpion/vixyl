import { isDataPixel, Pixel } from '../../util/Pixel';
import { VinylMeta } from '../VinylMeta';
import { isSamePoint, Point } from '../../util/Point';
import CanvasImage from '../CanvasImage';

export default abstract class VinylDecoder {
  constructor(public readonly meta: VinylMeta, private readonly vinyl: CanvasImage) {
  }

  protected abstract parsePixels(pixels: Pixel[]): Uint8Array;

  public decode(): Uint8Array {
    return this.parsePixels(this.readVinyl());
  }

  private readVinyl(): Pixel[] {
    const data: Pixel[] = [];

    let prevPos = this.meta.trackStart;
    let pos: Point | null = this.meta.trackStart;

    while (pos) {
      // Read the pixel data, push it.
      let pixel = this.vinyl.getPixel(pos);
      data.push(pixel);

      // Get the next pixel position.
      const nextPos = this.findNextPixel(prevPos, pos);
      prevPos = pos;
      pos = nextPos;
    }

    return data;
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
        if (isDataPixel(data)) {
          return nextPoint;
        }
      }
    }

    return null;
  }
}
