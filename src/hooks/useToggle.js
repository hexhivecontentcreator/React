/**
 * CUSTOM HOOK: useToggle
 * 
 * React Concepts Demonstrated:
 * - Custom hooks
 * - useState
 * - useCallback for memoized functions
 * - Boolean state management
 * 
 * This is a simple but useful custom hook for toggling boolean values.
 * It demonstrates how even simple patterns can be extracted into reusable hooks.
 */

import { useState, useCallback } from 'react';

/**
 * useToggle Hook
 * 
 * Manages a boolean state with toggle functionality.
 * 
 * @param {boolean} initialValue - Initial boolean value (default: false)
 * @returns {Array} [value, toggle, setValue] - Current value, toggle function, and setter
 * 
 * Usage:
 * const [isOpen, toggleOpen, setIsOpen] = useToggle(false);
 * 
 * toggleOpen();        // Flips the value
 * setIsOpen(true);     // Sets to specific value
 */
export const useToggle = (initialValue = false) => {
    // State for the boolean value
    const [value, setValue] = useState(initialValue);

    /**
     * useCallback Hook
     * 
     * Returns a memoized version of the callback.
     * The function reference stays the same unless dependencies change.
     * 
     * Why use useCallback?
     * - Performance: prevents unnecessary re-renders if this function
     *   is passed as a prop to a child component
     * - Stability: same function reference across renders
     * 
     * Dependencies: [setValue]
     * - setValue from useState is already stable, so this is safe
     */
    const toggle = useCallback(() => {
        setValue(prev => !prev);
    }, []);

    /**
     * We also expose setValue for when you want to set a specific value
     * instead of toggling.
     * 
     * Example: setIsOpen(false) to explicitly close a modal
     */
    return [value, toggle, setValue];
};
