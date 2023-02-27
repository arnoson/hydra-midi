import { chainable } from '../utils'
import { range } from './range'
import { scale } from './scale'
import { value } from './value'
import { adsr } from './adsr'
import state from '../state'
import { NoteId } from '../types'

const getNoteVelocity = (noteId: string) => state.playingNotes.get(noteId) ?? 0

/**
 * velocity is chainable to `note()`. It retrieves the note's velocity and retrieves a chainable
 * function which returns said velocity in a range from 0 to 1
 */
export const velocity = (noteId: NoteId) => () => () => {
  const fn = () => getNoteVelocity(noteId) / 127
  return chainable(fn, { scale, range, value, adsr: adsr(noteId, fn) })
}
