// @ts-check

import { chainable, map } from '../utils'
import { scale } from './scale'
import { value } from './value'

/**
 * Generate a new transform that maps the previous value in the function chain
 * to a new range.
 * @param {function} fn
 */
export const range = fn => (min = 0, max = 1) =>
  chainable((...args) => map(fn(...args), 0, 1, min, max), { scale, value })
