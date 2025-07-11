let state      = {};
const listeners = new Set();
let callIndex   = -1;   

export function initState(initialState) {
  state = { ...initialState };
}

export function getState() {
  return { ...state };           
}

export function setState(newState) {
  state = { ...state, ...newState };

  /* ensure hooks array exists */
  if (!Array.isArray(state.hooks)) state.hooks = [];

  listeners.forEach((fn) => fn(state));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useState(initialValue) {
  callIndex++;
  const idx = callIndex;

  if (state.hooks[idx] === undefined) {
    state.hooks[idx] = initialValue;
  }

  const setValue = (v) => {
    state.hooks[idx] = v;
    listeners.forEach((fn) => fn(state));
  };

  return [state.hooks[idx], setValue];
}

export function resetHookIndex() {
  callIndex = -1;
}