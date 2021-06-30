import { parseMidi, midiTypes, exposeToWindow } from './utils'
import { adsr, envelopes } from './adsr'
import { cc, _cc, ccValues } from './cc'
import { note, _note, noteValues } from './note'

const access = await navigator.requestMIDIAccess()
for (const input of access.inputs.values()) {
  input.onmidimessage = message => {
    const { type, data, channel } = parseMidi(message)
    if (type === midiTypes.ControlChange) {
      ccValues[data[0]] = (data[1] + 1) / 128
    } else if (type === midiTypes.NoteOn) {
      noteValues[data[0]] = true
    } else if (type === midiTypes.NoteOff) {
      delete noteValues[data[0]]
    }
  }
}

exposeToWindow({ cc, _cc, note, _note })
