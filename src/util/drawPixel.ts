import { Pixel } from './Pixel';

export default function drawPixel(context: CanvasRenderingContext2D, x: number, y: number, pixel: Pixel): void {
  context.fillStyle = `rgb(${pixel.red}, ${pixel.green}, ${pixel.blue})`;
  context.fillRect(x, y, 1, 1);
}
