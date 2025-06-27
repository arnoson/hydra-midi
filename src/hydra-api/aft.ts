import { chainable } from '../utils'
import state from '../state'
import { getMidiId, resolveNote, resolveInput } from '../midiAccess'
import { scale, range, value } from '../transforms'
import { ChannelArg, NoteArg, InputArg } from '../types'

export const getAftId = (
  note: NoteArg,
  channel?: ChannelArg,
  input?: InputArg,
) =>
  getMidiId(
    resolveNote(note),
    channel ?? state.defaults.channel,
    resolveInput(input ?? state.defaults.input),
  )

/**
 * Return an aftertouch value for a specific note. This is useful if you want to use the value inside a
 * parameter function. See also {@link aft}.
 * @example osc(() => _aft(60) / 2).out() // Could also be achieved with osc(aft(60).value(v => v / 2)).out()
 * @returns
 */
export const _aft = (
  note: NoteArg = '*',
  channel: ChannelArg = '*',
  input: InputArg = '*',
) => state.aftValues.get(getAftId(note, channel, input)) ?? 0

/**
 * Generate a chainable function that returns the aftertouch value for the specified note.
 * @example osc(aft(60)).out() // Aftertouch on note 60 will modulate the osc in realtime.
 */
export const aft = (
  note: NoteArg = '*',
  channel?: ChannelArg,
  input?: InputArg,
) => {
  const aftId = getAftId(note, channel, input)
  const fn = () => state.aftValues.get(aftId) ?? 0
  return chainable(fn, { scale, range, value })
} 