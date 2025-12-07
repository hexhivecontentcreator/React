/**
 * CUSTOM HOOK: usePrevious
 * 
 * React Concepts Demonstrated:
 * - Custom hooks
 * - useRef for persistent values
 * - useEffect for tracking changes
 * - Accessing previous values
 * 
 * This hook stores the previous value of a state or prop.
 * Useful for comparing current vs previous values to detect changes.
 */

import { useRef, useEffect } from 'react';

/**
 * usePrevious Hook
 * 
 * Stores and returns the previous value of a variable.
 * 
 * @param {any} value - The value to track
 * @returns {any} The previous value
 * 
 * Usage:
 * const [count, setCount] = useState(0);
 * const previousCount = usePrevious(count);
 * 
 * // Can compare: if (count !== previousCount) { ... }
 */
export const usePrevious = (value) => {
    /**
     * useRef to store previous value
     * 
     * We use useRef instead of useState because:
     * - We don't want re-renders when the previous value changes
     * - We need the value to persist across renders
     * - We're only reading this value, not triggering UI updates
     */
    const ref = useRef();

    /**
     * Update ref.current with the current value AFTER render
     * 
     * useEffect runs after render, so:
     * 1. Component renders with new value
     * 2. ref.current still has old value (previous)
     * 3. Effect runs, updating ref.current to new value
     * 4. Next render: ref.current has the "previous" value
     */
    useEffect(() => {
        ref.current = value;
    }, [value]); // Run when value changes

    // Return the previous value
    return ref.current;
};
