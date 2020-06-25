import VinylEncoder from './VinylEncoder';
import { Pixel } from '../../util/Pixel';
import { VinylFormat } from '../VinylFormat';

export default class RainbowVinylEncoder extends VinylEncoder {
  protected getFormat(): VinylFormat {
    return VinylFormat.RAINBOW;
  }

  protected getPixels(data: Uint8Array): Pixel[] {
    const pixels: Pixel[] = [];
    for (let i = 0; i < data.length; i += 3) {
      pixels.push({
        red: data[i],
        green: data[i + 1],
        blue: data[i + 2],
        alpha: 255,
      });
    }
    return pixels;
  }
}
