import { Pixel } from '../../util/Pixel';

export default function parseRainbowVinyl(pixels: Pixel[]): Uint8Array {
  const result = new Uint8Array(pixels.length * 3);
  for (let i = 0; i < pixels.length; i++) {
    const pixel = pixels[i];
    result[i * 3] = pixel.red;
    result[i * 3 + 1] = pixel.green;
    result[i * 3 + 2] = pixel.blue;
  }
  return result;
}
