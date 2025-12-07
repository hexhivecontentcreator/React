/**
 * CONSTANTS
 * 
 * React Concepts Demonstrated:
 * - JavaScript module exports
 * - Constant data that doesn't change
 * - Used throughout the app for consistency
 * 
 * This file contains all constant values used in the application.
 * Centralizing constants makes the code more maintainable and consistent.
 */

// Days of the week for repetitive task selection
// This array will be used in checkbox groups for selecting which days a task repeats
export const DAYS_OF_WEEK = [
    { id: 'monday', label: 'Monday', short: 'Mon' },
    { id: 'tuesday', label: 'Tuesday', short: 'Tue' },
    { id: 'wednesday', label: 'Wednesday', short: 'Wed' },
    { id: 'thursday', label: 'Thursday', short: 'Thu' },
    { id: 'friday', label: 'Friday', short: 'Fri' },
    { id: 'saturday', label: 'Saturday', short: 'Sat' },
    { id: 'sunday', label: 'Sunday', short: 'Sun' }
];

// Task status values
// Used to track the current state of a task
export const TASK_STATUS = {
    ACTIVE: 'active',
    COMPLETED: 'completed',
    OVERDUE: 'overdue'
};

// Task type - whether it's a one-day task or spans multiple days
export const TASK_TYPE = {
    ONE_DAY: 'one-day',
    DATE_RANGE: 'date-range'
};

// LocalStorage keys
// Using constants prevents typos when accessing localStorage
export const STORAGE_KEYS = {
    TASKS: 'task-tracker-tasks',
    TIMERS: 'task-tracker-timers'
};

// Default task template
// This will be used when creating a new task
export const DEFAULT_TASK = {
    id: null,
    title: '',
    description: '',
    isRepetitive: false,
    repetitionDays: [],
    allocatedHours: 0,
    deadline: null,
    taskType: TASK_TYPE.ONE_DAY,
    startDate: null,
    endDate: null,
    elapsedTime: 0, // in seconds
    status: TASK_STATUS.ACTIVE,
    createdAt: null,
    updatedAt: null
};

// Timer states
export const TIMER_STATE = {
    IDLE: 'idle',
    RUNNING: 'running',
    PAUSED: 'paused'
};

// Validation messages
export const VALIDATION_MESSAGES = {
    TITLE_REQUIRED: 'Task title is required',
    TITLE_MIN_LENGTH: 'Title must be at least 3 characters',
    DESCRIPTION_MIN_LENGTH: 'Description must be at least 10 characters',
    HOURS_INVALID: 'Allocated hours must be greater than 0',
    DEADLINE_INVALID: 'Deadline must be a future date',
    REPETITION_DAYS_REQUIRED: 'Please select at least one day for repetitive tasks',
    DATE_RANGE_INVALID: 'End date must be after start date'
};

// Animation durations (in milliseconds)
// These match the CSS animation durations
export const ANIMATION_DURATION = {
    FAST: 300,
    MEDIUM: 600,
    SLOW: 1000
};

// Date format options
export const DATE_FORMAT_OPTIONS = {
    SHORT: { month: 'short', day: 'numeric', year: 'numeric' },
    LONG: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
    TIME: { hour: '2-digit', minute: '2-digit' }
};
