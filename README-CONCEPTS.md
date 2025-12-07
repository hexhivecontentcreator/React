# React Concepts Mapping

This document maps every React concept demonstrated in this application to specific files and features.

## Table of Contents
- [Core React Concepts](#core-react-concepts)
- [Components & JSX](#components--jsx)
- [State Management](#state-management)
- [Side Effects](#side-effects)
- [Performance Optimization](#performance-optimization)
- [Advanced Patterns](#advanced-patterns)
- [Hooks (Built-in & Custom)](#hooks-built-in--custom)

---

## Core React Concepts

### What is React?
| Concept | Where Used | File | Description |
|---------|-----------|------|-------------|
| Component-based architecture | Entire app | All `.jsx` files | App is built from reusable components |
| Virtual DOM | Behind the scenes | - | React's rendering engine |
| One-way data flow | All components | All files | Data flows from parent to child |
| Declarative UI | All components | All `.jsx` files | Describe what UI should look like, not how to build it |

### JSX (JavaScript XML)
| Concept | Where Used | File | Description |
|---------|-----------|------|-------------|
| JSX syntax | All components | All `.jsx` files | HTML-like syntax in JavaScript |
| JSX expressions `{}` | Dynamic content | All components | Embedding JavaScript in JSX |
| JSX attributes | Props, styling | All components | className, onClick, data-*, etc. |
| Fragments `<></>` | Multiple elements | `Input.jsx`, `TaskItem.jsx` | Group elements without extra DOM node |
| Conditional rendering | Dynamic UI | `TaskList.jsx`, `TaskItem.jsx`, `TaskForm.jsx` | Show/hide based on conditions |

---

## Components & JSX

### Functional Components
| Concept | Where Used | File | Description |
|---------|-----------|------|-------------|
| Function components | All components | All `.jsx` files | Modern way to write components |
| Arrow functions | Most components | Most `.jsx` files | Concise function syntax |
| Default exports | All components | All `.jsx` files | `export default ComponentName` |

### Props
| Concept | Where Used | File | Description |
|---------|-----------|------|-------------|
| Props basics | All components | All `.jsx` files | Passing data to components |
| Prop destructuring | All components | All `.jsx` files | `{ prop1, prop2 } =` in parameters |
| Default props | Button, Input | `Button.jsx`, `Input.jsx` | Default parameter values |
| Children prop | Button, Modal | `Button.jsx`, `Modal.jsx` | Content between tags |
| Spread props `...rest` | Button, Input | `Button.jsx`, `Input.jsx` | Passing through unknown props |
| Prop types (implicit) | All components | All `.jsx` files | JSDoc comments for documentation |

### Composition
| Concept | Where Used | File | Description |
|---------|-----------|------|-------------|
| Component composition | App structure | `App.jsx` | Building UI from smaller components |
| Container/Presentational | TaskList/TaskItem | `TaskList.jsx`, `TaskItem.jsx` | Separating logic from presentation |
| Wrapper components | ErrorBoundary, Modal | `ErrorBoundary.jsx`, `Modal.jsx` | Components that wrap others |

### Conditional Rendering
| Concept | Where Used | File | Description |
|---------|-----------|------|-------------|
| && operator | Show/hide elements | `TaskItem.jsx`, `Input.jsx` | `{condition && <Element />}` |
| Ternary operator | Toggle content | `Timer.jsx`, `App.jsx` | `{condition ? <A /> : <B />}` |
| Early return | Empty states | `TaskList.jsx` | Return early if condition not met |
| Multiple conditions | Task badges | `TaskItem.jsx` | Nested conditionals |

### Lists & Keys
| Concept | Where Used | File | Description |
|---------|-----------|------|-------------|
| Array.map() | Rendering lists | `TaskList.jsx`, `Calendar.jsx`, `TaskForm.jsx` | Transform array to elements |
| Key prop | All lists | `TaskList.jsx`, `Calendar.jsx` | Unique identifier for list items |
| Why keys matter | Documentation | `TaskList.jsx` (comments) | Performance and correctness |
| Index as key (when safe) | Static lists | `Calendar.jsx` (day headers) | OK when list never reorders |

---

## State Management

### useState Hook
| Concept | Where Used | File | Description |
|---------|-----------|------|-------------|
| Basic useState | Form fields | `TaskForm.jsx` | `const [state, setState] = useState(initial)` |
| Multiple state variables | Form with many fields | `TaskForm.jsx` | Separate state for each field |
| State updates | Event handlers | All components | Updating state with setState |
| Functional updates | Timer, toggles | `useTimer.js`, `useToggle.js` | `setState(prev => ...)` |
| Lazy initialization | Loading from storage | `useLocalStorage.js` | `useState(() => expensive())` |
| Object state | Complex data | `TaskForm.jsx` | State as objects |
| Array state | Lists, selections | `TaskForm.jsx` | State as arrays |

### Controlled Components
| Concept | Where Used | File | Description |
|---------|-----------|------|-------------|
| Controlled inputs | All form fields | `TaskForm.jsx`, `TaskList.jsx` | React controls input value |
| value + onChange | Text inputs | `TaskForm.jsx` | Binding input to state |
| checked + onChange | Checkboxes, radios | `TaskForm.jsx` | Controlled checkboxes |
| Form submission | Task creation/edit | `TaskForm.jsx` | Handling form submit |
| Preventing default | Form submit | `TaskForm.jsx` | `e.preventDefault()` |

### Lifting State Up
| Concept | Where Used | File | Description |
|---------|-----------|------|-------------|
| Shared state | Tasks shared across components | `TaskContext.jsx` | State moved to common ancestor |
| Callback props | Modal close, form submit | `Modal.jsx`, `TaskForm.jsx` | Passing functions down |

### Context API
| Concept | Where Used | File | Description |
|---------|-----------|------|-------------|
| createContext | Task state | `TaskContext.jsx` | Creating context object |
| Provider pattern | Wrapping app | `TaskContext.jsx`, `App.jsx` | Providing state to tree |
| useContext hook | Consuming context | `Timer.jsx`, `TaskItem.jsx`, `TaskList.jsx` | Accessing context value |
| Custom context hook | useTaskContext | `TaskContext.jsx` | Wrapper for useContext with validation |
| Avoiding prop drilling | Global task state | Entire app | No need to pass props through layers |

### useReducer Hook
| Concept | Where Used | File | Description |
|---------|-----------|------|-------------|
| Reducer function | Task management | `taskReducer.js` | `(state, action) => newState` |
| Action types | CRUD operations | `taskReducer.js` | Constants for action types |
| Action creators | Helper functions | `taskReducer.js` | Functions that return actions |
| dispatch function | Updating state | All components using context | Sending actions to reducer |
| Complex state logic | Task CRUD | `taskReducer.js` | When useState isn't enough |
| Immutable updates | All reducer cases | `taskReducer.js` | Never mutate state |

---

## Side Effects

### useEffect Hook
| Concept | Where Used | File | Description |
|---------|-----------|------|-------------|
| Basic useEffect | localStorage sync | `TaskContext.jsx` | Side effects in components |
| Dependency array | When effect runs | All useEffect usage | Control when effect executes |
| Empty dependencies [] | Run once on mount | `TaskContext.jsx` | Like componentDidMount |
| Specific dependencies | Run when deps change | `Timer.jsx`, `Modal.jsx` | Re-run on specific changes |
| Cleanup functions | Unmount, re-run | `useTimer.js`, `Modal.jsx` | Clear timers, remove listeners |
| Multiple effects | Separate concerns | `TaskContext.jsx`, `Modal.jsx` | One effect per concern |

### Event Handling
| Concept | Where Used | File | Description |
|---------|-----------|------|-------------|
| onClick | Buttons | All button usage | Click handlers |
| onChange | Form inputs | `TaskForm.jsx`, `TaskList.jsx` | Input change handlers |
| onSubmit | Forms | `TaskForm.jsx` | Form submission |
| Event object | Getting values | `TaskForm.jsx` | `e.target.value`, `e.preventDefault()` |
| Event.stopPropagation | Modal overlay | `Modal.jsx` | Prevent event bubbling |

### Working with Browser APIs
| Concept | Where Used | File | Description |
|---------|-----------|------|-------------|
| localStorage | Data persistence | `localStorage.js`, `TaskContext.jsx` | Saving/loading data |
| setTimeout | Debouncing | `useDebounce.js` | Delayed execution |
| setInterval | Timer | `useTimer.js` | Repeated execution |
| clearInterval/clearTimeout | Cleanup | `useTimer.js`, `useDebounce.js` | Preventing memory leaks |
| document.addEventListener | Keyboard events | `Modal.jsx` | Global event listeners |
| document.body | Portal target | `Modal.jsx` | DOM manipulation |

---

## Performance Optimization

### useMemo Hook
| Concept | Where Used | File | Description |
|---------|-----------|------|-------------|
| Memoizing calculations | Filter/sort tasks | `TaskList.jsx` | Cache expensive computations |
| Memoizing date calculations | Calendar days | `Calendar.jsx` | Avoid recalculating dates |
| Memoizing derived data | Tasks by date | `Calendar.jsx` | Compute map once |
| Dependencies | When to recompute | All useMemo usage | Re-memoize when deps change |

### useCallback Hook
| Concept | Where Used | File | Description |
|---------|-----------|------|-------------|
| Memoizing functions | Event handlers | `Timer.jsx`, `TaskItem.jsx`, `Calendar.jsx` | Stable function references |
| Preventing re-renders | Callbacks as props | Multiple components | Don't recreate functions |
| Dependencies | When to recreate | All useCallback usage | New function when deps change |

### React.memo
| Concept | Where Used | File | Description |
|---------|-----------|------|-------------|
| Memoizing components | TaskItem | `TaskItem.jsx` | Prevent re-renders with same props |
| Shallow prop comparison | Default behavior | `TaskItem.jsx` | How memo decides to re-render |
| Custom comparison | Advanced (commented) | `TaskItem.jsx` (comments) | Custom shouldUpdate logic |

### Code Splitting
| Concept | Where Used | File | Description |
|---------|-----------|------|-------------|
| React.lazy() | Heavy components | `App.jsx` | Dynamic imports |
| Dynamic import() | Async loading | `App.jsx` | ES module imports |
| Suspense | Loading fallback | `App.jsx` | Show UI while loading |

---

## Advanced Patterns

### Portals
| Concept | Where Used | File | Description |
|---------|-----------|------|-------------|
| createPortal | Modal rendering | `Modal.jsx` | Render outside parent DOM |
| document.body | Portal target | `Modal.jsx` | Where modal appears |
| Event bubbling | React tree vs DOM tree | `Modal.jsx` (comments) | Events bubble through React tree |

### Error Boundaries
| Concept | Where Used | File | Description |
|---------|-----------|------|-------------|
| Class component | ErrorBoundary | `ErrorBoundary.jsx` | Only way to catch errors |
| getDerivedStateFromError | Error state | `ErrorBoundary.jsx` | Update state on error |
| componentDidCatch | Error logging | `ErrorBoundary.jsx` | Log errors |
| Fallback UI | Error display | `ErrorBoundary.jsx` | What to show on error |

### Suspense
| Concept | Where Used | File | Description |
|---------|-----------|------|-------------|
| Suspense boundary | Lazy components | `App.jsx` | Catch loading state |
| fallback prop | Loading UI | `App.jsx` | Show while loading |
| Code splitting | Performance | `App.jsx` | Load code on-demand |

---

## Hooks (Built-in & Custom)

### Built-in Hooks
| Hook | Where Used | File | Description |
|------|-----------|------|-------------|
| useState | State management | `TaskForm.jsx`, `App.jsx`, custom hooks | Component state |
| useEffect | Side effects | `TaskContext.jsx`, `Modal.jsx`, custom hooks | Effects, cleanup |
| useContext | Context consumption | `Timer.jsx`, `TaskItem.jsx`, `TaskList.jsx` | Access context |
| useReducer | Complex state | `TaskContext.jsx` | Reducer pattern |
| useMemo | Performance | `TaskList.jsx`, `Calendar.jsx` | Memoize values |
| useCallback | Performance | Multiple components | Memoize functions |
| useRef | Mutable refs | `useTimer.js`, `usePrevious.js` | Persist values, DOM refs |

### Custom Hooks
| Hook | File | Purpose |
|------|------|---------|
| useLocalStorage | `hooks/useLocalStorage.js` | Sync state with localStorage |
| useToggle | `hooks/useToggle.js` | Boolean state management |
| useTimer | `hooks/useTimer.js` | Timer with start/pause/reset |
| useDebounce | `hooks/useDebounce.js` | Debounce value changes |
| usePrevious | `hooks/usePrevious.js` | Track previous value |
| useTaskContext | `context/TaskContext.jsx` | Access task context |

### Custom Hook Patterns
| Concept | Where Used | File | Description |
|---------|-----------|------|-------------|
| Hook composition | All custom hooks | `hooks/` directory | Hooks using other hooks |
| Reusable logic | Extracting patterns | All custom hooks | DRY principle |
| Hook rules | All hooks | All files | Start with "use", only call at top level |

---

## Additional Concepts

### Styling
| Concept | Where Used | File | Description |
|---------|-----------|------|-------------|
| CSS in separate file | Global styles | `styles.css` | Single stylesheet |
| className | Elements | All components | CSS classes |
| Inline styles | Dynamic styling | `TaskItem.jsx`, `Calendar.jsx` | Style objects |
| Style objects | Computed styles | Multiple components | JavaScript objects for styles |
| Data attributes | CSS selectors | `Button.jsx`, `Card elements` | data-variant, data-status |

### Accessibility
| Concept | Where Used | File | Description |
|---------|-----------|------|-------------|
| aria-label | Buttons | `Button.jsx`, `TaskItem.jsx` | Accessible labels |
| aria-invalid | Form validation | `Input.jsx` | Invalid input state |
| aria-describedby | Error messages | `Input.jsx` | Linking errors to inputs |
| Semantic HTML | Structure | All components | button, header, main, footer |
| Keyboard support | Modal | `Modal.jsx` | ESC key to close |

### TypeScript / PropTypes Alternative
| Concept | Where Used | File | Description |
|---------|-----------|------|-------------|
| JSDoc comments | Documentation | All components | Type hints in comments |
| @param tags | Function docs | All files | Parameter documentation |
| @returns tags | Function docs | All files | Return value documentation |

---

## React Best Practices Demonstrated

1. **Component Organization**: Separate concerns, single responsibility
2. **State Management**: Use right tool (useState, useReducer, Context)
3. **Performance**: Memoization, code splitting, lazy loading
4. **Error Handling**: Error boundaries, try-catch
5. **Accessibility**: ARIA attributes, semantic HTML
6. **Code Quality**: Comments, documentation, clean code
7. **Immutability**: Never mutate state directly
8. **Pure Functions**: Reducers, utilities
9. **DRY Principle**: Custom hooks, reusable components
10. **Separation of Concerns**: Components, hooks, utils, context

---

## File Structure Summary

```
src/
├── components/        # Reusable UI components
│   ├── Button.jsx           # Props, children, spreading
│   ├── Input.jsx            # Controlled components, validation
│   ├── Modal.jsx            # Portals, event handling
│   ├── ErrorBoundary.jsx    # Error boundaries (class component)
│   ├── Timer.jsx            # Custom hooks, useRef, intervals
│   ├── TaskForm.jsx         # Forms, state, validation
│   ├── TaskItem.jsx         # React.memo, composition
│   ├── TaskList.jsx         # Lists, keys, useMemo
│   └── Calendar.jsx         # Complex memoization, derived state
├── hooks/            # Custom hooks
│   ├── useLocalStorage.js   # localStorage integration
│   ├── useToggle.js         # Boolean state helper
│   ├── useTimer.js          # Timer with useRef
│   ├── useDebounce.js       # Performance optimization
│   └── usePrevious.js       # Tracking previous values
├── context/          # Context and providers
│   └── TaskContext.jsx      # Context, Provider, useReducer
├── reducers/         # State reducers
│   └── taskReducer.js       # Reducer logic, actions
├── utils/            # Utility functions
│   ├── constants.js         # App constants
│   ├── dateHelpers.js       # Date utilities
│   ├── localStorage.js      # Storage utilities
│   └── validation.js        # Form validation
├── App.jsx           # Main app (Suspense, lazy, composition)
├── main.jsx          # Entry point (createRoot, StrictMode)
└── styles.css        # Global styles
```

---

## Concepts NOT Covered (and why)

- **Class Components**: Covered only in ErrorBoundary (required for error boundaries)
- **Legacy Context API**: Using modern Context API instead
- **PropTypes**: Using JSDoc comments instead
- **CSS-in-JS**: Per requirements, using single CSS file
- **State Management Libraries**: Demonstrating built-in React patterns
- **Routing**: Out of scope for this tutorial
- **Testing**: Out of scope (focus on React concepts)

---

This mapping provides a complete reference for finding examples of every React concept in the codebase.
