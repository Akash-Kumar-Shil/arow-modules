export class Arow {
    static version = '1.0.0';

    /**
     * @type {HTMLElement|null} Main container element for the app
     * @type {number} Holds app update count
     * @type {Function|null} Template function that returns HTML string
     */
    static appElement = null;
    static renderCount = 0;
    static templateFun = null;

    /**
     * Render app if there is no problem
     */
    static render() {
        if (!this.appElement) {
            document.body.innerHTML = `<div id="app"></div>`
        }

        this.appElement = document.getElementById("app")
        if (this.appElement && typeof this.templateFun === 'function') {
            this.appElement.innerHTML = this.templateFun();
        } else {
            console.error("initialization problem")
        }
    }

    /**
     * Update app
     */
    static update() {
        if (this.appElement && this.templateFun) {
            this.renderCount++;
            this.appElement.innerHTML = this.templateFun();
        }
    }

    /**
     * Register delegated event listener.
     * 
     * @param {string} selector CSS selector.
     * @param {string} event Event name.
     * @param {(event: Event) => void} handler Callback function.
     */
    static event(selector, event, handler) {
        document.body.addEventListener(event, (e) => {
            const targetElement = e.target.closest(selector);
            if (targetElement) {
                handler.call(targetElement, e);
            }
        }, { capture: true })
    }
}

/**
 * Creates a simple state management hook.
 *
 * @param {any} initialState - The starting value for the state.
 * @returns {[() => any, (newState: any) => any]} A tuple containing:
 *   - `getState`: A function that returns the current state value.
 *   - `setState`: A function that updates and returns the new state value.
 */
export function useState(initialState) {
    let state = initialState;

    /**
     * Retrieves the current state value.
     * @returns {any} The current state.
     */
    function getState() {
        return state;
    }

    /**
     * Updates the state with a new value.
     * @param {any} newState - The new value to set.
     * @returns {any} The updated state.
     */
    function setState(newState) {
        state = newState;
        return state;
    }

    return [getState, setState];
}

/**
 * Injects content (string or function result) into a specified DOM element.
 * 
 * @param {string} cssTag - The CSS selector for the target element.
 * @param {string|Function} content - The HTML content or a function returning HTML content.
 * @param {boolean} state - Flag indicating whether the injection should execute.
 */
export function injection(cssTag, content, state = true) {
    // Validate the CSS selector before querying the DOM
    if (!cssTag || typeof cssTag !== "string") {
        console.error("css tag is invalid!");
        return; // Guard clause to exit early
    }

    // 2. Query the target DOM element
    const tag = document.querySelector(cssTag);
    
    /* 
     * Check if the element exists in the DOM. 
     * Prevents TypeError when attempting to set innerHTML on null.
     */
    if (!tag) {
        console.error(`Element matching selector "${cssTag}" was not found!`);
        return;
    }

    // 3. Process injection only if state is truthy and content exists
    if (state && content) {
        // Execute dynamic content generator function
        if (typeof content === "function") {
            tag.innerHTML = content();
        } 
        // Inject static string HTML directly
        else if (typeof content === "string") {
            tag.innerHTML = content;
        } 
        // Log error if content type is unsupported (e.g., numbers, objects)
        else {
            console.error("content is invalid!");
        }
    }
}

/**
 * Dynamically injects CSS rules into the document by appending them to a dedicated <style> element.
 *
 * @param {string} selector - The CSS selector (e.g., '#title', '.btn', 'h1').
 * @param {string} cssRules - The CSS property-value pairs to apply (e.g., 'color: red; margin: 0;').
 */
export function setStyles(selector, cssRules) {
  // Check if the dedicated dynamic style sheet already exists in the DOM
  let styleSheet = document.getElementById("dynamic-styles");
  
  // If the style sheet does not exist, create it and attach it to the document head
  if (!styleSheet) {
    styleSheet = document.createElement("style");
    styleSheet.id = "dynamic-styles";
    document.head.appendChild(styleSheet);
  }

  // Append the new selector and CSS rules to the style sheet's text content
  styleSheet.textContent += `
    ${selector} {
      ${cssRules}
    }
  `;
}
