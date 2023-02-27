import { HydraContext } from '../types'
import { chainable, map } from '../utils'
import { scale } from './scale'
import { value } from './value'

/**
 * Generate a new transform that maps the previous value in the function chain
 * to a new range.
 */
export const range =
  (fn: Function) =>
  (min = 0, max = 1) =>
    chainable((ctx: HydraContext) => map(fn(ctx), 0, 1, min, max), {
      scale,
      value,
    })
