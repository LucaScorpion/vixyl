import { Point } from '../../util/Point';
import { isDataPixel } from '../../util/Pixel';
import Vinyl from '../Vinyl';

export default function detectStartingPoint(vinyl: Vinyl): Point | null {
  const options: Point[] = [];

  for (let x = 0; x < vinyl.width; x++) {
    for (let y = 0; y < vinyl.height; y++) {
      const pos = { x, y };
      const pixel = vinyl.getPixel(pos);

      if (isDataPixel(pixel)) {
        continue;
      }

      let hits = -1;
      for (let dX = -1; dX <= 1; dX++) {
        for (let dY = -1; dY <= 1; dY++) {
          const nextPoint = ({
            x: pos.x + dX,
            y: pos.y + dY,
          });

          // Check if the point is in bounds.
          if (!vinyl.isInBounds(nextPoint)) {
            continue;
          }

          // Get the pixel data, check if it is valid.
          const data = vinyl.getPixel(nextPoint);
          if (isDataPixel(data)) {
            hits++;
          }
        }
      }

      if (hits === 1) {
        options.push(pos);
      }
    }
  }

  let closest: Point = options[0];
  let closestDist = getDistanceToEdge(vinyl, options[0]);
  for (let i = 1; i < options.length; i++) {
    let dist = getDistanceToEdge(vinyl, options[i]);
    if (dist < closestDist) {
      closestDist = dist;
      closest = options[i];
    }
  }

  return closest;
}

function getDistanceToEdge(vinyl: Vinyl, pos: Point): number {
  let minDist = pos.x < pos.y ? pos.x : pos.y;
  if (vinyl.width - pos.x < minDist) {
    minDist = vinyl.width - pos.x;
  }
  if (vinyl.height - pos.y < minDist) {
    minDist = vinyl.height - pos.y;
  }
  return minDist;
}
