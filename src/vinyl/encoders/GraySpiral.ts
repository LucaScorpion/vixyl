import { grayPixel, Pixel } from '../../util/Pixel';
import SpiralBase from './SpiralBase';

export default class GraySpiral extends SpiralBase {
  protected getPixels(data: Uint8Array): Pixel[] {
    const pixels: Pixel[] = [];
    data.forEach(byte => pixels.push(grayPixel(byte)));
    return pixels;
  }
}
