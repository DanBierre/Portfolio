// AI Rough Cut: DEMO transcript and agent run (labelled on the page). Swap in Dan's footage by
// giving segments a `src` (a short video clip) and replacing the transcript and actions.
export type Segment = { id: string; start: number; end: number; text: string; src?: string };
export type Action =
  | { kind: 'select'; segment: string; note?: string }
  | { kind: 'drop'; segment: string; note?: string }
  | { kind: 'reorder'; segment: string; to: number; note?: string }
  | { kind: 'note'; note: string };

export const segments: Segment[] = [
  { id: 's1', start: 0, end: 4.2, text: "Okay, we're at Fushimi Inari, it's six in the morning." },
  { id: 's2', start: 4.2, end: 7.0, text: 'Um, so, uh, wait. Let me start again.' },
  { id: 's3', start: 7.0, end: 12.5, text: 'Six a.m. at Fushimi Inari, before the crowds.' },
  { id: 's4', start: 12.5, end: 17.8, text: "Thousands of gates, and right now it's just us and the crows." },
  { id: 's5', start: 17.8, end: 20.1, text: '[long pause]' },
  { id: 's6', start: 20.1, end: 26.4, text: "The light comes through the gates in stripes. It's ridiculous." },
  { id: 's7', start: 26.4, end: 30.0, text: '(laughs) I nearly walked into a fox statue.' },
  { id: 's8', start: 30.0, end: 35.5, text: "Okay, the battery's on ten percent, we need to be quick." },
  { id: 's9', start: 35.5, end: 41.2, text: "Halfway up there's a view over the whole of Kyoto." },
  { id: 's10', start: 41.2, end: 45.0, text: "Right, that's it, that's the view." },
  { id: 's11', start: 45.0, end: 49.6, text: "If you come to Kyoto, come here early. That's the whole trick." },
  { id: 's12', start: 49.6, end: 52.0, text: 'Okay, stop recording.' },
];

export const actions: Action[] = [
  { kind: 'note', note: 'Open on the clean intro, not the first take.' },
  { kind: 'drop', segment: 's1', note: 'First take; s3 says it better.' },
  { kind: 'drop', segment: 's2', note: 'False start.' },
  { kind: 'select', segment: 's3' },
  { kind: 'select', segment: 's4' },
  { kind: 'drop', segment: 's5', note: 'Cut the pause.' },
  { kind: 'select', segment: 's6', note: 'Best visual line; keep it whole.' },
  { kind: 'select', segment: 's7', note: 'Keep the laugh.' },
  { kind: 'drop', segment: 's8', note: 'Battery chat: off the story.' },
  { kind: 'select', segment: 's9' },
  { kind: 'drop', segment: 's10', note: 'Repeats the view line.' },
  { kind: 'select', segment: 's11', note: 'The closing line.' },
  { kind: 'drop', segment: 's12' },
  { kind: 'reorder', segment: 's7', to: 4, note: 'Move the laugh after the view: a breather before the close.' },
  { kind: 'note', note: 'Rough cut ready: six selects.' },
];

export type CutState = { order: string[]; dropped: Set<string>; notes: string[] };

/** Apply the first `upto` actions (all by default). Pure: the same inputs always give the same cut. */
export function applyActions(_segments: Segment[], list: Action[], upto = list.length): CutState {
  const state: CutState = { order: [], dropped: new Set(), notes: [] };
  for (const a of list.slice(0, upto)) {
    if (a.kind === 'select') state.order.push(a.segment);
    else if (a.kind === 'drop') state.dropped.add(a.segment);
    else if (a.kind === 'reorder') {
      state.order = state.order.filter((id) => id !== a.segment);
      state.order.splice(a.to, 0, a.segment);
    }
    if (a.note) state.notes.push(a.note);
  }
  return state;
}

export const runtime = (all: Segment[], order: string[]) =>
  order.reduce((sum, id) => {
    const s = all.find((x) => x.id === id)!;
    return sum + (s.end - s.start);
  }, 0);
