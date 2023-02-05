export default {
  /** @type {Record<string, number>} */
  ccValues: {},

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
