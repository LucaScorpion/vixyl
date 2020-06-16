import { Pixel } from '../../util/Pixel';

export default function parseGrayVinyl(pixels: Pixel[]): Uint8Array {
  return new Uint8Array(pixels.map(p => p.red));
}
