import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import { ySyncPluginKey } from "@tiptap/y-tiptap"
import type { Core } from "../../../core/types"

export interface PauseOnEditOptions {
  core: Core
}

export const PauseOnEdit = Extension.create<PauseOnEditOptions>({
  name: "pauseOnEdit",

  addProseMirrorPlugins() {
    const { core } = this.options

    return [
      new Plugin({
        key: new PluginKey("pauseOnEdit"),
        filterTransaction(tr) {
          // Pause audio on any local doc mutation. Yjs sync transactions
          // carry the ySyncPluginKey meta — skip them so a remote edit
          // doesn't pause the local listener.
          if (
            tr.docChanged &&
            !tr.getMeta(ySyncPluginKey) &&
            core.audio?.isPlaying.value
          ) {
            core.audio.pause()
          }
          return true
        },
      }),
    ]
  },
})
