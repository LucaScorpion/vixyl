import Pixel, { grayPixel} from '../../util/Pixel';
import SpiralBase from './SpiralBase';

export default class GraySpiral extends SpiralBase {
  protected getPixels(data: Uint8Array): Pixel[] {
    const pixels: Pixel[] = [];
    data.forEach(byte => pixels.push(grayPixel(byte)));
    return pixels;
  }

  protected getBytes(pixels: Pixel[]): Uint8Array {
    return new Uint8Array(pixels.map(p => p.red));
  }
}
