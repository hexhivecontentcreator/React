/**
 * TASKFORM COMPONENT
 * 
 * React Concepts Demonstrated:
 * - useState for multiple form fields
 * - Controlled components (inputs controlled by React state)
 * - Event handlers (onChange, onSubmit)
 * - Form submission handling
 * - Form validation
 * - Conditional rendering (showing/hiding fields)
 * - Multiple state variables
 * - Derived state
 * - Object and array state updates
 * - useCallback for event handlers
 * 
 * CONTROLLED COMPONENTS:
 * A controlled component is an input whose value is controlled by React state.
 * - React state is the "single source of truth"
 * - Input value comes from state
 * - onChange updates state
 * - Allows validation, formatting, etc. before updating state
 */

import { useState, useCallback } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { TASK_ACTIONS } from '../reducers/taskReducer';
import { DEFAULT_TASK, DAYS_OF_WEEK, TASK_TYPE } from '../utils/constants';
import { validateTask, hasErrors } from '../utils/validation';
import { toInputDate } from '../utils/dateHelpers';
import Input from './Input';
import Button from './Button';

/**
 * TaskForm Component
 * 
 * Form for creating and editing tasks.
 * 
 * @param {object} props - Component props
 * @param {object} props.existingTask - Task to edit (optional)
 * @param {function} props.onSuccess - Callback after successful save
 * @param {Date} props.initialDate - Initial date to pre-fill (optional)
 */
const TaskForm = ({ existingTask = null, onSuccess, initialDate = null }) => {
    /**
     * Determine if we're editing or creating
     */
    const isEditing = existingTask !== null;

    /**
     * Context Hook
     * 
     * Get dispatch from context.
     * No prop drilling needed!
     */
    const { dispatch } = useTaskContext();

    /**
     * Form State
     * 
     * We use multiple useState calls for different pieces of state.
     * This is the recommended approach when state pieces are independent.
     * 
     * Alternative: Could use a single state object, but that requires
     * more complex update logic.
     */

    // Basic info
    const [title, setTitle] = useState(existingTask?.title || '');
    const [description, setDescription] = useState(existingTask?.description || '');

    // Repetition
    const [isRepetitive, setIsRepetitive] = useState(existingTask?.isRepetitive || false);
    const [repetitionDays, setRepetitionDays] = useState(existingTask?.repetitionDays || []);

    // Time allocation
    const [allocatedHours, setAllocatedHours] = useState(existingTask?.allocatedHours || 0);

    // Deadline
    const [deadline, setDeadline] = useState(
        existingTask?.deadline ? toInputDate(existingTask.deadline) : ''
    );

    // Task type (one-day vs date-range)
    const [taskType, setTaskType] = useState(existingTask?.taskType || TASK_TYPE.ONE_DAY);

    // Dates for scheduling
    const [startDate, setStartDate] = useState(
        existingTask?.startDate
            ? toInputDate(existingTask.startDate)
            : initialDate
                ? toInputDate(initialDate)
                : toInputDate(new Date()) // Default to today's date
    );
    const [endDate, setEndDate] = useState(
        existingTask?.endDate ? toInputDate(existingTask.endDate) : ''
    );

    /**
     * Validation Errors State
     * 
     * Stores validation errors for each field.
     * Object where keys are field names and values are error messages.
     */
    const [errors, setErrors] = useState({});

    /**
     * CONTROLLED COMPONENT EXAMPLE:
     * 
     * Input value comes from state:
     * <input value={title} ... />
     * 
     * onChange updates state:
     * onChange={(e) => setTitle(e.target.value)}
     * 
     * This is the "controlled component" pattern.
     * React controls the input value, not the DOM.
     */

    /**
     * Handle Repetition Day Toggle
     * 
     * This demonstrates updating array state immutably.
     * 
     * useCallback memoizes the function to prevent re-creating it on every render.
     */
    const handleDayToggle = useCallback((dayId) => {
        setRepetitionDays(prevDays => {
            // Check if day is already selected
            if (prevDays.includes(dayId)) {
                // Remove it (filter creates new array)
                return prevDays.filter(id => id !== dayId);
            } else {
                // Add it (spread creates new array)
                return [...prevDays, dayId];
            }

            /**
             * IMMUTABILITY:
             * 
             * We never modify prevDays directly!
             * 
             * ❌ Wrong: prevDays.push(dayId)
             * ✅ Right: [...prevDays, dayId]
             * 
             * Why immutability?
             * - React compares references to detect changes
             * - Mutating state directly won't trigger re-render
             * - Immutability makes state changes predictable
             */
        });
    }, []); // No dependencies - function is stable

    /**
     * Handle Form Submission
     * 
     * This demonstrates:
     * - Form event handling
     * - Validation before submission
     * - Dispatching actions to context
     * - Resetting form after success
     */
    const handleSubmit = useCallback((e) => {
        /**
         * Prevent Default
         * 
         * e.preventDefault() prevents the form from submitting
         * and refreshing the page (default browser behavior).
         * 
         * This is CRITICAL in React forms!
         */
        e.preventDefault();

        /**
         * Build Task Object
         * 
         * Collect all form data into a single object.
         */
        const taskData = {
            ...DEFAULT_TASK,
            ...existingTask, // Include existing data if editing
            title: title.trim(),
            description: description.trim(),
            isRepetitive,
            repetitionDays,
            allocatedHours: Number(allocatedHours),
            deadline: deadline || null,
            taskType,
            startDate: startDate || null,
            endDate: taskType === TASK_TYPE.DATE_RANGE ? endDate : null
        };

        /**
         * Validate
         * 
         * Check if form data is valid.
         * validateTask returns an object with error messages.
         */
        const validationErrors = validateTask(taskData);

        /**
         * Show Errors if Validation Fails
         */
        if (hasErrors(validationErrors)) {
            setErrors(validationErrors);
            return; // Don't submit
        }

        /**
         * Clear Errors
         */
        setErrors({});

        /**
         * Dispatch Action
         * 
         * Add or update task in global state.
         */
        if (isEditing) {
            dispatch({ type: TASK_ACTIONS.UPDATE_TASK, payload: taskData });
        } else {
            dispatch({ type: TASK_ACTIONS.ADD_TASK, payload: taskData });
        }

        /**
         * Reset Form (only when creating)
         */
        if (!isEditing) {
            setTitle('');
            setDescription('');
            setIsRepetitive(false);
            setRepetitionDays([]);
            setAllocatedHours(0);
            setDeadline('');
            setTaskType(TASK_TYPE.ONE_DAY);
            setStartDate('');
            setEndDate('');
        }

        /**
         * Call Success Callback
         */
        if (onSuccess) {
            onSuccess();
        }
    }, [
        title,
        description,
        isRepetitive,
        repetitionDays,
        allocatedHours,
        deadline,
        taskType,
        startDate,
        endDate,
        existingTask,
        isEditing,
        dispatch,
        onSuccess
    ]);

    /**
     * RENDER
     */
    return (
        <form onSubmit={handleSubmit}>
            {/**
       * Title Input - CONTROLLED COMPONENT
       * 
       * value={title} - Value comes from state
       * onChange={(e) => setTitle(e.target.value)} - Updates state
       * 
       * The input is "controlled" by React.
       */}
            <Input
                label="Task Title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                /**
                 * e.target.value is the new input value.
                 * e is the event object.
                 * e.target is the input element.
                 * e.target.value is the current value of that input.
                 */
                error={errors.title}
                required
                placeholder="Enter task title..."
            />

            {/**
       * Description Textarea - CONTROLLED COMPONENT
       */}
            <div>
                <label>Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter task description..."
                    rows={4}
                />
                {errors.description && (
                    <p style={{ color: '#f5576c', fontSize: '0.875rem' }}>
                        {errors.description}
                    </p>
                )}
            </div>

            {/**
       * Allocated Hours - CONTROLLED NUMBER INPUT
       */}
            <Input
                label="Allocated Hours"
                type="number"
                value={allocatedHours}
                onChange={(e) => setAllocatedHours(e.target.value)}
                min="0"
                step="0.5"
                error={errors.allocatedHours}
                placeholder="0"
            />

            {/**
       * Repetitive Checkbox - CONTROLLED CHECKBOX
       * 
       * checked={isRepetitive} - Checked state comes from state
       * onChange={(e) => setIsRepetitive(e.target.checked)} - Updates state
       * 
       * Note: For checkboxes, use e.target.checked (not e.target.value)
       */}
            <div className="flex-row">
                <input
                    type="checkbox"
                    id="isRepetitive"
                    checked={isRepetitive}
                    onChange={(e) => setIsRepetitive(e.target.checked)}
                />
                <label htmlFor="isRepetitive">Repetitive Task</label>
            </div>

            {/**
       * CONDITIONAL RENDERING - Days of Week
       * 
       * Only show if isRepetitive is true.
       * 
       * This demonstrates conditional rendering based on form state.
       */}
            {isRepetitive && (
                <div>
                    <label>Repeat on:</label>
                    {errors.repetitionDays && (
                        <p style={{ color: '#f5576c', fontSize: '0.875rem' }}>
                            {errors.repetitionDays}
                        </p>
                    )}
                    <div className="checkbox-group">
                        {/**
             * RENDERING LISTS
             * 
             * Map over array to create list of elements.
             * Each element needs a unique 'key' prop.
             */}
                        {DAYS_OF_WEEK.map(day => (
                            <div key={day.id} className="checkbox-item">
                                {/**
                 * KEY PROP:
                 * 
                 * React uses keys to identify which items have changed.
                 * Keys should be:
                 * - Stable (same for same item across renders)
                 * - Unique (among siblings)
                 * - Not the array index (if list can reorder)
                 */}
                                <input
                                    type="checkbox"
                                    id={day.id}
                                    checked={repetitionDays.includes(day.id)}
                                    onChange={() => handleDayToggle(day.id)}
                                />
                                <label htmlFor={day.id}>{day.label}</label>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/**
       * Task Type - CONTROLLED RADIO BUTTONS
       */}
            <div>
                <label>Task Schedule Type:</label>
                <div className="flex-row">
                    <div className="flex-row">
                        <input
                            type="radio"
                            id="oneDay"
                            name="taskType"
                            value={TASK_TYPE.ONE_DAY}
                            checked={taskType === TASK_TYPE.ONE_DAY}
                            onChange={(e) => setTaskType(e.target.value)}
                        />
                        <label htmlFor="oneDay">One Day</label>
                    </div>
                    <div className="flex-row">
                        <input
                            type="radio"
                            id="dateRange"
                            name="taskType"
                            value={TASK_TYPE.DATE_RANGE}
                            checked={taskType === TASK_TYPE.DATE_RANGE}
                            onChange={(e) => setTaskType(e.target.value)}
                        />
                        <label htmlFor="dateRange">Date Range</label>
                    </div>
                </div>
            </div>

            {/**
       * Start Date
       */}
            <Input
                label={taskType === TASK_TYPE.ONE_DAY ? "Task Date" : "Start Date"}
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />

            {/**
       * CONDITIONAL RENDERING - End Date
       * 
       * Only show if taskType is DATE_RANGE
       */}
            {taskType === TASK_TYPE.DATE_RANGE && (
                <Input
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    error={errors.dateRange}
                />
            )}

            {/**
       * Deadline - CONTROLLED DATE INPUT
       */}
            <Input
                label="Deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                error={errors.deadline}
            />

            {/**
       * Submit Button
       */}
            <Button type="submit" variant="primary" data-size="large">
                {isEditing ? 'Update Task' : 'Create Task'}
            </Button>
        </form>
    );
};

export default TaskForm;

/**
 * KEY CONCEPTS DEMONSTRATED:
 * 
 * 1. CONTROLLED COMPONENTS:
 *    - All inputs controlled by React state
 *    - Single source of truth
 *    - Enables validation and formatting
 * 
 * 2. MULTIPLE STATE:
 *    - Separate useState for each form field
 *    - Independent state updates
 *    - Clear and maintainable
 * 
 * 3. CONDITIONAL RENDERING:
 *    - Show/hide based on state
 *    - {condition && <Component />}
 *    - Ternary operator for variants
 * 
 * 4. FORM HANDLING:
 *    - preventDefault on submit
 *    - Validation before submitting
 *    - Clear errors on successful submit
 * 
 * 5. IMMUTABLE UPDATES:
 *    - Array updates with filter/spread
 *    - Never mutate state directly
 *    - Create new arrays/objects
 * 
 * 6. EVENT HANDLERS:
 *    - onChange for inputs
 *    - onSubmit for form
 *    - onClick for buttons
 *    - Accessing event properties
 */
