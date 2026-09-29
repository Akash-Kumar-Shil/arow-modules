// --------------------------------------------------
// MODULES
// --------------------------------------------------
import { Arow } from "./modules/Arow.mjs";

// --------------------------------------------------
// COMPONENTS
// --------------------------------------------------
import { FileContainer } from "./components/FILE_CONTAINER.mjs";

// --------------------------------------------------
// MAIN APP FUNCTIONALITY
// --------------------------------------------------
Arow.templateFun = () => `
${FileContainer()}
`
Arow.render()