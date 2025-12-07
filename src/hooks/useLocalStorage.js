/**
 * CUSTOM HOOK: useLocalStorage
 * 
 * React Concepts Demonstrated:
 * - Custom hooks (hooks that use other hooks)
 * - useState
 * - useEffect
 * - Lazy state initialization
 * - Effect cleanup
 * - Encapsulating reusable logic
 * 
 * WHAT ARE CUSTOM HOOKS?
 * Custom hooks are JavaScript functions that use React hooks.
 * They let you extract component logic into reusable functions.
 * 
 * RULES FOR CUSTOM HOOKS:
 * 1. Name must start with "use"
 * 2. Can call other hooks
 * 3. Must follow the same rules as built-in hooks
 * 
 * This custom hook synchronizes state with localStorage.
 */

import { useState, useEffect } from 'react';

/**
 * useLocalStorage Hook
 * 
 * Synchronizes state with localStorage automatically.
 * Similar to useState but persists data.
 * 
 * @param {string} key - localStorage key
 * @param {any} initialValue - Initial value if key doesn't exist
 * @returns {Array} [storedValue, setValue] - Like useState
 * 
 * Usage:
 * const [name, setName] = useLocalStorage('name', 'John');
 */
export const useLocalStorage = (key, initialValue) => {
    /**
     * useState with Lazy Initialization
     * 
     * Instead of passing a value, we pass a function.
     * This function only runs once on initial render.
     * 
     * Why? Reading from localStorage is expensive.
     * We only want to do it once, not on every render.
     */
    const [storedValue, setStoredValue] = useState(() => {
        try {
            // Get from localStorage by key
            const item = window.localStorage.getItem(key);

            // Parse JSON or return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If error (e.g., JSON parse error), return initialValue
            console.error(`Error loading ${key} from localStorage:`, error);
            return initialValue;
        }
    });

    /**
     * Custom setter function
     * 
     * This wraps setState to also save to localStorage.
     * It accepts either a value or a function (like setState).
     */
    const setValue = (value) => {
        try {
            // Allow value to be a function (like setState)
            // This enables: setValue(prev => prev + 1)
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            // Update React state
            setStoredValue(valueToStore);

            // Save to localStorage
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error saving ${key} to localStorage:`, error);
        }
    };

    /**
     * Sync with localStorage changes from other tabs/windows
     * 
     * The 'storage' event fires when localStorage changes in another tab.
     * This keeps all tabs in sync!
     */
    useEffect(() => {
        const handleStorageChange = (e) => {
            // Check if the change was to our key
            if (e.key === key && e.newValue) {
                try {
                    setStoredValue(JSON.parse(e.newValue));
                } catch (error) {
                    console.error('Error parsing storage event:', error);
                }
            }
        };

        // Listen for storage events
        window.addEventListener('storage', handleStorageChange);

        // Cleanup: remove event listener when component unmounts
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key]); // Re-run if key changes

    return [storedValue, setValue];
};
