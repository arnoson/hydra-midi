// @ts-check

import { Envelope } from '../lib/Envelope'
import { chainable } from '../utils'
import { scale } from './scale'
import { range } from './range'
import state from '../state'
import { value } from './value'

export const envelopes = {}

/**
 * Adsr is chainable to `note()`. It creates an envelope and returns a chainable
 * function, which in turn returns the envelope value at a given time.
 * @param {string} noteId
 */
export const adsr = noteId => () => (a, d, s, r) => {
  // Perform a deep merge with the adsr defaults.
  ;[a, d, s, r] = [a, d, s, r].map(
    (arg, i) => arg ?? state.defaults.adsr[i] ?? state.initialDefaults.adsr[i]
  )

  envelopes[noteId] = new Envelope({ a, d, s, r })
  const envelope = envelopes[noteId]

  return chainable(({ time }) => envelope.value(time * 1000), {
    scale,
    range,
    value
  })
}
