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
  return chainable(() => _note(note), { scale, range, adsr: adsr(note) })
}
