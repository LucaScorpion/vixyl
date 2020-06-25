import SpiralEncoder from './SpiralEncoder';
import { VinylFormat } from '../VinylFormat';
import GraySpiralEncoder from './GraySpiralEncoder';
import RainbowSpiralEncoder from './RainbowSpiralEncoder';

export default function getVinylEncoder(format: VinylFormat): SpiralEncoder {
  switch (format) {
    case VinylFormat.GRAY:
      return new GraySpiralEncoder();
    case VinylFormat.RAINBOW:
      return new RainbowSpiralEncoder();
    default:
      throw new Error('Unknown encoding format');
  }
}
