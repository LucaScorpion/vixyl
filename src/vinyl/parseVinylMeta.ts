import { VinylMeta } from './VinylMeta';
import Vinyl from './Vinyl';
import { decodeInt24Pixel, Pixel } from '../util/Pixel';

export default function parseVinylMeta(vinyl: Vinyl): VinylMeta | null {
  // If the vinyl contains metadata, the top-left 5 pixels should decode to "Vixyl".
  const hasMeta = ['V', 'i', 'x', 'y', 'l'].every((letter, i): boolean => isLetter(vinyl.getPixel(i, 0), letter));
  if (!hasMeta) {
    return null;
  }

  // y=1: startX, startY, encoding
  const trackStart = {
    x: decodeInt24Pixel(vinyl.getPixel(0, 1)),
    y: decodeInt24Pixel(vinyl.getPixel(1, 1)),
  };
  const encoding = vinyl.getPixel(2, 1).red;

  // y=2: sampleRate, bitsPerSample
  const sampleRate = decodeInt24Pixel(vinyl.getPixel(0, 2));
  const bitsPerSample = decodeInt24Pixel(vinyl.getPixel(1, 2));

  return ({
    trackStart,
    format: {
      sampleRate,
      bitsPerSample,
      channels: 1,
    },
    encoding,
  });
}

function isLetter(pixel: Pixel, letter: string): boolean {
  const char = letter.charCodeAt(0);
  return pixel.red === char && pixel.green === char && pixel.blue === char && pixel.alpha === 255;
}
