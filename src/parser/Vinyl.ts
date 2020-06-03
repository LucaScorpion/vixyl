import { Point } from './Point';
import { Pixel } from './Pixel';

export default class Vinyl {
  private readonly imageData: ImageData;

  constructor(context: CanvasRenderingContext2D) {
    this.imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
  }

  public getPixel(pos: Point): Pixel {
    const offset = (pos.x + pos.y * this.imageData.width) * 4;
    const data = this.imageData.data.slice(offset, offset + 4);
    return ({
      red: data[0],
      green: data[1],
      blue: data[2],
      alpha: data[3],
    });
  }

  public isInBounds(pos: Point): boolean {
    return pos.x >= 0 && pos.y >= 0 && pos.x < this.imageData.width && pos.y < this.imageData.height;
  }

  public get width() {
    return this.imageData.width;
  }

  public get height() {
    return this.imageData.height;
  }
}
