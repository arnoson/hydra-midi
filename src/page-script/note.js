// @ts-check

import { chainable, getNoteNumber } from '../utils'
import { scale, range } from './transforms'
import { adsr } from './adsr'
import { getMidiId } from '../utils/getMidiId'

export const playingNotes = new Set()

/** @param {string} noteId */
const noteIsPlaying = noteId => playingNotes.has(noteId)

/** @param {string|number} note */
export const _note = (note, channel, device) =>
  noteIsPlaying[getMidiId(getNoteNumber(note), channel, device)] ? 1 : 0

/** @param {string|number|null} note */
export const note = (note, channel, device) => {
  note = getNoteNumber(note)
  const id = getMidiId(note, channel, device)
  // Use this function instead of `_note()` so we don't have resolve the note
  // number each time.
  const fn = () => (noteIsPlaying(id) ? 1 : 0)
  return chainable(fn, { scale, range, adsr: adsr(id) })
}
