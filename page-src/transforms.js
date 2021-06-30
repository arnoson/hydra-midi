import { map } from './utils'

export const scale = value => factor => () => value() * factor

export const range = value => (min = 0, max = 1) => () =>
  map(value(), 0, 1, min, max)
