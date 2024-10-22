<template>
  <div class="flex row">
    <form
      class="flex col flex1"
      @submit="createSession"
      :disabled="formState === 'sending'">
      <section>
        <h2>{{ $t("session.create_page.main_info_title") }}</h2>
        <FormInput :field="name" v-model="name.value" />
        <AppointmentSelector
          :field="fieldAppointment"
          v-bind:error.sync="fieldAppointment.error"
          v-model="fieldAppointment.value" />

        <FormCheckbox
          :field="fieldIsPublic"
          v-model="fieldIsPublic.value"></FormCheckbox>
      </section>
      <section class="flex col">
        <div>
          <div class="flex row gap-medium">
            <h2 style="width: auto">
              {{ $t("session.channels_list.title") }}
            </h2>
            <button class="btn" @click="addChannel" type="button">
              <span class="icon add"></span>
              <span class="label">{{ $t("session.channels_list.add") }}</span>
            </button>
          </div>
          <div v-if="channelsError" class="error-field">
            {{ channelsError }}
          </div>
        </div>
        <FormCheckbox
          class="medium-margin-top"
          :field="fieldDiarizationEnabled"
          v-model="fieldDiarizationEnabled.value"></FormCheckbox>
        <div class="" style="overflow: auto">
          <SessionChannelsTable
            class="medium-margin-top"
            v-if="channels.length > 0"
            :channelsList="channels"
            @updateName="updateName"
            @removeChannel="removeChannel" />
          <p v-else>{{ $t("session.channels_list.empty") }}</p>
        </div>
      </section>

      <div class="flex gap-small align-center conversation-create-footer">
        <div class="error-field flex1" v-if="formError">{{ formError }}</div>
        <div v-else class="flex1"></div>
        <button
          type="submit"
          class="btn green"
          id="upload-media-button"
          :disabled="formState === 'sending'">
          <span class="icon apply"></span>
          <span class="label">
            {{ $t("session.create_page.submit_button") }}
          </span>
        </button>
      </div>
    </form>
    <ModalAddSessionChannels
      v-if="modalAddChannelsIsOpen"
      v-model="selectedProfiles"
      @on-confirm="confirmAddSessionChannels"
      @on-cancel="closeModalAddSessionChannels" />
  </div>
</template>
<script>
import { bus } from "../main.js"

import { testName } from "@/tools/fields/testName"

import EMPTY_FIELD from "@/const/emptyField"

import { apiCreateSession } from "@/api/session.js"

import { formsMixin } from "@/mixins/forms.js"

import MainContent from "@/components/MainContent.vue"
import FormInput from "@/components/FormInput.vue"
import FormCheckbox from "@/components/FormCheckbox.vue"
import SessionChannelsTable from "@/components/SessionChannelsTable.vue"
import ModalAddSessionChannels from "@/components/ModalAddSessionChannels.vue"
import AppointmentSelector from "@/components/AppointmentSelector.vue"

export default {
  mixins: [formsMixin],
  props: {
    currentOrganizationScope: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      formState: "idle",
      fields: [
        "name",
        "fieldIsPublic",
        "fieldDiarizationEnabled",
        "fieldAppointment",
      ],
      name: {
        ...EMPTY_FIELD,
        label: this.$i18n.t("session.create_page.name_field.label"),
        testField: testName,
      },
      fieldIsPublic: {
        value: true,
        error: null,
        valid: false,
        label: this.$t("session.settings_page.isPublic_label"),
      },
      fieldDiarizationEnabled: {
        ...EMPTY_FIELD,
        value: false,
        label: this.$t("session.create_page.diarization_label"),
      },
      fieldAppointment: {
        ...EMPTY_FIELD,
        value: [null, null], // startDateTime, endDateTime
        label: this.$t("session.create_page.appointment_label"),
      },

      channels: [],
      selectedProfiles: [],
      modalAddChannelsIsOpen: false,
      channelsError: null,
      formError: null,
    }
  },
  watch: {
    selectedProfiles() {
      this.channelsError = null
    },
  },
  mounted() {},
  methods: {
    async createSession(e) {
      e.preventDefault()
      this.formState = "sending"
      if (this.channels.length === 0) {
        this.channelsError = this.$i18n.t("session.create_page.channels_error")
        this.formState = "error"
        return false
      }

      if (this.testFields()) {
        // convert fieldAppointment.value[0] and fieldAppointment.value[1] to ISO string like 2024-10-04T13:52:56.693Z
        const startDateTime = this.fieldAppointment.value[0]
          ? this.fieldAppointment.value[0].toISOString()
          : null

        const endDateTime = this.fieldAppointment.value[1]
          ? this.fieldAppointment.value[1].toISOString()
          : null

        const res = await apiCreateSession(this.currentOrganizationScope, {
          name: this.name.value,
          channels: this.channels.map(({ profileId, name, translations }) => ({
            transcriberProfileId: profileId,
            name,
            translations: translations ?? [],
            diarization: this.fieldDiarizationEnabled.value,
          })),
          startTime: startDateTime,
          endTime: endDateTime,
          visibility: this.fieldIsPublic.value ? "public" : "organization",
        })
        if (res.status == "success") {
          this.formState = "success"
          bus.$emit("app_notif", {
            status: "success",
            message: this.$i18n.t("session.create_page.success_message"),
            redirect: false,
          })
          this.$router.push({
            name: "sessions settings",
            params: {
              sessionId: res.data.id,
              organizationId: this.currentOrganizationScope,
            },
          })
        } else {
          bus.$emit("app_notif", {
            status: "error",
            message: this.$i18n.t("session.create_page.error_message"),
            timeout: null,
          })
          this.formState = "error"
        }
      } else {
        this.formState = "error"
      }

      return false
    },
    addChannel() {
      this.openModalAddSessionChannels()
    },
    confirmAddSessionChannels(channels) {
      this.channels = this.channels.concat(channels)
      this.closeModalAddSessionChannels()
    },
    closeModalAddSessionChannels() {
      this.modalAddChannelsIsOpen = false
      this.selectedProfiles = []
    },
    openModalAddSessionChannels() {
      this.modalAddChannelsIsOpen = true
    },
    removeChannel(index) {
      this.channels.splice(index, 1)
    },
    updateName(index, value) {
      this.channels[index].name = value
    },
  },
  components: {
    MainContent,
    FormInput,
    SessionChannelsTable,
    ModalAddSessionChannels,
    FormCheckbox,
    AppointmentSelector,
  },
}
</script>
