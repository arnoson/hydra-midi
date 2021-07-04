// The page script is bundled by rollup (see `rollup.config.js`) and treated as
// a text file so we can import it as a string.
import pageScript from './page-script-bundle.js.txt'

// The page script has to run in the same context as the hydra website so we can
// manipulate the global window object. But chrome extensions do not seem to
// have permission to load a script from file so we inject the script directly.
const script = document.createElement('script')
script.text = pageScript
script.setAttribute('type', 'module')
document.head.prepend(script)
