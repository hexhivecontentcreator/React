/**
 * APP COMPONENT
 * 
 * React Concepts Demonstrated:
 * - Component composition (combining many components)
 * - Suspense and lazy loading
 * - Error boundaries
 * - Context provider wrapping
 * - State management (via toggle hook)
 * - Fragments
 * - Conditional rendering
 * - Code splitting for performance
 * 
 * This is the root component of our application.
 * It demonstrates how to compose an entire app from smaller components.
 */

import { Suspense, lazy, useState } from 'react';
import { TaskProvider } from './context/TaskContext';
import ErrorBoundary from './components/ErrorBoundary';
import Button from './components/Button';
import Modal from './components/Modal';
import TaskForm from './components/TaskForm';
import { useToggle } from './hooks/useToggle';
import './styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck } from '@fortawesome/free-solid-svg-icons';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
/**
 * LAZY LOADING with React.lazy()
 * 
 * WHAT IS LAZY LOADING?
 * Lazy loading delays loading of components until they're needed.
 * This reduces the initial bundle size and improves performance.
 * 
 * HOW IT WORKS:
 * - React.lazy() takes a function that returns a dynamic import()
 * - Component code is split into a separate chunk
 * - Chunk is loaded on-demand when component is first rendered
 * 
 * SYNTAX:
 * const Component = lazy(() => import('./Component'));
 * 
 * REQUIREMENTS:
 * - Must be wrapped in <Suspense> component
 * - Suspense provides fallback UI while loading
 * 
 * WHEN TO USE:
 * - Large components not needed immediately
 * - Route-based code splitting
 * - Modal dialogs
 * - Tabs or accordions
 * - Heavy libraries
 * 
 * BENEFITS:
 * - Smaller initial bundle
 * - Faster initial load
 * - Better performance
 * - Load code only when needed
 */

// Lazy load heavy components
const TaskList = lazy(() => import('./components/TaskList'));
const Calendar = lazy(() => import('./components/Calendar'));

/**
 * Note: We're lazy loading TaskList and Calendar because they:
 * - Are relatively heavy (render many child components)
 * - May not be needed immediately
 * - Can be loaded on-demand
 * 
 * We don't lazy load TaskForm, Button, Modal because they:
 * - Are needed immediately
 * - Are lightweight
 * - Would cause more overhead than benefit
 */

/**
 * App Component
 * 
 * The root component that composes the entire application.
 */
function App() {
  /**
   * State - Modal Visibility
   * 
   * Using our custom useToggle hook for cleaner code.
   */
  const [isCreateModalOpen, , setIsCreateModalOpen] = useToggle(false);

  /**
   * State - Selected Date from Calendar
   * 
   * Stores the date clicked in calendar view
   */
  const [selectedDate, setSelectedDate] = useState(null);

  /**
   * State - Active Tab
   * 
   * Simple useState for tab switching.
   * Demonstrates component-local state.
   */
  const [activeTab, setActiveTab] = useState('tasks');

  /**
   * Handle Calendar Date Click
   * 
   * When a date is clicked in calendar:
   * - Store the selected date
   * - Open the create modal
   */
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsCreateModalOpen(true);
  };

  /**
   * Handle Modal Close
   * 
   * Clear selected date when modal closes
   */
  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    setSelectedDate(null);
  };

  /**
   * RENDER
   * 
   * The structure of our app:
   * - ErrorBoundary wraps everything (catch errors)
   * - TaskProvider provides global state
   * - Header with title and create button
   * - Tab navigation
   * - Suspense-wrapped content
   * - Modal for creating tasks
   */
  return (
    /**
     * ERROR BOUNDARY
     * 
     * Wraps the entire app to catch and handle errors gracefully.
     * If any component throws an error, ErrorBoundary will catch it
     * and display a fallback UI instead of crashing the whole app.
     * 
     * This is a best practice for production React apps!
     */
    <ErrorBoundary>
      {/**
       * CONTEXT PROVIDER
       * 
       * TaskProvider makes task state available to all child components.
       * No prop drilling needed - any component can access tasks via useTaskContext().
       * 
       * This demonstrates the Provider pattern for global state management.
       */}
      <TaskProvider>
        {/**
         * MAIN CONTAINER
         * 
         * Uses a CSS class for styling.
         * We keep classes minimal as per requirements.
         */}
        <div className="app-container">
          {/**
           * HEADER SECTION
           * 
           * Contains app title and main actions.
           */}
          <header className="header">
            <h1>Task Tracker & Scheduler</h1>
            <p>A comprehensive React tutorial application demonstrating all React concepts</p>

            {/**
             * CREATE TASK BUTTON
             * 
             * onClick opens the modal.
             * Demonstrates event handling.
             */}
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              variant="primary"
              data-size="large"
            >
              + Create New Task
            </Button>
          </header>

          {/**
           * MAIN CONTENT AREA
           */}
          <main>
            {/**
             * TAB NAVIGATION
             * 
             * Demonstrates conditional rendering and active states.
             * Simple tab switching using local state.
             */}
            <div className="flex-row mb-2" style={{ justifyContent: 'center', gap: '1rem' }}>
              <Button
                variant={activeTab === 'tasks' ? 'primary' : 'outline'}
                onClick={() => setActiveTab('tasks')}
              >
                <FontAwesomeIcon icon={faListCheck} />  Task List
              </Button>
              <Button
                variant={activeTab === 'calendar' ? 'primary' : 'outline'}
                onClick={() => setActiveTab('calendar')}
              >
                <FontAwesomeIcon icon={faCalendarDays} /> Calendar View
              </Button>
            </div>

            {/**
             * SUSPENSE BOUNDARY
             * 
             * Wraps lazy-loaded components.
             * Shows fallback UI while component is loading.
             * 
             * IMPORTANT:
             * - Required when using React.lazy()
             * - Catches loading state
             * - Provides loading UI
             * 
             * The fallback prop accepts any React element to show while loading.
             */}
            <Suspense
              fallback={
                <div className="loading">
                  {/**
                   * LOADING STATE
                   * 
                   * Shown while lazy component is loading.
                   * This improves UX by showing something while waiting.
                   */}
                  <div className="spinner"></div>
                  <p>Loading...</p>
                </div>
              }
            >
              {/**
               * CONDITIONAL RENDERING - Tab Content
               * 
               * Show different component based on activeTab state.
               * Uses ternary operator for two options.
               * 
               * Syntax: condition ? ifTrue : ifFalse
               * 
               * Both TaskList and Calendar are lazy-loaded,
               * so they only download when first rendered.
               */}
              {activeTab === 'tasks' ? (
                <div className="section">
                  <h2>My Tasks</h2>
                  <TaskList />
                </div>
              ) : (
                <div className="section">
                  <h2>Calendar Schedule</h2>
                  <Calendar onDateClick={handleDateClick} />
                </div>
              )}
            </Suspense>
          </main>

          {/**
           * PORTAL - Create Task Modal
           * 
           * Modal uses ReactDOM.createPortal() internally.
           * It renders at document.body level (outside this component's DOM tree).
           * 
           * Demonstrates:
           * - Portals
           * - Modal pattern
           * - Form in modal
           * - Callback on success
           */}
          <Modal
            isOpen={isCreateModalOpen}
            onClose={handleModalClose}
            title="Create New Task"
          >
            {/**
             * TaskForm Component
             * 
             * When form is submitted successfully:
             * - onSuccess callback is called
             * - We close the modal
             * - Form resets itself
             * 
             * selectedDate is passed to pre-fill the task date
             */}
            <TaskForm
              onSuccess={handleModalClose}
              initialDate={selectedDate}
            />
          </Modal>

          {/**
           * FOOTER
           * 
           * Simple footer with info.
           */}
          <footer style={{
            textAlign: 'center',
            marginTop: '3rem',
            padding: '2rem',
            color: 'var(--text-muted)',
            fontSize: '0.875rem'
          }}>
            <p>
              Built with React | Demonstrates: Hooks, Context, Reducers, Custom Hooks,
              Portals, Suspense, Error Boundaries, and more!
            </p>
          </footer>
        </div>
      </TaskProvider>
    </ErrorBoundary>
  );
}

export default App;

/**
 * KEY CONCEPTS DEMONSTRATED IN APP.JSX:
 * 
 * 1. CODE SPLITTING:
 *    - React.lazy() for dynamic imports
 *    - Smaller initial bundle
 *    - Load components on-demand
 * 
 * 2. SUSPENSE:
 *    - Handles loading state for lazy components
 *    - Provides fallback UI
 *    - Required for lazy loading
 * 
 * 3. ERROR BOUNDARIES:
 *    - Catches errors in component tree
 *    - Prevents entire app crash
 *    - Shows fallback UI
 * 
 * 4. CONTEXT PROVIDER:
 *    - TaskProvider wraps app
 *    - Global state available everywhere
 *    - No prop drilling
 * 
 * 5. COMPONENT COMPOSITION:
 *    - App built from many smaller components
 *    - Each component has single responsibility
 *    - Easy to understand and maintain
 * 
 * 6. CONDITIONAL RENDERING:
 *    - Tab switching
 *    - Modal visibility
 *    - Different views
 * 
 * 7. CUSTOM HOOKS:
 *    - useToggle for modal state
 *    - Cleaner, more reusable code
 * 
 * 8. PORTALS:
 *    - Modal renders at document.body
 *    - Better z-index management
 *    - Accessibility benefits
 */
