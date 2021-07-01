import { map } from './utils'

export const scale = fn => factor => (...args) => fn(...args) * factor

export const range = fn => (min = 0, max = 1) => (...args) =>
  map(fn(...args), 0, 1, min, max)
