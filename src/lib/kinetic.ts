// Kinetic Type layout rules: turn a line into timed, sized words. Pure and deterministic,
// so the same line always animates the same way (like a saved After Effects comp).
export type KineticWord = {
  text: string;
  /** Size multiplier relative to the stage's base type size. */
  size: number;
  /** Vertical entry offset in em. */
  rise: number;
  /** Font weight. */
  weight: number;
  /** The longest word carries the line: set larger and in gold. */
  emphasis: boolean;
  /** Entry delay in milliseconds. */
  delay: number;
};

const STAGGER = 140;
const FINAL_HOLD = 320;

function split(line: string, lang: 'en' | 'ja'): string[] {
  if (lang === 'ja') {
    const seg = new Intl.Segmenter('ja', { granularity: 'word' });
    // Keep punctuation attached to the word before it, so 。 and 、 never stand alone.
    const out: string[] = [];
    for (const { segment, isWordLike } of seg.segment(line)) {
      if (!segment.trim()) continue;
      if (!isWordLike && out.length) out[out.length - 1] += segment;
      else out.push(segment);
    }
    return out;
  }
  return line.split(/\s+/).filter(Boolean);
}

export function layoutWords(line: string, lang: 'en' | 'ja' = 'en'): KineticWord[] {
  const texts = split(line.trim(), lang);
  if (!texts.length) return [];
  const letters = (t: string) => t.replace(/[^\p{L}\p{N}]/gu, '').length;
  const longest = texts.reduce((best, t, i) => (letters(t) > letters(texts[best]) ? i : best), 0);

  return texts.map((text, i) => {
    const emphasis = i === longest;
    const isLast = i === texts.length - 1 && /[.!?。！？]$/.test(text);
    return {
      text,
      // Short words sit small; each word steps through three sizes; the emphasis jumps.
      size: emphasis ? 2.2 : [1, 1.35, 0.8][i % 3] * (letters(text) <= 3 ? 0.85 : 1),
      rise: [0.6, -0.4, 0.3][i % 3],
      weight: emphasis ? 600 : [400, 500, 300][i % 3],
      emphasis,
      delay: i * STAGGER + (isLast ? FINAL_HOLD : 0),
    };
  });
}
