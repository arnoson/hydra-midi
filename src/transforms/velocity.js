// @ts-check

import { chainable } from '../utils'
import { range } from './range'
import { scale } from './scale'
import { value } from './value'
import { adsr } from './adsr'
import state from '../state'

/**
 * get note pure velocity from 0 to 127
 * @param {string} noteId
 */
const getNoteVelocity = noteId => state.playingNotes.get(noteId) ?? 0

/**
 * velocity is chainable to `note()`. It retrieves the note's velocity and retrieves a chainable
 * function which returns said velocity in a range from 0 to 1
 * @param {string} noteId
 */
export const velocity = noteId => () => () => {
  const v = () => getNoteVelocity(noteId) / 127
  return chainable(() => v(), { scale, range, value, adsr: adsr(noteId, v) })
}
