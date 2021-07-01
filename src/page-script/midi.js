// @ts-check

import { cc } from './cc'
import { note } from './note'

export const midi = (channel = null, device = null) => ({
  note: (number, _channel, _device) =>
    note(number, channel ?? _channel, device ?? _device),

  cc: (index, _channel, _device) =>
    cc(index, channel ?? _channel, device ?? _device)
})
