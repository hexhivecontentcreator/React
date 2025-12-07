/**
 * LOCALSTORAGE UTILITIES
 * 
 * React Concepts Demonstrated:
 * - Side effects (localStorage is a browser API - external to React)
 * - Error handling with try-catch
 * - These will be used in useEffect for data persistence
 * 
 * These utilities provide a safe interface to localStorage.
 * They handle JSON serialization/deserialization and errors gracefully.
 */

/**
 * Save data to localStorage
 * This is a side effect - it modifies something outside of React
 * @param {string} key - The localStorage key
 * @param {any} value - The value to store (will be JSON stringified)
 * @returns {boolean} True if successful, false otherwise
 */
export const saveToStorage = (key, value) => {
    try {
        // Convert JavaScript object to JSON string
        const serializedValue = JSON.stringify(value);

        // Save to localStorage
        window.localStorage.setItem(key, serializedValue);

        return true;
    } catch (error) {
        // Handle errors (e.g., storage quota exceeded, privacy mode)
        console.error(`Error saving to localStorage: ${error.message}`);
        return false;
    }
};

/**
 * Load data from localStorage
 * @param {string} key - The localStorage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} The stored value or default value
 */
export const loadFromStorage = (key, defaultValue = null) => {
    try {
        // Get the serialized data from localStorage
        const serializedValue = window.localStorage.getItem(key);

        // If no data exists, return default value
        if (serializedValue === null) {
            return defaultValue;
        }

        // Parse JSON string back to JavaScript object
        return JSON.parse(serializedValue);
    } catch (error) {
        // Handle errors (e.g., invalid JSON)
        console.error(`Error loading from localStorage: ${error.message}`);
        return defaultValue;
    }
};

/**
 * Remove data from localStorage
 * @param {string} key - The localStorage key
 * @returns {boolean} True if successful, false otherwise
 */
export const removeFromStorage = (key) => {
    try {
        window.localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error removing from localStorage: ${error.message}`);
        return false;
    }
};

/**
 * Clear all data from localStorage
 * Use with caution!
 * @returns {boolean} True if successful, false otherwise
 */
export const clearStorage = () => {
    try {
        window.localStorage.clear();
        return true;
    } catch (error) {
        console.error(`Error clearing localStorage: ${error.message}`);
        return false;
    }
};

/**
 * Check if a key exists in localStorage
 * @param {string} key - The localStorage key
 * @returns {boolean} True if key exists
 */
export const hasKey = (key) => {
    return window.localStorage.getItem(key) !== null;
};

/**
 * Get all keys from localStorage
 * Useful for debugging
 * @returns {Array<string>} Array of all localStorage keys
 */
export const getAllKeys = () => {
    const keys = [];

    for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key) {
            keys.push(key);
        }
    }

    return keys;
};

/**
 * Get the size of localStorage in bytes
 * Useful for monitoring storage usage
 * @returns {number} Size in bytes
 */
export const getStorageSize = () => {
    let size = 0;

    for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key) {
            const value = window.localStorage.getItem(key);
            // Count both key and value size
            size += key.length + (value ? value.length : 0);
        }
    }

    return size;
};
