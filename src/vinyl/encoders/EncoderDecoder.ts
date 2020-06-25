import { CanvasHTMLAttributes } from 'react';
import { FileInfo } from '../FileInfo';
import CanvasImage from '../CanvasImage';

export default interface EncoderDecoder {
  encode(file: FileInfo, options: EncodeOptions): Promise<void>;

  decode(image: CanvasImage): FileInfo | Promise<FileInfo>;
}

export interface EncodeOptions {
  setCanvasProps: (props: CanvasHTMLAttributes<HTMLCanvasElement>) => Promise<CanvasRenderingContext2D>
}
