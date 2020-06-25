import { Pixel } from '../../util/Pixel';
import VinylDecoder from './VinylDecoder';
import { VinylFormat } from '../VinylFormat';
import GrayVinylDecoder from './GrayVinylDecoder';
import RainbowVinylDecoder from './RainbowVinylDecoder';

export default function decodeVinylMeta(pixels: Pixel[]): VinylDecoder | null {
  // The first 5 pixels should decode to "Vixyl".
  const hasMeta = ['V', 'i', 'x', 'y', 'l'].every((letter, i): boolean => isLetter(pixels[i], letter));
  if (!hasMeta) {
    console.log('Not a Vixyl track');
    return null;
  }

  const encoding: VinylFormat = pixels[5].red;

  switch (encoding) {
    case VinylFormat.GRAY:
      return new GrayVinylDecoder();
    case VinylFormat.RAINBOW:
      return new RainbowVinylDecoder();
    default:
      console.error('Invalid encoding');
      return null;
  }
}

function isLetter(pixel: Pixel, letter: string): boolean {
  const char = letter.charCodeAt(0);
  return pixel.red === char && pixel.green === char && pixel.blue === char && pixel.alpha === 255;
}
