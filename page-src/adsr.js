// @ts-check

import { linearRamp, chainable } from './utils'
import { scale, range } from './transforms'

class Envelope {
  active = false
  noteOn = false
  /** @type {number|null} */
  gateDuration = null
  /** @type {number|null} */
  startTime = null

  constructor({ a, d, s, r }) {
    this.a = a
    this.d = d
    this.s = s
    this.r = r
  }

  trigger() {
    this.startTime = null
    this.noteOn = true
    this.active = true
  }

  stop() {
    this.noteOn = false
  }

  /**
   * @param {number} time
   * @returns {number}
   */
  value(time) {
    if (!this.active) return 0

    this.startTime ??= time
    const elapsedTime = time - this.startTime
    const { a, d, s, r } = this

    if (elapsedTime < a) {
      // Attack
      const factor = elapsedTime / a
      return linearRamp(factor, 0, 1)
    } else if (elapsedTime < a + d && s > 0) {
      // Decay (only if there is sustain)
      const factor = (elapsedTime - a) / d
      return linearRamp(factor, 1, s)
    } else if (this.noteOn && s > 0) {
      // Sustain (if the note is still on and there is sustain)
      return s
    } else {
      // Release
      this.gateDuration ??= elapsedTime
      const factor = Math.min(1, (elapsedTime - this.gateDuration) / r)

      // Envelope has finished.
      if (factor === 1) this.active = false

      // If there was no sustain, there also was no decay so we can start the
      // release at 1.0
      const from = s || 1
      return linearRamp(factor, from, 0)
    }
  }
}

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
