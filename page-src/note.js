// @ts-check

import { chainable, getNoteNumber } from './utils'
import { scale, range } from './transforms'

export const noteValues = {}

export const _note = note => (noteValues[getNoteNumber(note)] ? 1 : 0)

export const note = note => {
  const number = getNoteNumber(note)
  return chainable(_note, [number], { scale, range })
}
