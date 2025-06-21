//  Framework entry point (exports all modules)

// import { makeElement, render } from "./dom.js";

// let count = 0;

// function App() {
//   return makeElement('div', { class: 'container' }, [
//     makeElement('h1', {}, `Count: ${count}`),
//     makeElement('button', { id: 'btn' }, 'Increment'),
//   ]);
// }

// render(App(), document.getElementById('app'));


// testing event handling

import { makeElement, render } from './dom.js';
import { initEventSystem } from './event.js';

let count = 0;

function App() {
  return makeElement('div', { class: 'container' }, [
    makeElement('h1', {}, `Count: ${count}`),
    makeElement('button', { onClick: () => {
      count++;
      render(App(), document.getElementById('app'));
    } }, 'Increment'),
    makeElement('input', { onInput: e => console.log(e.target.value) }, []),
  ]);
}

const container = document.getElementById('app');
initEventSystem(container);
render(App(), container);