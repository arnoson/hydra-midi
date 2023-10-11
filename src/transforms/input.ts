import { cc, note, onNote } from '../hydra-api'
import { ChannelArg, InputArg, NoteArg, NoteEventContext } from '../types'
import { channel } from './channel'

/**
 * Input is chainable only to `midi` and provides an input for all the functions
 * that are chained to it.
 * @example osc(midi.input(3).cc(74)).out()
 * @example osc(midi.input('*').channel(15).cc(74)).out()
 */
export const input = (input: InputArg) => ({
  note: (_note: NoteArg, _channel: ChannelArg, _input?: InputArg) =>
    note(_note, _channel, _input ?? input),

  cc: (_index: number, _channel: ChannelArg, _input?: InputArg) =>
    cc(_index, _channel, _input ?? input),

  onNote: (_note: NoteArg, _event: (context: NoteEventContext) => void) =>
    onNote(_note, '*', input, _event),

  channel: (_channel: ChannelArg) => channel(_channel, input),
})
