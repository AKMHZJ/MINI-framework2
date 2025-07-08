

const stateValues = []

let state = {};
const listeners = new Set();
let callIndex = -1;   

export function initState(initialState) {
  state = { ...initialState };
}

export function getState() {
  return { ...state };             // return a copy
}

export function setState(newState) {
  state = { ...state, ...newState };

  if (!Array.isArray(stateValues)) stateValues = [];

  listeners.forEach((fn) => fn(state));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}


export const useState = (initialValue) => {
  callIndex++
  const currentCallIndex = callIndex
  if (stateValues[currentCallIndex] === undefined) {
    stateValues[currentCallIndex] = initialValue
  }

  const setValue = (newValue) => {
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


