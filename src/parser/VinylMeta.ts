import { Point } from './Point';
import { WaveFormat } from '../wave/WaveFormat';

export interface VinylMeta {
  trackStart: Point;
  format: WaveFormat;
}
