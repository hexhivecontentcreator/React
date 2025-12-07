/**
 * TASK CONTEXT
 * 
 * React Concepts Demonstrated:
 * - createContext API
 * - useContext hook
 * - useReducer hook  
 * - useEffect for side effects
 * - Context Provider pattern
 * - Prop drilling avoidance
 * - State management architecture
 * 
 * WHAT IS CONTEXT?
 * Context provides a way to pass data through the component tree without
 * having to pass props down manually at every level.
 * 
 * WHY USE CONTEXT?
 * - Avoid prop drilling (passing props through many intermediate components)
 * - Share state globally across the app
 * - Create a centralized state management solution
 * 
 * WHEN TO USE CONTEXT?
 * - Theme data (dark mode, colors)
 * - User authentication state
 * - Application-wide settings
 * - In our case: Tasks data that many components need
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { taskReducer, TASK_ACTIONS } from '../reducers/taskReducer';
import { saveToStorage, loadFromStorage } from '../utils/localStorage';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Create Context
 * 
 * createContext() creates a Context object.
 * When React renders a component that subscribes to this Context object,
 * it will read the current context value from the closest matching Provider above it.
 * 
 * The argument to createContext is the default value, used only when a component
 * does not have a matching Provider above it in the tree.
 */
const TaskContext = createContext(undefined);

/**
 * TaskProvider Component
 * 
 * This is a Provider component that wraps our app.
 * It manages the task state and provides it to all child components.
 * 
 * Concepts demonstrated:
 * - Component composition (children prop)
 * - useReducer for complex state
 * - useEffect for localStorage sync
 * - Creating a context provider
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const TaskProvider = ({ children }) => {
    /**
     * useReducer Hook
     * 
     * const [state, dispatch] = useReducer(reducer, initialState);
     * 
     * useReducer is an alternative to useState.
     * It's preferable when:
     * - State logic is complex
     * - Next state depends on previous state
     * - You want to optimize performance
     * 
     * Returns:
     * - state: Current state value
     * - dispatch: Function to send actions to the reducer
     */

    // Initialize state by loading from localStorage
    // This is called "lazy initialization" - the function only runs once
    const [tasks, dispatch] = useReducer(
        taskReducer,
        [], // Initial state (empty array)
        () => {
            // This initialization function runs only once on mount
            // It's useful for expensive computations or reading from storage
            const savedTasks = loadFromStorage(STORAGE_KEYS.TASKS, []);
            return savedTasks;
        }
    );

    /**
     * useEffect for localStorage Synchronization
     * 
     * This effect runs whenever the tasks array changes.
     * It saves the current tasks to localStorage.
     * 
     * This demonstrates:
     * - Side effects (localStorage is external to React)
     * - Effect dependencies (runs when tasks changes)
     * - Data persistence
     */
    useEffect(() => {
        // Save tasks to localStorage whenever they change
        saveToStorage(STORAGE_KEYS.TASKS, tasks);

        // No cleanup needed for this effect
        // If we needed cleanup (e.g., cancelling a subscription),
        // we would return a cleanup function:
        // return () => { /* cleanup code */ };
    }, [tasks]); // Dependency array: effect runs when tasks changes

    /**
     * useEffect for Status Updates
     * 
     * This effect periodically checks for overdue tasks.
     * It demonstrates:
     * - setInterval in React
     * - Cleanup functions (clearing interval)
     * - Regular background updates
     */
    useEffect(() => {
        // Check for overdue tasks every minute
        const intervalId = setInterval(() => {
            dispatch({ type: TASK_ACTIONS.UPDATE_TASK_STATUS });
        }, 60000); // 60000ms = 1 minute

        // Cleanup function
        // This runs when the component unmounts or before the effect runs again
        // It's CRITICAL to clear intervals to prevent memory leaks!
        return () => {
            clearInterval(intervalId);
        };
    }, []); // Empty dependency array: effect runs once on mount

    /**
     * Context Value
     * 
     * This object will be available to all components that use this context.
     * We provide both the state (tasks) and the dispatch function.
     * 
     * Note: In a larger app, we might also provide helper functions here
     * instead of exposing dispatch directly.
     * 
     * Note: TASK_ACTIONS should be imported directly from taskReducer.js
     * in components that need it, rather than passing through context.
     */
    const value = {
        tasks,           // Current tasks array
        dispatch         // Dispatch function for actions
    };

    /**
     * Provider Component
     * 
     * The Provider component accepts a "value" prop.
     * All components that are descendants of this Provider will have access
     * to this value, no matter how deep in the component tree.
     * 
     * The "children" prop allows this component to wrap other components.
     */
    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );
};

/**
 * Custom Hook: useTaskContext
 * 
 * This is a custom hook that provides easy access to the task context.
 * 
 * Why create a custom hook?
 * - Cleaner API for consuming context
 * - Better error messages if used outside provider
 * - Encapsulation of context consumption logic
 * - Easier to test and refactor
 * 
 * Usage:
 * const { tasks, dispatch } = useTaskContext();
 * import { TASK_ACTIONS } from '../reducers/taskReducer';
 * 
 * @returns {object} Context value with tasks and dispatch
 */
export const useTaskContext = () => {
    // useContext hook subscribes to the nearest TaskContext Provider above
    const context = useContext(TaskContext);

    /**
     * Error Handling
     * 
     * If useTaskContext is called outside of a TaskProvider,
     * context will be undefined. We throw a helpful error message.
     * 
     * This is a best practice for context hooks!
     */
    if (context === undefined) {
        throw new Error('useTaskContext must be used within a TaskProvider');
    }

    return context;
};

/**
 * HOW TO USE THIS CONTEXT:
 * 
 * 1. Wrap your app with TaskProvider:
 * 
 *    <TaskProvider>
 *      <App />
 *    </TaskProvider>
 * 
 * 2. Use the custom hook in any component:
 * 
 *    import { useTaskContext } from '../context/TaskContext';
 *    import { TASK_ACTIONS } from '../reducers/taskReducer';
 *    const { tasks, dispatch } = useTaskContext();
 * 
 * 3. Dispatch actions:
 * 
 *    dispatch({ type: TASK_ACTIONS.ADD_TASK, payload: newTask });
 *    dispatch({ type: TASK_ACTIONS.DELETE_TASK, payload: taskId });
 * 
 * 4. Access tasks:
 * 
 *    tasks.map(task => <TaskItem key={task.id} task={task} />)
 */

/**
 * ALTERNATIVE PATTERNS:
 * 
 * Instead of exposing dispatch directly, we could create helper functions:
 * 
 * const addTask = useCallback((task) => {
 *   dispatch(taskActions.addTask(task));
 * }, [dispatch]);
 * 
 * const value = { tasks, addTask, deleteTask, ... };
 * 
 * This provides a more explicit API but requires more boilerplate.
 * For this tutorial, we keep it simple by exposing dispatch.
 */
