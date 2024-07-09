<template>
  <MainContent sidebar box>
    <template v-slot:breadcrumb-actions> </template>

    <div class="flex col">
      <Tabs v-model="currentTab" :tabs="tabs" squareTabs />

      <form
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
          class="flex col gap-small align-top align-end"
          style="margin-top: 1rem">
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
      <!-- <ConversationCreateTabFile
        v-if="currentTab === 'file'"
        :userInfo="userInfo"
        :currentOrganizationScope="currentOrganizationScope"
        :userOrganizations="userOrganizations" />

      <ConversationCreateMicro
        v-if="currentTab === 'microphone'"
        :userInfo="userInfo"
        :currentOrganizationScope="currentOrganizationScope"
        :userOrganizations="userOrganizations" /> -->
    </div>
  </MainContent>
</template>
<script>
import debounce from "debounce"

import { bus } from "@/main.js"
import { apiGetTranscriptionService } from "@/api/service"
import { apiCreateConversation } from "@/api/conversation"
import { getUserRoleInOrganization } from "@/tools/getUserRoleInOrganization"
import { testFieldEmpty } from "@/tools/fields/testEmpty.js"
import { testService } from "@/tools/fields/testService.js"

import { formsMixin } from "@/mixins/forms.js"
import { debounceMixin } from "@/mixins/debounce"
import ConversationCreateMixin from "@/mixins/conversationCreate.js"

import ConversationCreateAudio from "@/components/ConversationCreateAudio.vue"
import ConversationCreateServices from "@/components/ConversationCreateServices.vue"
import MainContent from "@/components/MainContent.vue"

import RIGHTS_LIST from "@/const/rigthsList"
import EMPTY_FIELD from "@/const/emptyField"
import Checkbox from "../components/Checkbox.vue"
import Tabs from "../components/Tabs.vue"
import ConversationCreateTabFile from "../components/ConversationCreateTabFile.vue"
import ConversationCreateMicro from "../components/ConversationCreateTabMicro.vue"
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
    ConversationCreateTabFile,
    ConversationCreateMicro,
  },
}
</script>
