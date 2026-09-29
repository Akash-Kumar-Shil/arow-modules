// --------------------------------------------------
// MODULES
// --------------------------------------------------
import { getData } from "../modules/fetch.mjs";
import { Notification } from "../modules/notification.mjs"

// --------------------------------------------------
// COMPONENTS
// --------------------------------------------------
import { Module_Box } from "./module_box.mjs";

export function FileContainer() {
  return `
    <div class="container" id="file-container-369"></div>
  `;
}

const api = {
  url: "data.json",
  version: "0.1.0",
  container: document.getElementById("file-container-369")
}



async function renderModuleBoxes(list = []) {
  // Reusable delay helper
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const container = document.getElementById("file-container-369");
  if (!container) return;

  for (const item of list) {
    await delay(300); // Waits

    const markup = Module_Box({
      name: item.name,
      extension: item.extension,
      version: item.version,
    });

    // Safely appends the HTML without re-rendering existing items
    container.insertAdjacentHTML("beforeend", markup);
  }
}
getData(`${api.url}`).then((data) => {
  if (data.version == api.version) {
    renderModuleBoxes(data.modules)
    Notification.success(`Get All Modules`)
  } else {
    Notification.error(`API and JSON version not same!`)
  }
})