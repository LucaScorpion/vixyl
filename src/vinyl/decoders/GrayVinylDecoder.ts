import VinylDecoder from './VinylDecoder';
import { Pixel } from '../../util/Pixel';

export default class GrayVinylDecoder extends VinylDecoder {
  parsePixels(pixels: Pixel[]): Uint8Array {
    return new Uint8Array(pixels.map(p => p.red));
  }
}
