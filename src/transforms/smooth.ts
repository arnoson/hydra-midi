import { HydraContext } from '../types'
import { chainable } from '../utils'
import { range } from './range'
import { value } from './value'
import { scale } from './scale'

type SmoothTransform = (fn: Function) => (factor: number) => any

/**
 * Generate a new transform that slews the previous value in the function
 * chain.
 *
 * Factor should be between 0 and 1.
 */
export const smooth: SmoothTransform =
  (fn: Function) =>
  (factor = 0.01) => {
    let initialized = false
    let current = 0

    return chainable(
      (ctx: HydraContext) => {
        const target = fn(ctx)

        if (!initialized) {
          initialized = true
          current = target
          return current
        }

        current += (target - current) * factor
        return current
      },
      { range, value, scale },
    )
  }
