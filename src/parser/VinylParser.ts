import { PixelData } from './PixelData';
import { isSamePoint, Point } from './Point';

export default class VinylParser {
  private readonly imageData: ImageData;

  constructor(context: CanvasRenderingContext2D) {
     this.imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
  }

  public parseVinyl(startX: number, startY: number): Uint8Array {
    const data: number[] = [];

    let prevPos = { x: startX, y: startY };
    let pos: Point | null = { x: startX, y: startY };

    while (pos) {
      // Read the pixel data, push it.
      let pixel = this.getPixelData(pos);
      data.push(pixel.red);

      // Get the next pixel position.
      const nextPos = this.findNextPixel(prevPos, pos);
      prevPos = pos;
      pos = nextPos;
    }

    return new Uint8Array(data);
  }

  public detectStartingPoint(): Point[] {
    const options: Point[] = [];
    for (let x = 0; x < this.imageData.width; x++) {
      for (let y = 0; y < this.imageData.height; y++) {
        const pos = {x, y};
        const pixel = this.getPixelData(pos);

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
            if (!this.isInBounds(nextPoint)) {
              continue;
            }

            // Get the pixel data, check if it is valid.
            const data = this.getPixelData(nextPoint);
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
    return options;
  }

  private getPixelData(pos: Point): PixelData {
    const offset = (pos.x + pos.y * this.imageData.width) * 4;
    const data = this.imageData.data.slice(offset, offset + 4);
    return ({
      red: data[0],
      green: data[1],
      blue: data[2],
      alpha: data[3],
    });
  }

  private isInBounds(pos: Point): boolean {
    return pos.x >= 0 && pos.y >= 0 && pos.x < this.imageData.width && pos.y < this.imageData.height;
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
        if (!this.isInBounds(nextPoint)) {
          continue;
        }

        // Get the pixel data, check if it is valid.
        const data = this.getPixelData(nextPoint);
        if (this.isDataPixel(data)) {
          return nextPoint;
        }
      }
    }

    return null;
  }

  private isDataPixel(data: PixelData): boolean {
    return (data.red !== 0 || data.green !== 0 || data.blue !== 0) && data.alpha !== 0;
  }
}
