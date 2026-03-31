import { onCC } from '../hydra-api'
import { cc } from '../hydra-api/cc'
import { note } from '../hydra-api/note'
import { onNote } from '../hydra-api/onNote'
import { aft } from '../hydra-api/aft'
import { onAft } from '../hydra-api/onAft'
import { bend } from '../hydra-api/bend'
import { onBend } from '../hydra-api/onBend'
import {
  CCEventContext,
  ChannelArg,
  IndexArg,
  InputArg,
  NoteArg,
  NoteEventContext,
  AftEventContext,
  BendEventContext,
} from '../types'

/**
 * Channel is chainable to `midi` and `input()` and provides a channel for all
 * the functions that are chained to it.
 * @example osc(midi.channel(4).note(60)).out()
 * @example osc(midi.input('my keyboard').channel('*').note(60)).out()
 */
export const channel = (channel: ChannelArg, input?: InputArg) => ({
  note: (_note?: NoteArg, _channel?: ChannelArg, _input?: InputArg) =>
    note(_note, _channel ?? channel, _input ?? input),

  cc: (_index?: number, _channel?: ChannelArg, _input?: InputArg) =>
    cc(_index, _channel ?? channel, _input ?? input),

  aft: (_note?: NoteArg, _channel?: ChannelArg, _input?: InputArg) =>
    aft(_note, _channel ?? channel, _input ?? input),

  bend: (_channel?: ChannelArg, _input?: InputArg) =>
    bend(_channel ?? channel, _input ?? input),

  onNote: (_note: NoteArg, _event: (context: NoteEventContext) => void) =>
    onNote(_note, channel, input ?? '*', _event),

  onCC: (_index: IndexArg, _event: (context: CCEventContext) => void) =>
    onCC(_index, channel, input ?? '*', _event),

  onAft: (_note: NoteArg, _event: (context: AftEventContext) => void) =>
    onAft(_note, channel, input ?? '*', _event),

  onBend: (_event: (context: BendEventContext) => void) =>
    onBend(channel, input ?? '*', _event),
})
