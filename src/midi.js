// @ts-check

import { ccValues } from './hydra-functions/cc'
import { playingNotes } from './hydra-functions/note'
import { envelopes } from './transforms/adsr'
import { Midi } from './lib/Midi'

export const midi = new Midi()

/**
 * @param {number|string} value
 * @param {number|string} channel
 * @param {number|string} input
 * @returns
 */
export const getMidiId = (value, channel = 0, input) => {
  if (input !== undefined) {
    return `${value}/${channel}/${input ?? midi.getInputId(0)}`
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

midi.on(Midi.TypeControlChange, ({ data, channel, input }) => {
  const [index, value] = data
  const ccId = getMidiId(index, channel, input.id)
  const normalizedValue = value / 127

  ccValues[ccId] = normalizedValue
  getMidiWildcards(index, channel, input.id).forEach(
    wildcard => (ccValues[wildcard] = normalizedValue)
  )
})

midi.on(Midi.TypeNoteOn, ({ data, channel, input }) => {
  const [note] = data
  const noteId = getMidiId(note, channel, input.id)
  playingNotes.add(noteId)
  envelopes[noteId]?.trigger()

  getMidiWildcards(note, channel, input.id).forEach(wildcard => {
    playingNotes.add(wildcard)
    envelopes[wildcard]?.trigger()
  })
})

midi.on(Midi.TypeNoteOff, ({ data, channel, input }) => {
  const [note] = data
  const noteId = getMidiId(note, channel, input.id)
  playingNotes.delete(noteId)
  envelopes[noteId]?.stop()

  getMidiWildcards(note, channel, input.id).forEach(wildcard => {
    playingNotes.delete(wildcard)
    envelopes[wildcard]?.stop()
  })
})
