/**
 * TASKITEM COMPONENT
 * 
 * React Concepts Demonstrated:
 * - React.memo for performance optimization
 * - Props and prop types
 * - Conditional rendering (status badges, buttons)
 * - Event handlers
 * - Component composition (Timer, Button)
 * - Derived state (formatting)
 * - useCallback for event handlers (via parent)
 * 
 * React.memo():
 * Wraps a component to prevent re-renders if props haven't changed.
 * It's a Higher-Order Component (HOC) for optimization.
 */

import { memo, useCallback, useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { TASK_ACTIONS } from '../reducers/taskReducer';
import { formatDate, getRelativeTime } from '../utils/dateHelpers';
import { TASK_STATUS, TASK_TYPE } from '../utils/constants';
import Timer from './Timer';
import Button from './Button';
import Modal from './Modal';
import TaskForm from './TaskForm';

/**
 * TaskItem Component
 * 
 * Displays a single task with all its information and controls.
 * 
 * @param {object} props - Component props
 * @param {object} props.task - Task object to display
 * 
 * This component is wrapped in React.memo at the bottom.
 */
const TaskItem = ({ task }) => {
    /**
     * Context Hook
     */
    const { dispatch } = useTaskContext();

    /**
     * Local State for Edit Modal
     */
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    /**
     * Event Handlers
     * 
     * useCallback prevents these functions from being recreated on every render.
     * Important when passing functions as props or using in effects.
     */

    // Toggle task completion
    const handleToggleComplete = useCallback(() => {
        dispatch({ type: TASK_ACTIONS.TOGGLE_COMPLETE, payload: { id: task.id } });
    }, [dispatch, task.id]);

    // Delete task
    const handleDelete = useCallback(() => {
        // In production, you'd want a confirmation dialog
        if (window.confirm('Are you sure you want to delete this task?')) {
            dispatch({ type: TASK_ACTIONS.DELETE_TASK, payload: { id: task.id } });
        }
    }, [dispatch, task.id]);

    // Open edit modal
    const handleEdit = useCallback(() => {
        setIsEditModalOpen(true);
    }, []);

    // Close edit modal
    const handleCloseEdit = useCallback(() => {
        setIsEditModalOpen(false);
    }, []);

    /**
     * Derived State
     * 
     * These values are computed from props during render.
     * No need for useState - they update automatically when task changes.
     */
    const isCompleted = task.status === TASK_STATUS.COMPLETED;
    const isOverdue = task.status === TASK_STATUS.OVERDUE;

    // Format dates for display
    const formattedDeadline = task.deadline
        ? formatDate(task.deadline)
        : null;

    const relativeDeadline = task.deadline
        ? getRelativeTime(task.deadline)
        : null;

    const formattedStartDate = task.startDate
        ? formatDate(task.startDate)
        : null;

    const formattedEndDate = task.endDate
        ? formatDate(task.endDate)
        : null;

    /**
     * RENDER
     */
    return (
        <>
            {/**
       * CARD COMPONENT
       * 
       * data-status attribute used for CSS styling
       * This demonstrates data attributes for conditional styling
       */}
            <div className="card" data-status={task.status}>
                {/**
         * Card Header
         * Contains title and action buttons
         */}
                <div className="card-header">
                    <h3 className="card-title">
                        {/**
             * CONDITIONAL STYLING - Strikethrough for completed
             * 
             * Inline style based on condition
             */}
                        <span style={{
                            textDecoration: isCompleted ? 'line-through' : 'none',
                            opacity: isCompleted ? 0.6 : 1
                        }}>
                            {task.title}
                        </span>
                    </h3>

                    {/**
           * Action Buttons
           */}
                    <div className="flex-row">
                        <Button
                            size="small"
                            variant="outline"
                            onClick={handleEdit}
                            aria-label={`Edit task: ${task.title}`}
                        >
                            Edit
                        </Button>
                        <Button
                            size="small"
                            variant="danger"
                            onClick={handleDelete}
                            aria-label={`Delete task: ${task.title}`}
                        >
                            Delete
                        </Button>
                    </div>
                </div>

                {/**
         * Card Content - Task Description
         * 
         * CONDITIONAL RENDERING:
         * Only show description if it exists
         */}
                {task.description && (
                    <div className="card-content">
                        <p>{task.description}</p>
                    </div>
                )}

                {/**
         * Task Metadata - Badges
         * 
         * CONDITIONAL RENDERING WITH MULTIPLE CONDITIONS:
         * Show different badges based on task properties
         */}
                <div className="flex-row" style={{ flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    {/**
           * Status Badge
           */}
                    {isCompleted && (
                        <span className="badge" data-type="success">
                            ✓ Completed
                        </span>
                    )}

                    {isOverdue && !isCompleted && (
                        <span className="badge" data-type="deadline">
                            ⚠ Overdue
                        </span>
                    )}

                    {/**
           * Repetitive Badge
           * 
           * Shows which days task repeats on
           */}
                    {task.isRepetitive && (
                        <span className="badge" data-type="repetitive">
                            🔄 Repeats: {task.repetitionDays.join(', ')}
                        </span>
                    )}

                    {/**
           * Hours Badge
           */}
                    {task.allocatedHours > 0 && (
                        <span className="badge" data-type="hours">
                            ⏱ {task.allocatedHours}h allocated
                        </span>
                    )}

                    {/**
           * Deadline Badge
           */}
                    {formattedDeadline && (
                        <span className="badge" data-type="deadline">
                            📅 Deadline: {formattedDeadline} ({relativeDeadline})
                        </span>
                    )}

                    {/**
           * Schedule Badge
           * 
           * CONDITIONAL CONTENT:
           * Different text based on task type
           */}
                    {task.taskType === TASK_TYPE.ONE_DAY && formattedStartDate && (
                        <span className="badge">
                            📆 Scheduled: {formattedStartDate}
                        </span>
                    )}

                    {task.taskType === TASK_TYPE.DATE_RANGE && formattedStartDate && formattedEndDate && (
                        <span className="badge">
                            📆 {formattedStartDate} → {formattedEndDate}
                        </span>
                    )}
                </div>

                {/**
         * Card Footer
         * Contains timer and completion toggle
         */}
                <div className="card-footer">
                    {/**
           * COMPONENT COMPOSITION:
           * 
           * Timer is a separate component
           * We pass it the necessary props
           */}
                    <Timer
                        taskId={task.id}
                        initialTime={task.elapsedTime || 0}
                    />

                    {/**
           * Toggle Completion Button
           * 
           * CONDITIONAL RENDERING:
           * Different text and style based on status
           */}
                    <Button
                        variant={isCompleted ? 'outline' : 'success'}
                        size="small"
                        onClick={handleToggleComplete}
                        aria-label={isCompleted ? `Mark ${task.title} as incomplete` : `Mark ${task.title} as complete`}
                    >
                        {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
                    </Button>
                </div>
            </div>

            {/**
       * PORTAL - Edit Modal
       * 
       * Modal uses a portal to render outside this component's DOM tree.
       * It's here in the JSX but will appear at document.body.
       */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={handleCloseEdit}
                title="Edit Task"
            >
                <TaskForm
                    existingTask={task}
                    onSuccess={handleCloseEdit}
                />
            </Modal>
        </>
    );
};

/**
 * React.memo()
 * 
 * WHAT IT DOES:
 * Wraps the component to prevent re-renders when props haven't changed.
 * 
 * HOW IT WORKS:
 * - React will compare old and new props (shallow comparison)
 * - If props are the same, skip re-rendering
 * - If props changed, re-render normally
 * 
 * WHEN TO USE:
 * - Component renders often with same props
 * - Component is expensive to render
 * - Parent re-renders frequently
 * 
 * WHEN NOT TO USE:
 * - Props change frequently anyway
 * - Component is simple/cheap to render
 * - Premature optimization
 * 
 * In this case, TaskItem might be in a list that re-renders often,
 * but individual tasks might not change. memo prevents unnecessary re-renders.
 */
export default memo(TaskItem);

/**
 * CUSTOM COMPARISON (ADVANCED):
 * 
 * You can provide a custom comparison function:
 * 
 * export default memo(TaskItem, (prevProps, nextProps) => {
 *   // Return true if props are equal (skip re-render)
 *   // Return false if props changed (re-render)
 *   return prevProps.task.id === nextProps.task.id &&
 *          prevProps.task.updatedAt === nextProps.task.updatedAt;
 * });
 * 
 * This gives you fine-grained control over when to re-render.
 */

/**
 * PERFORMANCE NOTES:
 * 
 * React.memo() does a shallow comparison of props.
 * For object props (like task), it compares references.
 * 
 * If task is a new object every render (even with same values),
 * memo won't help!
 * 
 * Make sure parent provides stable task references (from context/state).
 */
