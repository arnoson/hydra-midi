import state from '../state'
import { ChannelArg, InputArg, IndexArg, CcEventContext } from '../types'
import { getCcId } from './cc'

export const onCC = (
  index: IndexArg,
  channel: ChannelArg,
  input: InputArg,
  event: (context: CcEventContext) => void
) => {
  const ccId = getCcId(index, channel, input)
  state.CcEvents.set(ccId, event)
}


