// @ts-check

import { transformValue, getNoteNumber } from './utils'

export const noteValues = {}

export const _note = (note, options) =>
  transformValue(noteValues[getNoteNumber(note)] ? 1 : 0, options)

export const note = (note, options) => () => _note(note, options)
