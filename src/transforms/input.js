// @ts-check

import { cc, note } from '../hydra-functions'

export const input = input => ({
  note: (_note, _channel, _input) => note(_note, _channel, input),
  cc: (_index, _channel, _input) => cc(_index, _channel, input)
})
