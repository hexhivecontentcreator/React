/**
 * CUSTOM HOOK: useTimer
 * 
 * React Concepts Demonstrated:
 * - Custom hooks
 * - useState for timer state
 * - useRef for mutable values (interval ID)
 * - useEffect for setup/cleanup
 * - useCallback for stable function references
 * - Working with intervals safely in React
 * 
 * This hook manages a timer with start, pause, reset functionality.
 * It demonstrates the critical pattern of using useRef for interval IDs.
 * 
 * WHY useRef FOR INTERVALS?
 * - useState causes re-renders
 * - useRef persists values between renders WITHOUT causing re-renders
 * - Perfect for storing interval/timeout IDs
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { TIMER_STATE } from '../utils/constants';

/**
 * useTimer Hook
 * 
 * Creates a timer that can be started, paused, and reset.
 * 
 * @param {number} initialTime - Initial time in seconds (default: 0)
 * @returns {object} Timer state and control functions
 * 
 * Usage:
 * const { time, timerState, start, pause, reset } = useTimer(0);
 */
export const useTimer = (initialTime = 0) => {
    // Current time in seconds
    const [time, setTime] = useState(initialTime);

    // Timer state: 'idle', 'running', or 'paused'
    const [timerState, setTimerState] = useState(TIMER_STATE.IDLE);

    /**
     * useRef for Interval ID
     * 
     * useRef returns a mutable ref object whose .current property
     * is initialized to the passed argument.
     * 
     * The returned object will persist for the full lifetime of the component.
     * 
     * Key differences from useState:
     * - Changing .current does NOT trigger a re-render
     * - Value persists across renders
     * - Mutable (can change .current directly)
     * 
     * Perfect for:
     * - Storing interval/timeout IDs
     * - Keeping mutable values that don't affect rendering
     * - Accessing DOM elements (we'll see this later)
     */
    const intervalRef = useRef(null);

    /**
     * Start the timer
     * 
     * useCallback ensures this function reference stays stable.
     * This is important because this function might be passed as a prop.
     */
    const start = useCallback(() => {
        // Don't start if already running
        if (timerState === TIMER_STATE.RUNNING) return;

        setTimerState(TIMER_STATE.RUNNING);

        /**
         * setInterval creates a timer that executes a function repeatedly
         * every X milliseconds.
         * 
         * IMPORTANT: Always store the interval ID so you can clear it later!
         * Not clearing intervals is a common source of memory leaks.
         */
        intervalRef.current = setInterval(() => {
            // Update time every second
            // We use functional update to get the latest time value
            setTime(prevTime => prevTime + 1);
        }, 1000); // 1000ms = 1 second
    }, [timerState]); // Dependency: timerState

    /**
     * Pause the timer
     */
    const pause = useCallback(() => {
        // Only pause if running
        if (timerState !== TIMER_STATE.RUNNING) return;

        setTimerState(TIMER_STATE.PAUSED);

        /**
         * clearInterval stops the interval
         * 
         * CRITICAL: Always clear intervals when pausing or unmounting!
         * Forgetting this causes memory leaks and unexpected behavior.
         */
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, [timerState]);

    /**
     * Reset the timer
     */
    const reset = useCallback(() => {
        // Clear the interval if running
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // Reset state
        setTime(initialTime);
        setTimerState(TIMER_STATE.IDLE);
    }, [initialTime]);

    /**
     * Update time directly (for loading saved time from localStorage)
     */
    const setTimeDirect = useCallback((newTime) => {
        setTime(newTime);
    }, []);

    /**
     * Cleanup Effect
     * 
     * This effect runs when the component unmounts.
     * It clears the interval to prevent memory leaks.
     * 
     * This is CRITICAL! Without cleanup:
     * - Intervals keep running after component unmounts
     * - Tries to update state on unmounted component (React warning)
     * - Memory leak
     */
    useEffect(() => {
        // The cleanup function returned from useEffect
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []); // Empty array: only run on mount/unmount

    /**
     * Return timer state and controls
     * 
     * This demonstrates a common pattern: returning an object with
     * both state and functions that operate on that state.
     */
    return {
        time,           // Current time in seconds
        timerState,     // Current state ('idle', 'running', 'paused')
        start,          // Function to start timer
        pause,          // Function to pause timer
        reset,          // Function to reset timer
        setTime: setTimeDirect  // Function to set time directly
    };
};

/**
 * COMMON MISTAKES WITH TIMERS IN REACT:
 * 
 * 1. Not clearing intervals:
 *    ❌ setInterval(...) without cleanup
 *    ✅ Clear in useEffect cleanup
 * 
 * 2. Using useState for interval ID:
 *    ❌ const [intervalId, setIntervalId] = useState(null);
 *    ✅ const intervalRef = useRef(null);
 * 
 * 3. Not using functional setState:
 *    ❌ setTime(time + 1) - uses stale closure
 *    ✅ setTime(prev => prev + 1) - always gets latest value
 * 
 * 4. Creating multiple intervals:
 *    ❌ Not checking if interval exists before creating new one
 *    ✅ Check and clear existing interval first
 */
