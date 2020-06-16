import { Spiral } from './Spiral';
import { encodeInt24Pixel, grayPixel, Pixel } from '../util/Pixel';
import { WaveData } from '../wave/WaveData';

export default function drawVinyl(context: CanvasRenderingContext2D, spiralData: Spiral, wave: WaveData): void {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  const center = {
    x: context.canvas.width / 2,
    y: context.canvas.height / 2,
  };

  // Draw the metadata.
  ['V', 'i', 'x', 'y', 'l'].forEach((char, i) => {
    drawPixel(context, i, 0, grayPixel(char.charCodeAt(0)));
  });
  const startPos = spiralData.points[0];
  // y=1: startX, startY
  drawPixel(context, 0, 1, encodeInt24Pixel(startPos.x + center.x));
  drawPixel(context, 1, 1, encodeInt24Pixel(startPos.y + center.y));
  // y=2: sampleRate
  drawPixel(context, 0, 2, encodeInt24Pixel(wave.format.sampleRate));

  // Draw the back circle.
  context.fillStyle = 'black';
  context.beginPath();
  context.arc(center.x, center.y, spiralData.radius + 10, 0, 2 * Math.PI);
  context.fill();

  // Draw the spiral.
  for (let i = 0; i < spiralData.points.length; i++) {
    const p = spiralData.points[i];
    const val = Math.max(1, wave.data[i]);
    drawPixel(context, p.x + center.x, p.y + center.y, grayPixel(val));
  }
}

function drawPixel(context: CanvasRenderingContext2D, x: number, y: number, pixel: Pixel): void {
  context.fillStyle = `rgb(${pixel.red}, ${pixel.green}, ${pixel.blue})`;
  context.fillRect(x, y, 1, 1);
}
