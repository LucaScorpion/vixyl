import { grayPixel } from '../../util/Pixel';
import { Spiral } from '../Spiral';
import { WaveData } from '../../wave/WaveData';
import drawPixel from '../../util/drawPixel';

export default function drawGrayVinyl(context: CanvasRenderingContext2D, spiralData: Spiral, wave: WaveData) {
  const center = {
    x: context.canvas.width / 2,
    y: context.canvas.height / 2,
  };
  
  // Draw the spiral.
  for (let i = 0; i < spiralData.points.length; i++) {
    const p = spiralData.points[i];
    const val = Math.max(1, wave.data[i]);
    drawPixel(context, p.x + center.x, p.y + center.y, grayPixel(val));
  }
}
