import { Spiral } from './Spiral';
import { encodeInt24Pixel, grayPixel } from '../util/Pixel';
import { WaveData } from '../wave/WaveData';
import drawPixel from '../util/drawPixel';
import { VinylEncoding } from './VinylEncoding';

export default function drawVinylBase(context: CanvasRenderingContext2D, spiralData: Spiral, wave: WaveData, encoding: VinylEncoding): void {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  const center = {
    x: context.canvas.width / 2,
    y: context.canvas.height / 2,
  };

  // Encode the metadata
  // y=0: Vixyl
  ['V', 'i', 'x', 'y', 'l'].forEach((char, i) => {
    drawPixel(context, i, 0, grayPixel(char.charCodeAt(0)));
  });
  const startPos = spiralData.points[0];
  // y=1: startX, startY, encoding
  drawPixel(context, 0, 1, encodeInt24Pixel(startPos.x + center.x));
  drawPixel(context, 1, 1, encodeInt24Pixel(startPos.y + center.y));
  drawPixel(context, 2, 1, grayPixel(encoding));
  // y=2: sampleRate, bitsPerSample
  drawPixel(context, 0, 2, encodeInt24Pixel(wave.format.sampleRate));
  drawPixel(context, 1, 2, encodeInt24Pixel(wave.format.bitsPerSample));

  // Draw the back circle.
  context.fillStyle = 'black';
  context.beginPath();
  context.arc(center.x, center.y, spiralData.radius + 10, 0, 2 * Math.PI);
  context.fill();
}
