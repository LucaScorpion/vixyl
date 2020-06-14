import { VinylMeta } from './VinylMeta';
import Vinyl from './Vinyl';
import { Pixel } from '../util/Pixel';

export default function parseVinylMeta(vinyl: Vinyl): VinylMeta | null {
  // If the vinyl contains metadata, the top-left 5 pixels should decode to "Vixyl".
  const hasMeta = ['V', 'i', 'x', 'y', 'l'].every((letter, i): boolean => isLetter(vinyl.getPixel(i, 0), letter));
  if (!hasMeta) {
    return null;
  }

  // The RGB values of the first two pixels on y=1 encode the track starting position as an Int24.
  const trackStart = {
    x: decodeInt24(vinyl.getPixel(0, 1)),
    y: decodeInt24(vinyl.getPixel(1, 1)),
  };

  // The values on y=2 encode WAV format information.
  // TODO

  return ({
    trackStart,
    format: {
      channels: 1,
      sampleRate: 4000,
      bitsPerSample: 8,
    },
  });
}

function isLetter(pixel: Pixel, letter: string): boolean {
  const char = letter.charCodeAt(0);
  return pixel.red === char && pixel.green === char && pixel.blue === char && pixel.alpha === 255;
}

function decodeInt24(pixel: Pixel): number {
  return pixel.red + (pixel.green << 8) + (pixel.blue << 16);
}
