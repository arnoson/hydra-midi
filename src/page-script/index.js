// @ts-check

import {
  parseMidi,
  midiTypes,
  exposeToWindow,
  getMidiId,
  getMidiWildcards
} from '../utils'
import { midi } from './midi'
import { envelopes } from './adsr'
import { cc, _cc, ccValues } from './cc'
import { note, _note, playingNotes } from './note'

exposeToWindow({ midi, cc, _cc, note, _note })

const handleControlChange = (index, value, channel, device) => {
  const ccId = getMidiId(index, channel, device)
  const normalizedValue = value / 127

  ccValues[ccId] = normalizedValue
  getMidiWildcards(index, channel, device).forEach(
    wildcard => (ccValues[wildcard] = normalizedValue)
  )
}

const handleNoteOn = (note, _velocity, channel, device) => {
  const noteId = getMidiId(note, channel, device)
  playingNotes.add(noteId)
  envelopes[noteId]?.trigger()

  getMidiWildcards(note, channel, device).forEach(wildcard => {
    playingNotes.add(wildcard)
    envelopes[wildcard]?.trigger()
  })
}

const handleNoteOff = (note, _velocity, channel, device) => {
  const noteId = getMidiId(note, channel, device)
  playingNotes.delete(noteId)
  envelopes[noteId]?.stop()

  getMidiWildcards(note, channel, device).forEach(wildcard => {
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

let i = 0
for (const input of access.inputs.values()) {
  const index = i++
  input.onmidimessage = message => {
    const { type, data, channel } = parseMidi(message)
    messageHandlers[type]?.(...data, channel, index)
  }
}

// Hydra's logging is quite verbose.
// setTimeout(console.clear, 2000)
