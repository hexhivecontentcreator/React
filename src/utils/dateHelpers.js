/**
 * DATE HELPER FUNCTIONS
 * 
 * React Concepts Demonstrated:
 * - Pure functions (no side effects)
 * - Function composition
 * - These utilities will be used with useMemo for performance optimization
 * 
 * These are utility functions for working with dates.
 * They are pure functions - given the same input, they always return the same output.
 * Pure functions are easier to test and reason about.
 */

/**
 * Format a date to a readable string
 * @param {Date|string} date - The date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
    if (!date) return '';

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Default options
    const defaultOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    };

    return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(dateObj);
};

/**
 * Format seconds to HH:MM:SS format
 * This will be used extensively in our timer display
 * @param {number} seconds - Total seconds
 * @returns {string} Formatted time string
 */
export const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    // Pad single digits with leading zero
    return [hours, minutes, secs]
        .map(val => String(val).padStart(2, '0'))
        .join(':');
};

/**
 * Check if a date is in the past
 * @param {Date|string} date - The date to check
 * @returns {boolean} True if date is in the past
 */
export const isPastDate = (date) => {
    if (!date) return false;

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return dateObj < today;
};

/**
 * Check if a date is today
 * @param {Date|string} date - The date to check
 * @returns {boolean} True if date is today
 */
export const isToday = (date) => {
    if (!date) return false;

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();

    return (
        dateObj.getDate() === today.getDate() &&
        dateObj.getMonth() === today.getMonth() &&
        dateObj.getFullYear() === today.getFullYear()
    );
};

/**
 * Check if two dates are the same day
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {boolean} True if dates are the same day
 */
export const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;

    const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
    const d2 = typeof date2 === 'string' ? new Date(date2) : date2;

    return (
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear()
    );
};

/**
 * Get the start of the month for a given date
 * @param {Date} date - The reference date
 * @returns {Date} First day of the month
 */
export const getMonthStart = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
};

/**
 * Get the end of the month for a given date
 * @param {Date} date - The reference date
 * @returns {Date} Last day of the month
 */
export const getMonthEnd = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

/**
 * Get all days in a month (including leading/trailing days from other months)
 * This is used for rendering the calendar grid
 * @param {Date} date - The reference date
 * @returns {Array<Date>} Array of dates for calendar display
 */
export const getMonthDays = (date) => {
    const start = getMonthStart(date);
    const end = getMonthEnd(date);

    // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
    const startDay = start.getDay();

    // Get the day of week for the last day
    const endDay = end.getDay();

    const days = [];

    // Add days from previous month
    const prevMonthEnd = new Date(date.getFullYear(), date.getMonth(), 0);
    const prevMonthDays = prevMonthEnd.getDate();

    for (let i = startDay - 1; i >= 0; i--) {
        days.push(new Date(date.getFullYear(), date.getMonth() - 1, prevMonthDays - i));
    }

    // Add days from current month
    const currentMonthDays = end.getDate();
    for (let i = 1; i <= currentMonthDays; i++) {
        days.push(new Date(date.getFullYear(), date.getMonth(), i));
    }

    // Add days from next month to complete the grid
    const remainingDays = 7 - (endDay + 1);
    for (let i = 1; i <= remainingDays; i++) {
        days.push(new Date(date.getFullYear(), date.getMonth() + 1, i));
    }

    return days;
};

/**
 * Get the name of the month
 * @param {Date} date - The date
 * @returns {string} Month name
 */
export const getMonthName = (date) => {
    return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
};

/**
 * Get the year
 * @param {Date} date - The date
 * @returns {number} Year
 */
export const getYear = (date) => {
    return date.getFullYear();
};

/**
 * Add months to a date
 * @param {Date} date - The reference date
 * @param {number} months - Number of months to add (can be negative)
 * @returns {Date} New date
 */
export const addMonths = (date, months) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
};

/**
 * Check if a date falls within a date range
 * @param {Date|string} date - The date to check
 * @param {Date|string} startDate - Range start
 * @param {Date|string} endDate - Range end
 * @returns {boolean} True if date is within range
 */
export const isDateInRange = (date, startDate, endDate) => {
    if (!date || !startDate || !endDate) return false;

    const d = typeof date === 'string' ? new Date(date) : date;
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

    // Set time to midnight for comparison
    d.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    return d >= start && d <= end;
};

/**
 * Get the day of week name from a date
 * @param {Date} date - The date
 * @returns {string} Day name (e.g., 'monday')
 */
export const getDayName = (date) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
};

/**
 * Convert date to input-compatible string (YYYY-MM-DD)
 * HTML date inputs require this specific format
 * @param {Date|string} date - The date to convert
 * @returns {string} Formatted date string
 */
export const toInputDate = (date) => {
    if (!date) return '';

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

/**
 * Get relative time string (e.g., "2 days ago", "in 3 hours")
 * This demonstrates working with time differences
 * @param {Date|string} date - The date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
    if (!date) return '';

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = dateObj - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
        return `in ${diffDays} day${diffDays === 1 ? '' : 's'}`;
    } else if (diffDays < 0) {
        return `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} ago`;
    } else if (diffHours > 0) {
        return `in ${diffHours} hour${diffHours === 1 ? '' : 's'}`;
    } else if (diffHours < 0) {
        return `${Math.abs(diffHours)} hour${Math.abs(diffHours) === 1 ? '' : 's'} ago`;
    } else if (diffMinutes > 0) {
        return `in ${diffMinutes} minute${diffMinutes === 1 ? '' : 's'}`;
    } else if (diffMinutes < 0) {
        return `${Math.abs(diffMinutes)} minute${Math.abs(diffMinutes) === 1 ? '' : 's'} ago`;
    } else {
        return 'now';
    }
};
