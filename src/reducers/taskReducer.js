/**
 * TASK REDUCER
 * 
 * React Concepts Demonstrated:
 * - useReducer hook pattern
 * - State management with actions
 * - Immutable state updates
 * - Pure reducer functions
 * 
 * A reducer is a pure function that takes the current state and an action,
 * and returns a new state. It's called a "reducer" because it's similar to
 * the function you pass to Array.reduce().
 * 
 * Reducer Pattern:
 * (state, action) => newState
 * 
 * Why use useReducer instead of useState?
 * - When state logic is complex
 * - When next state depends on previous state
 * - When you want to optimize performance (we can use dispatch in useCallback)
 * - When you have multiple sub-values in state
 */

import { TASK_STATUS, TASK_TYPE } from '../utils/constants';

/**
 * Action Types
 * Using constants prevents typos and makes refactoring easier
 */
export const TASK_ACTIONS = {
    // CRUD operations
    ADD_TASK: 'ADD_TASK',
    UPDATE_TASK: 'UPDATE_TASK',
    DELETE_TASK: 'DELETE_TASK',
    TOGGLE_COMPLETE: 'TOGGLE_COMPLETE',

    // Timer operations
    UPDATE_TIMER: 'UPDATE_TIMER',
    RESET_TIMER: 'RESET_TIMER',

    // Bulk operations
    SET_TASKS: 'SET_TASKS',
    CLEAR_ALL_TASKS: 'CLEAR_ALL_TASKS',

    // Status updates
    UPDATE_TASK_STATUS: 'UPDATE_TASK_STATUS'
};

/**
 * Generate a unique ID for tasks
 * In a real app, this would come from a backend/database
 * @returns {string} Unique ID
 */
const generateId = () => {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calculate task status based on deadline
 * This demonstrates derived state logic
 * @param {object} task - The task object
 * @returns {string} Task status
 */
const calculateTaskStatus = (task) => {
    // If manually marked as completed, return completed
    if (task.status === TASK_STATUS.COMPLETED) {
        return TASK_STATUS.COMPLETED;
    }

    // Check if deadline is in the past
    if (task.deadline) {
        const deadline = new Date(task.deadline);
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        if (deadline < now) {
            return TASK_STATUS.OVERDUE;
        }
    }

    return TASK_STATUS.ACTIVE;
};

/**
 * Task Reducer Function
 * 
 * IMPORTANT: This must be a pure function!
 * - No side effects (no API calls, no localStorage, no console.logs in production)
 * - Same input always produces same output
 * - Doesn't modify the original state (immutability)
 * 
 * @param {Array} state - Current tasks array
 * @param {object} action - Action object with type and payload
 * @returns {Array} New tasks array
 */
export const taskReducer = (state, action) => {
    // Use switch statement to handle different action types
    switch (action.type) {

        case TASK_ACTIONS.ADD_TASK: {
            /**
             * Adding a new task
             * 
             * Concepts demonstrated:
             * - Immutable array update (spread operator)
             * - Object composition
             * - Timestamps for tracking
             */
            const newTask = {
                ...action.payload,
                id: generateId(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: TASK_STATUS.ACTIVE,
                elapsedTime: 0
            };

            // Return new array with new task added
            // We use spread operator to create a new array (immutability)
            return [...state, newTask];
        }

        case TASK_ACTIONS.UPDATE_TASK: {
            /**
             * Updating an existing task
             * 
             * Concepts demonstrated:
             * - Array.map() for immutable updates
             * - Conditional logic
             * - Object spreading
             */
            return state.map(task => {
                // Find the task to update
                if (task.id === action.payload.id) {
                    // Create new task object with updated fields
                    const updatedTask = {
                        ...task,
                        ...action.payload,
                        updatedAt: new Date().toISOString()
                    };

                    // Recalculate status
                    updatedTask.status = calculateTaskStatus(updatedTask);

                    return updatedTask;
                }

                // Return unchanged task
                return task;
            });
        }

        case TASK_ACTIONS.DELETE_TASK: {
            /**
             * Deleting a task
             * 
             * Concepts demonstrated:
             * - Array.filter() for immutable deletion
             */
            return state.filter(task => task.id !== action.payload.id);
        }

        case TASK_ACTIONS.TOGGLE_COMPLETE: {
            /**
             * Toggle task completion status
             * 
             * Concepts demonstrated:
             * - Toggling boolean state
             * - Conditional status updates
             */
            return state.map(task => {
                if (task.id === action.payload.id) {
                    const newStatus = task.status === TASK_STATUS.COMPLETED
                        ? TASK_STATUS.ACTIVE
                        : TASK_STATUS.COMPLETED;

                    return {
                        ...task,
                        status: newStatus,
                        updatedAt: new Date().toISOString()
                    };
                }
                return task;
            });
        }

        case TASK_ACTIONS.UPDATE_TIMER: {
            /**
             * Update task timer
             * 
             * Concepts demonstrated:
             * - Updating nested state
             * - Working with numbers
             */
            return state.map(task => {
                if (task.id === action.payload.id) {
                    return {
                        ...task,
                        elapsedTime: action.payload.elapsedTime,
                        updatedAt: new Date().toISOString()
                    };
                }
                return task;
            });
        }

        case TASK_ACTIONS.RESET_TIMER: {
            /**
             * Reset task timer to zero
             */
            return state.map(task => {
                if (task.id === action.payload.id) {
                    return {
                        ...task,
                        elapsedTime: 0,
                        updatedAt: new Date().toISOString()
                    };
                }
                return task;
            });
        }

        case TASK_ACTIONS.SET_TASKS: {
            /**
             * Replace all tasks (used when loading from localStorage)
             * 
             * Concepts demonstrated:
             * - Bulk state replacement
             * - Useful for hydration from storage
             */
            return action.payload;
        }

        case TASK_ACTIONS.CLEAR_ALL_TASKS: {
            /**
             * Clear all tasks
             * 
             * Concepts demonstrated:
             * - Resetting to initial state
             */
            return [];
        }

        case TASK_ACTIONS.UPDATE_TASK_STATUS: {
            /**
             * Update task status explicitly
             * This could be called periodically to check for overdue tasks
             */
            return state.map(task => {
                const newStatus = calculateTaskStatus(task);
                if (task.status !== newStatus) {
                    return {
                        ...task,
                        status: newStatus,
                        updatedAt: new Date().toISOString()
                    };
                }
                return task;
            });
        }

        default: {
            /**
             * If we receive an unknown action type, throw an error
             * This helps catch bugs during development
             */
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
};

/**
 * Action Creators
 * 
 * These are helper functions that create action objects.
 * They make our code more readable and less error-prone.
 * 
 * Benefits:
 * - Encapsulate action structure
 * - Provide clear API for dispatching actions
 * - Make testing easier
 * - Enable better IDE autocomplete
 */

export const taskActions = {
    addTask: (task) => ({
        type: TASK_ACTIONS.ADD_TASK,
        payload: task
    }),

    updateTask: (task) => ({
        type: TASK_ACTIONS.UPDATE_TASK,
        payload: task
    }),

    deleteTask: (id) => ({
        type: TASK_ACTIONS.DELETE_TASK,
        payload: { id }
    }),

    toggleComplete: (id) => ({
        type: TASK_ACTIONS.TOGGLE_COMPLETE,
        payload: { id }
    }),

    updateTimer: (id, elapsedTime) => ({
        type: TASK_ACTIONS.UPDATE_TIMER,
        payload: { id, elapsedTime }
    }),

    resetTimer: (id) => ({
        type: TASK_ACTIONS.RESET_TIMER,
        payload: { id }
    }),

    setTasks: (tasks) => ({
        type: TASK_ACTIONS.SET_TASKS,
        payload: tasks
    }),

    clearAllTasks: () => ({
        type: TASK_ACTIONS.CLEAR_ALL_TASKS
    }),

    updateTaskStatus: () => ({
        type: TASK_ACTIONS.UPDATE_TASK_STATUS
    })
};
