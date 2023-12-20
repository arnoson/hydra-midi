import state from '../state'
import { ChannelArg, InputArg, IndexArg, CCEventContext } from '../types'
import { getCCId } from './cc'

export const onCC = (
  index: IndexArg,
  channel: ChannelArg,
  input: InputArg,
  event: (context: CCEventContext) => void,
) => {
  const ccId = getCCId(index, channel, input)
  state.ccEvents.set(ccId, event)
}
