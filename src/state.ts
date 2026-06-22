import type {
  CCValues,
  Defaults,
  NoteEventContext,
  CCEventContext,
  AftEventContext,
  BendEventContext,
} from './types'

const ccValues: CCValues = new Map(
  JSON.parse(sessionStorage.getItem('hydra-midi_ccValues') || '[]'),
)

const aftValues: CCValues = new Map(
  JSON.parse(sessionStorage.getItem('hydra-midi_aftValues') || '[]'),
)

const bendValues: CCValues = new Map(
  JSON.parse(sessionStorage.getItem('hydra-midi_bendValues') || '[]'),
)

// Monkey-patch `ccValues.set` to make a kind of proxy.
const { set } = ccValues
ccValues.set = function (key: string, value: number) {
  const result = set.apply(this, [key, value])
  sessionStorage.setItem('hydra-midi_ccValues', JSON.stringify([...ccValues]))
  return result
}

// Monkey-patch `aftValues.set` to make a kind of proxy.
const { set: setAft } = aftValues
aftValues.set = function (key: string, value: number) {
  const result = setAft.apply(this, [key, value])
  sessionStorage.setItem('hydra-midi_aftValues', JSON.stringify([...aftValues]))
  return result
}

// Monkey-patch `bendValues.set` to make a kind of proxy.
const { set: setBend } = bendValues
bendValues.set = function (key: string, value: number) {
  const result = setBend.apply(this, [key, value])
  sessionStorage.setItem('hydra-midi_bendValues', JSON.stringify([...bendValues]))
  return result
}

export default {
  ccValues,
  aftValues,
  bendValues,

  playingNotes: new Map<string, number>(),

  noteOnEvents: new Map<string, (context: NoteEventContext) => void>(),

  ccEvents: new Map<string, (context: CCEventContext) => void>(),

  aftEvents: new Map<string, (context: AftEventContext) => void>(),

  bendEvents: new Map<string, (context: BendEventContext) => void>(),

  defaults: {
    channel: '*',
    input: '*',
    adsr: [100, 100, 1, 100],
  } as Defaults,
}
