import { base64ArrayBuffer } from './b64Encode';

export default function createDataUrl(type: string, data: Uint8Array): string {
  return `data:${type};base64,${base64ArrayBuffer(data)}`;
}
