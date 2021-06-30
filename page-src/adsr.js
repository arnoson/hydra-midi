// @ts-check

import { Envelope } from './Envelope'
import { chainable } from './utils'
import { scale, range } from './transforms'

export const envelopes = {}

/**
 * Adsr is chainable to `note()`. It creates an envelope and returns a chainable
 * function that returns the envelope value at a given time.
 * @param {number} note
 * @returns
 */
export const adsr = note => fn => (a = 100, d = 100, s = 1, r = 100) => {
  envelopes[note] = new Envelope({ a, d, s, r })
  const envelope = envelopes[note]

  return chainable(({ time }) => envelope.value(time * 1000), { scale, range })
}
