import { isSamePoint, Point } from '../util/Point';
import { Spiral } from './Spiral';

export default function createSpiral(length: number): Spiral {
  const points: Point[] = [];
  let radius = 0;

  const startT = Math.PI * 20;
  const a = 0.5;

  let dT = 0.1;
  let t = startT - dT;
  let previousPoint: Point | undefined;

  function isPointValid(nextPoint: Point): boolean {
    // If this is the first point, no checks needed.
    if (!previousPoint) {
      return true;
    }

    // Check if the next point is the same as the previous point.
    if (isSamePoint(nextPoint, previousPoint)) {
      dT *= 1.5;
      return false;
    }

    // Check if the next point touches the previous point;
    if (Math.abs(nextPoint.x - previousPoint.x) > 1 || Math.abs(nextPoint.y - previousPoint.y) > 1) {
      dT /= 2;
      return false;
    }

    return true;
  }

  for (let i = 0; i < length; i++) {
    let valid = false;
    let nextPoint = { x: 0, y: 0 };

    while (!valid) {
      // Get the next point.
      nextPoint = {
        x: Math.floor(a * t * Math.cos(t + dT)),
        y: Math.floor(a * t * Math.sin(t + dT)),
      };

      // Check if the next point is adjacent to the previous point.
      valid = isPointValid(nextPoint);
    }

    // Check the radius.
    const absX = Math.abs(nextPoint.x);
    if (absX > radius) {
      radius = absX;
    }
    const absY = Math.abs(nextPoint.y);
    if (absY > radius) {
      radius = absY;
    }

    // Store the next point, update the previous.
    points.push(nextPoint);
    previousPoint = nextPoint;

    // Increase t.
    t += dT;
  }

  return ({
    points,
    radius,
  });
}
