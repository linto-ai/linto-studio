import { createCore } from "../../createCore"
import type { Core } from "../../types"
import type { Turn } from "../../../types/editor"

function makeTurn(id: string, speakerId: string | null): Turn {
  return { id, speakerId, text: `text of ${id}`, words: [], language: "fr" }
}

/** A core with one channel, one source translation, three turns and two
 *  speakers — the minimal document the speaker helpers operate on. */
export function makeTestCore(): Core {
  const core = createCore()
  core.setDocument({
    title: "test",
    speakers: new Map([
      ["spk-1", { id: "spk-1", name: "Marie", color: "#111111" }],
      ["spk-2", { id: "spk-2", name: "Thomas", color: "#222222" }],
    ]),
    channels: [
      {
        id: "ch-1",
        name: "channel 1",
        duration: 60,
        translations: [
          {
            id: "tr-1",
            languages: ["fr"],
            isSource: true,
            turns: [
              makeTurn("turn-1", "spk-1"),
              makeTurn("turn-2", "spk-2"),
              makeTurn("turn-3", "spk-1"),
            ],
          },
        ],
      },
    ],
  })
  return core
}
