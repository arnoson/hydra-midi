import state from '../state'
import { ChannelArg, InputArg, NoteArg } from '../types'
import { getNoteId } from './note'

export const onNote = (
  note: NoteArg,
  channel: ChannelArg,
  input: InputArg,
  event: Function
) => {
  const noteId = getNoteId(note, channel, input)
  state.noteOnEvents.set(noteId, event)
}
