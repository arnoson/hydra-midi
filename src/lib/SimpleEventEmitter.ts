export class SimpleEventEmitter<T, P> {
  listeners = new Map<T, ((payload: P) => any)[]>()

  on(type: T, handler: (payload: P) => any) {
    if (!this.listeners.has(type)) this.listeners.set(type, [])
    this.listeners.get(type)?.push(handler)
  }

  off(type: T, handler: (payload: P) => any) {
    const list = this.listeners.get(type)
    list?.splice(list.indexOf(handler), 1)
  }

  emit(type: T, payload: P) {
    this.listeners.get(type)?.forEach(handler => handler(payload))
  }
}
