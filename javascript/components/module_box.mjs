// --------------------------------------------------
// MODULES
// --------------------------------------------------
import { useState, setStyles } from "../modules/Arow.mjs";

export function Module_Box({ name, extension, version, description }) {
    // 1. Set the initial state with default icon and color (gray color)
    let [getIcon, setIcon] = useState({
        html: `<i class="ri-file-4-fill"></i>`,
        color: "#888888"
    });

    // 2. Define icons and colors matching each extension
    const fileSpecs = {
        html: { icon: `<i class="ri-html5-fill"></i>`, color: "#e45744" },
        css:  { icon: `<i class="ri-css3-fill"></i>`,  color: "#7d37ab" },
        js:   { icon: `<i class="ri-javascript-fill"></i>`, color: "#f7df1e" },
        mjs:  { icon: `<i class="ri-javascript-fill"></i>`, color: "#f7df1e" },
        py:   { icon: `<i class="fa-brands fa-python"></i>`, color: "#52ab37" }
    };

    // 3. Update the state if the extension matches our map
    if (extension in fileSpecs) {
        setIcon(fileSpecs[extension]);
    }

    // 4. Retrieve current state data
    const currentIcon = getIcon();

    // 5. Get Link
    const link = `${String(name).toLowerCase().trim()}${String(version).trim()}.${String(extension).trim()}`

    // 6. Inject the color directly into a wrapper style tag
    return `
    <div class="module-box-369 box">
        <div>
            <span style="color: ${currentIcon.color};">${currentIcon.icon}</span>
            <span data-type="name">${name}</span>
        </div>

        <div>
            <span>${version}</span>
        </div>

        <div class="options">
            <a data-type="show" href="./modules/${link}" target="_blank" rel="noopener noreferrer"><i class="ri-macbook-fill"></i> Show</a>
            <a data-type="download" download href="./modules/${link}" target="_blank" rel="noopener noreferrer"><i class="ri-download-fill"></i> Download</a>
        </div>
    </div>
    `;
}