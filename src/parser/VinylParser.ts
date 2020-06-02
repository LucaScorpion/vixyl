import { PixelData } from './PixelData';
import { isSamePoint, Point } from './Point';

export default class VinylParser {
  constructor(private readonly context: CanvasRenderingContext2D) {
  }

  public parseVinyl(startX: number, startY: number): number[] {
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

    console.log(data);

    return data;
  }

  private getPixelData(pos: Point): PixelData {
    const data = this.context.getImageData(pos.x, pos.y, 1, 1).data;
    return ({
      red: data[0],
      green: data[1],
      blue: data[2],
      alpha: data[3],
    });
  }

  private isInBounds(pos: Point): boolean {
    return pos.x >= 0 && pos.y >= 0 && pos.x < this.context.canvas.width && pos.y < this.context.canvas.height;
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
