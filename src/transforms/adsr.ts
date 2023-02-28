import { Envelope } from '../lib/Envelope'
import { chainable } from '../utils'
import { scale } from './scale'
import { range } from './range'
import state from '../state'
import { value } from './value'
import { NoteId } from '../types'

export const envelopes = new Map<string, Envelope>()

/**
 * Adsr is chainable to `note()`. It creates an envelope and returns a chainable
 * function, which in turn returns the envelope value at a given time.
 */
export const adsr =
  (noteId: NoteId, velocity: () => number) =>
  () =>
  (a: number, d: number, s: number, r: number) => {
    // Perform a deep merge with the adsr defaults.
    ;[a, d, s, r] = [a, d, s, r].map((arg, i) => arg ?? state.defaults.adsr[i])

    const envelope = new Envelope({ a, d, s, r })
    envelopes.set(noteId, envelope)

    return chainable(
      (ctx: { time: number }) => envelope.value(ctx.time * 1000) * velocity(),
      {
        scale,
        range,
        value,
      }
    )
  }
