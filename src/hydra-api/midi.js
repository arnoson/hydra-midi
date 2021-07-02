// @ts-check

import { midiAccess } from '../midiAccess'
import { channel, input } from '../transforms'
import { show, hide, showInputs } from '../gui'
import state from '../state'

const start = defaults => {
  state.defaults = { ...state.initialDefaults, ...defaults }

  midiAccess
    .start()
    .then(() =>
      midiAccess.access.addEventListener('statechange', () =>
        showInputs(midiAccess.access.inputs)
      )
    )

  // Allow `midi.start().show()` chaining.
  return { show }
}

const pause = () => midiAccess.pause()

export const midi = { start, pause, show, hide, input, channel }
