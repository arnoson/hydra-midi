import type { CCValues, Defaults } from './types'

const ccValues: CCValues = JSON.parse(
  sessionStorage.getItem('hydra-midi_ccValues') || '{}'
)

const ccValuesHandler: ProxyHandler<CCValues> = {
  set(...args) {
    sessionStorage.setItem('hydra-midi_ccValues', JSON.stringify(ccValues))
    return Reflect.set(...args)
  },
}

export default {
  ccValues: new Proxy<CCValues>(ccValues, ccValuesHandler),

  playingNotes: new Map<string, number>(),

  noteOnEvents: {} as Record<string, Function>,

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
