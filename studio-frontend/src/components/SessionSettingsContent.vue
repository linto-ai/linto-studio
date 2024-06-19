<template>
  <div class="flex1 medium-padding">
    <h1 class="center-text">{{ name }}</h1>
    <section>
      <h2>{{ $t("session.settings_page.global_informations_title") }}</h2>
      <div class="flex">
        <div class="flex1">
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
        </div>
        <div>
          <!-- it's not a vueJS component, it's a webcomponent. Code is imported in index.html -->
          <qr-code :contents="publicLink"></qr-code>
        </div>
      </div>
    </section>
    <section>
      <h2>{{ $t("session.settings_page.channels_list_title") }}</h2>
      <SessionChannelsTable
        v-if="channels.length > 0"
        from="sessionSettings"
        :channelsList="channels"></SessionChannelsTable>
    </section>
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"

import { sessionModelMixin } from "@/mixins/sessionModel.js"

import MainContent from "@/components/MainContent.vue"
import SessionNotStarted from "@/components/SessionNotStarted.vue"
import LabeledValue from "@/components/LabeledValue.vue"
import FormInput from "@/components/FormInput.vue"
import FormCheckbox from "@/components/FormCheckbox.vue"
import SessionChannelsTable from "@/components/SessionChannelsTable.vue"

export default {
  mixins: [sessionModelMixin],
  props: {
    session: { type: Object, required: true },
  },
  data() {
    console.log(this.name)
    return {
      fieldAutoStart: {
        value: null, // computed property cannot be used here so fields are initialized in mounted
        error: null,
        valid: false,
        label: this.$t("session.settings_page.autoStart_label"),
      },
      fieldPublicLink: {
        value: null,
        error: null,
        valid: false,
        readOnly: true,
        label: this.$t("session.settings_page.publicLink_label"),
      },
      fieldIsPublic: {
        value: null,
        error: null,
        valid: false,
        label: this.$t("session.settings_page.isPublic_label"),
      },
    }
  },
  created() {
    // if not started, redirect to home
  },
  mounted() {
    this.fieldAutoStart.value = this.autoStart
    this.fieldPublicLink.value = this.publicLink
    this.fieldIsPublic.value = this.isPublic
  },
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
