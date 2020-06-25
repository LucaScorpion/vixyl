import { isDataPixel, Pixel } from '../../util/Pixel';
import { isSamePoint, Point } from '../../util/Point';
import CanvasImage from '../CanvasImage';

export default function readVinylTrack(vinyl: CanvasImage, trackStart: Point): Pixel[] {
  const data: Pixel[] = [];

  let prevPos = trackStart;
  let pos: Point | null = trackStart;

  while (pos) {
    // Read the pixel data, push it.
    let pixel = vinyl.getPixel(pos);
    data.push(pixel);

    // Get the next pixel position.
    const nextPos = findNextPixel(vinyl, prevPos, pos);
    prevPos = pos;
    pos = nextPos;
  }

  return data;
}

function findNextPixel(vinyl: CanvasImage, previous: Point, current: Point): Point | null {
  for (let dX = -1; dX <= 1; dX++) {
    for (let dY = -1; dY <= 1; dY++) {
      const nextPoint = ({
        x: current.x + dX,
        y: current.y + dY,
      });

      // Check if the point is the same as the previous or current point.
      if (isSamePoint(nextPoint, previous) || isSamePoint(nextPoint, current)) {
        continue;
      }

      // Check if the point is in bounds.
      if (!vinyl.isInBounds(nextPoint)) {
        continue;
      }

      // Get the pixel data, check if it is valid.
      const data = vinyl.getPixel(nextPoint);
      if (isDataPixel(data)) {
        return nextPoint;
      }
    }
  }

  return null;
}
