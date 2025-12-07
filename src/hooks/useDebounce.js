/**
 * CUSTOM HOOK: useDebounce
 * 
 * React Concepts Demonstrated:
 * - Custom hooks
 * - useState
 * - useEffect
 * - setTimeout/clearTimeout
 * - Performance optimization
 * 
 * WHAT IS DEBOUNCING?
 * Debouncing delays executing a function until after a specified time
 * has passed since the last time it was invoked.
 * 
 * USE CASES:
 * - Search input: don't search on every keystroke
 * - Window resize handlers
 * - Scroll event handlers
 * - Auto-save functionality
 * 
 * This hook returns a debounced version of a value.
 */

import { useState, useEffect } from 'react';

/**
 * useDebounce Hook
 * 
 * Returns a debounced version of the value.
 * The debounced value will only update after the delay period
 * has passed without the value changing.
 * 
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 500)
 * @returns {any} Debounced value
 * 
 * Usage:
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 * 
 * useEffect(() => {
 *   // This only runs 500ms after the user stops typing
 *   searchAPI(debouncedSearchTerm);
 * }, [debouncedSearchTerm]);
 */
export const useDebounce = (value, delay = 500) => {
    // State to store the debounced value
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        /**
         * setTimeout creates a timer that executes a function once after a delay.
         * 
         * The pattern:
         * 1. User types -> value changes
         * 2. Effect runs -> sets timeout
         * 3. If user types again before timeout -> cleanup runs, clears timeout
         * 4. New timeout is set
         * 5. If no changes for 'delay' ms -> timeout executes, updates debouncedValue
         */

        // Set timeout to update debounced value
        const timeoutId = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        /**
         * Cleanup function
         * 
         * This runs:
         * - Before the effect runs again (when value or delay changes)
         * - When the component unmounts
         * 
         * It clears the timeout, preventing the debounced value from updating
         * if the value has changed again.
         * 
         * This is the KEY to debouncing:
         * - Each keystroke clears the previous timeout
         * - Only the last timeout (after user stops typing) executes
         */
        return () => {
            clearTimeout(timeoutId);
        };
    }, [value, delay]); // Re-run effect when value or delay changes

    return debouncedValue;
};

/**
 * EXAMPLE VISUALIZATION:
 * 
 * User types "React" letter by letter:
 * 
 * Time:  0ms   100ms  200ms  300ms  400ms  900ms
 * Input: R     Re     Rea    Reac   React  React
 * Effect: ↓     ↓      ↓      ↓      ↓
 * Timeout: [500ms] -> cleared
 *                [500ms] -> cleared
 *                       [500ms] -> cleared
 *                              [500ms] -> cleared
 *                                     [500ms] -> executes!
 * 
 * Result: debouncedValue only updates to "React" at 900ms,
 * even though the user finished typing at 400ms.
 * 
 * This prevents the search/API call from running on every keystroke!
 */

/**
 * PERFORMANCE IMPACT:
 * 
 * Without debounce:
 * - User types "React" (5 letters)
 * - 5 API calls made
 * - Network congestion
 * - Wasted resources
 * 
 * With debounce (500ms):
 * - User types "React"
 * - 1 API call made (after 500ms of no typing)
 * - Better performance
 * - Better user experience
 */
