import { Pixel } from './Pixel';

export function drawPixel(context: CanvasRenderingContext2D, x: number, y: number, pixel: Pixel): void {
  context.fillStyle = `rgba(${pixel.red}, ${pixel.green}, ${pixel.blue}, ${pixel.alpha})`;
  context.fillRect(x, y, 1, 1);
}

export function drawCircle(context: CanvasRenderingContext2D, x: number, y: number, radius: number, fill: string) {
  context.fillStyle = fill;
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.fill();
}
