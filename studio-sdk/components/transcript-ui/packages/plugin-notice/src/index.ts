import { ref } from "vue"
import type { Core, CorePlugin, NoticePluginApi } from "@linto-ai/transcript-ui-core"
import NoticeDialog from "./NoticeDialog.vue"

export type { NoticePluginApi }
export { NoticeDialog }

export interface NoticePluginOptions {
  /** Markdown text shown in the dialog. */
  content: string
}

export function createNoticePlugin(options: NoticePluginOptions): CorePlugin {
  return {
    name: "notice",
    components: { noticeDialog: NoticeDialog },

    install(core: Core) {
      const content = ref(options.content)
      const isOpen = ref(false)

      const api: NoticePluginApi = {
        content,
        isOpen,
        open() {
          isOpen.value = true
        },
        close() {
          isOpen.value = false
        },
      }

      core.notice = api

      return () => {
        isOpen.value = false
        core.notice = undefined
      }
    },
  }
}
