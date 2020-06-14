export function encodeString(data: Uint8Array, offset: number, value: string): void {
  for (let i = 0; i < value.length; i++) {
    data[offset + i] = value.charCodeAt(i);
  }
}

export function encodeShort(data: Uint8Array, offset: number, value: number): void {
  data[offset] = value & 0xFF;
  data[offset + 1] = (value >> 8) & 0xFF;
}

export function encodeInt(data: Uint8Array, offset: number, value: number): void {
  encodeShort(data, offset, value);
  encodeShort(data, offset + 2, value >> 16);
}
