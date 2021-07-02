// @ts-check

import { chainable } from '../utils'
import { range } from './range'
import { scale } from './scale'

/**
 * Generate a new transform that allows to modify the previous value in the
 * function chain.
 * @param {function} fn The previous function
 */
export const value = fn => modify =>
  chainable((...args) => modify(fn(...args)), { scale, range })
