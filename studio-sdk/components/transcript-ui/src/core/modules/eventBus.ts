type EventHandler<EventMap, K extends keyof EventMap> = (
  payload: EventMap[K],
) => void
type AnyHandler = (payload: never) => void

export function createEventBus<EventMap>() {
  const listeners = new Map<keyof EventMap, Set<AnyHandler>>()

  function on<K extends keyof EventMap>(
    event: K,
    handler: EventHandler<EventMap, K>,
  ): () => void {
    let set = listeners.get(event)
    if (!set) {
      set = new Set()
      listeners.set(event, set)
    }
    set.add(handler as AnyHandler)
    return () => off(event, handler)
  }

  function off<K extends keyof EventMap>(
    event: K,
    handler: EventHandler<EventMap, K>,
  ): void {
    listeners.get(event)?.delete(handler as AnyHandler)
  }

  function emit<K extends keyof EventMap>(
    event: K,
    payload: EventMap[K],
  ): void {
    listeners.get(event)?.forEach((h) =>
      (h as EventHandler<EventMap, K>)(payload),
    )
  }

  function clear(): void {
    listeners.clear()
  }

  return { on, off, emit, clear }
}
