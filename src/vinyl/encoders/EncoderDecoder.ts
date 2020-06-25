import { CanvasHTMLAttributes } from 'react';
import { FileInfo } from '../FileInfo';
import CanvasImage from '../CanvasImage';
import { Color } from 'react-color';

export default interface EncoderDecoder<T> {
  getEncodeForm(): EncodeFormOption[];

  encode(file: FileInfo, options: EncodeOptions<T>): Promise<void>;

  decode(image: CanvasImage): FileInfo | Promise<FileInfo>;
}

export interface EncodeOptions<T> {
  setCanvasProps: (props: CanvasHTMLAttributes<HTMLCanvasElement>) => Promise<CanvasRenderingContext2D>
  form: T;
}

export type EncodeFormOption = BooleanEncodeFormOption | ColorEncodeFormOption;

export interface BaseEncodeFormOption<T> {
  key: string;
  type: 'boolean' | 'color';
  text: string;
  defaultValue: T;
}

export interface BooleanEncodeFormOption extends BaseEncodeFormOption<boolean> {
  type: 'boolean';
}

export interface ColorEncodeFormOption extends BaseEncodeFormOption<Color> {
  type: 'color';
}
