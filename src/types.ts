export type CCValues = Map<string, number>

export type MidiMessageType = 'cc' | 'on' | 'off' | 'bend' | 'aft'

export type ChannelArg = number | '*'
export type NoteArg = number | string | '*'
export type InputArg = number | string | '*'
export type IndexArg = number | '*'

export type NoteId = `${NoteArg}/${ChannelArg}/${InputArg}`
export type CCId = `${IndexArg}/${ChannelArg}/${InputArg}`
export type BendId = `${ChannelArg}/${InputArg}`

export interface HydraContext {
  time: number
  bpm: number
  resolution: [width: number, height: number]
  mouse: {
    x: number
    y: number
    enabled: boolean
    mods: { alt: boolean; control: boolean; meta: boolean; shift: boolean }
    buttons: number
    element: HTMLElement
  }
}

export interface NoteEventContext {
  note: number
  velocity: number
  channel: number
}

export interface CCEventContext {
  index: number
  value: number
  channel: number
}

export interface AftEventContext {
  note: number
  value: number
  channel: number
}

export interface BendEventContext {
  value: number
  channel: number
}

export interface Defaults {
  input: InputArg
  channel: ChannelArg
  adsr: [attack: number, decay: number, sustain: number, release: number]
}
