import pageScript from './page-script-bundle.js.txt'

const script = document.createElement('script')
script.text = pageScript
script.setAttribute('type', 'module')
document.head.prepend(script)
