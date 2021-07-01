// @ts-check

import { getNoteId } from './getNoteId'

/**
 * Get all possible wildcard combination for a note.
 * Wildcard examples:
 * '*-*-*' -> any note on any channel on any device
 * '60-0-*' -> note 60 on channel 0 on any device
 * @param {number} note
 * @param {number} channel
 * @param {string} device
 * @returns
 */
export const getNoteWildcards = (note, channel, device) => [
  getNoteId(null, null, null),
  getNoteId(note, null, null),
  getNoteId(null, channel, null),
  getNoteId(null, null, device),
  getNoteId(note, channel, null),
  getNoteId(null, channel, device),
  getNoteId(note, null, device)
]
