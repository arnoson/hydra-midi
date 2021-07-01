// @ts-check

/**
 * Get a unique id for the note. Uses osc style address with optional wildcards.
 * @param {number|string} note
 * @param {number} channel
 * @param {string} device
 * @returns
 */
export const getNoteId = (note, channel, device) =>
  `${note ?? '*'}/${channel ?? '*'}/${device ?? '*'}`
