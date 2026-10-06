// Ersatz fuer die Mini-Runtime aus der Vorlage: state / on / set.
export const ui = (init = {}) => {
  const state = { ...init }, subs = new Set();
  return { state, set(p) { Object.assign(state, typeof p === 'function' ? p(state) : p); subs.forEach((fn) => fn(state)); }, on(fn) { subs.add(fn); fn(state); return () => subs.delete(fn); } };
};
