import type { CCValues, Defaults } from './types'

const ccValues: CCValues = new Map(
  JSON.parse(sessionStorage.getItem('hydra-midi_ccValues') || '[]')
)

// Monkey-patch `ccValues.set` to make a kind of proxy.
const { set } = ccValues
ccValues.set = function (key: string, value: number) {
  sessionStorage.setItem('hydra-midi_ccValues', JSON.stringify([...ccValues]))
  return set.apply(this, [key, value])
}

export default {
  ccValues,

  playingNotes: new Map<string, number>(),

  noteOnEvents: new Map<string, Function>(),

  initialDefaults: {
    channel: 0,
    input: 0,
    adsr: [100, 100, 1, 100],
  } as Defaults,

  defaults: {
    channel: 0,
    input: 0,
    adsr: [100, 100, 1, 100],
  } as Defaults,
}
