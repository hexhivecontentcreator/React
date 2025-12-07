/**
 * MAIN.JSX - Application Entry Point
 * 
 * React Concepts Demonstrated:
 * - ReactDOM.createRoot() - React 18 rendering API
 * - StrictMode - Development tool for highlighting issues
 * - Application mounting
 * 
 * This is the entry point of our React application.
 * It renders the root App component into the DOM.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

/**
 * STRICT MODE
 * 
 * <StrictMode> is a development-only tool that:
 * - Highlights potential problems in the app
 * - Activates additional checks and warnings
 * - Helps identify unsafe lifecycles
 * - Warns about legacy API usage
 * - Detects unexpected side effects
 * 
 * How it helps:
 * - Runs effects twice in development to catch missing cleanups
 * - Warns about deprecated APIs
 * - Helps you write better React code
 * 
 * IMPORTANT: StrictMode has no visible UI!
 * It only activates extra checks in development.
 * In production build, it does nothing.
 */

/**
 * REACT 18 RENDERING API
 * 
 * createRoot() is the new way to render React apps (React 18+).
 * 
 * Old way (React 17):
 * ReactDOM.render(<App />, document.getElementById('root'))
 * 
 * New way (React 18):
 * const root = createRoot(document.getElementById('root'))
 * root.render(<App />)
 * 
 * Benefits of createRoot:
 * - Enables concurrent features
 * - Better performance
 * - Automatic batching
 * - Transitions
 * - Suspense improvements
 */

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

/**
 * WHAT HAPPENS WHEN THIS RUNS:
 * 
 * 1. React finds the DOM element with id="root" (in index.html)
 * 2. Creates a React root at that DOM node
 * 3. Renders the <App /> component
 * 4. App component renders its children
 * 5. React builds the virtual DOM
 * 6. React updates the real DOM to match
 * 7. Your app is now visible!
 */

/**
 * UNDERSTANDING THE RENDER FLOW:
 * 
 * index.html (has <div id="root">)
 *     ↓
 * main.jsx (creates root, renders <App />)
 *     ↓
 * App.jsx (renders ErrorBoundary, TaskProvider, components)
 *     ↓
 * Components render their children
 *     ↓
 * Full component tree is rendered
 *     ↓
 * User sees the application!
 */

