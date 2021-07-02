// @ts-check

import { chainable } from '../utils'
import { range } from './range'
import { value } from './value'

/**
 * Generate a new transform that scales the previous value in the function
 * chain.
 * @param {function} fn The previous function
 */
export const scale = fn => factor =>
  chainable((...args) => fn(...args) * factor, { range, value })
