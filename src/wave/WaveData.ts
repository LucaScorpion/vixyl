import { WaveFormat } from './WaveFormat';

export interface WaveData {
  format: WaveFormat;
  data: Uint8Array;
}
