import { Point } from '../util/Point';
import { WaveFormat } from '../wave/WaveFormat';
import { VinylEncoding } from './VinylEncoding';

export interface VinylMeta {
  trackStart: Point;
  format: WaveFormat;
  encoding: VinylEncoding;
}
