export function decodeShort(data: Uint8Array, offset: number): number {
  return data[offset] + (data[offset + 1] << 8);
}

export function decodeInt(data: Uint8Array, offset: number): number {
  return decodeShort(data, offset) + (decodeShort(data, offset + 2) << 16);
}
