import { transformValue } from './utils'

export const ccValues = Array(128).fill(0.5)

export const _cc = (index, options) => transformValue(ccValues[index], options)

export const cc = (index, options) => () => _cc(index, options)
