import pageScript from './page-script.js.txt'

const script = document.createElement('script')
script.text = pageScript
script.setAttribute('type', 'module')
document.head.prepend(script)
