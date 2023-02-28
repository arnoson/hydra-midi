import { midiAccess } from '../midiAccess'
import { channel, input } from '../transforms'
import { show, hide, showInputs } from '../gui'
import state from '../state'
import { Defaults } from '../types'

type ChainablePromise<T, M> = Promise<T> & M

const start = (defaults: Defaults) => {
  state.defaults = { ...state.defaults, ...defaults }

  const promise = midiAccess.start().then(() => {
    midiAccess.access?.addEventListener('statechange', () => {
      if (midiAccess.access) showInputs(midiAccess.access.inputs)
      if (autoShow) show()
    })
  }) as ChainablePromise<void, { show: () => {} }>

  // We can't show the midi monitor directly, since the midi access is probably
  // not ready yet. Instead we set a flag and check for it in the listener
  // above.
  let autoShow = false
  promise.show = () => (autoShow = true)
  return promise
}

const pause = () => midiAccess.pause()

export const midi = { start, pause, show, hide, input, channel }
