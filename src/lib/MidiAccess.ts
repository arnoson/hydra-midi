import { SimpleEventEmitter } from './SimpleEventEmitter'

interface MidiMessagePayload {
  data: [data1: number, data2: number]
  channel: number
  input: WebMidi.MIDIInput
}

/**
 * A thin wrapper around Web Midi.
 */
export class MidiAccess extends SimpleEventEmitter<number, MidiMessagePayload> {
  static TypeNoteOff = 0x80
  static TypeNoteOn = 0x90
  static TypeAfterTouchPoly = 0xa0
  static TypeControlChange = 0xb0
  static TypeProgramChange = 0xc0
  static TypeAfterTouchChannel = 0xd0
  static TypePitchBend = 0xe0
  static TypeSystemExclusive = 0xf0
  static TypeTimeCodeQuarterFrame = 0xf1
  static TypeSongPosition = 0xf2
  static TypeSongSelect = 0xf3
  static TypeTuneRequest = 0xf6
  static TypeClock = 0xf8
  static TypeStart = 0xfa
  static TypeContinue = 0xfb
  static TypeStop = 0xfc
  static TypeActiveSensing = 0xfe
  static TypeSystemReset = 0xff

  enabled = false
  isSetup = false
  access: WebMidi.MIDIAccess | undefined

  static parseMessage(
    message: WebMidi.MIDIMessageEvent,
  ): { type: number } & Omit<MidiMessagePayload, 'input'> {
    const [status, data1, data2] = message.data
    const type = status & 0xf0
    const channel = status & 0x0f
    return { type, channel, data: [data1, data2] }
  }

  async setup() {
    this.access = await navigator.requestMIDIAccess()

    for (const input of this.access.inputs.values()) {
      input.open()
    }
    const handleMessage = this.handleMessage.bind(this)

    this.access.addEventListener('statechange', ({ port }) => {
      if (port.state === 'connected') {
        const input = this.access?.inputs.get(port.id)
        input?.addEventListener('midimessage', handleMessage)
      }
    })

    this.isSetup = true
  }

  async start() {
    if (!this.isSetup) await this.setup()
    this.enabled = true
  }

  pause() {
    this.enabled = false
  }

  getInputByIndex(index: number) {
    return this.access && [...this.access.inputs.values()][index]
  }

  getInputByName(name: string) {
    return (
      this.access &&
      [...this.access.inputs.values()].find(input => input.name === name)
    )
  }

  getInputId(indexOrName: number | string): string | undefined {
    const input =
      typeof indexOrName === 'number'
        ? this.getInputByIndex(indexOrName)
        : this.getInputByName(indexOrName)

    return input?.id
  }

  handleMessage(message: WebMidi.MIDIMessageEvent) {
    if (this.enabled) {
      const { type, data, channel } = MidiAccess.parseMessage(message)
      const input = message.target as WebMidi.MIDIInput
      this.emit(type, { data, channel, input })
    }
  }
}
