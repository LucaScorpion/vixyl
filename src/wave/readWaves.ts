import { WaveData } from './WaveData';
import { decodeInt, decodeShort } from '../util/decode';

export default function readWaves(wave: Uint8Array): WaveData | null {
  // Check if it's a valid wave file.
  if (!isValidWaveFile(wave)) {
    return null;
  }

  return ({
    format: {
      channels: decodeShort(wave, 22),
      sampleRate: decodeInt(wave, 24),
      bitsPerSample: decodeShort(wave, 34),
    },
    data: wave.slice(44),
  });
}

function isValidWaveFile(wave: Uint8Array): boolean {
  return wave[0] === 0x52 && wave[1] === 0x49 && wave[2] === 0x46 && wave[3] === 0x46;
}

