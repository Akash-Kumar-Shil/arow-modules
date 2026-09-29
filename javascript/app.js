// --------------------------------------------------
// MODULES
// --------------------------------------------------
import { Arow } from "./modules/Arow.mjs";

// --------------------------------------------------
// COMPONENTS
// --------------------------------------------------
import { FileContainer } from "./components/file_container.mjs";

// --------------------------------------------------
// MAIN APP FUNCTIONALITY
// --------------------------------------------------
Arow.templateFun = () => `
${FileContainer()}
`
Arow.render()
