import state from '../state'
import { getAftId, resolveNote, resolveInput } from '../midiAccess'
import { ChannelArg, NoteArg, InputArg, AftEventContext } from '../types'

/**
 * Register a callback for aftertouch events on a specific note.
 * @example onAft(60, ({ note, value, channel }) => console.log(`Aftertouch on note ${note}: ${value}`))
 */
export const onAft = (
  note: NoteArg,
  channel: ChannelArg,
  input: InputArg,
  event: (context: AftEventContext) => void,
) => {
  const aftId = getAftId(resolveNote(note), channel, resolveInput(input))
  state.aftEvents.set(aftId, event)
} 