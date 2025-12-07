/**
 * TIMER COMPONENT
 * 
 * React Concepts Demonstrated:
 * - Props and prop destructuring
 * - useCallback for memoized functions
 * - Custom hooks (useTimer)
 * - Event handling
 * - Conditional rendering
 * - Derived state (formatting)
 * - Component composition
 * 
 * This component provides timer controls for a task.
 * It uses our custom useTimer hook and demonstrates
 * how to integrate custom hooks into components.
 */

import { useCallback, useEffect } from 'react';
import { useTimer } from '../hooks/useTimer';
import { useTaskContext } from '../context/TaskContext';
import { TASK_ACTIONS } from '../reducers/taskReducer';
import { formatTime } from '../utils/dateHelpers';
import Button from './Button';

/**
 * Timer Component
 * 
 * Displays and controls a timer for a task.
 * 
 * @param {object} props - Component props
 * @param {string} props.taskId - ID of the task
 * @param {number} props.initialTime - Initial timer value in seconds
 */
const Timer = ({ taskId, initialTime = 0 }) => {
    /**
     * useTaskContext Hook
     * 
     * This demonstrates consuming context in a component.
     * We get access to dispatch without prop drilling.
     */
    const { dispatch } = useTaskContext();

    /**
     * useTimer Custom Hook
     * 
     * This demonstrates using a custom hook.
     * The hook encapsulates all timer logic, keeping this component clean.
     */
    const { time, timerState, start, pause, reset, setTime } = useTimer(initialTime);

    /**
     * useEffect to Initialize Timer
     * 
     * When initialTime changes (e.g., loaded from localStorage),
     * update the timer.
     */
    useEffect(() => {
        setTime(initialTime);
    }, [initialTime, setTime]);

    /**
     * useEffect to Save Timer to Context
     * 
     * Whenever the time changes, save it to the global state.
     * This ensures the timer value is persisted.
     * 
     * This demonstrates:
     * - Side effects (dispatching actions)
     * - Syncing local state with global state
     */
    useEffect(() => {
        // Only update if timer is running or has time
        // Avoid unnecessary dispatches
        if (time > 0 || timerState === 'running') {
            dispatch({ type: TASK_ACTIONS.UPDATE_TIMER, payload: { id: taskId, elapsedTime: time } });
        }
    }, [time, taskId, dispatch, timerState]);

    /**
     * useCallback for Reset Handler
     * 
     * Memoize the reset handler to prevent unnecessary re-renders
     * of child components that receive this as a prop.
     * 
     * Dependencies: [reset, dispatch, taskActions, taskId]
     * - Function only recreated if these change
     */
    const handleReset = useCallback(() => {
        reset();
        dispatch({ type: TASK_ACTIONS.RESET_TIMER, payload: { id: taskId } });
    }, [reset, dispatch, taskId]);

    /**
     * Derived State: Formatted Time
     * 
     * We calculate the formatted time during render.
     * This is "derived state" - computed from existing state.
     * 
     * No need for useState here because:
     * - Value is computed from 'time'
     * - Recomputes automatically when 'time' changes
     * - No need to sync two pieces of state
     */
    const formattedTime = formatTime(time);

    /**
     * RENDER
     * 
     * The component returns JSX that displays the timer and controls.
     */
    return (
        <div className="timer">
            {/**
       * Timer Display
       * 
       * Shows the formatted time (HH:MM:SS)
       * aria-live="polite" - Screen readers announce time changes
       * aria-atomic="true" - Read entire time string
       */}
            <div
                className="timer-display"
                role="timer"
                aria-live="polite"
                aria-atomic="true"
                aria-label={`Elapsed time: ${formattedTime}`}
            >
                {formattedTime}
            </div>

            {/**
       * Timer Controls
       * 
       * Buttons to start, pause, and reset the timer.
       */}
            <div className="timer-controls">
                {/**
         * CONDITIONAL RENDERING:
         * 
         * Show "Start" or "Resume" based on timer state.
         * 
         * Ternary operator: condition ? ifTrue : ifFalse
         */}
                {timerState === 'running' ? (
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={pause}
                        aria-label="Pause timer"
                    >
                        Pause
                    </Button>
                ) : (
                    <Button
                        variant="success"
                        size="small"
                        onClick={start}
                        aria-label={timerState === 'paused' ? 'Resume timer' : 'Start timer'}
                    >
                        {timerState === 'paused' ? 'Resume' : 'Start'}
                        {/**
             * NESTED CONDITIONAL:
             * 
             * If timer is paused, show "Resume"
             * Otherwise (idle), show "Start"
             */}
                    </Button>
                )}

                {/**
         * Reset Button
         * 
         * Only show if timer has run (time > 0)
         * 
         * This demonstrates conditional rendering with && operator.
         */}
                {time > 0 && (
                    <Button
                        variant="outline"
                        size="small"
                        onClick={handleReset}
                        aria-label="Reset timer to zero"
                    >
                        Reset
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Timer;

/**
 * USAGE EXAMPLE:
 * 
 * import Timer from './components/Timer';
 * 
 * function TaskItem({ task }) {
 *   return (
 *     <div className="task">
 *       <h3>{task.title}</h3>
 *       <Timer taskId={task.id} initialTime={task.elapsedTime} />
 *     </div>
 *   );
 * }
 */

/**
 * KEY CONCEPTS REVIEW:
 * 
 * 1. CUSTOM HOOKS:
 *    - useTimer encapsulates all timer logic
 *    - Makes component simpler and more readable
 *    - Logic is reusable across components
 * 
 * 2. DERIVED STATE:
 *    - formattedTime is computed from 'time'
 *    - No need for separate state
 *    - Automatically updates when 'time' changes
 * 
 * 3. EFFECTS:
 *    - Sync local timer with global state
 *    - Initialize timer from props
 *    - Side effects properly managed
 * 
 * 4. MEMOIZATION:
 *    - useCallback for handleReset
 *    - Prevents unnecessary re-renders
 *    - Stable function reference
 * 
 * 5. CONDITIONAL RENDERING:
 *    - Different buttons based on state
 *    - Show/hide reset button
 *    - Dynamic button text
 */
