# <span style="color:magenta">*Lightweight State Management System Documentation*</span>


## <span style="color:pink">Overview
This documentation describes a simple state management system with React-like useState hook functionality. The system provides centralized state storage, state change notifications, and a basic hook implementation.


## <span style="color:pink">Core Functions
#### <span style="color:#F3E5AB">1. initState(initialState)
`Purpose`: Initializes the global state.

#### <span style="color:#FBA0E3">Parameters:

`initialState (object)`: The initial state object

#### <span style="color:#FBA0E3">Behavior:

- Creates a shallow copy of the initial state

- Sets up the global state variable

- Ensures the state contains a hooks array for useState functionality

#### <span style="color:#F3E5AB">2. getState()
`Purpose`: Retrieves the current state.

`Returns`: A shallow copy of the current state object

#### <span style="color:#FBA0E3">Behavior:

Prevents direct state modification by returning a copy

Maintains immutability pattern


#### <span style="color:#F3E5AB">3. setState(newState)
`Purpose`: Updates the global state.

#### <span style="color:#FBA0E3">Parameters:

`newState (object)`: Partial state update (will be merged with current state)

#### <span style="color:#FBA0E3">Behavior:

- Merges new state with existing state

- Ensures hooks array exists in state

- Notifies all subscribed listeners of state changes


#### <span style="color:#F3E5AB"> 4. subscribe(fn)
`Purpose`: Subscribes to state changes.

#### <span style="color:#FBA0E3">Parameters:

`fn (function)`: Callback to execute on state changes

`Returns`: Unsubscribe function (call to remove the listener)

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


#### <span style="color:#F3E5AB">6. resetHookIndex()
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

