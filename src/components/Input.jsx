/**
 * INPUT COMPONENT
 * 
 * React Concepts Demonstrated:
 * - Functional components
 * - Props and prop destructuring
 * - Default props
 * - Conditional rendering (error message)
 * - Fragments (<>...</>)
 * - Component composition
 * - Controlled component pattern (used by parent)
 */

/**
 * Input Component
 * 
 * A reusable input component with label and error support.
 * 
 * @param {object} props - Component props
 * @param {string} props.label - Label text
 * @param {string} props.error - Error message
 * @param {string} props.type - Input type
 * @param {string} props.value - Input value (controlled)
 * @param {function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.required - Required field
 */
const Input = ({
    label,
    error,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    ...rest
}) => {
    /**
     * FRAGMENTS (<>...</>):
     * 
     * React components must return a single element.
     * Fragments let you group multiple elements without adding extra DOM nodes.
     * 
     * <></> is shorthand for <React.Fragment></React.Fragment>
     * 
     * Why not use a <div>?
     * - Fragments don't add extra DOM nodes
     * - Better semantics
     * - Cleaner DOM structure
     */
    return (
        <>
            {/**
       * CONDITIONAL RENDERING - IF STATEMENT:
       * 
       * {label && <label>...</label>}
       * 
       * This is a short-circuit evaluation:
       * - If label is truthy, render the <label>
       * - If label is falsy, render nothing
       * 
       * Equivalent to:
       * {label ? <label>...</label> : null}
       */}
            {label && (
                <label>
                    {label}
                    {required && <span style={{ color: '#f5576c' }}> *</span>}
                    {/**
           * NESTED CONDITIONAL:
           * If required is true, show a red asterisk.
           * 
           * INLINE STYLES:
           * style prop accepts an object (not a string like in HTML)
           * Property names are camelCase (color, fontSize, etc.)
           */}
                </label>
            )}

            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? `${label}-error` : undefined}
                {...rest}
            /**
             * ARIA ATTRIBUTES:
             * 
             * These improve accessibility:
             * - aria-invalid: tells screen readers the field has an error
             * - aria-describedby: links to error message element
             */
            />

            {/**
       * CONDITIONAL RENDERING - ERROR MESSAGE:
       * 
       * If error exists, render error message.
       * This demonstrates how to show validation feedback.
       */}
            {error && (
                <p
                    id={`${label}-error`}
                    style={{
                        color: '#f5576c',
                        fontSize: '0.875rem',
                        marginTop: '0.25rem'
                    }}
                >
                    {error}
                </p>
            )}
        </>
    );
};

export default Input;

/**
 * USAGE EXAMPLES:
 * 
 * // Basic input with label
 * <Input 
 *   label="Email"
 *   type="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 * />
 * 
 * // Required field with error
 * <Input
 *   label="Password"
 *   type="password"
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 *   error="Password must be at least 8 characters"
 *   required
 * />
 * 
 * // With placeholder
 * <Input
 *   label="Search"
 *   placeholder="Type to search..."
 *   value={search}
 *   onChange={(e) => setSearch(e.target.value)}
 * />
 */
