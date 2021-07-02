// @ts-check

import { chainable } from '../utils'
import state from '../state'
import { getMidiId, resolveInput } from '../midiAccess'
import { scale, range, value } from '../transforms'

const getCcId = (index, channel, input) =>
  getMidiId(index, channel, resolveInput(input))

/**
 * Return a CC value. This is useful if you want to use the value inside a
 * parameter function. See also {@link _cc}.
 * @example osc(() => _cc(74) / 2).out() // Could also be achieved with osc(cc(74).value(v => v / 2)).out()
 * @param {number|string} index
 * @param {number|string} channel
 * @param {number|string} input
 * @returns
 */
export const _cc = (index, channel, input = 0) =>
  state.ccValues[getCcId(index, channel, input)] ?? 0

/**
 * Generate a chainable function that returns the value for the specified CC
 * index.
 * @example osc(cc(74)).out() // CC 74 will modulate the osc in realtime.
 * @param {number|string} index A CC index or '*' for any CC.
 * @param {number|string} channel A channel or '*' for any channel.
 * @param {number|string} input An input index or an input name or '*' for any
 * input.
 * @returns
 */
export const cc = (index, channel, input = 0) => {
  const ccId = getCcId(index, channel, input)
  const fn = () => state.ccValues[ccId] ?? 0
  return chainable(fn, { scale, range, value })
}
