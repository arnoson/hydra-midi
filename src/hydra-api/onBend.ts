import state from '../state'
import { ChannelArg, InputArg, BendEventContext } from '../types'
import { getBendId } from './bend'

/**
 * Register a callback for pitch bend events.
 * @example onBend(0, ({ value, channel }) => console.log(`Pitch bend on channel ${channel}: ${value}`))
 */
export const onBend = (
  channel: ChannelArg,
  input: InputArg,
  event: (context: BendEventContext) => void,
) => {
  const bendId = getBendId(channel, input)
  state.bendEvents.set(bendId, event)
} 