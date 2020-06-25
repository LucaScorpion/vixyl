import EncoderDecoder, { EncodeOptions } from './EncoderDecoder';
import { Spiral } from '../encoding/Spiral';
import { isSamePoint, Point } from '../../util/Point';
import { encodeInt24Pixel, encodeStringGrayPixels, Pixel } from '../../util/Pixel';
import { drawCircle, drawPixel } from '../../util/draw';
import { FileInfo } from '../FileInfo';

export default abstract class SpiralBase implements EncoderDecoder {
  protected abstract getPixels(data: Uint8Array): Pixel[];

  public async encode(file: FileInfo, options: EncodeOptions): Promise<void> {
    const pixels = [
      encodeInt24Pixel(file.type.length),   // File type length
      ...encodeStringGrayPixels(file.type), // File type
      ...this.getPixels(file.data),         // Data
    ];
    const spiral = this.createSpiral(pixels.length);

    const size = spiral.radius * 2 + 10;
    const context = await options.setCanvasProps({
      width: size,
      height: size,
    });

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    const center = {
      x: Math.round(context.canvas.width / 2),
      y: Math.round(context.canvas.height / 2),
    };

    // Draw the back and inner circle.
    drawCircle(context, center.x, center.y, size / 2, 'rgba(0, 0, 0, 0.99)');
    drawCircle(context, center.x, center.y, spiral.points[spiral.points.length - 1].x - 5, 'white');

    // Draw all the spiral pixels.
    for (let i = 0; i < spiral.points.length; i++) {
      const point = spiral.points[i];
      drawPixel(context, point.x + center.x, point.y + center.y, pixels[i]);
    }
  }

  protected createSpiral(length: number): Spiral {
    const points: Point[] = [];
    let radius = 0;

    const a = 0.5;

    let dT = 0.1;
    let t = Math.PI * 30;
    let previousPoint: Point | undefined;

    const self = this;

    function isPointValid(nextPoint: Point): boolean {
      // If this is the first point, no checks needed.
      if (!previousPoint) {
        return true;
      }

      // Check if the next point is the same as the previous point.
      if (isSamePoint(nextPoint, previousPoint)) {
        dT *= 1.5;
        return false;
      }

      // Check if the next point touches the previous point;
      if (!self.isNeighbor(nextPoint, previousPoint)) {
        dT /= 2;
        return false;
      }

      return true;
    }

    for (let i = 0; i < length; i++) {
      let valid = false;
      let nextPoint = { x: 0, y: 0 };

      while (!valid) {
        // Get the next point.
        nextPoint = {
          x: Math.floor(a * t * Math.cos(t + dT)),
          y: Math.floor(a * t * Math.sin(t + dT)),
        };

        // Check if the next point is adjacent to the previous point.
        valid = isPointValid(nextPoint);
      }

      // Check if the previous point can be removed.
      if (i > 1 && this.isNeighbor(points[i - 2], nextPoint)) {
        delete points[i--];
      }

      // Check the radius.
      const absX = Math.abs(nextPoint.x);
      if (absX > radius) {
        radius = absX;
      }
      const absY = Math.abs(nextPoint.y);
      if (absY > radius) {
        radius = absY;
      }

      // Store the next point, update the previous.
      points[i] = nextPoint;
      previousPoint = nextPoint;

      // Increase t.
      t += dT;
    }

    return ({
      points: points.reverse(),
      radius,
    });
  }

  private isNeighbor(a: Point, b: Point): boolean {
    return Math.abs(a.x - b.x) <= 1 && Math.abs(a.y - b.y) <= 1;
  }
}
