import { getNoteNumber } from './utils/getNoteNumber'
import { map } from './utils/map'

class Envelope {
  constructor({ a, d, s, r }) {
    this.a = a
    this.d = d
    this.s = s
    this.r = r

    this.noteOn = true
    this.gateDuration = null
    this.startTime = null
  }

  trigger() {
    this.startTime = null
  }

  value(time) {
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
    } else if (noteOn && s > 0) {
      // Sustain (if the note is still on and there is sustain)
      return s
    } else {
      // Release
      this.gateDuration ??= elapsedTime
      const factor = Math.min(1, (elapsedTime - gateDuration) / r)
      // If there was no sustain, there also was no decay so we can start the
      // release at 1.0
      const from = s || 1
      return linearRamp(factor, from, 0)
    }
  }
}

const envelopes = {}

export const adsr = (note, a, d, s, r, options) => {
  const envelope = new Envelope({ a, d, s, r })
  envelopes[getNoteNumber(note)] = envelope

  const min = options.min ?? 0
  const max = options.max ?? options.scale ?? 1

  return time => map(envelope.value(time), 0, 1, min, max)
}
