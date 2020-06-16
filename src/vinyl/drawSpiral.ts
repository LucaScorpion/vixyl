import { Spiral } from './Spiral';

export default function drawSpiral(context: CanvasRenderingContext2D, spiralData: Spiral, spiralDiameter: number): void {
  context.clearRect(0, 0, spiralDiameter, spiralDiameter);
  const center = spiralDiameter / 2;

  // Draw the back circle.
  context.fillStyle = 'black';
  context.beginPath();
  context.arc(center, center, spiralData.radius + 10, 0, 2 * Math.PI);
  context.fill();

  // Draw the spiral.
  context.fillStyle = 'white';
  spiralData.points.forEach((p) => {
    context.fillRect(p.x + center, p.y + center, 1, 1);
  });
}
