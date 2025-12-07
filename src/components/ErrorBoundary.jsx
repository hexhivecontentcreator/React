/**
 * ERROR BOUNDARY COMPONENT
 * 
 * React Concepts Demonstrated:
 * - Error boundaries (error handling in React)
 * - Component lifecycle (class component pattern - necessary for error boundaries)
 * - State management in class components
 * - Fallback UI
 * 
 * WHAT IS AN ERROR BOUNDARY?
 * An error boundary is a React component that catches JavaScript errors
 * anywhere in its child component tree, logs those errors, and displays
 * a fallback UI instead of the component tree that crashed.
 * 
 * WHY ERROR BOUNDARIES?
 * - Prevent the entire app from crashing
 * - Show user-friendly error messages
 * - Log errors for debugging
 * - Graceful degradation
 * 
 * IMPORTANT: Error boundaries currently MUST be class components!
 * There's no hook equivalent yet (as of React 18).
 * This is the only place we use a class component in this tutorial.
 */

import React from 'react';

/**
 * ErrorBoundary Class Component
 * 
 * Note: This is a class component, not a functional component.
 * Class components are the older way of writing React components.
 * 
 * We need a class component here because error boundaries require
 * lifecycle methods that don't have hook equivalents yet.
 */
class ErrorBoundary extends React.Component {
    /**
     * Constructor
     * 
     * In class components, the constructor is called when the component
     * is first created. It's used to initialize state.
     * 
     * @param {object} props - Component props
     */
    constructor(props) {
        // MUST call super(props) first in constructor
        super(props);

        /**
         * Initialize state
         * 
         * In class components, state is always an object.
         * We use this.state to access it.
         */
        this.state = {
            hasError: false,  // Whether an error has occurred
            error: null,      // The error object
            errorInfo: null   // Additional error information
        };
    }

    /**
     * static getDerivedStateFromError(error)
     * 
     * This lifecycle method is called when an error is thrown
     * in a descendant component.
     * 
     * It should return a state update object.
     * 
     * This is called during the render phase, so side effects are not allowed.
     * For logging errors, use componentDidCatch instead.
     * 
     * @param {Error} error - The error that was thrown
     * @returns {object} State update object
     */
    static getDerivedStateFromError(error) {
        // Update state to show fallback UI
        return {
            hasError: true,
            error: error
        };
    }

    /**
     * componentDidCatch(error, errorInfo)
     * 
     * This lifecycle method is called after an error has been thrown
     * in a descendant component.
     * 
     * It's called during the commit phase, so side effects are allowed.
     * This is where you can log errors to an error reporting service.
     * 
     * @param {Error} error - The error that was thrown
     * @param {object} errorInfo - Information about which component threw the error
     */
    componentDidCatch(error, errorInfo) {
        // Log error to console
        // In production, you'd send this to an error tracking service
        console.error('Error caught by ErrorBoundary:', error, errorInfo);

        // Update state with error info
        this.setState({
            errorInfo: errorInfo
        });
    }

    /**
     * render()
     * 
     * The render method is required in class components.
     * It returns the JSX to render.
     * 
     * In class components, we access props via this.props
     * and state via this.state.
     */
    render() {
        // If there's an error, show fallback UI
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <h2>Oops! Something went wrong</h2>
                    <p>
                        We're sorry, but something unexpected happened.
                        The error has been logged and we'll look into it.
                    </p>

                    {/**
           * Show error details in development
           * 
           * In production, you'd want to hide these details
           * and show a user-friendly message instead.
           */}
                    {import.meta.env.DEV && (
                        <details className="error-message">
                            <summary>Error Details (Development Only)</summary>
                            <p><strong>Error:</strong> {this.state.error && this.state.error.toString()}</p>
                            <p><strong>Stack trace:</strong></p>
                            <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
                        </details>
                    )}

                    <button onClick={() => window.location.reload()}>
                        Reload Page
                    </button>
                </div>
            );
        }

        /**
         * If no error, render children normally
         * 
         * this.props.children contains the components wrapped
         * by this ErrorBoundary.
         */
        return this.props.children;
    }
}

export default ErrorBoundary;

/**
 * USAGE EXAMPLE:
 * 
 * import ErrorBoundary from './components/ErrorBoundary';
 * 
 * function App() {
 *   return (
 *     <ErrorBoundary>
 *       <YourApp />
 *     </ErrorBoundary>
 *   );
 * }
 * 
 * // You can also wrap specific sections:
 * <ErrorBoundary>
 *   <Sidebar />
 * </ErrorBoundary>
 * <ErrorBoundary>
 *   <MainContent />
 * </ErrorBoundary>
 */

/**
 * WHAT ERROR BOUNDARIES CATCH:
 * - Errors during rendering
 * - Errors in lifecycle methods
 * - Errors in constructors of child components
 * 
 * WHAT ERROR BOUNDARIES DON'T CATCH:
 * - Event handlers (use try-catch)
 * - Asynchronous code (setTimeout, requestAnimationFrame)
 * - Server side rendering
 * - Errors thrown in the error boundary itself
 */

/**
 * CLASS COMPONENTS vs FUNCTIONAL COMPONENTS:
 * 
 * Class Component:
 * - class MyComponent extends React.Component
 * - Has state via this.state
 * - Has lifecycle methods
 * - Access props via this.props
 * - Older pattern
 * 
 * Functional Component:
 * - function MyComponent(props)
 * - Has state via useState hook
 * - Has effects via useEffect hook
 * - Access props via parameter
 * - Modern pattern (preferred)
 * 
 * We use functional components everywhere EXCEPT error boundaries,
 * which currently require class components.
 */
