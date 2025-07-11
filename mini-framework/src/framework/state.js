


let state = {};
state.stateValues = []

const listeners = new Set();
let callIndex   = -1;   // for useState hook order

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

  if (!Array.isArray(state.stateValues)) state.stateValues = [];

  listeners.forEach((fn) => fn(state));
}

/* ---------- subscription API ---------- */
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}


export const useState = (initialValue) => {
  callIndex++
  const currentCallIndex = callIndex
  if (state.stateValues[currentCallIndex] === undefined) {
    state.stateValues[currentCallIndex] = initialValue
  }

  const setValue = (newValue) => {
    if (typeof newValue === 'function') {
      state.stateValues[currentCallIndex] = newValue(state.stateValues[currentCallIndex])
    } else {
      state.stateValues[currentCallIndex] = newValue
    }

     listeners.forEach((fn) => fn(state));
  }
  return [state.stateValues[currentCallIndex], setValue]
}

export function resetHookIndex() { 
  
  callIndex = -1;
}