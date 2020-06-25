export default interface Point {
  x: number;
  y: number;
}

export function isSamePoint(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

export function isPoint(p: any): p is Point {
  if (typeof p !== 'object' || !p) {
    return false;
  }

  return 'x' in p && 'y' in p && typeof p.x === 'number' && typeof p.y === 'number';
}
