import state from '../state'
import { ChannelArg, InputArg, NoteArg, NoteEventContext } from '../types'
import { getNoteId } from './note'

export const onNote = (
  note: NoteArg,
  channel: ChannelArg,
  input: InputArg,
  event: (context: NoteEventContext) => void,
) => {
  const noteId = getNoteId(note, channel, input)
  state.noteOnEvents.set(noteId, event)
}
