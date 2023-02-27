/** Expose variables to global window object. */
export const exposeToWindow = (obj: object) =>
  Object.entries(obj).forEach(([key, value]) => (window[key as any] = value))
