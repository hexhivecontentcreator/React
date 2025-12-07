/**
 * TASKLIST COMPONENT
 * 
 * React Concepts Demonstrated:
 * - Rendering lists with .map()
 * - Keys in lists
 * - Conditional rendering (empty state)
 * - useMemo for performance
 * - Filtering and sorting data
 * - Context consumption
 * - Component composition
 */

import { useMemo, useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { TASK_STATUS } from '../utils/constants';
import TaskItem from './TaskItem';

/**
 * TaskList Component
 * 
 * Displays a list of tasks with filtering and sorting.
 */
const TaskList = () => {
    /**
     * Context Hook
     * 
     * Get tasks from global context
     */
    const { tasks } = useTaskContext();

    /**
     * Local State for Filters
     * 
     * This demonstrates managing component-local state
     * that doesn't need to be global.
     */
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('createdAt');

    /**
     * useMemo for Filtered and Sorted Tasks
     * 
     * WHAT IS useMemo?
     * useMemo memoizes (caches) the result of a computation.
     * It only recomputes when dependencies change.
     * 
     * WHY USE useMemo?
     * - Expensive computations (filtering/sorting large lists)
     * - Prevent unnecessary work on every render
     * - Performance optimization
     * 
     * SYNTAX:
     * const value = useMemo(() => {
     *   // computation
     *   return result;
     * }, [dependencies]);
     * 
     * The function runs when dependencies change.
     * Otherwise, cached value is returned.
     */
    const filteredAndSortedTasks = useMemo(() => {
        /**
         * STEP 1: FILTER
         * 
         * Array.filter() creates a new array with elements that pass the test.
         * This is immutable - doesn't modify original array.
         */
        let result = tasks;

        // Filter by status
        if (filterStatus !== 'all') {
            result = result.filter(task => task.status === filterStatus);
        }

        /**
         * STEP 2: SORT
         * 
         * Array.sort() sorts the array.
         * IMPORTANT: sort() mutates the array, so we create a copy first!
         * 
         * [...result] creates a new array (spread operator)
         */
        result = [...result].sort((a, b) => {
            if (sortBy === 'createdAt') {
                // Sort by creation date (newest first)
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (sortBy === 'deadline') {
                // Sort by deadline (soonest first)
                // Tasks without deadline go to end
                if (!a.deadline) return 1;
                if (!b.deadline) return -1;
                return new Date(a.deadline) - new Date(b.deadline);
            } else if (sortBy === 'title') {
                // Sort alphabetically by title
                return a.title.localeCompare(b.title);
            }
            return 0;
        });

        return result;
    }, [tasks, filterStatus, sortBy]);
    // Dependencies: recompute when any of these change

    /**
     * CONDITIONAL RENDERING - Empty State
     * 
     * If no tasks, show a message instead of an empty list.
     * This improves user experience.
     */
    if (tasks.length === 0) {
        return (
            <div className="empty-state">
                <h3>No tasks yet</h3>
                <p>Create your first task to get started!</p>
            </div>
        );
    }

    /**
     * RENDER
     */
    return (
        <div>
            {/**
       * Filter and Sort Controls
       * 
       * Always visible so users can change filters even when no results
       */}
            <div className="space-between mb-2">
                <div className="flex-row">
                    <label htmlFor="filter-status">Filter:</label>
                    <select
                        id="filter-status"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{ width: 'auto' }}
                    >
                        <option value="all">All Tasks</option>
                        <option value={TASK_STATUS.ACTIVE}>Active</option>
                        <option value={TASK_STATUS.COMPLETED}>Completed</option>
                        <option value={TASK_STATUS.OVERDUE}>Overdue</option>
                    </select>
                </div>

                <div className="flex-row">
                    <label htmlFor="sort-by">Sort by:</label>
                    <select
                        id="sort-by"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{ width: 'auto' }}
                    >
                        <option value="createdAt">Created Date</option>
                        <option value="deadline">Deadline</option>
                        <option value="title">Title (A-Z)</option>
                    </select>
                </div>
            </div>

            {/**
       * CONDITIONAL RENDERING - No Results
       * 
       * If filter returns no results, show message but keep controls visible
       */}
            {filteredAndSortedTasks.length === 0 ? (
                <div className="empty-state">
                    <h3>No tasks match your filters</h3>
                    <p>Try adjusting your filters or create a new task.</p>
                </div>
            ) : (
                <>
                    {/**
       * RENDERING LISTS
       * 
       * This is one of the most important React patterns!
       * 
       * Array.map() transforms each element into a React element.
       * 
       * CRITICAL: Each element needs a unique 'key' prop!
       */}
                    <div className="grid-2">
                        {filteredAndSortedTasks.map(task => (
                            /**
                             * THE KEY PROP
                             * 
                             * key={task.id}
                             * 
                             * WHY KEYS ARE IMPORTANT:
                             * - React uses keys to identify which items changed/added/removed
                             * - Helps React optimize rendering
                             * - Prevents bugs with component state
                             * 
                             * KEY REQUIREMENTS:
                             * - Must be unique among siblings
                             * - Must be stable (same key for same item across renders)
                             * - Should not use array index (if list can reorder)
                             * 
                             * GOOD KEYS:
                             * ✅ Database IDs
                             * ✅ Unique generated IDs
                             * ✅ Unique item properties
                             * 
                             * BAD KEYS:
                             * ❌ Array index (if list reorders)
                             * ❌ Random values (Math.random())
                             * ❌ Non-unique values
                             * 
                             * WHY NOT INDEX?
                             * If items reorder, index changes, but item is the same.
                             * This confuses React and can cause bugs.
                             * 
                             * Example problem with index:
                             * [task1, task2, task3] → delete task2
                             * [task1, task3]
                             * 
                             * With index keys:
                             * - task3 gets key=1 (was key=2)
                             * - React thinks task2 changed to task3
                             * - Internal state might be wrong!
                             * 
                             * With ID keys:
                             * - task3 keeps same key
                             * - React knows task2 was removed
                             * - Correct behavior
                             */
                            <TaskItem
                                key={task.id}
                                task={task}
                            />
                        ))}
                    </div>

                    {/**
       * Task Count
       */}
                    <div className="mt-2 text-center">
                        <p style={{ color: 'var(--text-muted)' }}>
                            Showing {filteredAndSortedTasks.length} of {tasks.length} tasks
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default TaskList;

/**
 * KEY CONCEPTS DEMONSTRATED:
 * 
 * 1. LISTS AND KEYS:
 *    - .map() to render arrays
 *    - Unique key prop on each item
 *    - Keys help React optimize
 * 
 * 2. useMemo OPTIMIZATION:
 *    - Cache expensive computations
 *    - Only recompute when dependencies change
 *    - Improves performance with large lists
 * 
 * 3. FILTERING AND SORTING:
 *    - Array.filter() for filtering
 *    - Array.sort() for sorting
 *    - Immutable operations
 * 
 * 4. CONDITIONAL RENDERING:
 *    - Empty states
 *    - Different UI based on data
 * 
 * 5. CONTROLLED COMPONENTS:
 *    - Filter and sort selects
 *    - Local state management
 */

/**
 * PERFORMANCE CONSIDERATIONS:
 * 
 * Without useMemo:
 * - Filtering and sorting run on EVERY render
 * - Even if tasks hasn't changed
 * - Wasted CPU cycles
 * 
 * With useMemo:
 * - Filtering and sorting only run when needed
 * - Cached result used otherwise
 * - Better performance
 * 
 * When to use useMemo:
 * ✅ Expensive computations
 * ✅ Large data transformations
 * ✅ Creating objects/arrays that are props
 * 
 * When NOT to use:
 * ❌ Simple calculations
 * ❌ Premature optimization
 * ❌ Everything "just in case"
 */
