// @ts-check

/** @type {HTMLElement|null} */
let gui
/** @type {HTMLElement|null} */
let inputs
/** @type {HTMLElement|null} */
let messages

const maxMessages = 10
const messageStack = Array(maxMessages)

export const initGui = () => {
  gui = document.createElement('div')
  gui.classList.add('hydra-midi-gui')
  gui.innerHTML = `
    <div class="hydra-midi-inputs"></div>
    <span>⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</span>
    <div class="hydra-midi-heading">Ch Type Values</div>
    <div class="hydra-midi-messages"></div>
  `
  document.body.append(gui)
  inputs = gui.querySelector('.hydra-midi-inputs')
  messages = gui.querySelector('.hydra-midi-messages')
}

export const showInputs = list => {
  const getInputName = input => input.name ?? input.id ?? 'n/a'
  const template = (input, index) =>
    `<div class="hydra-midi-input">#${index} <span class="hydra-midi-input-name">${getInputName(
      input
    )}</span></div>`

  inputs.innerHTML = [...list.values()].map(template).join('')
}

export const logMidiMessage = message => {
  const pad = (value, length = 3) => String(value).padEnd(length, ' ')

  const channel = pad(message.channel, 2)
  const type = pad(message.type, 4)
  const data1 = pad(message.data[0])
  const data2 = message.data[1] ? pad(message.data[1]) : ''

  messageStack.shift()
  messageStack.push(
    `<div class="hydra-midi-message-${type}">${channel} ${type.toUpperCase()} ${data1} ${data2}</div>`
  )
  messages.innerHTML = messageStack.join('')
}
