// @ts-check

import { parseMidi, midiTypes, exposeToWindow } from '../utils'
import { envelopes } from './adsr'

import { cc, _cc, ccValues } from './cc'
import { note, _note, noteValues } from './note'

exposeToWindow({ cc, _cc, note, _note })

const handleControlChange = (index, value) => {
  // Normalize values.
  ccValues[index] = (value + 1) / 128
}

const handleNoteOn = note => {
  noteValues.add(note)
  envelopes[note]?.trigger()
}

const handleNoteOff = note => {
  noteValues.delete(note)
  envelopes[note]?.stop()
}

const messageHandlers = {
  [midiTypes.ControlChange]: handleControlChange,
  [midiTypes.NoteOn]: handleNoteOn,
  [midiTypes.NoteOff]: handleNoteOff
}

const access = await navigator.requestMIDIAccess()
for (const input of access.inputs.values()) {
  input.onmidimessage = message => {
    const { type, data } = parseMidi(message)
    messageHandlers[type]?.(...data)
  }
}

// Hydra's logging is quite verbose.
// setTimeout(console.clear, 2000)
