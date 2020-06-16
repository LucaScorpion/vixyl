export interface Pixel {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

export function grayPixel(value: number): Pixel {
  return ({
    red: value,
    green: value,
    blue: value,
    alpha: 255,
  });
}

export function encodeInt24Pixel(value: number): Pixel {
  return ({
    red: value & 0xFF,
    green: (value >> 8) & 0xFF,
    blue: (value >> 16) & 0xFF,
    alpha: 255,
  });
}

export function decodeInt24Pixel(pixel: Pixel): number {
  return pixel.red + (pixel.green << 8) + (pixel.blue << 16);
}
