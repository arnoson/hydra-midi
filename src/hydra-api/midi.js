// @ts-check

import { midiAccess } from '../midiAccess'
import { channel, input } from '../transforms'

export const midi = {
  start: () => midiAccess.start(),
  pause: () => midiAccess.pause(),
  input,
  channel
}
