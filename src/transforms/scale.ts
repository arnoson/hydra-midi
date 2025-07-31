import { HydraContext } from '../types'
import { chainable } from '../utils'
import { range } from './range'
import { value } from './value'

type ScaleTransform = (fn: Function) => (factor: number) => any

/**
 * Generate a new transform that scales the previous value in the function
 * chain.
 */
export const scale: ScaleTransform = (fn: Function) => (factor: number) =>
  chainable((ctx: HydraContext) => fn(ctx) * factor, { range, value })
