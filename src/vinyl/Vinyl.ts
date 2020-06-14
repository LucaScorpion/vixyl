import { isPoint, Point } from '../util/Point';
import { Pixel } from '../util/Pixel';

export default class Vinyl {
  private readonly imageData: ImageData;

  constructor(context: CanvasRenderingContext2D) {
    this.imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
  }

  public get width() {
    return this.imageData.width;
  }

  public get height() {
    return this.imageData.height;
  }

  public getPixel(pos: Point): Pixel;
  public getPixel(x: number, y: number): Pixel;
  public getPixel(xOrPos: Point | number, y?: number): Pixel {
    let xVal: number;
    let yVal: number;
    if (isPoint(xOrPos)) {
      xVal = xOrPos.x;
      yVal = xOrPos.y;
    } else {
      xVal = xOrPos;
      yVal = y || 0;
    }

    const offset = (xVal + yVal * this.imageData.width) * 4;
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
}
