/**
 * BUTTON COMPONENT
 * 
 * React Concepts Demonstrated:
 * - Functional components
 * - Props (properties passed to components)
 * - Prop destructuring
 * - Default props (via default parameters)
 * - Spreading props (...rest)
 * - Conditional className
 * - JSX expressions
 * - Component composition
 * 
 * WHAT IS A COMPONENT?
 * A component is a reusable piece of UI.
 * In React, components are JavaScript functions that return JSX.
 * 
 * WHAT IS JSX?
 * JSX is a syntax extension for JavaScript.
 * It looks like HTML but is actually JavaScript.
 * JSX gets compiled to React.createElement() calls.
 */

/**
 * Button Component
 * 
 * A reusable button component with different variants and sizes.
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - Button style variant
 * @param {string} props.size - Button size
 * @param {boolean} props.disabled - Disabled state
 * @param {function} props.onClick - Click handler
 * @param {string} props.type - Button type attribute
 * 
 * PROPS EXPLAINED:
 * Props are arguments passed to components, like function parameters.
 * They flow down from parent to child (one-way data flow).
 * Props are READ-ONLY - a component should never modify its own props.
 */
const Button = ({
    children,           // What's inside the button (text, icons, etc.)
    variant = 'primary', // Style variant (default: 'primary')
    size = 'medium',    // Size (default: 'medium')
    disabled = false,   // Disabled state (default: false)
    onClick,            // Click handler function
    type = 'button',    // HTML button type
    ...rest             // All other props (spread operator)
}) => {
    /**
     * DESTRUCTURING EXPLAINED:
     * 
     * Instead of:
     * const Button = (props) => {
     *   const children = props.children;
     *   const variant = props.variant;
     *   ...
     * }
     * 
     * We destructure in the parameter list for cleaner code.
     */

    /**
     * DEFAULT PARAMETERS:
     * 
     * variant = 'primary' means:
     * - If variant prop is provided, use it
     * - If not provided, use 'primary'
     * 
     * This is the modern way to handle default props in functional components.
     */

    /**
     * SPREAD OPERATOR (...rest):
     * 
     * Collects all remaining props into a 'rest' object.
     * Useful for passing through props like aria-label, data-*, etc.
     * without explicitly listing them all.
     */

    /**
     * JSX RETURN
     * 
     * Components return JSX - a syntax extension that looks like HTML.
     * 
     * Key differences from HTML:
     * - className instead of class (class is a JS keyword)
     * - onClick instead of onclick (camelCase for events)
     * - style prop accepts an object, not a string
     * - All tags must be closed (including <br />, <img />)
     * - Can embed JavaScript expressions using { }
     */
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            data-variant={variant}
            data-size={size}
            {...rest}
        /**
         * ATTRIBUTE SPREADING:
         * 
         * {...rest} spreads all remaining props onto the button element.
         * Example: <Button aria-label="Submit" data-testid="submit-btn">
         * Results in: <button aria-label="Submit" data-testid="submit-btn">
         */
        >
            {children}
            {/**
       * CHILDREN PROP:
       * 
       * {children} is a special prop that contains whatever is between
       * the opening and closing tags of the component.
       * 
       * Example:
       * <Button>Click Me</Button>
       * children = "Click Me"
       * 
       * <Button><Icon /> Submit</Button>
       * children = [<Icon />, " Submit"]
       */}
        </button>
    );
};

/**
 * EXPORTING THE COMPONENT:
 * 
 * export default makes this component the default export.
 * Other files can import it:
 * import Button from './Button';
 */
export default Button;

/**
 * HOW TO USE THIS COMPONENT:
 * 
 * import Button from './components/Button';
 * 
 * // Basic usage
 * <Button>Click Me</Button>
 * 
 * // With props
 * <Button variant="secondary" size="large" onClick={handleClick}>
 *   Submit Form
 * </Button>
 * 
 * // Disabled
 * <Button disabled>Can't Click</Button>
 * 
 * // With custom attributes
 * <Button data-testid="submit-btn" aria-label="Submit the form">
 *   Submit
 * </Button>
 */

/**
 * WHY CREATE REUSABLE COMPONENTS?
 * 
 * 1. DRY (Don't Repeat Yourself):
 *    - Write once, use everywhere
 *    - Consistent behavior
 * 
 * 2. Maintainability:
 *    - Update in one place
 *    - Easy to fix bugs
 * 
 * 3. Testing:
 *    - Test component once
 *    - Confidence in all usages
 * 
 * 4. Composition:
 *    - Build complex UIs from simple components
 *    - Easier to reason about
 */
