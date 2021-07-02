// @ts-check

import { Envelope } from '../lib/Envelope'
import { chainable } from '../utils'
import { scale } from './scale'
import { range } from './range'

export const envelopes = {}

/**
 * Adsr is chainable to `note()`. It creates an envelope and returns a chainable
 * function, which in turn returns the envelope value at a given time.
 * @param {string} noteId
 * @returns
 */
export const adsr = noteId => () => (a = 100, d = 100, s = 1, r = 100) => {
  envelopes[noteId] = new Envelope({ a, d, s, r })
  const envelope = envelopes[noteId]

  return chainable(({ time }) => envelope.value(time * 1000), { scale, range })
}
