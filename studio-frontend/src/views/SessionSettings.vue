<template>
  <MainContent noBreadcrumb :organizationPage="false" box>
    <template v-slot:breadcrumb-actions>
      <router-link :to="sessionListRoute" class="btn secondary">
        <span class="icon close"></span>
        <span class="label">{{
          $t("session.detail_page.back_to_listing")
        }}</span>
      </router-link>
      <div class="flex1 center-text" v-if="isPending">
        <span class="icon clock"></span>
        <span>{{ $t("session.detail_page.sessions_status.no_started") }}</span>
      </div>
      <router-link :to="settingsRoute" class="btn" v-if="isPending">
        <span class="label">{{ $t("session.detail_page.start_button") }}</span>
      </router-link>
    </template>

    <div class="flex1 medium-padding">
      <h1 class="center-text">{{ name }}</h1>

      <section>
        <h2>{{ $t("session.settings_page.global_informations_title") }}</h2>
        <LabeledValue
          :label="$t('session.settings_page.start_time_label')"
          :value="startTime"></LabeledValue>
        <FormCheckbox
          :field="fieldAutoStart"
          v-model="fieldAutoStart.value"
          :disabled="isStarted"></FormCheckbox>
        <LabeledValue
          :label="$t('session.settings_page.end_time_label')"
          :value="endTime"></LabeledValue>
        <FormInput :field="fieldPublicLink">
          <template v-slot:content-after-input>
            <button class="btn" @click="copyPublicLink">
              <span class="icon copy"></span>
              <span class="label">{{
                $t("session.settings_page.copy_link_button")
              }}</span>
            </button>
          </template>
        </FormInput>
        <FormCheckbox
          :field="fieldIsPublic"
          v-model="fieldIsPublic.value"
          :disabled="isStarted"></FormCheckbox>
      </section>
      <section>
        <h2>{{ $t("session.settings_page.channels_list_title") }}</h2>
        <SessionChannelsTable
          v-if="channels.length > 0"
          from="sessionSettings"
          :channelsList="channels"
          @removeChannel="removeChannel"></SessionChannelsTable>
      </section>
    </div>
  </MainContent>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"

import { sessionMixin } from "@/mixins/session.js"

import MainContent from "@/components/MainContent.vue"
import SessionNotStarted from "../components/SessionNotStarted.vue"
import LabeledValue from "../components/LabeledValue.vue"
import FormInput from "../components/FormInput.vue"
import FormCheckbox from "../components/FormCheckbox.vue"
import SessionChannelsTable from "../components/SessionChannelsTable.vue"

export default {
  mixins: [sessionMixin],
  props: {},
  data() {
    return {
      fieldAutoStart: {
        value: this.autoStart,
        error: null,
        valid: false,
        label: this.$t("session.settings_page.autoStart_label"),
      },
      fieldPublicLink: {
        value: this.publicLink,
        error: null,
        valid: false,
        readOnly: true,
        label: this.$t("session.settings_page.publicLink_label"),
      },
      fieldIsPublic: {
        value: this.isPublic,
        error: null,
        valid: false,
        label: this.$t("session.settings_page.isPublic_label"),
      },
    }
  },
  created() {
    // if not started, redirect to home
  },
  mounted() {},
  methods: {
    copyPublicLink() {
      navigator.clipboard.writeText(this.publicLink)
    },
  },
  components: {
    Fragment,
    MainContent,
    SessionNotStarted,
    LabeledValue,
    FormInput,
    FormCheckbox,
    SessionChannelsTable,
  },
}
</script>
