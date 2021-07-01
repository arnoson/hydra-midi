// @ts-check

import {
  parseMidi,
  midiTypes,
  exposeToWindow,
  getNoteId,
  getNoteWildcards
} from '../utils'
import { envelopes } from './adsr'

import { cc, _cc, ccValues } from './cc'
import { note, _note, playingNotes } from './note'

exposeToWindow({ cc, _cc, note, _note })

const handleControlChange = (index, value) => {
  // Normalize values.
  ccValues[index] = (value + 1) / 128
}

const handleNoteOn = (note, _velocity, channel, device) => {
  const id = getNoteId(note, channel, device)
  playingNotes.add(id)
  envelopes[id]?.trigger()

  getNoteWildcards(note, channel, device).forEach(wildcard => {
    playingNotes.add(wildcard)
    envelopes[wildcard]?.trigger()
  })

  console.log(envelopes)
}

const handleNoteOff = (note, _velocity, channel, device) => {
  const id = getNoteId(note, channel, device)
  playingNotes.delete(id)
  envelopes[note]?.stop()

  getNoteWildcards(note, channel, device).forEach(wildcard => {
    playingNotes.delete(wildcard)
    envelopes[wildcard]?.stop()
  })
}

const messageHandlers = {
  [midiTypes.ControlChange]: handleControlChange,
  [midiTypes.NoteOn]: handleNoteOn,
  [midiTypes.NoteOff]: handleNoteOff
}

const access = await navigator.requestMIDIAccess()
for (const input of access.inputs.values()) {
  input.onmidimessage = message => {
    const { type, data, channel } = parseMidi(message)
    messageHandlers[type]?.(...data, channel, input.id)
  }
}

// Hydra's logging is quite verbose.
// setTimeout(console.clear, 2000)
