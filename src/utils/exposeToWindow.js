// @ts-check

/**
 * Expose variables to global window object.
 * @param {object} obj
 * @returns
 */
export const exposeToWindow = obj =>
  Object.entries(obj).forEach(([key, value]) => (window[key] = value))
