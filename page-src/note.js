// @ts-check

import { chainable, getNoteNumber } from './utils'
import { scale, range } from './transforms'
import { adsr } from './adsr'

export const noteValues = {}

/** @param {string|number} note */
export const _note = note => (noteValues[getNoteNumber(note)] ? 1 : 0)

/** @param {string|number} note */
export const note = note => {
  note = getNoteNumber(note)
  // Use this function instead of `_note()` so we don't have resolve the note
  // number each time.
  const fn = () => (noteValues[note] ? 1 : 0)
  return chainable(fn, { scale, range, adsr: adsr(note) })
}
