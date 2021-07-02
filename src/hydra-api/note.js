// @ts-check

import { chainable, getNoteNumber } from '../utils'
import { scale, range } from '../transforms'
import { adsr } from '../transforms/adsr'
import { getMidiId, midiAccess } from '../midiAccess'

export const playingNotes = new Set()

const noteIsPlaying = noteId => playingNotes.has(noteId)

export const _note = (note, channel, input = 0) => {
  const noteId = getMidiId(
    getNoteNumber(note),
    channel,
    midiAccess.getInputId(input)
  )
  return noteIsPlaying(noteId) ? 1 : 0
}

/**
 * @param {string|number|null} note
 * @param {number} channel
 * @param {number|string} input
 */
export const note = (note, channel, input = 0) => {
  note = note === '*' ? note : getNoteNumber(note)
  const noteId = getMidiId(note, channel, midiAccess.getInputId(input))

  // Use this function instead of `_note()` so we don't have resolve the note
  // number each time.
  const fn = () => (noteIsPlaying(noteId) ? 1 : 0)
  return chainable(fn, { scale, range, adsr: adsr(noteId) })
}
