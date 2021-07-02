export default {
  /** @type {Record<string, number>} */
  ccValues: {},

  /** @type {Set<string>} */
  playingNotes: new Set(),

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
