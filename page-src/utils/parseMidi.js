export const midiTypes = {
  NoteOff: 0x80,
  NoteOn: 0x90,
  AfterTouchPoly: 0xa0,
  ControlChange: 0xb0,
  ProgramChange: 0xc0,
  AfterTouchChannel: 0xd0,
  PitchBend: 0xe0,
  SystemExclusive: 0xf0,
  TimeCodeQuarterFrame: 0xf1,
  SongPosition: 0xf2,
  SongSelect: 0xf3,
  TuneRequest: 0xf6,
  Clock: 0xf8,
  Start: 0xfa,
  Continue: 0xfb,
  Stop: 0xfc,
  ActiveSensing: 0xfe,
  SystemReset: 0xff
}

export const parseMidi = message => {
  const [status, data1, data2] = message.data
  const type = status & 0xf0
  const channel = status & 0x0f
  return { type, channel, data: [data1, data2] }
}
