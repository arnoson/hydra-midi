// @ts-check

import { chainable } from '../utils'
import { ccValues } from '../state'
import { getMidiId, midiAccess } from '../midiAccess'
import { scale, range, value } from '../transforms'

export const _cc = (index, channel, input = 0) =>
  ccValues[getMidiId(index, channel, midiAccess.getInputId(input))] ?? 0

/**
 * @param {number} index
 * @param {number} channel
 * @param {string|number} input
 * @returns
 */
export const cc = (index, channel, input = 0) => {
  const ccId = getMidiId(index, channel, midiAccess.getInputId(input))
  const fn = () => ccValues[ccId] ?? 0
  return chainable(fn, { scale, range, value })
}
