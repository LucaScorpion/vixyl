import EncoderDecoder, { EncodeFormOption, EncodeOptions } from './EncoderDecoder';
import Point, { isSamePoint } from '../../util/Point';
import Pixel, { decodeInt24Pixel, encodeInt24Pixel, encodeStringGrayPixels, isDataPixel } from '../../util/Pixel';
import { drawCircle, drawPixel } from '../../util/draw';
import { FileInfo } from '../FileInfo';
import CanvasImage from '../CanvasImage';
import { RGBColor } from 'react-color';

export interface Options {
  addQr: boolean;
  bgColor: RGBColor;
}

export interface Spiral {
  points: Point[];
  radius: number;
}

export default abstract class SpiralBase implements EncoderDecoder<Options> {
  protected abstract getPixels(data: Uint8Array): Pixel[];

  protected abstract getBytes(pixels: Pixel[]): Uint8Array;

  public getEncodeForm(): EncodeFormOption[] {
    return [
      {
        key: 'addQr',
        type: 'boolean',
        text: 'Add QR code',
        defaultValue: true,
      },
      {
        key: 'bgColor',
        type: 'color',
        text: 'Background color',
        defaultValue: {
          r: 0,
          g: 0,
          b: 0,
        },
      },
    ];
  }

  public async encode(file: FileInfo, options: EncodeOptions<Options>): Promise<void> {
    const pixels = [
      encodeInt24Pixel(file.type.length),   // File type length
      ...encodeStringGrayPixels(file.type), // File type
      encodeInt24Pixel(file.data.length),   // Data length
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

    // Draw the background circle.
    const bgColor = options.form.bgColor;
    const alpha = Math.min(bgColor.a == null ? 1 : bgColor.a, 0.99);
    drawCircle(context, center.x, center.y, size / 2, `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, ${alpha})`);

    // Draw the inner circle and QR code.
    drawCircle(context, center.x, center.y, spiral.points[spiral.points.length - 1].x - 5, 'white');
    if (options.form.addQr) {
      const qrImg = new Image();
      await new Promise(res => {
        qrImg.addEventListener('load', () => {
          context.drawImage(qrImg, Math.round(center.x - qrImg.width / 2), Math.round(center.y - qrImg.height / 2));
          res();
        });
        qrImg.src = 'vixyl/qr.png';
      });
    }

    // Draw all the spiral pixels.
    for (let i = 0; i < spiral.points.length; i++) {
      const point = spiral.points[i];
      drawPixel(context, point.x + center.x, point.y + center.y, pixels[i]);
    }

    // Encode the starting point on y=1.
    const startingPoint = spiral.points[0];
    drawPixel(context, 0, 1, encodeInt24Pixel(startingPoint.x + center.x));
    drawPixel(context, 1, 1, encodeInt24Pixel(startingPoint.y + center.y));
  }

  public decode(image: CanvasImage): FileInfo {
    const startingPoint = {
      x: decodeInt24Pixel(image.getPixel(0, 1)),
      y: decodeInt24Pixel(image.getPixel(1, 1)),
    };

    const pixels = this.readVinylTrack(image, startingPoint);

    // Read the file type.
    const fileTypeLength = decodeInt24Pixel(pixels[0]);
    let type = '';
    for (let i = 0; i < fileTypeLength; i++) {
      type = `${type}${String.fromCharCode(pixels[i + 1].red)}`;
    }

    // Read the data.
    const dataLength = decodeInt24Pixel(pixels[fileTypeLength + 1]);
    const data = this.getBytes(pixels.slice(fileTypeLength + 2)).slice(0, dataLength);

    return ({
      type,
      data,
    });
  }

  private createSpiral(length: number): Spiral {
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

  private readVinylTrack(vinyl: CanvasImage, trackStart: Point): Pixel[] {
    const data: Pixel[] = [];

    let prevPos = trackStart;
    let pos: Point | null = trackStart;

    while (pos) {
      // Read the pixel data, push it.
      let pixel = vinyl.getPixel(pos);
      data.push(pixel);

      // Get the next pixel position.
      const nextPos = this.findNextPixel(vinyl, prevPos, pos);
      prevPos = pos;
      pos = nextPos;
    }

    return data;
  }

  private findNextPixel(vinyl: CanvasImage, previous: Point, current: Point): Point | null {
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
        if (!vinyl.isInBounds(nextPoint)) {
          continue;
        }

        // Get the pixel data, check if it is valid.
        const data = vinyl.getPixel(nextPoint);
        if (isDataPixel(data)) {
          return nextPoint;
        }
      }
    }

    return null;
  }
}
