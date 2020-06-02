export interface Point {
  x: number;
  y: number;
}

export function isSamePoint(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}
