// @ts-check

/**
 * Generate a new transform that scales the previous value in the function
 * chain.
 * @param {function} fn The previous function
 */
export const scale = fn => factor => (...args) => fn(...args) * factor
