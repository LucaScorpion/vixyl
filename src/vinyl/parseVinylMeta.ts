import { VinylMeta } from './VinylMeta';
import Vinyl from './Vinyl';
import { decodeInt24Pixel, Pixel } from '../util/Pixel';

export default function parseVinylMeta(vinyl: Vinyl): VinylMeta | null {
  // If the vinyl contains metadata, the top-left 5 pixels should decode to "Vixyl".
  const hasMeta = ['V', 'i', 'x', 'y', 'l'].every((letter, i): boolean => isLetter(vinyl.getPixel(i, 0), letter));
  if (!hasMeta) {
    return null;
  }

  // The RGB values of the first two pixels on y=1 encode the track starting position as an Int24.
  const trackStart = {
    x: decodeInt24Pixel(vinyl.getPixel(0, 1)),
    y: decodeInt24Pixel(vinyl.getPixel(1, 1)),
  };

  // The values on y=2 encode WAV format information.
  const sampleRate = decodeInt24Pixel(vinyl.getPixel(0, 2));

  return ({
    trackStart,
    format: {
      sampleRate,
      channels: 1,
      bitsPerSample: 8,
    },
  });
}

function isLetter(pixel: Pixel, letter: string): boolean {
  const char = letter.charCodeAt(0);
  return pixel.red === char && pixel.green === char && pixel.blue === char && pixel.alpha === 255;
}
