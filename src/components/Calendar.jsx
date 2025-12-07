/**
 * CALENDAR COMPONENT
 * 
 * React Concepts Demonstrated:
 * - useState for current month
 * - useMemo for expensive date calculations
 * - useCallback for event handlers
 * - Rendering nested loops (weeks and days)
 * - Keys in nested lists
 * - Conditional styling (today, selected, has tasks)
 * - Data attributes for styling
 * - Context consumption
 * - Derived state from context
 */

import { useState, useMemo, useCallback } from 'react';
import { useTaskContext } from '../context/TaskContext';
import {
    getMonthDays,
    getMonthName,
    getYear,
    addMonths,
    isToday,
    getDayName
} from '../utils/dateHelpers';
import Button from './Button';

/**
 * Calendar Component
 * 
 * Displays a monthly calendar view with tasks.
 * 
 * @param {object} props - Component props
 * @param {function} props.onDateClick - Callback when a date is clicked
 */
const Calendar = ({ onDateClick }) => {
    /**
     * Context - Get tasks
     */
    const { tasks } = useTaskContext();

    /**
     * State - Current Month
     * 
     * Stores the currently displayed month.
     * Defaults to current month.
     */
    const [currentMonth, setCurrentMonth] = useState(new Date());

    /**
     * useMemo - Calendar Days
     * 
     * EXPENSIVE COMPUTATION:
     * Calculating all days in a month (including previous/next month days)
     * is relatively expensive. We only want to do it when currentMonth changes.
     * 
     * useMemo caches the result until currentMonth changes.
     */
    const calendarDays = useMemo(() => {
        return getMonthDays(currentMonth);
    }, [currentMonth]);
    // Only recalculate when currentMonth changes

    /**
     * useMemo - Tasks by Date
     * 
     * ANOTHER EXPENSIVE COMPUTATION:
     * Creating a map of dates to tasks.
     * This allows O(1) lookup when rendering each day.
     * 
     * Without memoization, this would run on EVERY render!
     */
    const tasksByDate = useMemo(() => {
        /**
         * Create a Map for efficient lookups
         * 
         * Map is better than Object for this because:
         * - Date objects as keys
         * - Better performance for frequent lookups
         * - Cleaner API
         */
        const map = new Map();

        /**
         * Iterate through all tasks
         */
        tasks.forEach(task => {
            // Add task to startDate
            if (task.startDate) {
                const dateKey = new Date(task.startDate).toDateString();
                if (!map.has(dateKey)) {
                    map.set(dateKey, []);
                }
                map.get(dateKey).push(task);
            }

            // For date range tasks, add to all dates in range
            if (task.taskType === 'date-range' && task.endDate) {
                const start = new Date(task.startDate);
                const end = new Date(task.endDate);

                // Iterate through each day in range
                for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                    const dateKey = d.toDateString();
                    if (!map.has(dateKey)) {
                        map.set(dateKey, []);
                    }
                    // Avoid duplicates
                    if (!map.get(dateKey).includes(task)) {
                        map.get(dateKey).push(task);
                    }
                }
            }

            // For repetitive tasks, check if day matches
            if (task.isRepetitive && task.repetitionDays.length > 0) {
                // Check each calendar day
                calendarDays.forEach(day => {
                    const dayName = getDayName(day);
                    if (task.repetitionDays.includes(dayName)) {
                        const dateKey = day.toDateString();
                        if (!map.has(dateKey)) {
                            map.set(dateKey, []);
                        }
                        if (!map.get(dateKey).includes(task)) {
                            map.get(dateKey).push(task);
                        }
                    }
                });
            }
        });

        return map;
    }, [tasks, calendarDays]);
    // Recalculate when tasks or calendarDays change

    /**
     * useCallback - Navigate to Previous Month
     * 
     * Memoized function to prevent recreation on every render.
     */
    const goToPreviousMonth = useCallback(() => {
        setCurrentMonth(prev => addMonths(prev, -1));
    }, []);

    /**
     * useCallback - Navigate to Next Month
     */
    const goToNextMonth = useCallback(() => {
        setCurrentMonth(prev => addMonths(prev, 1));
    }, []);

    /**
     * useCallback - Navigate to Today
     */
    const goToToday = useCallback(() => {
        setCurrentMonth(new Date());
    }, []);

    /**
     * Derived State - Month and Year Strings
     * 
     * These are simple transformations, don't need useMemo.
     */
    const monthName = getMonthName(currentMonth);
    const year = getYear(currentMonth);

    /**
     * Day of Week Headers
     */
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    /**
     * RENDER
     */
    return (
        <div className="calendar">
            {/**
       * Calendar Header - Navigation
       */}
            <div className="calendar-header">
                <Button
                    variant="outline"
                    size="small"
                    onClick={goToPreviousMonth}
                    aria-label="Previous month"
                >
                    ←
                </Button>

                <h3>{monthName} {year}</h3>

                <div className="flex-row">
                    <Button
                        variant="outline"
                        size="small"
                        onClick={goToToday}
                    >
                        Today
                    </Button>
                    <Button
                        variant="outline"
                        size="small"
                        onClick={goToNextMonth}
                        aria-label="Next month"
                    >
                        →
                    </Button>
                </div>
            </div>

            {/**
       * Calendar Grid
       */}
            <div className="calendar-grid">
                {/**
         * Day Headers (Sun, Mon, Tue, etc.)
         * 
         * RENDERING A LIST:
         * .map() with unique keys
         */}
                {dayHeaders.map(day => (
                    <div key={day} className="calendar-day-header">
                        {day}
                    </div>
                ))}

                {/**
         * Calendar Days
         * 
         * RENDERING A LIST:
         * Map over calendarDays array
         * 
         * KEYS:
         * We use toISOString() to create unique keys
         * This is better than index because dates are unique
         */}
                {calendarDays.map((day) => {
                    /**
                     * Determine day properties
                     * 
                     * This demonstrates derived state within a loop.
                     */
                    const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                    const isTodayDate = isToday(day);
                    const dateKey = day.toDateString();
                    const hasTasks = tasksByDate.has(dateKey);
                    const tasksOnDay = tasksByDate.get(dateKey) || [];

                    return (
                        <div
                            key={day.toISOString()}
                            /**
                             * KEY EXPLANATION:
                             * 
                             * day.toISOString() creates a unique string for each date.
                             * Even if we have duplicate dates (which we won't), 
                             * ISO string ensures uniqueness.
                             * 
                             * We could also use index, but dates are more semantic.
                             */
                            className="calendar-day"
                            /**
                             * DATA ATTRIBUTES FOR STYLING:
                             * 
                             * CSS can select based on these attributes:
                             * .calendar-day[data-today="true"] { ... }
                             * 
                             * This keeps styling in CSS, logic in JS.
                             */
                            data-today={isTodayDate}
                            data-other-month={!isCurrentMonth}
                            data-has-task={hasTasks}
                            /**
                             * CLICK HANDLER:
                             * Call onDateClick callback with the selected date
                             */
                            onClick={() => onDateClick && onDateClick(day)}
                            style={{ cursor: 'pointer' }}
                            /**
                             * ARIA for accessibility
                             */
                            aria-label={`${day.getDate()} ${monthName} ${day.getFullYear()}`}
                            title={hasTasks ? `${tasksOnDay.length} task(s)` : 'Click to create task'}
                        >
                            {/**
               * Day Number
               */}
                            <span>{day.getDate()}</span>

                            {/**
               * CONDITIONAL RENDERING - Task Indicators
               * 
               * Show dots for tasks on this day
               */}
                            {hasTasks && (
                                <div style={{
                                    display: 'flex',
                                    gap: '2px',
                                    justifyContent: 'center',
                                    marginTop: '4px'
                                }}>
                                    {/**
                   * LIMITING DISPLAYED ITEMS:
                   * Only show first 3 tasks (prevent overcrowding)
                   */}
                                    {tasksOnDay.slice(0, 3).map((task, i) => (
                                        <div
                                            key={`${task.id}-${i}`}
                                            /**
                                             * COMPOSITE KEYS:
                                             * 
                                             * When you might have the same task multiple times
                                             * (e.g., in a date range), you can combine ID with index.
                                             * 
                                             * Format: `${uniqueId}-${index}`
                                             */
                                            style={{
                                                width: '4px',
                                                height: '4px',
                                                borderRadius: '50%',
                                                backgroundColor: task.status === 'completed'
                                                    ? '#00f2fe'
                                                    : '#f5576c'
                                            }}
                                            title={task.title}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/**
       * Legend
       */}
            <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                background: 'rgba(0,0,0,0.02)',
                borderRadius: '8px',
                fontSize: '0.875rem'
            }}>
                <div className="flex-row" style={{ justifyContent: 'space-around' }}>
                    <span>🔵 Today</span>
                    <span>🔴 Has Tasks</span>
                    <span style={{ opacity: 0.4 }}>Other Month</span>
                </div>
            </div>
        </div>
    );
};

export default Calendar;

/**
 * KEY CONCEPTS DEMONSTRATED:
 * 
 * 1. useMemo FOR PERFORMANCE:
 *    - Expensive date calculations
 *    - Task-to-date mapping
 *    - Only recompute when necessary
 * 
 * 2. NESTED LISTS:
 *    - Headers array (map)
 *    - Days array (map)
 *    - Tasks per day (map)
 *    - Proper keys for each level
 * 
 * 3. DERIVED STATE:
 *    - Compute properties during render
 *    - No unnecessary useState
 *    - Auto-updates with dependencies
 * 
 * 4. DATA STRUCTURES:
 *    - Map for efficient lookups
 *    - Arrays for ordered data
 *    - Choosing right structure matters
 * 
 * 5. CONDITIONAL STYLING:
 *    - Data attributes
 *    - Dynamic styles
 *    - CSS integration
 */

/**
 * PERFORMANCE OPTIMIZATION EXPLAINED:
 * 
 * Without useMemo:
 * - getMonthDays runs on every render (even when month doesn't change)
 * - Task mapping runs on every render
 * - Wasted calculations
 * - Slow with many tasks
 * 
 * With useMemo:
 * - getMonthDays only runs when month changes
 * - Task mapping only runs when tasks or days change
 * - Cached results used otherwise
 * - Fast even with hundreds of tasks
 * 
 * This is a textbook example of when to use useMemo!
 */
