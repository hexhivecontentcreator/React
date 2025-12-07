/**
 * VALIDATION UTILITIES
 * 
 * React Concepts Demonstrated:
 * - Pure functions for validation logic
 * - Used in forms with controlled components
 * - These functions help us validate user input before updating state
 * 
 * Validation functions return error messages if validation fails,
 * or null if validation passes.
 */

import { VALIDATION_MESSAGES } from './constants';

/**
 * Validate task title
 * @param {string} title - The task title
 * @returns {string|null} Error message or null if valid
 */
export const validateTitle = (title) => {
    // Check if title is empty or only whitespace
    if (!title || title.trim().length === 0) {
        return VALIDATION_MESSAGES.TITLE_REQUIRED;
    }

    // Check minimum length
    if (title.trim().length < 3) {
        return VALIDATION_MESSAGES.TITLE_MIN_LENGTH;
    }

    // Validation passed
    return null;
};

/**
 * Validate task description
 * @param {string} description - The task description
 * @returns {string|null} Error message or null if valid
 */
export const validateDescription = (description) => {
    // Description is optional, so empty is okay
    if (!description || description.trim().length === 0) {
        return null;
    }

    // If provided, check minimum length
    if (description.trim().length < 10) {
        return VALIDATION_MESSAGES.DESCRIPTION_MIN_LENGTH;
    }

    return null;
};

/**
 * Validate allocated hours
 * @param {number} hours - The allocated hours
 * @returns {string|null} Error message or null if valid
 */
export const validateHours = (hours) => {
    // Convert to number if it's a string
    const numHours = Number(hours);

    // Check if it's a valid number and greater than 0
    if (isNaN(numHours) || numHours <= 0) {
        return VALIDATION_MESSAGES.HOURS_INVALID;
    }

    return null;
};

/**
 * Validate deadline date
 * @param {Date|string} deadline - The deadline date
 * @returns {string|null} Error message or null if valid
 */
export const validateDeadline = (deadline) => {
    // Deadline is optional
    if (!deadline) {
        return null;
    }

    const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if deadline is in the past
    if (deadlineDate < today) {
        return VALIDATION_MESSAGES.DEADLINE_INVALID;
    }

    return null;
};

/**
 * Validate repetition days
 * @param {boolean} isRepetitive - Whether task is repetitive
 * @param {Array<string>} repetitionDays - Array of selected days
 * @returns {string|null} Error message or null if valid
 */
export const validateRepetitionDays = (isRepetitive, repetitionDays) => {
    // Only validate if task is marked as repetitive
    if (!isRepetitive) {
        return null;
    }

    // Check if at least one day is selected
    if (!repetitionDays || repetitionDays.length === 0) {
        return VALIDATION_MESSAGES.REPETITION_DAYS_REQUIRED;
    }

    return null;
};

/**
 * Validate date range
 * @param {Date|string} startDate - Range start date
 * @param {Date|string} endDate - Range end date
 * @returns {string|null} Error message or null if valid
 */
export const validateDateRange = (startDate, endDate) => {
    // Both dates are required for date range validation
    if (!startDate || !endDate) {
        return null;
    }

    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

    // End date must be after start date
    if (end < start) {
        return VALIDATION_MESSAGES.DATE_RANGE_INVALID;
    }

    return null;
};

/**
 * Validate entire task object
 * This demonstrates how to compose multiple validation functions
 * @param {object} task - The task object to validate
 * @returns {object} Object with field names as keys and error messages as values
 */
export const validateTask = (task) => {
    const errors = {};

    // Validate title
    const titleError = validateTitle(task.title);
    if (titleError) {
        errors.title = titleError;
    }

    // Validate description
    const descriptionError = validateDescription(task.description);
    if (descriptionError) {
        errors.description = descriptionError;
    }

    // Validate hours (only if provided)
    if (task.allocatedHours) {
        const hoursError = validateHours(task.allocatedHours);
        if (hoursError) {
            errors.allocatedHours = hoursError;
        }
    }

    // Validate deadline
    const deadlineError = validateDeadline(task.deadline);
    if (deadlineError) {
        errors.deadline = deadlineError;
    }

    // Validate repetition days
    const repetitionError = validateRepetitionDays(task.isRepetitive, task.repetitionDays);
    if (repetitionError) {
        errors.repetitionDays = repetitionError;
    }

    // Validate date range
    const dateRangeError = validateDateRange(task.startDate, task.endDate);
    if (dateRangeError) {
        errors.dateRange = dateRangeError;
    }

    return errors;
};

/**
 * Check if validation errors object has any errors
 * @param {object} errors - The errors object from validateTask
 * @returns {boolean} True if there are errors
 */
export const hasErrors = (errors) => {
    return Object.keys(errors).length > 0;
};
