import type {
  CCValues,
  Defaults,
  NoteEventContext,
  CcEventContext,
} from './types'

const ccValues: CCValues = new Map(
  JSON.parse(sessionStorage.getItem('hydra-midi_ccValues') || '[]'),
)

// Monkey-patch `ccValues.set` to make a kind of proxy.
const { set } = ccValues
ccValues.set = function (key: string, value: number) {
  const result = set.apply(this, [key, value])
  sessionStorage.setItem('hydra-midi_ccValues', JSON.stringify([...ccValues]))
  return result
}

export default {
  ccValues,

  playingNotes: new Map<string, number>(),

  noteOnEvents: new Map<string, (context: NoteEventContext) => void>(),

  ccEvents: new Map<string, (context: CcEventContext) => void>(),

  defaults: {
    channel: '*',
    input: '*',
    adsr: [100, 100, 1, 100],
  } as Defaults,
}
