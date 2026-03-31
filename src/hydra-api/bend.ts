import { chainable } from '../utils'
import state from '../state'
import { getMidiId, resolveInput } from '../midiAccess'
import { scale, range, value } from '../transforms'
import { ChannelArg, InputArg } from '../types'

export const getBendId = (
  channel?: ChannelArg,
  input?: InputArg,
) =>
  getMidiId(
    '*',
    channel ?? state.defaults.channel,
    resolveInput(input ?? state.defaults.input),
  )

/**
 * Return a pitch bend value. This is useful if you want to use the value inside a
 * parameter function. See also {@link bend}.
 * @example osc(() => _bend() / 2).out() // Could also be achieved with osc(bend().value(v => v / 2)).out()
 * @returns
 */
export const _bend = (
  channel: ChannelArg = '*',
  input: InputArg = '*',
) => state.bendValues.get(getBendId(channel, input)) ?? 0

/**
 * Generate a chainable function that returns the pitch bend value.
 * @example osc(bend()).out() // Pitch bend will modulate the osc in realtime.
 */
export const bend = (
  channel?: ChannelArg,
  input?: InputArg,
) => {
  const bendId = getBendId(channel, input)
  const fn = () => state.bendValues.get(bendId) ?? 0
  return chainable(fn, { scale, range, value })
} 