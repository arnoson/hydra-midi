// @ts-check

import { chainable, getNoteNumber } from '../utils'
import { scale, range } from './transforms'
import { adsr } from './adsr'

export const noteValues = new Set()

/** @param {number|string} note */
const noteIsPlaying = note =>
  note === 'all' ? noteValues.size : noteValues.has(note)

/** @param {string|number} note */
export const _note = note => (noteIsPlaying[getNoteNumber(note)] ? 1 : 0)

/** @param {string|number|null} note */
export const note = note => {
  note = getNoteNumber(note) ?? 'all'
  // Use this function instead of `_note()` so we don't have resolve the note
  // number each time.
  const fn = () => (noteIsPlaying(note) ? 1 : 0)
  return chainable(fn, { scale, range, adsr: adsr(note) })
}
