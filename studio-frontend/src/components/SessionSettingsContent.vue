<template>
  <div class="flex1 medium-padding">
    <h1 class="center-text">{{ name }}</h1>
    <div class="flex">
      <div class="flex1">
        <!-- General informations -->
        <section>
          <h2>{{ $t("session.settings_page.global_informations_title") }}</h2>
          <FormInput :field="fieldPublicLink">
            <template v-slot:content-after-input>
              <button class="btn" @click="copyPublicLink">
                <span class="icon apply" v-if="linkHasBeenCopied"></span>
                <span class="icon copy" v-else></span>
                <span class="label" v-if="linkHasBeenCopied">{{
                  $t("session.settings_page.copy_link_button_done")
                }}</span>
                <span class="label" v-else>{{
                  $t("session.settings_page.copy_link_button")
                }}</span>
              </button>
            </template>
          </FormInput>
          <FormCheckbox
            :field="fieldIsPublic"
            v-model="fieldIsPublic.value"
            :disabled="isActive"></FormCheckbox>
        </section>

        <!-- Auto start and datetime-->
        <section>
          <h2>{{ $t("session.settings_page.time_informations_title") }}</h2>
          <div v-if="isStarted">
            {{ $t("session.detail_page.session_already_started") }}
          </div>
          <div v-else>
            {{ $t("session.detail_page.session_auto_start_helper") }}
          </div>
          <AppointmentSelector
            :readonly="isStarted"
            :field="fieldAppointment"
            v-bind:error.sync="fieldAppointment.error"
            v-model="fieldAppointment.value" />
          <!-- <div class="flex gap-medium align-center medium-margin-top">
            <FormCheckbox
              :field="fieldAutoStart"
              v-model="fieldAutoStart.value"
              :disabled="isStarted"></FormCheckbox>
            <FormCheckbox
              :field="fieldAutoStop"
              v-model="fieldAutoStop.value"
              :disabled="isStarted"></FormCheckbox>
            <div></div>
          </div> -->
        </section>
      </div>
      <div class="flex col gap-medium">
        <!-- it's not a vueJS component, it's a webcomponent. Code is imported in index.html -->

        <div class="flex col gap-medium">
          <!-- <button
            class="btn flex1"
            v-if="isPending"
            @click="startSession"
            :disabled="isStarting">
            <span class="icon play"></span>
            <span class="label">{{
              $t("session.detail_page.start_button")
            }}</span>
          </button> -->

          <button
            class="btn flex1"
            v-if="isStarted"
            @click="stopSession"
            :disabled="isStoping">
            <span class="icon stop"></span>
            <span class="label">{{
              $t("session.detail_page.stop_button")
            }}</span>
          </button>

          <button
            class="btn red-border flex1"
            :disabled="isDeleting"
            @click="openModalDeleteSession">
            <span class="icon trash"></span>
            <span class="label">{{
              $t("session.detail_page.delete_button")
            }}</span>
          </button>
        </div>

        <qr-code :contents="publicLink"></qr-code>
      </div>
    </div>

    <!-- Channels list -->
    <section>
      <h2>{{ $t("session.settings_page.channels_list_title") }}</h2>
      <div class="overflow-horizontal-auto">
        <SessionChannelsTable
          v-if="channels.length > 0"
          from="sessionSettings"
          @updateName="updateChannelName"
          :channelsList="localChannels"></SessionChannelsTable>
      </div>
    </section>

    <!-- Save bottom bar -->
    <div
      class="flex gap-medium conversation-create-footer align-center"
      v-if="hasChanged">
      <div class="flex1 small-padding-left">Session has been modified</div>
      <button class="btn secondary" @click="resetSession">
        <span class="label">Reset</span>
      </button>

      <button @click="updateSession" class="btn green">
        <span class="icon apply"></span>
        <span class="label">Sauvegarder</span>
      </button>
    </div>

    <ModalDeleteSession
      v-if="showModalDeleteSession"
      @on-close="closeModalDeleteSession"
      @on-confirm="deleteSession" />
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
import EMPTY_FIELD from "@/const/emptyField"

import { sessionMixin } from "@/mixins/session.js"
import { formsMixin } from "@/mixins/forms.js"

import { apiUpdateSession } from "@/api/session.js"

import MainContent from "@/components/MainContent.vue"
import SessionNotStarted from "@/components/SessionNotStarted.vue"
import LabeledValue from "@/components/LabeledValue.vue"
import FormInput from "@/components/FormInput.vue"
import FormCheckbox from "@/components/FormCheckbox.vue"
import SessionChannelsTable from "@/components/SessionChannelsTable.vue"
import AppointmentSelector from "@/components/AppointmentSelector.vue"
import ModalDeleteSession from "../components/ModalDeleteSession.vue"

export default {
  mixins: [sessionMixin, formsMixin],
  props: {
    session: { type: Object, required: true },
  },
  data() {
    return {
      fields: [
        "name",
        "fieldIsPublic",
        "fieldAppointment",
        "fieldAutoStop",
        "fieldAutoStart",
      ],
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
      fieldAppointment: {
        ...EMPTY_FIELD,
        value: [null, null], // startDateTime, endDateTime
        label: this.$t("session.create_page.appointment_label"),
      },
      fieldAutoStop: {
        value: null, // computed property cannot be used here so fields are initialized in mounted
        error: null,
        valid: false,
        label: this.$t("session.settings_page.autoStop_label"),
      },
      fieldAutoStart: {
        value: null, // computed property cannot be used here so fields are initialized in mounted
        error: null,
        valid: false,
        label: this.$t("session.settings_page.autoStart_label"),
      },
      linkHasBeenCopied: false,
      showModalDeleteSession: false,
      formState: "idle",
      localChannels: structuredClone(this.session.channels),
      channelsHasChanged: false,
    }
  },
  created() {
    // if not started, redirect to home
  },
  mounted() {
    this.initValues()
  },
  watch: {},
  computed: {
    hasChanged() {
      const publicChanged = this.fieldIsPublic.value !== this.isPublic
      const autoStartChanged = this.fieldAutoStart.value !== this.autoStart
      const autoStopChanged = this.fieldAutoStop.value !== this.autoStop
      const startDateChanged =
        new Date(this.fieldAppointment.value[0]).getTime() !==
        new Date(this.startTime).getTime()
      const stopDateChanged =
        new Date(this.fieldAppointment.value[1]).getTime() !==
        new Date(this.endTime).getTime()

      return (
        publicChanged ||
        autoStartChanged ||
        autoStopChanged ||
        startDateChanged ||
        stopDateChanged ||
        this.channelsHasChanged
      )
    },
  },
  methods: {
    initValues() {
      this.fieldAutoStart.value = this.autoStart
      this.fieldAutoStop.value = this.autoStop
      this.fieldPublicLink.value = this.publicLink
      this.fieldIsPublic.value = this.isPublic

      this.fieldAppointment.value = [this.startTime, this.endTime]
    },
    updateChannelName(index, value) {
      this.localChannels[index].name = value
      this.channelsHasChanged = true
    },
    openModalDeleteSession() {
      this.showModalDeleteSession = true
    },
    closeModalDeleteSession() {
      this.showModalDeleteSession = false
    },
    copyPublicLink() {
      navigator.clipboard.writeText(this.publicLink)
      this.linkHasBeenCopied = true
      setTimeout(() => {
        try {
          this.linkHasBeenCopied = false
        } catch (error) {}
      }, 2000)
    },
    resetSession() {
      this.initValues()
    },
    async updateSession() {
      this.formState = "sending"
      const startDateTime = this.fieldAppointment.value[0]
        ? this.fieldAppointment.value[0].toISOString()
        : null

      const endDateTime = this.fieldAppointment.value[1]
        ? this.fieldAppointment.value[1].toISOString()
        : null

      if (this.testFields()) {
        let newValues = {
          ...this.session,
          startTime: startDateTime,
          endTime: endDateTime,
          autoStart: this.fieldAutoStart.value,
          autoStop: this.fieldAutoStop.value,
          visibility: this.fieldIsPublic.value ? "public" : "organization",
          channels: this.localChannels,
        }

        const res = await apiUpdateSession(
          this.currentOrganizationScope,
          this.session.id,
          newValues,
        )

        if (res.status == "success") {
          bus.$emit("app_notif", {
            status: "success",
            message: this.$i18n.t("session.settings_page.success_message"),
            redirect: false,
          })
          this.$emit("session_update", res.data)
        } else {
          bus.$emit("app_notif", {
            status: "error",
            message: this.$i18n.t("session.settings_page.error_update_message"),
            redirect: false,
          })
          this.formState = "error"
        }
      } else {
        this.formState = "error"
      }
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
    AppointmentSelector,
    ModalDeleteSession,
  },
}
</script>
