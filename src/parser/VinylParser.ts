import { PixelData } from './PixelData';
import { Point } from './Point';

export default class VinylParser {
  constructor(private readonly context: CanvasRenderingContext2D) {
  }

  public parseVinyl(startX: number, startY: number): number[] {
    const data: number[] = [];

    let prevPos = { x: startX, y: startY };
    let pos = { x: startX, y: startY };

    let pixel = this.getPixelData(pos);
    while (true) {
      data.push(pixel.red);

      // Find the next position, check if we are at the end.
      const nextPos = this.findNextPixel(prevPos, pos);
      if (!nextPos) {
        break;
      }

      prevPos = pos;
      pos = nextPos;

      pixel = this.getPixelData(pos);
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

  private findNextPixel(previous: Point, current: Point): Point | null {
    return null;
  }
}
