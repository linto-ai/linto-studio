<template>
  <div class="sidebar__section flex col flex1">
    <h2>{{ $t("conversation.keyword_list.title") }}</h2>
    <div class="flex row gap-medium flex1 wrap-start" v-if="state == 'done'">
      <Keyword
        v-for="keyword in keywords"
        :key="keyword._id"
        :value="keyword.name"></Keyword>
    </div>
    <div v-else-if="state == 'error'" class="flex col gap-small">
      <div>{{ $t("conversation.keyword_list.error.description") }}</div>
      <button @click="generateKeywords">
        {{ $t("conversation.keyword_list.error.button") }}
      </button>
    </div>
    <div v-else-if="!state">
      <button @click="generateKeywords">
        {{ $t("conversation.keyword_list.none.button") }}
      </button>
    </div>
    <div v-else class="flex col align-center gap-small">
      <div>{{ $t("conversation.keyword_list.loading.description") }}</div>
      <div class="flex justify-center"><span class="icon loading" /></div>
    </div>
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
import Keyword from "./Keyword.vue"
import { workerSendMessage } from "../tools/worker-message.js"

export default {
  props: {
    conversation: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      state: this.conversation?.jobs?.nlp?.keyword?.state,
      keywords: [],
    }
  },
  mounted() {
    this.computeKeywords()
    bus.$on("refresh_keywords", () => {
      this.computeKeywords()
      this.state = this.conversation?.jobs?.nlp?.keyword?.state
    })
  },
  beforeDestroy() {
    bus.$off("refresh_keywords")
  },
  methods: {
    generateKeywords() {
      workerSendMessage("fetch_keywords", {
        conversation_id: this.conversation.id,
      })
    },
    computeKeywords() {
      this.keywords =
        this.conversation.keywords.find((cat) => cat.name === "keyword")
          ?.tags || []
    },
  },
  components: { Fragment, Keyword },
}
</script>
