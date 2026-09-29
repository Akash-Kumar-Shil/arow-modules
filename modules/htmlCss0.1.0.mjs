export const info = {
  name: "HtmlCss",
  extension: "mjs",
  version: "0.1.0",
  description:
    "Lightweight DOM helpers for dynamic HTML insertion and native nested CSS styling.",
  dependency: [],
};

/**
 * Inserts HTML string or dynamic content into a target DOM element.
 * 
 * @param {Object} options
 * @param {string} options.target - CSS selector for the target element.
 * @param {string|Function} options.content - HTML string or a function returning an HTML string.
 * @param {string} [options.insert='bottom'] - Insertion position: 'before', 'top', 'bottom', 'after'.
 * @returns {boolean} True if insertion succeeded, false otherwise.
 */
export function addHtml({ target, content, insert = 'bottom' } = {}) {
    // 1. Locate target element in the DOM
    const targetElement = document.querySelector(target);
    if (!targetElement) return false;

    // 2. Resolve content if passed as a function; ensure it evaluates to a string
    const contents = typeof content === 'function' ? content() : content;
    if (typeof contents !== 'string') return false;

    // 3. Map user-friendly position aliases to native insertAdjacentHTML keywords
    const positions = {
        before: 'beforebegin', // Outside target, immediately before
        top: 'afterbegin',    // Inside target, as first child
        bottom: 'beforeend',   // Inside target, as last child
        after: 'afterend'      // Outside target, immediately after
    };

    // 4. Fallback to 'beforeend' (bottom) if position key is invalid
    const position = positions[insert.trim()] || positions.bottom;
    
    // 5. Inject HTML safely into DOM
    targetElement.insertAdjacentHTML(position, contents);

    return true;
}

/**
 * Dynamically injects or updates CSS styles on a target element.
 * Supports string-based CSS (inline & native nesting) as well as JavaScript style objects.
 * 
 * @param {Object} options
 * @param {string} options.target - CSS selector for the target element.
 * @param {string|Object|Function} options.styling - CSS rules as a string, object, or supplier function.
 * @param {string} [options.type='nested'] - Style mode: 'nested', 'stylesheet', or 'inline'.
 * @param {boolean} [options.overwrite=true] - Whether to replace or append to existing styles.
 * @returns {boolean} True if styles were applied successfully, false otherwise.
 */
export function addCss({ target, styling, type = 'nested', overwrite = true } = {}) {
    // 1. Locate target element in the DOM
    const targetElement = document.querySelector(target);
    if (!targetElement) return false;

    // 2. Resolve dynamic styling if passed as a supplier function
    const stylings = typeof styling === 'function' ? styling() : styling;

    // -------------------------------------------------------------
    // BRANCH A: String-Based Styling (Inline attributes or <style> tags)
    // -------------------------------------------------------------
    if (typeof stylings === 'string' && stylings.trim()) {
        const trimmedStyling = stylings.trim();

        // Option A1: Apply as direct inline styles on the element
        if (type === 'inline') {
            if (overwrite) {
                targetElement.setAttribute('style', trimmedStyling);
            } else {
                const existingStyle = targetElement.getAttribute('style') || '';
                targetElement.setAttribute('style', `${existingStyle} ${trimmedStyling}`);
            }
            return true;
        }

        // Option A2: Inject or update a dedicated <style> tag in <head> for native CSS nesting
        if (type === 'nested' || type === 'stylesheet') {
            // Find existing <style> element created for this target selector
            let styleTag = document.querySelector(`style[data-style-target="${CSS.escape(target)}"]`);

            // Create a new <style> tag if one doesn't exist or if appending (overwrite: false)
            if (!styleTag || !overwrite) {
                styleTag = document.createElement('style');
                styleTag.setAttribute('data-style-target', target);
                document.head.appendChild(styleTag);
            }

            // Regex check to verify if the CSS string is already wrapped with target selector (e.g., "#target { ... }")
            const hasWrapper = new RegExp(`^${target.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\s*\\{`).test(trimmedStyling);
            const formattedCSS = hasWrapper ? trimmedStyling : `${target} { ${trimmedStyling} }`;

            // Overwrite existing tag contents or append rules
            if (overwrite) {
                styleTag.textContent = formattedCSS;
            } else {
                styleTag.textContent += `\n${formattedCSS}`;
            }

            return true;
        }
    }

    // -------------------------------------------------------------
    // BRANCH B: Object-Based Styling (Recursive JS object mapping)
    // -------------------------------------------------------------
    if (typeof stylings === 'object' && stylings !== null) {
        /**
         * Recursively applies nested JS style objects to child elements.
         * 
         * @param {Element} element - The current DOM element node.
         * @param {Object} styleObj - Nested style object.
         */
        function applyNestedStyles(element, styleObj) {
            for (let key in styleObj) {
                // If key points to a nested object (child selector)
                if (typeof styleObj[key] === 'object' && styleObj[key] !== null) {
                    const child = element.querySelector(key);
                    if (child) {
                        applyNestedStyles(child, styleObj[key]);
                    }
                } else {
                    // Apply standard camelCase CSS style property directly to element
                    element.style[key] = styleObj[key];
                }
            }
        }

        applyNestedStyles(targetElement, stylings);
        return true;
    }

    // Return false if styling format is unsupported
    return false;
}