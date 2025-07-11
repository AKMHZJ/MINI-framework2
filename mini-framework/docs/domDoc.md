# <span style="color:magenta">*Virtual DOM System Documentation*</span>

## <span style="color:pink">Overview
This documentation describes a lightweight Virtual DOM implementation with diffing and patching capabilities. The system provides DOM abstraction, efficient updates, and key-based reconciliation for dynamic UI rendering.


## <span style="color:pink">Core Functions
#### <span style="color:#F3E5AB"> 1. makeElement(tag, attrs = {}, children = [])
`Purpose:` Creates a virtual DOM node (VNode).

#### <span style="color:#FBA0E3">Parameters:

`tag (string)`: HTML tag name or "#text" for text nodes

`attrs (object)`: Attributes/properties for the element

`children (array|string|number)`: Child nodes or text content

#### <span style="color:#FBA0E3">Behavior:

- Normalizes children into consistent array format

- Handles text/number content by converting to text VNodes

- Extracts and removes special "key" property from attributes


#### <span style="color:#F3E5AB"> 2. createDOM(vnode)
`Purpose`: Converts a VNode to a real DOM element (initial render).

`Returns`: A shallow copy of the current state object

#### <span style="color:#FBA0E3">Behavior:

- Handles text nodes specially

- Creates proper DOM elements with attributes

- Recursively processes children

- Stores DOM reference back in VNode

- Special cases:

   - Event handlers (attributes starting with "on")

   - Checked state for input elements


#### <span style="color:#F3E5AB"> 3. render(vnode, container)
`Purpose`: Main render entry point.

#### <span style="color:#FBA0E3">Parameters:

`vnode`: Root virtual node to render

`container`: DOM element to render into

#### <span style="color:#FBA0E3">Behavior:

- On first render: creates fresh DOM tree

- On subsequent renders: performs diff/patch against previous VNode

- Maintains reference to previous VNode for diffing


#### <span style="color:#F3E5AB"> 4. updateDOM(oldVNode, newVNode, parent)
`Purpose`: Core diffing and patching algorithm.

#### <span style="color:#FBA0E3">Parameters:

`oldVNode`: Previous virtual node

`newVNode`: New virtual node

`parent`: Parent DOM element

#### <span style="color:#FBA0E3">Behavior:

- Adds listener to the listeners Set

- Returns a cleanup function that removes the listener


#### <span style="color:#F3E5AB"> 5. useState(initialValue)
`Purpose`: React-like state hook for functional components.

#### <span style="color:#FBA0E3">Parameters:

`initialValue (any)`: Initial value for this state slot

`Returns`:

Array containing:

Current state value

State setter function

#### <span style="color:#FBA0E3">Behavior:

- Tracks hook calls using callIndex

- Stores values in state.hooks array

- Returns a setter that updates the value and notifies listeners

- Must be called in consistent order (like React hooks)


#### <span style="color:#F3E5AB"> 6. resetHookIndex()
`Purpose`: Resets the hook call counter.


#### <span style="color:#FBA0E3">Behavior:

- Resets callIndex to -1

- Should be called before each component render cycle

- Ensures consistent hook ordering


## <span style="color:pink">Usage Example

```
// Initialize state
initState({ count: 0 });

// Subscribe to state changes
const unsubscribe = subscribe((state) => {
  console.log('State changed:', state);
});

// Use state hook
function MyComponent() {
  resetHookIndex(); // Important before each render
  
  const [count, setCount] = useState(0);
  const [name, setName] = useState('Anonymous');
  
  return { count, name, setCount, setName };
}

// Update state
setState({ loading: true });

// Unsubscribe when no longer needed
unsubscribe();
```

## <span style="color:pink">Benefits

- Efficient memory usage: Uses event delegation instead of attaching individual handlers

- Centralized management: All handlers are stored in a single registry

- Clean API: Simple on() function for event registration

- Automatic cleanup: No need to manually remove listeners (handlers are stored separately from DOM)


## <span style="color:pink">Important Notes


- The useState hook depends on consistent call order (like React hooks)

- Always call resetHookIndex() before a component's hook calls

- The state.hooks array is managed automatically by the system

- For production use, consider adding error boundaries or additional safety checks

