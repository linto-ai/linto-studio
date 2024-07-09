<template>
  <form
    class="flex col flex1"
    @submit="createConversation"
    :disabled="formState === 'sending'">
    <ConversationCreateAudio
      :disabled="formState === 'sending'"
      v-model="audioFiles" />

    <section>
      <h2>{{ $t("conversation.transcription_service_title") }}</h2>
      <div class="error-field" v-if="transcriptionService.error">
        {{ transcriptionService.error }}
      </div>
      <div class="form-field flex row">
        <div class="flex col">
          <label class="form-label" for="conversationName">
            {{ $t("conversation.language_label") }}
          </label>
          <select
            :disabled="formState === 'sending'"
            v-model="conversationLanguage.value">
            <option
              v-for="lang of languages"
              :key="lang.value"
              :value="lang.value">
              {{ lang.label }}
            </option>
          </select>
        </div>
      </div>
      <ConversationCreateServices
        :serviceList="transcriptionService.list"
        :disabled="formState === 'sending'"
        :loading="transcriptionService.loading"
        v-model="transcriptionService.value" />
    </section>

    <div class="flex col gap-small align-top" style="margin-top: 1rem">
      <div class="error-field" v-if="formError">{{ formError }}</div>
      <button
        type="submit"
        class="btn green"
        :disabled="formState === 'sending'">
        <span class="icon apply"></span>
        <span class="label">{{ formSubmitLabel }}</span>
      </button>
    </div>
  </form>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"

import ConversationCreateMixin from "@/mixins/conversationCreate.js"
import ConversationCreateAudio from "./ConversationCreateAudio.vue"
import ConversationCreateServices from "@/components/ConversationCreateServices.vue"

export default {
  mixins: [ConversationCreateMixin],
  props: {},
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  components: { Fragment, ConversationCreateAudio, ConversationCreateServices },
}
</script>
