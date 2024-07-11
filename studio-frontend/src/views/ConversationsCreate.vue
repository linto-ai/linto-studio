<template>
  <MainContent sidebar box>
    <template v-slot:breadcrumb-actions> </template>

    <div class="flex col">
      <Tabs
        v-model="currentTab"
        :tabs="tabs"
        squareTabs
        :disabled="formState === 'sending'" />

      <form
        v-if="currentTab !== 'session'"
        class="flex col flex1"
        @submit="createConversation"
        :disabled="formState === 'sending'">
        <ConversationCreateAudio
          v-if="currentTab === 'file'"
          mode="file"
          :disabled="formState === 'sending'"
          v-model="audioFiles" />

        <ConversationCreateAudio
          v-if="currentTab === 'microphone'"
          mode="microphone"
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

        <div
          class="flex gap-small align-center conversation-create-footer"
          style="margin-top: 1rem">
          <div class="error-field flex1" v-if="formError">{{ formError }}</div>
          <div v-else class="flex1"></div>
          <button
            type="submit"
            class="btn green"
            :disabled="formState === 'sending'">
            <span class="icon apply"></span>
            <span class="label">{{ formSubmitLabel }}</span>
          </button>
        </div>
      </form>

      <SessionCreateContent
        v-if="currentTab === 'session'"
        :currentOrganizationScope="currentOrganizationScope" />
    </div>
  </MainContent>
</template>
<script>
import ConversationCreateMixin from "@/mixins/conversationCreate.js"

import ConversationCreateAudio from "@/components/ConversationCreateAudio.vue"
import ConversationCreateServices from "@/components/ConversationCreateServices.vue"
import MainContent from "@/components/MainContent.vue"

import Checkbox from "@/components/Checkbox.vue"
import Tabs from "@/components/Tabs.vue"
import SessionCreateContent from "@/components/SessionCreateContent.vue"

export default {
  mixins: [ConversationCreateMixin],
  props: {
    userInfo: {
      type: Object,
      required: true,
    },
    currentOrganizationScope: {
      type: String,
      required: true,
    },
    userOrganizations: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      tabs: [
        {
          name: "file",
          label: this.$i18n.t("conversation_creation.tabs.file"),
          icon: "file-audio",
          img: "/img/We10X-icon-theme/audio-x-generic.svg",
        },
        {
          name: "microphone",
          label: this.$i18n.t("conversation_creation.tabs.microphone"),
          icon: "record",
          img: "/img/We10X-icon-theme/vocal.svg",
        },
        {
          name: "session",
          label: this.$i18n.t("conversation_creation.tabs.session"),
          icon: "session",
          //disabled: true,
        },
        {
          name: "url",
          label: this.$i18n.t("conversation_creation.tabs.url"),
          icon: "link",
          disabled: true,
        },
        {
          name: "visio",
          label: this.$i18n.t("conversation_creation.tabs.visio"),
          icon: "profile",
          img: "/img/We10X-icon-theme/preferences-desktop-accessibility.svg",
          disabled: true,
        },
      ],
      currentTab: "file",
    }
  },
  async created() {},
  components: {
    ConversationCreateAudio,
    ConversationCreateServices,
    MainContent,
    Checkbox,
    Tabs,
    SessionCreateContent,
  },
}
</script>
