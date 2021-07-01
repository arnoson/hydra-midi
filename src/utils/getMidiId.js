// @ts-check

/**
 * Get a unique id for a midi note or control change. Uses OSC style address
 * with wildcards.
 * Examples:
 * '60/0/*' -> Note 60 on channel 0 on any device
 * '74/1/input-0' -> CC 74 on channel 1 on input device with id `input-0`
 * @param {number|string} value
 * @param {number|string} channel
 * @param {number|string} device
 * @returns
 */
export const getMidiId = (value, channel = 0, device = 0) =>
  `${value}/${channel}/${device}`
