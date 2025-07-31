import { HydraContext } from '../types'
import { chainable, map } from '../utils'
import { scale } from './scale'
import { value } from './value'

type RangeTransform = (fn: Function) => (min?: number, max?: number) => any

/**
 * Generate a new transform that maps the previous value in the function chain
 * to a new range.
 */
export const range: RangeTransform =
  (fn: Function) =>
  (min = 0, max = 1) =>
    chainable((ctx: HydraContext) => map(fn(ctx), 0, 1, min, max), {
      scale,
      value,
    })
