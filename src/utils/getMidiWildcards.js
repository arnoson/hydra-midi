// @ts-check

import { getMidiId } from './getMidiId'

/**
 * Get all possible wildcard combinations for a midi id.
 * @param {number} value
 * @param {number} channel
 * @param {string} device
 * @returns
 */
export const getMidiWildcards = (value, channel, device) => [
  getMidiId('*', '*', '*'),
  getMidiId(value, '*', '*'),
  getMidiId('*', channel, '*'),
  getMidiId('*', '*', device),
  getMidiId(value, channel, '*'),
  getMidiId('*', channel, device),
  getMidiId(value, '*', device)
]
