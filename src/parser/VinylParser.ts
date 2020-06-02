import { PixelData } from './PixelData';
import { Point } from './Point';

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
      prevPos = pos;
      pos = this.findNextPixel(prevPos, pos);
    }

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
