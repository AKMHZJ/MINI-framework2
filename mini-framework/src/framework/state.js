

const stateValues = []

let state = {};
const listeners = new Set();
let callIndex = -1;   // for useState hook order

/* ---------- bootstrap ---------- */
export function initState(initialState) {
  state = { ...initialState };
}

/* ---------- basic getters / setters ---------- */
export function getState() {
  return { ...state };             // return a shallow copy
}

export function setState(newState) {
  state = { ...state, ...newState };

  /* ensure hooks array exists */
  if (!Array.isArray(stateValues)) stateValues = [];

  listeners.forEach((fn) => fn(state));
}

/* ---------- subscription API ---------- */
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/* ---------- lightweight useState hook ---------- */

export const useState = (initialValue) => {
  callIndex++
  const currentCallIndex = callIndex
  if (stateValues[currentCallIndex] === undefined) {
    stateValues[currentCallIndex] = initialValue
  }

  const setValue = (newValue) => {
    //React allows passing a function to setState
    if (typeof newValue === 'function') {
      stateValues[currentCallIndex] = newValue(stateValues[currentCallIndex])
    } else {
      stateValues[currentCallIndex] = newValue
    }

     listeners.forEach((fn) => fn(state));
  }
  return [stateValues[currentCallIndex], setValue]
}

export function resetHookIndex() {
  callIndex = -1;
}


