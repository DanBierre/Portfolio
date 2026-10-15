// Brush ensō, ported from Dan's live site (same drawing as Shoji's renderer/enso.js): a ring swept by a
// "brush" whose width follows a pressure curve, with a slight wobble so it never looks machine-made.
// Runs at build time, so the ring renders without JavaScript.
const START = -104;
const SWEEP = 338;

const pt = (r: number, deg: number, cx: number, cy: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
};
const xy = ([x, y]: [number, number]) => `${x.toFixed(2)} ${y.toFixed(2)}`;

export function brushRing({ cx = 50, cy = 50, r, width, seed = 1, steps = 90 }: {
  cx?: number;
  cy?: number;
  r: number;
  width: number;
  seed?: number;
  steps?: number;
}): string {
  const outer: [number, number][] = [];
  const inner: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const pressure = t < 0.08 ? 0.55 + 0.45 * (t / 0.08) : 1 - 0.68 * ((t - 0.08) / 0.92) ** 1.35;
    const wobble = 1 + 0.07 * Math.sin(t * 13 + seed) + 0.04 * Math.sin(t * 31 + seed * 2.3);
    const half = (width * pressure * wobble) / 2;
    const rr = r * (1 + 0.014 * Math.sin(t * 6 + seed * 1.7));
    const deg = START + SWEEP * t;
    outer.push(pt(rr + half, deg, cx, cy));
    inner.push(pt(rr - half, deg, cx, cy));
  }
  const capEnd = width * 0.21;
  const capStart = width * 0.3;
  return (
    `M ${xy(outer[0])} ${outer.slice(1).map((p) => `L ${xy(p)}`).join(' ')}` +
    ` A ${capEnd.toFixed(2)} ${capEnd.toFixed(2)} 0 0 1 ${xy(inner[inner.length - 1])}` +
    ` ${inner.slice(0, -1).reverse().map((p) => `L ${xy(p)}`).join(' ')}` +
    ` A ${capStart.toFixed(2)} ${capStart.toFixed(2)} 0 0 1 ${xy(outer[0])} Z`
  );
}
