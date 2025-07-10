# <span style="color:magenta">*Mini-Framework Documentation*</span>

## <span style="color:pink">Overview
This documentation describes a lightweight event handling system that provides centralized event management for DOM elements. The system allows you to register event handlers and efficiently delegate events through a single listener per event type.


## <span style="color:pink">Core Functions
1. registry(element, eventType, handler)
Purpose: Internal function to store event handlers in a centralized registry.

#### <span style="color:#38cb82">Parameters:

element (HTMLElement): The DOM element to register

eventType (string): The event type (e.g., 'click', 'keydown')

handler (function): The callback function to execute when the event occurs

#### <span style="color:#38cb82">Behavior:

Creates a nested Map structure to store handlers

First level maps elements to their event handlers

Second level maps event types to specific handler functions


2. attachListener(element, eventType, handler)
Purpose: Validates and attaches an event handler to an element.

#### <span style="color:#38cb82">Parameters:

element (HTMLElement): The target DOM element

eventType (string): The event type to listen for

handler (function): The callback function

#### <span style="color:#38cb82">Behavior:

Validates input parameters

Checks if the event type is in the supported Events list

Delegates to registry() for actual storage


3. findRegisteredElement(event)
Purpose: Finds the closest parent element with a registered handler for the event.

#### <span style="color:#38cb82">Parameters:

event (Event): The DOM event object

Returns:

The registered element or null if not found

#### <span style="color:#38cb82">Behavior:

Walks up the DOM tree from event.target

Checks each element for registered handlers

Returns the first matching element with a handler for the event type


4. initEventSystem(container = document)
Purpose: Initializes the event delegation system.

#### <span style="color:#38cb82">Parameters:

container (HTMLElement, optional): The root element to attach listeners to (defaults to document)

#### <span style="color:#38cb82">Behavior:

Sets up a single event listener for each supported event type

Uses event delegation to handle events efficiently

When an event occurs, finds the appropriate registered handler and executes it

5. on(element, eventType, handler)
Purpose: Public API to register event handlers.

#### <span style="color:#38cb82">Parameters:

element (HTMLElement): The target DOM element

eventType (string): The event type to listen for

handler (function): The callback function

#### <span style="color:#38cb82">Behavior:

Simple wrapper around attachListener()

Provides clean public interface for event registration

Supported Events
The system supports the following event types:

Mouse events: click, dblclick

Keyboard events: keydown, keyup, keypress

Form events: input, change, focus, blur, submit, reset

Window events: scroll, resize


## <span style="color:pink">Usage Example

```
// Initialize the event system
initEventSystem();

// Register event handlers
const button = document.getElementById('myButton');
on(button, 'click', (event) => {
    console.log('Button clicked!');
});

const input = document.getElementById('myInput');
on(input, 'focus', (event) => {
    console.log('Input focused');
});
```

## <span style="color:pink">Benefits

Efficient memory usage: Uses event delegation instead of attaching individual handlers

Centralized management: All handlers are stored in a single registry

Clean API: Simple on() function for event registration

Automatic cleanup: No need to manually remove listeners (handlers are stored separately from DOM)