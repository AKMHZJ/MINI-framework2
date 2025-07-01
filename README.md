<!-- Framework documentation (how to use, features, examples) -->

# Mini Framework Documentation

## DOM Abstraction

Welcome to the official documentation for the **Mini Framework** — a lightweight, modular JavaScript framework designed to help you build reactive apps from scratch without relying on external libraries like React or Vue.

It uses concepts like virtual DOM, state management, routing, and custom event handling to provide a solid foundation for frontend development.

---

### Features

- Create elements with tags, attributes, and children.
- Nest elements hierarchically.
- Update the DOM efficiently by applying only necessary changes.
- Support for text nodes and attributes (events to be added).

---

### 1. Setup

Create a basic HTML file:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>My App</title>
    <link rel="stylesheet" href="./styles/style.css" />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="./src/framework/app.js"></script>
  </body>
</html>
```

---

### 2. Folder Structure

---

### 🧱 Creating Elements

You can use `makeElement()` to create virtual elements that describe your UI.

#### Syntax

```js
makeElement(tag, attributes, children);
```

#### Example

```js
const el = makeElement("h1", { class: "title" }, "Hello World");
```

This creates a virtual representation of:

```html
<h1 class="title">Hello World</h1>
```

You can also nest elements:

```js
makeElement("div", { class: "container" }, [
  makeElement("h1", {}, "Title"),
  makeElement("p", {}, "Description"),
]);
```

---

### Adding Events

Instead of using `addEventListener`, this framework provides a custom event system using delegation.

#### Syntax

You can attach events using attributes that start with `on`, like:

```js
makeElement("button", {
  onClick: () => alert("Clicked!"),
}, "Click Me");
```

#### Supported Events

- `onClick`
- `onInput`
- `onKeyPress`
- `onKeyDown`
- `onChange`
- `onScroll`

These handlers are registered through a global listener initialized with `initEventSystem(container)`.

---

### 🧠 Managing State

The framework includes a built-in state system.

#### Initialize State

You must initialize the global state once:

```js
initState({
  todos: [],
  filter: "all",
  hooks: [], // Required for useState
});
```

Any updates automatically re-render your app.

#### useState (Local State)

You can use a simple `useState` hook for local component-level state:

```js
const [value, setValue] = useState("");
```

Each call is tracked by index. Always call `resetHookIndex()` before every render.

---

### 🌍 Routing

You can define routes that respond to hash changes (`#/all`, `#/active`, etc.).

#### Define Routes

```js
defineRoutes([
  { path: "/all", view: TodoApp },
  { path: "/active", view: TodoApp },
  { path: "/completed", view: TodoApp },
]);
```

#### Navigate Between Routes

```js
navigate("/active");
```

#### Initialize the Router

Initialize the router once at startup:

```js
initRouter();
```

---

### 📦 Full Example

```js
function App() {
  const [count, setCount] = useState(0);

  return makeElement("div", { class: "counter" }, [
    makeElement("h1", {}, `Count: ${count}`),
    makeElement("button", {
      onClick: () => setCount(count + 1)
    }, "Increment"),
  ]);
}

subscribe(() => {
  resetHookIndex();
  render(App(), document.getElementById("app"));
});
```

---

### 🧪 Why It Works This Way

- **Virtual DOM**: Your UI is described as pure JavaScript objects. This allows comparison between the previous and new state and only updates what’s changed.
- **Event Delegation**: Instead of attaching events to each element, events bubble up to a common parent (container) for performance and simplicity.
- **Global State**: Centralized state allows global data to be shared and updated across all components.
- **Hooks (`useState`)**: Inspired by React, these allow local state within functional components.
- **Routing**: Routes change the view and synchronize with the state filter, all without full page reloads.

