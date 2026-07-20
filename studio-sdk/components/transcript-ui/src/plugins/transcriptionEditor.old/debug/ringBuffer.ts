/** Fixed-capacity FIFO buffer. Once full, each push drops the oldest entry. */
export class RingBuffer<T> {
  private readonly items: T[] = []
  private start = 0
  private readonly capacity: number

  constructor(capacity: number) {
    this.capacity = capacity
  }

  push(item: T): void {
    if (this.items.length < this.capacity) {
      this.items.push(item)
      return
    }
    this.items[this.start] = item
    this.start = (this.start + 1) % this.capacity
  }

  /** Entries in insertion order (oldest first). */
  toArray(): T[] {
    return [...this.items.slice(this.start), ...this.items.slice(0, this.start)]
  }

  clear(): void {
    this.items.length = 0
    this.start = 0
  }
}
