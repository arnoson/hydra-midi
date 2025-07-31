import { HydraContext } from '../types'
import { chainable } from '../utils'
import { range } from './range'
import { scale } from './scale'

type ValueTransform = (fn: Function) => (modify: (v: number) => number) => any

/**
 * Generate a new transform that allows to modify the previous value in the
 * function chain.
 */
export const value: ValueTransform =
  (fn: Function) => (modify: (v: number) => number) =>
    chainable((ctx: HydraContext) => modify(fn(ctx)), { scale, range })
