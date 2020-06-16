import { Spiral } from './Spiral';

export default function drawSpiral(context: CanvasRenderingContext2D, spiralData: Spiral, values: Uint8Array): void {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  const center = {
    x: context.canvas.width / 2,
    y: context.canvas.height / 2,
  };

  // Draw the back circle.
  context.fillStyle = 'black';
  context.beginPath();
  context.arc(center.x, center.y, spiralData.radius + 10, 0, 2 * Math.PI);
  context.fill();

  // Draw the spiral.
  for (let i = 0; i < spiralData.points.length; i++) {
    const p = spiralData.points[i]
    const val = Math.max(1, values[i]);

    // Set the pixel color based on the sound value.
    context.fillStyle = `rgb(${val}, ${val}, ${val})`;

    context.fillRect(p.x + center.x, p.y + center.y, 1, 1);
  }
}
