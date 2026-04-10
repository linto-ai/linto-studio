<template>
  <LayoutV2 :fullscreen="isMobile && !isAuthenticated">
    <linto-editor ref="editor" :locale="$i18n.locale" no-header />
  </LayoutV2>
</template>
<script>
import { markRaw } from "vue"

import { getCookie } from "@/tools/getCookie"
import { getEnv } from "@/tools/getEnv"

import { apiGetConversationById } from "@/api/conversation.js"

import { createTranscriptionEditorPlugin } from "@linto/transcript-ui/webcomponent"
import LayoutV2 from "@/layouts/v2-layout.vue"

export default {
  components: { LayoutV2 },
  props: {
    userInfo: { type: Object, required: true },
  },
  data() {
    return {
      conversationId: this.$route.params.conversationId,
      core: null,
    }
  },
  async mounted() {
    const doc = await this.createDoc()
    await this.initEditor(doc)
  },
  methods: {
    async getCanonicalConv(convId) {
      const conversation = await apiGetConversationById(convId, {
        text: 0,
        type: 1,
        _id: 1,
      })

      let canonicalConversation

      if (conversation.type.mode != "canonical") {
        canonicalConversation = await apiGetConversationById(
          conversation.type.from_canonical_id,
          { text: 0, type: 1, _id: 1 },
        )
      } else {
        canonicalConversation = conversation
      }

      return canonicalConversation
    },
    async createDoc() {
      const canonical = await this.getCanonicalConv(this.conversationId)
      console.log(canonical)
      // one channel, no translations
      if (canonical.type.child_conversations.length === 0) {
        return {
          title: canonical.name,
          speakers: new Map(),
          channels: [
            {
              id: canonical._id,
              name: canonical.name,
              duration: canonical?.metadata?.audio?.duration,
              translations: [
                {
                  id: canonical._id,
                  isSource: true,
                  audio: canonical?.metadata?.audio?.filename,
                  languages: [canonical.locale],
                  turns: [],
                },
              ],
            },
          ],
        }
      } else {
        // TODO
      }
    },
    async initEditor(doc) {
      const el = this.$refs.editor
      const { core } = el
      const ws_url = new URL(getEnv("VUE_APP_CONVO_API"))
      ws_url.protocol = "ws"
      this.core = markRaw(core)

      core.use(
        createTranscriptionEditorPlugin({
          collab: {
            url: `ws://localhost:8001/ws/editor`,
            token: getCookie("authToken"),
          },
          user: { name: "test", color: "#E57373" },
        }),
      )

      core.setDocument(doc)
    },
  },
}
</script>

<style lang="scss" scoped></style>
