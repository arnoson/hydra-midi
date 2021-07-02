// @ts-check

import { midiAccess } from '../midiAccess'
import { channel, input } from '../transforms'
import { show, hide, showInputs } from '../gui'
import state from '../state'

const start = async defaults => {
  state.defaults = { ...state.initialDefaults, ...defaults }
  await midiAccess.start()
  midiAccess.access.addEventListener('statechange', () =>
    showInputs(midiAccess.access.inputs)
  )
}

const pause = () => midiAccess.pause()

export const midi = { start, pause, show, hide, input, channel }
