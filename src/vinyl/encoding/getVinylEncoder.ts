import VinylEncoder from './VinylEncoder';
import { VinylFormat } from '../VinylFormat';
import GrayVinylEncoder from './GrayVinylEncoder';
import RainbowVinylEncoder from './RainbowVinylEncoder';

export default function getVinylEncoder(format: VinylFormat): VinylEncoder {
  switch (format) {
    case VinylFormat.GRAY:
      return new GrayVinylEncoder();
    case VinylFormat.RAINBOW:
      return new RainbowVinylEncoder();
    default:
      throw new Error('Unknown encoding format');
  }
}
