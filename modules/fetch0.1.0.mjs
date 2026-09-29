export const info = {
  name: "Fetch",
  extension: "mjs",
  version: "0.1.0",
  description:
    "Lightweight wrapper for fetch requests supporting custom types and POST methods.",
  dependency: [],
};

/**
 * Fetches data from a URL and parses it based on the specified type.
 * 
 * @param {string} url - The URL endpoint to fetch data from.
 * @param {string} [type="json"] - Response type: "json", "text", "blob", "arrayBuffer", or "formData".
 * @returns {Promise<any|null>} Parsed data, or null if an error occurs.
 */
export async function getData(url, type = "json") {
    try {
        // 1. Send the GET request
        const response = await fetch(url);

        // 2. Check if the HTTP status code is in the success range (200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // 3. Normalize the type string to lowercase for safe matching
        const normalizedType = type?.toLowerCase();

        // 4. Validate and dynamically parse the response body based on the requested type
        if (["json", "text", "blob", "arraybuffer", "formdata"].includes(normalizedType)) {
            // Dynamically call the corresponding fetch Response method (e.g., response.json(), response.text())
            return await response[normalizedType]();
        }

        // 5. Default fallback if an unsupported or missing type is passed
        return await response.json();

    } catch (error) {
        // Log the error for debugging and return null to handle failures gracefully
        console.error("Fetch error:", error);
        return null;
    }
}

/**
 * Sends data to a specified URL using an asynchronous HTTP POST request.
 * 
 * @param {string} url - The endpoint URL to send the POST request to.
 * @param {Object} data - The payload object to be sent as JSON in the body.
 * @returns {Promise<Object|null>} - Resolves with parsed JSON response, or null if no content returned.
 * @throws {Error} - Throws an error if the HTTP response fails or a network issue occurs.
 */
export async function sendData(url, data) {
  try {
    // 1. Send the HTTP POST request using the Fetch API
    const response = await fetch(url, {
      method: "POST", // Specify the HTTP method
      headers: {
        "Content-Type": "application/json", // Tell the server payload is in JSON format
        "Accept": "application/json"        // Tell the server we expect JSON in response
      },
      body: JSON.stringify(data) // Convert the JavaScript object into a JSON string
    });

    // 2. Check if the HTTP status code indicates failure (status outside 200–299)
    if (!response.ok) {
      // Attempt to parse server error response body for better error details
      let errorDetails = "";
      try {
        const errorData = await response.json();
        errorDetails = errorData.message || JSON.stringify(errorData);
      } catch {
        // Fall back to status text if response isn't JSON
        errorDetails = response.statusText || `Status Code ${response.status}`;
      }
      
      throw new Error(`HTTP ${response.status} Error: ${errorDetails}`);
    }

    // 3. Handle 204 No Content responses safely without crashing
    if (response.status === 204) {
      return null;
    }

    // 4. Safely parse JSON response if a body exists
    const text = await response.text();
    return text ? JSON.parse(text) : null;
    
  } catch (error) {
    // 5. Log network errors or server failures to the console for debugging
    console.error("Fetch Error:", error.message || error);

    // 6. Re-throw the error so calling code can catch and handle it appropriately
    throw error; 
  }
}