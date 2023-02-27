import { HydraContext } from '../types'
import { chainable } from '../utils'
import { range } from './range'
import { value } from './value'

/**
 * Generate a new transform that scales the previous value in the function
 * chain.
 */
export const scale = (fn: Function) => (factor: number) =>
  chainable((ctx: HydraContext) => fn(ctx) * factor, { range, value })
