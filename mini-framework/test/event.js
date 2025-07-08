

// const handlers = new Map();
// function attachListener(root, eventType) {
//   root.addEventListener(eventType, (event) => {
//     const target = findRegisteredElement(event.target, eventType);
//     if (target) {
//       handlers.get(target).get(eventType)(event);
//     }
//   });
// }

// // const but = attachListener('home', 'click')
// // console.log(but);

// const inputComponent = {
//   tag: "input",
//   attrs: {
//     type: "text",
//     placeholder: "Typing...",
//     onInput: (e) => console.log("Typing:", e.target.value),
//     onKeyPress: (e) => {
//       if (e.key === "Enter") {
//         console.log("Enter pressed!");
//       }
//     },
//   },
// };

// const fakeEventInput = { target: { value: "hello" } }; // Typing: hello
// inputComponent.attrs.onInput(fakeEventInput);

// const fakeEventKeyPressEnter = { key: "Enter" };
// inputComponent.attrs.onKeyPress(fakeEventKeyPressEnter); // Enter pressed!

// const fakeEventKeyPressOther = { key: "a" };
// inputComponent.attrs.onKeyPress(fakeEventKeyPressOther); // rien

// const input = document.createElement(inputComponent.tag);
//   Object.entries(inputComponent.attrs).forEach(([key, value]) => {
//     if (key.startsWith("on")) {
//       input.addEventListener(key.slice(2).toLowerCase(), value);
//     } else {
//       input.setAttribute(key, value);
//     }
//   });

//   document.body.appendChild(input);

//   // --- TESTS SIMPLES ---
//   console.log("Test 1 - Type :", input.type === "text" ? "✅ Pass" : "❌ Fail");
//   console.log("Test 2 - Placeholder :", input.placeholder === "Typing..." ? "✅ Pass" : "❌ Fail");

//   // Simuler une saisie
//   input.value = "Hello Hasnae";
//   input.dispatchEvent(new Event("input")); // Affiche: Typing: Hello world

//   // Simuler appui sur Enter
//   input.dispatchEvent(new KeyboardEvent("keypress", { key: "Enter" })); // Affiche: Enter pressed!

//   // Simuler appui sur une autre touche
//   input.dispatchEvent(new KeyboardEvent("keypress", { key: "a" })); // Aucun message

// DOM abstraction and manipulation logic

// Importe ici ton code si tu utilises un module
// const { on, initEventSystem } = require('./event');

//////////////////////////
// ⚙️ Setup
//////////////////////////

// DOM abstraction and manipulation logic

// function makeElement(tag, attrs = {}, children = []) {
//   children = Array.isArray(children) ? children : [children];

//   children = children.map((child) =>
//     typeof child === "string" || typeof child === "number"
//       ? { tag: "#text", attrs: {}, children: [], text: child }
//       : child
//   );

//   return {
//     tag,
//     attrs,
//     children,
//     element: null,
//   };
// }

function createDOM(vnode) {
  if (vnode.tag === "#text") {
    const textNode = document.createTextNode(vnode.text);
    vnode.element = textNode;
    return textNode;
  }

  const element = document.createElement(vnode.tag);
  vnode.element = element;

  // handlling attributes
  for (const [key, value] of Object.entries(vnode.attrs)) {
    if (key.startsWith("on")) {
      // event handlers
      const eventName = key.toLowerCase().slice(2);
      on(element, eventName, value);
    } else {
      element.setAttribute(key, value);
    }
  }

  // render children
  vnode.children.forEach((child) => {
    const childElement = createDOM(child);
    element.appendChild(childElement);
  });

  return element;
}

let prevVNode = null;

function render(vnode, container) {
  if (prevVNode) {
    
    updateDOM(prevVNode, vnode, container);
    console.log(vnode);
  } else {
    const dom = createDOM(vnode);
    container.innerHTML = "";
    container.appendChild(dom);
  }
  prevVNode = vnode;
}

function updateDOM(oldVNode, newVNode, parent) {
  console.log(oldVNode, newVNode, parent);

  if (!oldVNode || oldVNode.tag != newVNode.tag) {
    const newElement = createDOM(newVNode);
    parent.replaceChild(newElement, oldVNode.element);
    newVNode.element = newElement;
    return;
  }

  newVNode.element = oldVNode.element;
  const oldAttrs = oldVNode.attrs;
  const newAttrs = newVNode.attrs;

  for (const key of Object.keys(oldAttrs)) {
    if (!(key in newAttrs)) {
      newVNode.element.removeAttribute(key);
    }
  }

  for (const [key, value] of Object.entries(newAttrs)) {
    if (oldAttrs[key] !== value) {
      newVNode.element.setAttribute(key, value);
    }
  }

  const oldChildren = oldVNode.children || [];
  const newChildren = newVNode.children || [];
  const maxLenght = Math.max(oldChildren.length, newChildren.length);

  for (let i = 0; i < length; i++) {
    if (i < oldChildren.length && i < newChildren.length) {
      oldChildren[i], newChildren[i], newVNode.element;
    } else if (i < oldChildren.length) {
      newVNode.element.removeChild(oldChildren[i].element);
    } else {
      const newChildElement = createDOM(newChildren[i]);
      newVNode.element.appendChild(newChildElement);
      newChildren[i].element = newChildElement;
    }
  }
}

const handlers = new Map();
const eventHandlers = new Map();

/// List of Events
const Events = [
  "click",
  "dblclick",
  "keydown",
  "keyup",
  "keypress",
  "input",
  "change",
  "focus",
  "blur",
  "submit",
  "reset",
  "scroll",
  "resize",
];
/*************🌟 1. Registry 🌟*************/
function registry(element, eventType, handler) {
  console.log("registry", element, eventType, handler);

  if (!handlers.has(element)) {
    console.log("registry", handlers.has(element));
    console.log("handlers", handlers);

    handlers.set(element, new Map());
  }
  console.log("handlers", handlers);
  const eventMap = handlers.get(element);
  if (!eventMap.has(eventType)) {
    eventMap.set(eventType, []);
  }

  eventMap.get(eventType).push(handler);
}

/*************🌟 2. Attach Listener 🌟*************/ /*👍*/
function attachListener(element, eventType, handler) {
  console.log("attach");

  if (!element || !eventType || !handler) return;
  if (!Events.includes(eventType)) return;
  console.log("attachListener");

  registry(element, eventType, handler);
}

/*************🌟 4. Init Event System 🌟*************/ /*👍*/
function initEventSystem(container = document) {
  Events.forEach((eventType) => {
    container.addEventListener(eventType, (event) => {
      const match = findRegisteredElement(event);
      console.log(match, "match");

      if (match) {
        match.handlers.forEach((handler) => handler(event));
      }
    });
  });
}

/*************🌟 3. Find Registered Element 🌟*************/
function findRegisteredElement(event) {
  console.log("hello ");

  let target = event.target;
  while (target && target !== document) {
    if (handlers.has(target)) {
      const eventMap = handlers.get(target);
      if (eventMap.has(event.type)) {
        return {
          element: target,
          handlers: eventMap.get(event.type),
        };
      }
    }
    target = target.parentNode;
  }
  return null;
}

/*************🌟 5. ON  🌟*************/ /*👍*/
function on(element, eventType, handler) {
  console.log("--- : ", element, eventType, handler);

  attachListener(element, eventType, handler);
}



/*************🌟🌟*************/ 
function makeElement(tag, attrs = {}, children = []) {
  // ── extract special "key" ---------------------------------
  let key = undefined;
  if ("key" in attrs) {
    key = attrs.key;
    delete attrs.key; // do not output it as HTML attr
  }

  children = (Array.isArray(children) ? children : [children]).filter(
    (c) => c !== null && c !== undefined
  );
  children = children.map((child) =>
    typeof child === "string" || typeof child === "number"
      ? { tag: "#text", attrs: {}, children: [], text: child }
      : child
  );

  return { tag, attrs, children, element: null, key };
}

/////////////////////////////////////////////
let count = 0;
function App() {
  return makeElement("div", { class: "container" }, [
    makeElement("h1", {}, `Count: ${count}`),
    makeElement(
      "button",
      {
        onClick: () => {
          console.log("heey");
           
          count++;
          console.log("count", count);
        },
      },
      "Increment"
    ),
  ]);
}

const container = document.getElementById("frame");
// function testtt() {
//   console.log(document.getElementById("frame"));
  
//   render(App(), document.getElementById("frame"));
// }
console.log(container, "container");

initEventSystem(container);
render(App(), container);
///////////////////////////
