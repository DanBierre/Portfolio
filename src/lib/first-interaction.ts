// Runs fn once, the first time the visitor scrolls, points, taps or types. Heavy media waits for a
// person, so it never weighs on first load (or on a crawler's visit).
export function onFirstInteraction(fn: () => void) {
  const events = ['pointermove', 'pointerdown', 'keydown', 'scroll', 'touchstart'];
  const go = () => {
    events.forEach((e) => removeEventListener(e, go));
    fn();
  };
  events.forEach((e) => addEventListener(e, go, { passive: true }));
}
