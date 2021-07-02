// @ts-check

import { cc, note } from '../hydra-api'
import { channel } from './channel'

export const input = input => ({
  note: (_note, _channel, _input) => note(_note, _channel, input),
  cc: (_index, _channel, _input) => cc(_index, _channel, input),
  channel: _channel => channel(_channel, input)
})
