import { Pixel } from '../../util/Pixel';
import SpiralBase from './SpiralBase';

export default class RainbowSpiral extends SpiralBase {
  protected getPixels(data: Uint8Array): Pixel[] {
    const pixels: Pixel[] = [];
    for (let i = 0; i < data.length; i += 3) {
      pixels.push({
        red: data[i],
        green: data[i + 1] || 0,
        blue: data[i + 2] || 0,
        alpha: 255,
      });
    }
    return pixels;
  }
}
