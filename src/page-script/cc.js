// @ts-check

import { chainable, getMidiId } from '../utils'
import { scale, range } from './transforms'

/** @type {Record<string, number>} */
export const ccValues = {}

export const _cc = (index, channel, device) =>
  ccValues[getMidiId(index, channel, device)] ?? 0

/**
 * @param {number} index
 * @param {number} channel
 * @param {string} device
 * @returns
 */
export const cc = (index, channel, device) =>
  chainable(() => _cc(index, channel, device), { scale, range })
