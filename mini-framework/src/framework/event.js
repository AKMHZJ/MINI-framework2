const handlers = new Map();

const Events = [
    'click', 'dblclick', 'keydown', 'keyup', 'keypress', 
    'input', 'change', 'focus', 'blur',
    'submit', 'reset', 'scroll', 'resize'
];

/*************🌟 1. Registry 🌟*************/
function registry(element, eventType, handler) {
    if (eventType == 'blur'){
        element.onblur = handler
        return
    }
    if (!handlers.has(element)) {
        handlers.set(element, new Map());
    }
    handlers.get(element).set(eventType, handler);
}


/*************🌟 2. Attach Listener 🌟*************/ 
function attachListener(element, eventType, handler) {
    if (!element || !eventType || !handler) return;
    if (!Events.includes(eventType)) return;
    registry(element, eventType, handler);
}


/*************🌟 3. Find Registered Element 🌟*************/
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


/*************🌟 4. Init Event System 🌟*************/ 
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


/*************🌟 5. ON  🌟*************/ 
export function on(element, eventType, handler) {
    attachListener(element, eventType, handler);
}