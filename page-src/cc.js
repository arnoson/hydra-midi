// @ts-check

import { chainable } from './utils'
import { scale, range } from './transforms'

/** @type {number[]} */
export const ccValues = Array(128).fill(0.5)

/** @param {number} index */
export const _cc = index => ccValues[index]

/** @param {number} index */
export const cc = index => chainable(_cc, [index], { scale, range })
