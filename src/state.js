const ccValues = JSON.parse(
  sessionStorage.getItem('hydra-midi_ccValues') || '{}'
)

const ccValuesHandler = {
  set() {
    sessionStorage.setItem('hydra-midi_ccValues', JSON.stringify(ccValues))
    return Reflect.set(...arguments)
  },
}

export default {
  /** @type {Record<string, number>} */
  ccValues: new Proxy(ccValues, ccValuesHandler),

  /** @type {Map<string, number>} */
  playingNotes: new Map(),

  /** @type {Record<string, function>} */
  noteOnEvents: {},

  initialDefaults: {
    channel: 0,
    input: 0,
    adsr: [100, 100, 1, 100]
  },

  defaults: {
    channel: 0,
    input: 0,
    adsr: [100, 100, 1, 100]
  }
}
