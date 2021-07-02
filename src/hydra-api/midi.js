// @ts-check

import { start, pause } from '../midiAccess'
import { channel, input } from '../transforms'
import { show, hide } from '../gui'

export const midi = { start, pause, show, hide, input, channel }
