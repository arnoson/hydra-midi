// @ts-check

import { parseMidi, midiTypes } from '../utils'

import { cc, ccValues } from './cc'
import { note, playingNotes } from './note'
import { envelopes } from './adsr'

let isSetup = false
let active = false

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

const onMidiMessage = message => {
  const { type, data, channel } = parseMidi(message)
  messageHandlers[type]?.(...data, channel, message.target.id)
}

/** @type {WebMidi.MIDIAccess|null} */
let access

const setup = async () => {
  access = await navigator.requestMIDIAccess()

  // access.addEventListener('statechange', event => {
  //   if (event.port.state === 'connected') {
  //     access.inputs
  //       .get(event.port.id)
  //       .addEventListener('midimessage', onMidiMessage)
  //   }
  // })

  for (const input of access.inputs.values()) {
    input.addEventListener('midimessage', onMidiMessage)
  }

  isSetup = true
}

/**
 * Get a midi input's id by index or name.
 * @param {number|string} indexOrName
 * @returns {string}
 */
export const getInputId = indexOrName => {
  if (!access) return

  const input =
    typeof indexOrName === 'number'
      ? access.inputs.values()[indexOrName]
      : [...access.inputs.values()].find(input => input.name === indexOrName)

  return input?.id
}

/**
 * Get a unique id for a midi note or control change. Uses OSC style address
 * with wildcards.
 * Examples:
 * '60/0/*' -> Note 60 on channel 0 on any device
 * '74/1/input-0' -> CC 74 on channel 1 on input device with id `input-0`
 * @param {number|string} value
 * @param {number|string} channel
 * @param {number|string} input
 * @returns
 */
export const getMidiId = (value, channel = 0, input = 0) =>
  `${value}/${channel}/${getInputId(input)}`

export const midi = {
  start() {
    setup()
    active = true
  },

  stop() {
    active = false
  }
}

/**
 * Get all possible wildcard combinations for a midi id.
 * @param {number} value
 * @param {number} channel
 * @param {string} device
 * @returns
 */
export const getMidiWildcards = (value, channel, device) => [
  getMidiId('*', '*', '*'),
  getMidiId(value, '*', '*'),
  getMidiId('*', channel, '*'),
  getMidiId('*', '*', device),
  getMidiId(value, channel, '*'),
  getMidiId('*', channel, device),
  getMidiId(value, '*', device)
]

// export const midi = (channel = null, device = null) => ({
//   note: (number, _channel, _device) =>
//     note(number, channel ?? _channel, device ?? _device),

//   cc: (index, _channel, _device) =>
//     cc(index, channel ?? _channel, device ?? _device)
// })
