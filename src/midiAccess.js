// @ts-check

import { ccValues, playingNotes } from './state'
import { envelopes } from './transforms/adsr'
import { MidiAccess } from './lib/MidiAccess'
import { logMidiMessage, showInputs } from './gui'
import { getNoteNumber } from './utils'

// Expose the `MidiAccess` instance because we need it in other files too.
export const midiAccess = new MidiAccess()

/**
 * Get an id for a midi message using an osc style address.
 * @example getMidiId(60, 0, 1) // -> '60/0/1'
 * @param {number|string} value
 * @param {number|string} channel
 * @param {number|string} input
 * @returns
 */
export const getMidiId = (value, channel = 0, input) => {
  if (input !== undefined) {
    return `${value}/${channel}/${input ?? midiAccess.getInputId(0)}`
  }
}

/**
 * Get all possible wildcard combinations for a midi id ({@link getMidiId}).
 * If we have an id for a midi note like this: '60/0/1' we could use the
 * wildcard '60/0/*' (Note 60 on channel 0 on any input).
 * @param {number} value
 * @param {number} channel
 * @param {string} input
 * @returns
 */
export const getMidiWildcards = (value, channel, input) => [
  getMidiId('*', '*', '*'),
  getMidiId(value, '*', '*'),
  getMidiId('*', channel, '*'),
  getMidiId('*', '*', input),
  getMidiId(value, channel, '*'),
  getMidiId('*', channel, input),
  getMidiId(value, '*', input)
]

export const resolveInput = input =>
  input === '*' ? '*' : midiAccess.getInputId(input)

export const resolveNote = note => (note === '*' ? note : getNoteNumber(note))

/**
 * Start midi access.
 */
export const start = async () => {
  await midiAccess.start()
  midiAccess.access.addEventListener('statechange', () => {
    showInputs(midiAccess.access.inputs)
  })
}

/**
 * Pause midi access.
 */
export const pause = midiAccess.pause

/**
 * For all received midi values we not only save the value for the exact midi id
 * (e.g.: ccValues['74/0/input-0'] = 127) but also all possible wildcards.
 * So for CC 74 this would be:
 * 74 / * / * (CC 74 on any channel and any input)
 * 74 / * / input-0 (CC 74 on any channel on input-0 )
 * ... and so on
 * This might seem a little verbose but this way we can easily poll for values
 * without having to do any additional logic.
 * Listening to CC 74 on channel 0 on any input in hydra: `cc(74, 0, '*')` will
 * internally just look up `ccValues['74/0/*']`, which is super fast.
 */

midiAccess.on(MidiAccess.TypeControlChange, ({ data, channel, input }) => {
  const [index, value] = data
  const ccId = getMidiId(index, channel, input.id)
  const normalizedValue = value / 127

  ccValues[ccId] = normalizedValue
  getMidiWildcards(index, channel, input.id).forEach(
    wildcard => (ccValues[wildcard] = normalizedValue)
  )

  logMidiMessage({ input, type: 'cc', channel, data })
})

midiAccess.on(MidiAccess.TypeNoteOn, ({ data, channel, input }) => {
  const [note] = data
  const noteId = getMidiId(note, channel, input.id)
  playingNotes.add(noteId)
  envelopes[noteId]?.trigger()

  getMidiWildcards(note, channel, input.id).forEach(wildcard => {
    playingNotes.add(wildcard)
    envelopes[wildcard]?.trigger()
  })

  logMidiMessage({ input, type: 'on', channel, data })
})

midiAccess.on(MidiAccess.TypeNoteOff, ({ data, channel, input }) => {
  const [note] = data
  const noteId = getMidiId(note, channel, input.id)
  playingNotes.delete(noteId)
  envelopes[noteId]?.stop()

  getMidiWildcards(note, channel, input.id).forEach(wildcard => {
    playingNotes.delete(wildcard)
    envelopes[wildcard]?.stop()
  })

  logMidiMessage({ input, type: 'off', channel, data })
})

midiAccess.on(MidiAccess.TypePitchBend, ({ input, data, channel }) => {
  const value = ((data[1] << 7) + data[0] - 8192) / 8192
  const displayValue = +value.toFixed(2)
  logMidiMessage({ input, type: 'bnd', channel, data: [displayValue] })
})

midiAccess.on(MidiAccess.TypeAfterTouchChannel, ({ input, data, channel }) => {
  logMidiMessage({ input, type: 'aft', channel, data })
})

midiAccess.on(MidiAccess.TypeAfterTouchPoly, ({ input, data, channel }) => {
  logMidiMessage({ input, type: 'aft', channel, data })
})
