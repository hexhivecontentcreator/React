/**
 * MODAL COMPONENT
 * 
 * React Concepts Demonstrated:
 * - Portals (ReactDOM.createPortal)
 * - useEffect for side effects
 * - Event handling
 * - Conditional rendering
 * - Props and children
 * - Escape key handling
 * 
 * WHAT ARE PORTALS?
 * Portals provide a way to render children into a DOM node
 * that exists outside the parent component's DOM hierarchy.
 * 
 * WHY USE PORTALS?
 * - Modals should render at document root (avoid z-index issues)
 * - Tooltips and popovers
 * - Overlays and dropdowns
 * - Breaking out of overflow:hidden containers
 */

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Modal Component
 * 
 * Renders a modal dialog using portals.
 * 
 * @param {object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {function} props.onClose - Close handler
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 */
const Modal = ({ isOpen, onClose, title, children }) => {
    /**
     * useEffect for ESC key handling
     * 
     * This demonstrates:
     * - Adding event listeners in React
     * - Cleanup functions
     * - Keyboard accessibility
     */
    useEffect(() => {
        // Only add listener if modal is open
        if (!isOpen) return;

        /**
         * Event handler for ESC key
         */
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        // Add event listener
        document.addEventListener('keydown', handleEscape);

        /**
         * Cleanup function
         * 
         * CRITICAL: Always remove event listeners!
         * Not removing them causes memory leaks.
         * 
         * This runs:
         * - Before effect runs again (if isOpen changes)
         * - When component unmounts
         */
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]); // Re-run when these change

    /**
     * useEffect for body scroll lock
     * 
     * When modal is open, prevent scrolling of the page behind it.
     */
    useEffect(() => {
        if (isOpen) {
            // Save current overflow value
            const originalOverflow = document.body.style.overflow;

            // Disable scrolling
            document.body.style.overflow = 'hidden';

            // Cleanup: restore original overflow
            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [isOpen]);

    /**
     * Early return pattern
     * 
     * If modal is not open, don't render anything.
     * This is a common pattern for conditional rendering.
     */
    if (!isOpen) return null;

    /**
     * Modal content
     * 
     * This will be rendered in a portal.
     */
    const modalContent = (
        <div className="modal-overlay" onClick={onClose}>
            {/**
       * EVENT BUBBLING:
       * 
       * onClick on overlay closes the modal.
       * We use stopPropagation on the modal itself to prevent
       * clicks inside the modal from closing it.
       */}

            <div className="modal" onClick={(e) => e.stopPropagation()}>
                {/**
         * e.stopPropagation():
         * 
         * Prevents the click event from bubbling up to the overlay.
         * Without this, clicking inside the modal would close it!
         */}

                <div className="modal-header">
                    <h2>{title}</h2>
                    <button
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        ×
                        {/**
             * × is an HTML entity for the multiplication sign,
             * commonly used as a close icon.
             */}
                    </button>
                </div>

                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    );

    /**
     * PORTAL:
     * 
     * createPortal(child, container)
     * 
     * Renders the modal content into document.body instead of
     * the parent component's DOM node.
     * 
     * Why?
     * - Modals should appear above everything else
     * - Avoids z-index and overflow issues
     * - Better for accessibility (screen readers)
     * 
     * How it works:
     * - React component tree: Modal is child of parent component
     * - DOM tree: Modal is rendered as child of document.body
     * - Events still bubble up through React component tree (not DOM tree)!
     */
    return createPortal(
        modalContent,
        document.body
    );
};

export default Modal;

/**
 * USAGE EXAMPLE:
 * 
 * import { useState } from 'react';
 * import Modal from './components/Modal';
 * 
 * function App() {
 *   const [isOpen, setIsOpen] = useState(false);
 * 
 *   return (
 *     <>
 *       <button onClick={() => setIsOpen(true)}>
 *         Open Modal
 *       </button>
 * 
 *       <Modal 
 *         isOpen={isOpen} 
 *         onClose={() => setIsOpen(false)}
 *         title="My Modal"
 *       >
 *         <p>This is modal content!</p>
 *         <button onClick={() => setIsOpen(false)}>Close</button>
 *       </Modal>
 *     </>
 *   );
 * }
 */

/**
 * ACCESSIBILITY NOTES:
 * 
 * A production modal should also include:
 * - role="dialog"
 * - aria-modal="true"
 * - aria-labelledby pointing to title
 * - Focus trap (keep focus within modal)
 * - Focus restoration (return focus when closed)
 * 
 * We keep it simple for this tutorial, but these are important
 * for a fully accessible modal!
 */
