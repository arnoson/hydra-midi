export default {
  /** @type {Record<string, number>} */
  ccValues: {},

  /** @type {Set<string>} */
  playingNotes: new Set(),

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
