<template>
  <MainContent noBreadcrumb :organizationPage="false" box>
    <template v-slot:breadcrumb-actions>
      <!-- <div class="flex flex1 gap-medium align-center justify-center">
        <router-link :to="sessionListRoute" class="btn secondary">
          <span class="icon back"></span>
          <span class="label">{{
            $t("session.detail_page.back_to_listing")
          }}</span>
        </router-link>

        <!-- title -->
      <!-- <SessionStatus
          v-if="sessionLoaded"
          :session="session"
          withText
          class="flex1" />

        
      </div> -->

      <SessionHeader
        v-if="sessionLoaded"
        :sessionListRoute="sessionListRoute"
        :isAuthenticated="isAuthenticated"
        :sessionLoaded="sessionLoaded"
        :name="name"
        :session="session">
        <template v-slot:right-button-desktop>
          <router-link :to="liveRoute" class="btn">
            <span class="icon text"></span>
            <span class="label">{{
              $t("session.detail_page.back_to_live")
            }}</span>
          </router-link>
        </template>
        <template v-slot:right-button-mobile>
          <router-link
            :to="liveRoute"
            class="btn secondary only-icon"
            :aria-label="$t('session.detail_page.back_to_live')">
            <span class="icon text"></span>
          </router-link>
        </template>
      </SessionHeader>
    </template>

    <div class="flex1 medium-padding" v-if="sessionLoaded">
      <h1 class="center-text">{{ name }}</h1>
      <div class="flex wrap">
        <div class="flex1 fit-content">
          <!-- General informations -->
          <section>
            <h2>
              {{ $t("session.settings_page.global_informations_title") }}
            </h2>
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
                <button class="btn" @click="openModalEditSessionAlias">
                  <span class="icon edit"></span>
                  <span class="label">{{
                    $t("session.settings_page.edit_alias_button")
                  }}</span>
                </button>
              </template>
            </FormInput>

            <FormCheckbox
              v-if="enableWatermark"
              switchDisplay
              :field="fieldDisplayWatermark"
              v-model="fieldDisplayWatermark.value">
              <template v-slot:content-after-label>
                <button
                  class="only-icon transparent"
                  :aria-label="
                    $t('session.live_page.watermark_settings.settings_button')
                  "
                  :title="
                    $t('session.live_page.watermark_settings.settings_button')
                  "
                  @click="showWatermarkSettings = true">
                  <span class="icon settings" />
                </button>

                <button
                  class="only-icon transparent"
                  :aria-label="
                    $t('session.live_page.watermark_settings.unpin_button')
                  "
                  :title="
                    $t('session.live_page.watermark_settings.unpin_button')
                  "
                  @click="togglePin"
                  v-if="fieldWatermarkPinned.value">
                  <span class="icon pin-on" />
                </button>
                <button
                  class="only-icon transparent"
                  :aria-label="
                    $t('session.live_page.watermark_settings.pin_button')
                  "
                  :title="$t('session.live_page.watermark_settings.pin_button')"
                  @click="togglePin"
                  v-else>
                  <span class="icon pin" />
                </button>
              </template>
            </FormCheckbox>
          </section>
          <section class="flex col gap-medium">
            <h2>{{ $t("session.settings_page.visibility_title") }}</h2>
            <FormRadio
              inline
              :field="fieldSessionVisibility"
              v-model="fieldSessionVisibility.value" />
          </section>
          <section>
            <h2 class="flex align-center gap-medium">
              <span>{{ $t("session.settings_page.metadata.title") }}</span>
            </h2>
            <MetadataList :field="fieldMetadata" />
            <!-- <MetadataEditor v-model="fieldMetadata.value" :field="fieldMetadata" /> -->
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
            <FormCheckbox
              :field="fieldAutoStop"
              v-model="fieldAutoStop.value"
              :disabled="isStarted"></FormCheckbox>
            <!-- <div class="flex gap-medium align-center medium-margin-top">
            <FormCheckbox
              :field="fieldAutoStart"
              v-model="fieldAutoStart.value"
              :disabled="isStarted"></FormCheckbox>
            
            <div></div>
          </div> -->
          </section>
        </div>
        <div class="flex col gap-medium session-settings-right align-center">
          <div class="flex col gap-medium">
            <!-- Delete and save -->
            <button
              class="btn flex1 red-border flex"
              v-if="isStarted && !isActive"
              @click="stopSession"
              :title="titleButtonDelete"
              :disabled="isStoping">
              <span class="icon stop"></span>
              <span class="label flex1">{{
                $t("session.detail_page.stop_button")
              }}</span>
            </button>
            <!-- Force delete and save -->
            <button
              class="btn flex1 red-border flex"
              v-if="isActive"
              @click="openModalDeleteSession"
              :title="titleButtonDelete"
              :disabled="isStoping">
              <span class="icon stop"></span>
              <span class="label flex1">{{
                $t("session.detail_page.stop_force_button")
              }}</span>
            </button>
          </div>
          <Qrcode :value="publicLink" class="session-settings-qr-code" />
        </div>
      </div>

      <!-- Channels list -->
      <section>
        <h2>{{ $t("session.settings_page.channels_list_title") }}</h2>
        <div class="overflow-horizontal-auto">
          <SessionChannelsTable
            v-if="channels.length > 0"
            from="sessionSettings"
            @connectMicrophone="connectMicrophone"
            @updateName="updateChannelName"
            @updateDiarization="updateChannelDiarization"
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

      <ModalForceDeleteSession
        v-if="showModalDeleteSession"
        @on-close="closeModalDeleteSession"
        @on-confirm="stopSession" />

      <ModalEditSessionAlias
        :organizationId="organizationId"
        :sessionId="session.id"
        :sessionAliases="sessionAliases"
        v-if="showModalEditSessionAlias"
        @on-cancel="closeModalEditSessionAlias"
        @on-confirm="updateSessionAlias" />

      <ModalWatermarkSettings
        v-if="showWatermarkSettings"
        @on-cancel="closeWatermarkSettings"
        @on-confirm="closeWatermarkSettings"
        :field="fieldWatermarkSettings"
        v-model="fieldWatermarkSettings.value" />
    </div>
  </MainContent>
</template>
<script>
import { bus } from "../main.js"

import { sessionMixin } from "@/mixins/session.js"

import EMPTY_FIELD from "@/const/emptyField"

import { formsMixin } from "@/mixins/forms.js"

import isSameDateTimeWithoutSeconds from "@/tools/isSameDateTimeWithoutSeconds.js"
import isAuthenticated from "@/tools/isAuthenticated.js"
import { getEnv } from "@/tools/getEnv"

import { apiUpdateSession } from "@/api/session.js"

import SessionNotStarted from "@/components/SessionNotStarted.vue"
import LabeledValue from "@/components/LabeledValue.vue"
import FormInput from "@/components/FormInput.vue"
import FormCheckbox from "@/components/FormCheckbox.vue"
import FormRadio from "@/components/FormRadio.vue"

import SessionChannelsTable from "@/components/SessionChannelsTable.vue"
import AppointmentSelector from "@/components/AppointmentSelector.vue"
import ModalForceDeleteSession from "@/components/ModalForceDeleteSession.vue"
import MainContent from "@/components/MainContent.vue"
import SessionStatus from "@/components/SessionStatus.vue"
import MetadataList from "@/components/MetadataList.vue"
import SessionHeader from "@/components/SessionHeader.vue"
import ModalEditSessionAlias from "@/components/ModalEditSessionAlias.vue"
import Qrcode from "@/components/Qrcode.vue"
import ModalWatermarkSettings from "@/components/ModalWatermarkSettings.vue"
export default {
  mixins: [sessionMixin, formsMixin],
  props: {},
  data() {
    return {
      fields: ["name", "fieldAppointment", "fieldAutoStop", "fieldAutoStart"],
      fieldPublicLink: {
        value: null,
        error: null,
        valid: false,
        readOnly: true,
        label: this.$t("session.settings_page.publicLink_label"),
      },
      fieldSessionVisibility: {
        value: "public",
        error: null,
        valid: true,
        options: [
          {
            name: "private",
            label: this.$i18n.t(
              "session.settings_page.visibility_private_label",
            ),
          },
          {
            name: "organization",
            label: this.$i18n.t(
              "session.settings_page.visibility_organization_label",
            ),
          },
          {
            name: "public",
            label: this.$i18n.t(
              "session.settings_page.visibility_public_label",
            ),
          },
        ],
      },
      fieldDisplayWatermark: {
        value: null,
        error: null,
        valid: false,
        label: this.$t("session.settings_page.displayWatermark_label"),
      },
      fieldWatermarkSettings: {
        value: {
          content: null,
          frequency: null,
          duration: null,
        },
        error: null,
        valid: false,
        label: this.$t("session.settings_page.watermarkSettings_label"),
      },
      fieldWatermarkPinned: {
        value: null,
        error: null,
        valid: false,
        label: this.$t("session.settings_page.watermarkPinned_label"),
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
        label: this.$t("session.create_page.auto_stop_label"),
      },
      fieldAutoStart: {
        value: null, // computed property cannot be used here so fields are initialized in mounted
        error: null,
        valid: false,
        label: this.$t("session.settings_page.autoStart_label"),
      },
      fieldMetadata: {
        ...EMPTY_FIELD,
        value: [],
        label: this.$t("session.create_page.metadata_label"),
      },
      linkHasBeenCopied: false,
      showModalDeleteSession: false,
      showModalEditSessionAlias: false,
      formState: "idle",
      localChannels: [],
      channelsHasChanged: false,
      showWatermarkSettings: false,
    }
  },
  created() {},
  computed: {
    hasChanged() {
      //const publicChanged = this.fieldIsPublic.value !== this.isPublic

      const autoStartChanged = this.fieldAutoStart.value !== this.autoStart
      const autoStopChanged = this.fieldAutoStop.value !== this.autoStop
      const startDateChanged = !isSameDateTimeWithoutSeconds(
        new Date(this.fieldAppointment.value[0]),
        new Date(this.startTime),
      )

      const stopDateChanged = !isSameDateTimeWithoutSeconds(
        new Date(this.fieldAppointment.value[1]),
        new Date(this.endTime),
      )

      return (
        //publicChanged ||
        autoStartChanged ||
        autoStopChanged ||
        startDateChanged ||
        stopDateChanged ||
        this.channelsHasChanged
      )
    },
    titleButtonDelete() {
      return this.isActive
        ? this.$t("session.detail_page.stop_button_title_session_running")
        : null
    },
    isAuthenticated() {
      return isAuthenticated()
    },
    enableWatermark() {
      return getEnv("VUE_APP_ENABLE_WATERMARK") === "true"
    },
  },
  mounted() {},
  watch: {
    sessionLoaded(value) {
      if (value) this.initValues()
    },
    "fieldAppointment.value": {
      handler(value) {
        if (value[1] && value[1] != this.endTime) {
          this.fieldAutoStop.value = true
        }
      },
      deep: true,
    },
    "fieldDisplayWatermark.value": {
      handler(value) {
        if (value != this.displayWatermark) {
          this.syncWatermarkSettings({
            display: this.fieldDisplayWatermark.value,
            frequency: this.fieldWatermarkSettings.value.frequency,
            duration: this.fieldWatermarkSettings.value.duration,
            content: this.fieldWatermarkSettings.value.content,
            pinned: this.fieldWatermarkPinned.value,
          })
        }
      },
    },
    "fieldSessionVisibility.value": {
      handler(value) {
        if (value != this.visibility) {
          this.syncVisibility(this.fieldSessionVisibility.value)
        }
      },
    },
  },
  methods: {
    onSessionUpdatePostProcess(newSession) {
      this.initValues()
    },
    async updateSessionAlias(alias) {
      this.closeModalEditSessionAlias()
      this.sessionLoaded = false
      await this.fetchAliases()
      this.sessionLoaded = true
    },
    initValues() {
      this.fieldDisplayWatermark.value = this.displayWatermark
      this.fieldWatermarkSettings.value = {
        content: this.watermarkContent,
        frequency: this.watermarkFrequency,
        duration: this.watermarkDuration,
      }
      this.fieldWatermarkPinned.value = this.watermarkPinned
      this.fieldAutoStart.value = this.autoStart
      this.fieldAutoStop.value = this.autoStop
      this.fieldPublicLink.value = this.publicLink
      this.fieldSessionVisibility.value = this.visibility

      this.fieldAppointment.value = [this.startTime, this.endTime]
      this.localChannels = structuredClone(this.session.channels)

      this.fieldMetadata.value = Object.entries(this.metadata)
    },
    updateChannelName(index, value) {
      this.localChannels[index].name = value
      this.channelsHasChanged = true
    },
    connectMicrophone(index) {
      const route = this.liveRoute
      route["query"] = {
        channelId: this.localChannels[index].id,
        microphone: "true",
      }
      this.$router.push(route)
    },
    updateChannelDiarization(index, value) {
      this.localChannels[index].diarization = value
      this.channelsHasChanged = true
    },
    openModalDeleteSession() {
      this.showModalDeleteSession = true
    },
    closeModalDeleteSession() {
      this.showModalDeleteSession = false
    },
    openModalEditSessionAlias() {
      this.showModalEditSessionAlias = true
    },
    closeModalEditSessionAlias() {
      this.showModalEditSessionAlias = false
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
    closeWatermarkSettings() {
      this.syncWatermarkSettings({
        display: this.fieldDisplayWatermark.value,
        frequency: this.fieldWatermarkSettings.value.frequency,
        duration: this.fieldWatermarkSettings.value.duration,
        content: this.fieldWatermarkSettings.value.content,
        pinned: this.fieldWatermarkPinned.value,
      })
      this.showWatermarkSettings = false
    },
    togglePin() {
      this.fieldWatermarkPinned.value = !this.fieldWatermarkPinned.value
      this.syncWatermarkSettings({
        display: this.fieldDisplayWatermark.value,
        frequency: this.fieldWatermarkSettings.value.frequency,
        duration: this.fieldWatermarkSettings.value.duration,
        content: this.fieldWatermarkSettings.value.content,
        pinned: this.fieldWatermarkPinned.value,
      })
      this.session.meta["@watermark"].pinned = this.fieldWatermarkPinned.value
    },
    openWatermarkSettings() {
      this.showWatermarkSettings = true
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
          meta: {
            ...this.session.meta,
            "@watermark": {
              ...this?.session?.meta?.["@watermark"],
              display: this.fieldDisplayWatermark.value,
              frequency: this.fieldWatermarkSettings.value.frequency,
              duration: this.fieldWatermarkSettings.value.duration,
              content: this.fieldWatermarkSettings.value.content,
              pinned: this.fieldWatermarkPinned.value,
            },
          },
          scheduleOn: startDateTime,
          endOn: endDateTime,
          autoStart: this.fieldAutoStart.value,
          autoEnd: this.fieldAutoStop.value,
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
          this.session = { ...this.session, ...res.data }
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
    MainContent,
    SessionStatus,
    MainContent,
    SessionNotStarted,
    LabeledValue,
    FormInput,
    FormCheckbox,
    FormRadio,
    SessionChannelsTable,
    AppointmentSelector,
    ModalForceDeleteSession,
    MetadataList,
    SessionHeader,
    ModalEditSessionAlias,
    Qrcode,
    ModalWatermarkSettings,
  },
}
</script>
