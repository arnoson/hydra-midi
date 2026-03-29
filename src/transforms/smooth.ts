import { HydraContext } from '../types'
import { chainable } from '../utils'
import { range } from './range'
import { value } from './value'

type SmoothTransform = (fn: Function) => (factor: number) => any

/**
 * Generate a new transform that slews the previous value in the function
 * chain.
 *
 * factor should be between 0 and 1:
 * - 0   => no change
 * - 1   => jump immediately to target
 * - 0.1 => slow smoothing
 */
export const smooth: SmoothTransform = (fn: Function) => (factor = 0.01) => {
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
    { range, value }
  )
}