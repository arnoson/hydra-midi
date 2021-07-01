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
  getMidiId(null, null, null),
  getMidiId(value, null, null),
  getMidiId(null, channel, null),
  getMidiId(null, null, device),
  getMidiId(value, channel, null),
  getMidiId(null, channel, device),
  getMidiId(value, null, device)
]
