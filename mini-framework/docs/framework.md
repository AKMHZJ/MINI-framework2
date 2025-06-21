<!-- Framework documentation (how to use, features, examples) -->

# Mini Framework Documentation

## DOM Abstraction

The DOM abstraction layer simplifies DOM manipulation by using a Virtual DOM. Users define the UI as JavaScript objects (Virtual Nodes or VNodes), and the framework efficiently updates the real DOM by comparing old and new VNodes.

### Features

- Create elements with tags, attributes, and children.
- Nest elements hierarchically.
- Update the DOM efficiently by applying only necessary changes.
- Support for text nodes and attributes (events to be added).

### API

#### `makeElement(tag, attrs, children)`

Creates a Virtual DOM node.

- `tag`: String, the HTML tag (e.g., `'div'`, `'h1'`).
- `attrs`: Object, attributes like `class`, `id` (e.g., `{ class: 'container' }`).
- `children`: Array or single child, VNodes or strings for text nodes.
- Returns: A VNode object.

**Example:**

```javascript
const vnode = makeElement("div", { class: "container" }, [
  makeElement("h1", {}, "Hello"),
  "World", // Text node
]);
```


## Event Handling

The event handling system uses event delegation to manage user interactions efficiently. A single listener per event type is attached to the app’s root container, and events are dispatched to registered handlers based on the target element. This system avoids direct use of `addEventListener` by using `on*` properties.

### Features
- Supports common events: `click`, `keypress`, `scroll`, `input`, `change`.
- Integrates with Virtual DOM via `on*` attributes (e.g., `onClick`).
- Uses event delegation for performance and dynamic elements.

### API

#### `initEventSystem(container)`
Initializes the event system by attaching listeners to the root container.
- `container`: The DOM element (e.g., `document.getElementById('app')`).

**Example:**
```javascript
initEventSystem(document.getElementById('app'));
```