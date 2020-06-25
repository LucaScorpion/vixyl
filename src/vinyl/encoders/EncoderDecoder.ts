import { CanvasHTMLAttributes } from 'react';
import { VixylEncoding } from '../VixylEncoding';
import { FileInfo } from '../FileInfo';

export default interface EncoderDecoder {
  encode(file: FileInfo, options: EncodeOptions): Promise<void>;

  // decode(image: CanvasImage): Promise<FileInfo>;
}

export interface EncodeOptions {
  setCanvasProps: (props: CanvasHTMLAttributes<HTMLCanvasElement>) => Promise<CanvasRenderingContext2D>
}
