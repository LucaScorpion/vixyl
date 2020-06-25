import { VixylEncoding } from '../VixylEncoding';
import RainbowSpiral from './RainbowSpiral';
import GraySpiral from './GraySpiral';
import EncoderDecoder from './EncoderDecoder';

const encoders = {
  [VixylEncoding.GRAY_SPIRAL]: GraySpiral,
  [VixylEncoding.RAINBOW_SPIRAL]: RainbowSpiral,
};

export default function getEncoder(encoding: VixylEncoding): EncoderDecoder {
  const Encoder = encoders[encoding];
  if (!Encoder) {
    throw new Error('Unknown encoding');
  }
  return new Encoder();
}
