

// const stateValues = []

// let state = {};
// const listeners = new Set();
// let callIndex = -1;   

// export function initState(initialState) {
//   state = { ...initialState };
// }

// export function getState() {
//   return { ...state };             // return a copy
// }

// export function setState(newState) {
//   state = { ...state, ...newState };

//   if (!Array.isArray(stateValues)) stateValues = [];

//   listeners.forEach((fn) => fn(state));
// }

// export function subscribe(fn) {
//   listeners.add(fn);
//   return () => listeners.delete(fn);
// }


// export const useState = (initialValue) => {
//   callIndex++
//   const currentCallIndex = callIndex
//   if (stateValues[currentCallIndex] === undefined) {
//     stateValues[currentCallIndex] = initialValue
//   }

//   const setValue = (newValue) => {
//     if (typeof newValue === 'function') {
//       stateValues[currentCallIndex] = newValue(stateValues[currentCallIndex])
//     } else {
//       stateValues[currentCallIndex] = newValue
//     }

//      listeners.forEach((fn) => fn(state));
//   }
//   return [stateValues[currentCallIndex], setValue]
// }

// export function resetHookIndex() {
//   callIndex = -1;
// }


// #################################################
// #################################################
// #################################################
// #################################################

/* ==========================================================
   In-memory global state (no localStorage persistence)
   ========================================================== */

let state      = {};
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

  /* ensure hooks array exists */
  if (!Array.isArray(state.hooks)) state.hooks = [];

  listeners.forEach((fn) => fn(state));
}

/* ---------- subscription API ---------- */
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/* ---------- lightweight useState hook ---------- */
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