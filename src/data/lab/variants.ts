// Campaign Variant Machine: a rule-based pipeline for a Shoji launch campaign.
// No image model: real Shoji screenshots × layouts × colourways × languages.
// Headlines drafted by Claude, factual about Shoji; Dan to check.
export type Lang = 'en' | 'ja';
export type Shot = 'today-light' | 'today-dark' | 'insights-light';
export type Layout = 'poster' | 'split' | 'crop' | 'type';
export type Colourway = 'ink' | 'washi';
export type Variant = { id: number; shot: Shot; layout: Layout; colourway: Colourway; lang: Lang; headline: string };

export const shots: Shot[] = ['today-light', 'today-dark', 'insights-light'];
export const layouts: Layout[] = ['poster', 'split', 'crop', 'type'];
export const colourways: Colourway[] = ['ink', 'washi'];

export const headlines: Record<Lang, string[]> = {
  en: ['Plan the day in blocks.', 'Focus, then stop.', 'Keep distractions out.', 'See your week in rings.'],
  ja: ['一日をブロックで計画。', '集中して、きちんと止める。', '気が散るものを遠ざける。', '一週間をリングで振り返る。'],
};

/** Every shot × layout × colourway once; languages alternate and headlines rotate, so the grid stays varied. */
export function variants(): Variant[] {
  const out: Variant[] = [];
  for (const shot of shots)
    for (const layout of layouts)
      for (const colourway of colourways) {
        const id = out.length;
        // Period-4 pattern (en, ja, ja, en) so language doesn't lock step with colourway.
        const lang: Lang = (id + Math.floor(id / 2)) % 2 === 0 ? 'en' : 'ja';
        out.push({ id, shot, layout, colourway, lang, headline: headlines[lang][Math.floor(id / 2) % 4] });
      }
  return out;
}
