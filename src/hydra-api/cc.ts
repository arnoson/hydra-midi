import { chainable } from '../utils'
import state from '../state'
import { getMidiId, resolveInput } from '../midiAccess'
import { scale, range, value } from '../transforms'
import { ChannelArg, IndexArg, InputArg } from '../types'

const getCcId = (index: IndexArg, channel: ChannelArg, input: InputArg) =>
  getMidiId(
    index,
    channel ?? state.defaults.channel,
    resolveInput(input ?? state.defaults.input)
  )

/**
 * Return a CC value. This is useful if you want to use the value inside a
 * parameter function. See also {@link _cc}.
 * @example osc(() => _cc(74) / 2).out() // Could also be achieved with osc(cc(74).value(v => v / 2)).out()
 * @returns
 */
export const _cc = (
  index: IndexArg = '*',
  channel: ChannelArg = '*',
  input: InputArg = '*'
) => state.ccValues.get(getCcId(index, channel, input)) ?? 0

/**
 * Generate a chainable function that returns the value for the specified CC
 * index.
 * @example osc(cc(74)).out() // CC 74 will modulate the osc in realtime.
 */
export const cc = (
  index: IndexArg = '*',
  channel: ChannelArg = '*',
  input: InputArg = '*'
) => {
  const ccId = getCcId(index, channel, input)
  const fn = () => state.ccValues.get(ccId) ?? 0
  return chainable(fn, { scale, range, value })
}
