import { map } from './map'

export const transformValue = (value, options = {}) => {
  const min = options.min ?? 0
  const max = options.max ?? options.scale ?? 1
  return map(value, 0, 1, min, max)
}
