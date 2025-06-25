let state = {};
const listeners = new Set();
let callIndex = -1;

function loadState(initialState) {
  const savedState = localStorage.getItem('mini-framework-state');
  let loadedState = savedState ? JSON.parse(savedState) : { ...initialState };

  if (!Array.isArray(loadedState.hooks)) {
    loadedState.hooks = [];
  }
  return loadedState;
}

function saveState() {
  localStorage.setItem('mini-framework-state', JSON.stringify(state));
}

export function initState(initialState) {
  state = loadState(initialState);
  saveState();
}

export function getState() {
  return { ...state };
}

export function setState(newState) {
  const mergedState = { ...state, ...newState };
  if (!Array.isArray(mergedState.hooks)) {
    mergedState.hooks = state.hooks || [];
  }
  state = mergedState;
  saveState();
  listeners.forEach(listener => listener(state));
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useState(initialValue) {
  callIndex++;
  const currentCallIndex = callIndex;

  if (state.hooks[currentCallIndex] === undefined) {
    state.hooks[currentCallIndex] = initialValue;
    saveState();
  }

  const setValue = (newValue) => {
    state.hooks[currentCallIndex] = newValue;
    saveState();
    listeners.forEach(listener => listener(state));
  };

  return [state.hooks[currentCallIndex], setValue];
}

export function resetHookIndex() {
  callIndex = -1;
}