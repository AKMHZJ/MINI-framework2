
// const handlers = new Map();
// const eventHandlers = new Map();

// /// List of Events
// const Events = [
//     'click', 'dblclick', 'keydown', 'keyup', 'keypress', 
//     'input', 'change', 'focus', 'blur',
//     'submit', 'reset', 'scroll', 'resize'
// ];


// // [button]{handleClick}
// // [button]{handleSubmit}

// // Map(){
// //   button: [func1, func2],
// //   span: [func1, func2]
// // }



// /*************🌟 1. Registry 🌟*************/
// function registry(element, eventType, handler) {
//     if (!handlers.has(element)) {
//         handlers.set(element, new Map());
//     }

//     const eventMap = handlers.get(element);
//     if (!eventMap.has(eventType)) {
//         eventMap.set(eventType, []);
//     }

//     eventMap.get(eventType).push(handler);
// }

// /*************🌟 2. Attach Listener 🌟*************/ /*👍*/
// function attachListener(element, eventType, handler) {
//      if (!element || !eventType || !handler) return
//      if (!Events.includes(eventType)) return

//     registry(element, eventType, handler);
// }


// /*************🌟 4. Init Event System 🌟*************/ /*👍*/
// export function initEventSystem(container = document) {
//   Events.forEach((eventType) => {
//     container.addEventListener(eventType, (event) => {
//       const match = findRegisteredElement(event);
//       if (match) {
//         match.handlers.forEach(handler => handler(event));
//       } 
//     })
//   })
// }


// /*************🌟 3. Find Registered Element 🌟*************/
// function findRegisteredElement(event) {
//    let target = event.target;
//    while (target && target !== document) {
//     if (handlers.has(target)) {
//       const eventMap = handlers.get(target);
//       if (eventMap.has(event.type)) {
//         return {
//           element: target,
//           handlers: eventMap.get(event.type),
//         };
//       }
//     }
//     target = target.parentNode;
//   }
//   return null;
// }


// /*************🌟 5. ON  🌟*************/  /*👍*/
// export function on(element, eventType, handler) {
//     attachListener(element, eventType, handler);
// }



const handlers = new Map();

const Events = [
    'click', 'dblclick', 'keydown', 'keyup', 'keypress', 
    'input', 'change', 'focus', 'blur',
    'submit', 'reset', 'scroll', 'resize'
];

function registry(element, eventType, handler) {
    if (!handlers.has(element)) {
        handlers.set(element, new Map());
    }
    handlers.get(element).set(eventType, handler);
}

function attachListener(element, eventType, handler) {
    if (!element || !eventType || !handler) return;
    if (!Events.includes(eventType)) return;
    registry(element, eventType, handler);
}

function findRegisteredElement(event) {
    let target = event.target;
    while (target && target !== document) {
        if (handlers.has(target)) {
            const eventMap = handlers.get(target);
            if (eventMap.has(event.type)) {
                return target;
            }
        }
        target = target.parentNode;
    }
    return null;
}

export function initEventSystem(container = document) {
    Events.forEach((eventType) => {
        container.addEventListener(eventType, (event) => {
            const target = findRegisteredElement(event);
            if (target) {
                handlers.get(target).get(event.type)(event);
            }
        });
    });
}

export function on(element, eventType, handler) {
    attachListener(element, eventType, handler);
}





// // Function to attach events to multiple elements
// export function attachToElements(selector, eventType, handler) {
//     const elements = document.querySelectorAll(selector);
//     elements.forEach(function(element) {
//         on(element, eventType, handler);
//     });
// }

// #################################################
// #################################################
// #################################################
// #################################################
// Custom event handling system

// const handlers = new Map();

// /* attach a single delegated listener to the root container */
// function attachListener(root, eventType) {
//   root.addEventListener(eventType, (event) => {
//     const target = findRegisteredElement(event.target, eventType);
//     if (target) {
//       handlers.get(target).get(eventType)(event);
//     }
//   });
// }

// /* walk up the DOM tree to find the first element that registered this event */
// function findRegisteredElement(node, eventType) {
//   let current = node;
//   while (current) {
//     if (handlers.has(current) && handlers.get(current).has(eventType)) {
//       return current;
//     }
//     current = current.parentElement;
//   }
//   return null;
// }

// // export function initEventSystem(container){
// //   const eventTypes = ['click', 'keypress', 'scroll', 'input', 'change'];

// //   eventTypes.forEach(eventType => {
// //     attachListener(container, eventType, event => {
// //       const registeredElement = findRegisteredElement(event.target, event);
// //       if(registeredElement){
// //         const handler = handlers.get(registeredElement).get(eventType);
// //         handler(event)
// //       }
// //     })
// //   })
// // }


// /* public: register an event handler on any element */
// export function on(eventType, element, handler) {
//   if (!handlers.has(element)) handlers.set(element, new Map());
//   handlers.get(element).set(eventType, handler);
// }


// /* public: one-time bootstrapping on the root container */
// export function initEventSystem(container) {
//   const eventTypes = [
//     "click",
//     "input",
//     "dblclick",      // ← NEW: needed for label editing
//     "change",
//     "keypress",  // still needed for edit-Enter handler
//     "keydown",   // <— needed for add-todo Enter + Esc in edit field
//     "keyup",
//     "scroll",
//   ];

//   eventTypes.forEach((type) => attachListener(container, type));
// }