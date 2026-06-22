import state from './state'
import { envelopes } from './transforms/adsr'
import { MidiAccess } from './lib/MidiAccess'
import { logMidiMessage } from './gui'
import { getNoteNumber } from './utils'
import { ChannelArg, IndexArg, InputArg, NoteArg, NoteId } from './types'

// Those properties will never change, only their content, so it's save to
// destructure.
const { ccValues, aftValues, bendValues, playingNotes, noteOnEvents, ccEvents, aftEvents, bendEvents } =
  state

// Expose the `MidiAccess` instance because we need it in other files too.
export const midiAccess = new MidiAccess()

/**
 * Get an id for a midi message using an osc style address. Right now this can
 * either be a note (`data` would be the note number) or a cc message (`data`
 * would be the cc number).
 * @example getMidiId(60, 0, 1) // -> '60/0/1'
 * @returns
 */
export const getMidiId = (
  data: IndexArg = '*',
  channel: ChannelArg = '*',
  input: InputArg = '*',
): NoteId => `${data}/${channel}/${input}`

/**
 * Get all possible wildcard combinations for a midi id ({@link getMidiId}).
 * If we have an id for a midi note like this: '60/0/1' we could use the
 * wildcard '60/0/*' (Note 60 on channel 0 on any input).
 */
export const getMidiWildcards = (
  data1: number,
  data2: number,
  input: string,
) => [
  getMidiId('*', '*', '*'),
  getMidiId(data1, '*', '*'),
  getMidiId('*', data2, '*'),
  getMidiId('*', '*', input),
  getMidiId(data1, data2, '*'),
  getMidiId('*', data2, input),
  getMidiId(data1, '*', input),
]

export const resolveInput = (input: InputArg) =>
  input === '*' ? '*' : midiAccess.getInputId(input)

export const resolveNote = (note: NoteArg) =>
  note === '*' ? note : getNoteNumber(note)

/**
 * For all received midi values we not only save the value for the exact midi id
 * (e.g.: ccValues['74/0/input-0'] = 127) but also all possible wildcards.
 * So for CC 74 this would be:
 * 74 / * / * (CC 74 on any channel and any input)
 * 74 / * / input-0 (CC 74 on any channel on input-0 )
 * ... and so on
 * This might seem a little verbose but this way we can easily poll for values
 * without having to do any additional logic.
 * Listening to CC 74 on channel 0 on any input in hydra: `cc(74, 0, '*')` will
 * internally just look up `ccValues.get('74/0/*')`, which is super fast.
 */

midiAccess.on(MidiAccess.TypeControlChange, ({ data, channel, input }) => {
  const [index, value] = data
  const ccId = getMidiId(index, channel, input.id)
  const normalizedValue = value / 127
  ccValues.set(ccId, normalizedValue)
  ccEvents.get(ccId)?.({ index, value, channel })
  getMidiWildcards(index, channel, input.id).forEach(wildcard => {
    ccValues.set(wildcard, normalizedValue)
    ccEvents.get(wildcard)?.({ index, value, channel })
  })

  logMidiMessage({ input, type: 'cc', channel, data })
})

midiAccess.on(MidiAccess.TypeNoteOn, ({ data, channel, input }) => {
  const [note, velocity] = data
  const noteId = getMidiId(note, channel, input.id)
  playingNotes.set(noteId, velocity)
  envelopes.get(noteId)?.trigger()
  noteOnEvents.get(noteId)?.({ note, velocity, channel })
  getMidiWildcards(note, channel, input.id).forEach(wildcard => {
    playingNotes.set(wildcard, velocity)
    envelopes.get(wildcard)?.trigger()
    noteOnEvents.get(wildcard)?.({ note, velocity, channel })
  })

  logMidiMessage({ input, type: 'on', channel, data })
})

midiAccess.on(MidiAccess.TypeNoteOff, ({ data, channel, input }) => {
  const [note] = data
  const noteId = getMidiId(note, channel, input.id)
  playingNotes.delete(noteId)
  envelopes.get(noteId)?.stop()

  getMidiWildcards(note, channel, input.id).forEach(wildcard => {
    playingNotes.delete(wildcard)
    envelopes.get(wildcard)?.stop()
  })

  logMidiMessage({ input, type: 'off', channel, data })
})

midiAccess.on(MidiAccess.TypePitchBend, ({ input, data, channel }) => {
  const value = ((data[1] << 7) + data[0] - 8192) / 8192
  const displayValue = +value.toFixed(2)
  const normalizedValue = (value + 1) / 2 // Normalize to 0-1 range
  const bendId = getMidiId('*', channel, input.id)
  bendValues.set(bendId, normalizedValue /* TODO: keep the -1 to 1 range */)
  bendEvents.get(bendId)?.({ value, channel })
  getMidiWildcards(-1, channel, input.id).forEach(wildcard => {
    bendValues.set(wildcard, normalizedValue)
    bendEvents.get(wildcard)?.({ value, channel })
  })
  logMidiMessage({ input, type: 'bend', channel, data: [displayValue] })
})

midiAccess.on(MidiAccess.TypeAfterTouchChannel, ({ input, data, channel }) => {
  const value = data[0]
  const aftId = getMidiId('*', channel, input.id)
  const normalizedValue = value / 127
  aftValues.set(aftId, normalizedValue)
  aftEvents.get(aftId)?.({ note: -1, value, channel })
  getMidiWildcards(-1, channel, input.id).forEach(wildcard => {
    aftValues.set(wildcard, normalizedValue)
    aftEvents.get(wildcard)?.({ note: -1, value, channel })
  })

  logMidiMessage({ input, type: 'aft', channel, data })
})

midiAccess.on(MidiAccess.TypeAfterTouchPoly, ({ input, data, channel }) => {
  const [note, value] = data
  const aftId = getMidiId(note, channel, input.id)
  const normalizedValue = value / 127
  aftValues.set(aftId, normalizedValue)
  aftEvents.get(aftId)?.({ note, value, channel })
  getMidiWildcards(note, channel, input.id).forEach(wildcard => {
    aftValues.set(wildcard, normalizedValue)
    aftEvents.get(wildcard)?.({ note, value, channel })
  })

  logMidiMessage({ input, type: 'aft', channel, data })
})
