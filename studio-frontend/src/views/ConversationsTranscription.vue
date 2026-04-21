<template>
  <LayoutV2 :fullscreen="isMobile && !isAuthenticated">
    <linto-editor ref="editor" :locale="$i18n.locale" no-header />
  </LayoutV2>
</template>
<script>
import { markRaw } from "vue"

import { getCookie } from "@/tools/getCookie"
import { getEnv } from "@/tools/getEnv"

import { apiGetConversationAsDoc } from "@/api/conversation.d/apiGetConversationAsDoc.js"

import {
  createTranscriptionEditorPlugin,
  createAudioPlugin,
} from "@linto/transcript-ui/webcomponent"

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
    const doc = await apiGetConversationAsDoc(this.conversationId)
    await this.initEditor(doc)
  },
  methods: {
    async initEditor(doc) {
      const el = this.$refs.editor
      const { core } = el
      const ws_url = new URL(getEnv("VUE_APP_CONVO_API"))
      ws_url.protocol = "ws"
      this.core = markRaw(core)
      core.use(createAudioPlugin())

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

<style scoped>
linto-editor {
  display: block;
  flex: 1;
  min-height: 0;

  /* Map host theme variables to editor tokens */
  --color-primary: var(--primary-color);
  --color-primary-hover: var(--primary-color);
  --color-background: var(--background-app);
  --color-surface: var(--background-primary);
  --color-surface-hover: var(--neutral-20);
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-muted: var(--neutral-60);
  --color-border: var(--neutral-30);
  --color-border-light: var(--neutral-20);
}
</style>
