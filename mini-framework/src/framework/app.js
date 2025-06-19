//  Framework entry point (exports all modules)

import { makeElement, render } from "./dom.js";

// let count = 0;

// function App() {
//   return makeElement('div', { class: 'container' }, [
//     makeElement('h1', {}, `Count: ${count}`),
//     makeElement('button', { id: 'btn' }, 'Increment'),
//   ]);
// }

// render(App(), document.getElementById('app'));


import { makeElement, render } from './dom.js';
import { initEventSystem } from './event.js';

const app = makeElement('div', { class: 'container' }, [
  makeElement('h1', {}, 'Event Test'),
  makeElement('button', { onClick: () => alert('Clicked!') }, 'Click Me'),
]);

const container = document.getElementById('app');
initEventSystem(container); // Initialize event system
render(app, container);