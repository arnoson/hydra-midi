import type {
  CCValues,
  Defaults,
  NoteEventContext,
  CCEventContext,
  AftEventContext,
} from './types'

const ccValues: CCValues = new Map(
  JSON.parse(sessionStorage.getItem('hydra-midi_ccValues') || '[]'),
)

const aftValues: CCValues = new Map(
  JSON.parse(sessionStorage.getItem('hydra-midi_aftValues') || '[]'),
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

export default {
  ccValues,
  aftValues,

  playingNotes: new Map<string, number>(),

  noteOnEvents: new Map<string, (context: NoteEventContext) => void>(),

  ccEvents: new Map<string, (context: CCEventContext) => void>(),

  aftEvents: new Map<string, (context: AftEventContext) => void>(),

  defaults: {
    channel: '*',
    input: '*',
    adsr: [100, 100, 1, 100],
  } as Defaults,
}
