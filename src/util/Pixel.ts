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
    alpha: 254,
  });
}

export function encodeInt24Pixel(value: number): Pixel {
  return ({
    red: value & 0xFF,
    green: (value >> 8) & 0xFF,
    blue: (value >> 16) & 0xFF,
    alpha: 254,
  });
}

export function decodeInt24Pixel(pixel: Pixel): number {
  return pixel.red + (pixel.green << 8) + (pixel.blue << 16);
}

export function isDataPixel(data: Pixel): boolean {
  return data.alpha === 254;
}

export function encodeStringGrayPixels(text: string): Pixel[] {
  return text.split('').map(char => grayPixel(char.charCodeAt(0)));
}

export function drawPixel(context: CanvasRenderingContext2D, x: number, y: number, pixel: Pixel): void {
  context.fillStyle = `rgba(${pixel.red}, ${pixel.green}, ${pixel.blue}, ${pixel.alpha})`;
  context.fillRect(x, y, 1, 1);
}
