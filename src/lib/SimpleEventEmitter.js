// @ts-check

export class SimpleEventEmitter {
  /** @type {Record<any, function[]>} */
  listeners = {}

  /**
   * Add a new event handler.
   * @param {any} type
   * @param {function} handler
   */
  on(type, handler) {
    this.listeners[type] ??= []
    this.listeners[type].push(handler)
  }

  /**
   * Remove an event handler.
   * @param {any} type
   * @param {function} handler
   */
  off(type, handler) {
    this.listeners[type]?.splice(this.listeners[type].indexOf(handler), 1)
  }

  /**
   * Emit an event.
   * @param {any} type
   * @param {any} payload
   */
  emit(type, payload) {
    this.listeners[type]?.forEach(handler => handler(payload))
  }
}
