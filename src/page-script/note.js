// @ts-check

import { chainable, getNoteNumber } from '../utils'
import { scale, range } from './transforms'
import { adsr } from './adsr'
import { getMidiId } from './midi'

export const playingNotes = new Set()

const noteIsPlaying = noteId => playingNotes.has(noteId)

export const _note = (note, channel, device) =>
  noteIsPlaying[getMidiId(getNoteNumber(note), channel, device)] ? 1 : 0

/**
 * @param {string|number|null} note
 * @param {number} channel
 * @param {string} device
 */
export const note = (note, channel, device) => {
  note = note === '*' ? note : getNoteNumber(note)
  const id = getMidiId(note, channel, device)
  // Use this function instead of `_note()` so we don't have resolve the note
  // number each time.
  const fn = () => (noteIsPlaying(id) ? 1 : 0)
  return chainable(fn, { scale, range, adsr: adsr(id) })
}
