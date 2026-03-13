import type { Channel } from "../../types/editor"

export function findChannel(channels: Channel[], id: string): Channel {
  return channels.find((c) => c.id === id) ?? channels[0]!
}
