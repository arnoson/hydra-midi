// @ts-check

import { ccValues } from './hydra-api/cc'
import { playingNotes } from './hydra-api/note'
import { envelopes } from './transforms/adsr'
import { MidiAccess } from './lib/MidiAccess'

export const midiAccess = new MidiAccess()

/**
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

midiAccess.on(MidiAccess.TypeControlChange, ({ data, channel, input }) => {
  const [index, value] = data
  const ccId = getMidiId(index, channel, input.id)
  const normalizedValue = value / 127

  ccValues[ccId] = normalizedValue
  getMidiWildcards(index, channel, input.id).forEach(
    wildcard => (ccValues[wildcard] = normalizedValue)
  )
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
})
