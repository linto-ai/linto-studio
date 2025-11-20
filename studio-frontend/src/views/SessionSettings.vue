<template>
  <LayoutV2>
    <template v-slot:breadcrumb-actions>
      <SessionHeader
        :sessionListRoute="sessionListRoute"
        :isAuthenticated="isAuthenticated"
        :sessionLoaded="sessionLoaded"
        :name="name"
        :session="session">
        <IsMobile>
          <Button
            :to="liveRoute"
            variant="primary"
            :aria-label="$t('session.detail_page.back_to_live')"
            :title="$t('session.detail_page.back_to_live')"
            icon="text-align-left" />
          <template #desktop>
            <Button
              :to="liveRoute"
              variant="primary"
              size="sm"
              :label="$t('session.detail_page.back_to_live')"
              icon="text-align-left" />
          </template>
        </IsMobile>
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
                <Button
                  variant="secondary"
                  @click="copyPublicLink"
                  size="sm"
                  :icon="linkHasBeenCopied ? 'check' : 'clipboard'"
                  :label="
                    linkHasBeenCopied
                      ? $t('session.settings_page.copy_link_button_done')
                      : $t('session.settings_page.copy_link_button')
                  " />

                <Button
                  variant="secondary"
                  @click="openModalEditSessionAlias"
                  size="sm"
                  icon="pencil"
                  :label="$t('session.settings_page.edit_alias_button')" />
                <!-- <button class="btn" @click="openModalEditSessionAlias">
                  <ph-icon name="pencil"></ph-icon>
                  <span class="label">{{
                    $t("session.settings_page.edit_alias_button")
                  }}</span>
                </button> -->
              </template>
            </FormInput>

            <FormCheckbox
              v-if="enableWatermark"
              switchDisplay
              :field="fieldDisplayWatermark"
              v-model="fieldDisplayWatermark.value">
              <template v-slot:content-after-label>
                <div class="flex gap-small small-margin-left">
                  <Button
                    icon="gear"
                    variant="transparent"
                    :aria-label="
                      $t('session.live_page.watermark_settings.settings_button')
                    "
                    :title="
                      $t('session.live_page.watermark_settings.settings_button')
                    "
                    @click="showWatermarkSettings = true" />

                  <Button
                    icon="push-pin"
                    variant="transparent"
                    @click="togglePin"
                    :aria-label="
                      $t('session.live_page.watermark_settings.pin_button')
                    "
                    :title="
                      $t('session.live_page.watermark_settings.unpin_button')
                    "
                    v-if="fieldWatermarkPinned.value" />

                  <Button
                    icon="push-pin-slash"
                    variant="transparent"
                    @click="togglePin"
                    :aria-label="
                      $t('session.live_page.watermark_settings.pin_button')
                    "
                    :title="
                      $t('session.live_page.watermark_settings.pin_button')
                    "
                    v-else />
                  <!-- <button
                    class="only-icon transparent"
                    :aria-label="
                      $t('session.live_page.watermark_settings.unpin_button')
                    "
                    
                    @click="togglePin"
                    v-if="fieldWatermarkPinned.value">
                    <span class="icon pin-on" />
                  </button> -->
                  <!-- <button
                    class="only-icon transparent"
                    :aria-label="
                      $t('session.live_page.watermark_settings.pin_button')
                    "
                    :title="
                      $t('session.live_page.watermark_settings.pin_button')
                    "
                    @click="togglePin"
                    v-else>
                    <span class="icon pin" />
                  </button> -->
                </div>
              </template>
            </FormCheckbox>
          </section>
          <!-- Visibility -->
          <section class="flex col">
            <h2>{{ $t("session.settings_page.visibility_title") }}</h2>
            <FormRadio
              :field="fieldSessionVisibility"
              v-model="fieldSessionVisibility.value" />
            <div
              class="form-field"
              style="margin-left: 24px"
              v-if="fieldSessionVisibility.value === 'password'">
              <FormInput :field="fieldPassword" v-model="fieldPassword.value" />
            </div>
            <div class="form-field">
              <Button
                @click="settingUpdateVisibility"
                icon="check"
                variant="secondary"
                :label="$t('session.settings_page.visibility_save_button')" />
            </div>
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
            <Button
              v-if="isStarted && !isActive"
              icon="stop"
              :label="$t('session.detail_page.stop_button')"
              @click="stopSession"
              variant="primary"
              intent="destructive"
              size="sm"></Button>
            <Button
              v-if="isActive"
              icon="stop"
              :label="$t('session.detail_page.stop_force_button')"
              @click="openModalDeleteSession"
              variant="primary"
              intent="destructive"
              size="sm"></Button>
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

        <button @click="updateSession" class="btn primary">
          <ph-icon name="check" size="md" class="icon" />
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
  </LayoutV2>
</template>
<script>
import { bus } from "@/main.js"

import { sessionMixin } from "@/mixins/session.js"

import EMPTY_FIELD from "@/const/emptyField"

import { formsMixin } from "@/mixins/forms.js"

import isSameDateTimeWithoutSeconds from "@/tools/isSameDateTimeWithoutSeconds.js"
import isAuthenticated from "@/tools/isAuthenticated.js"
import { getEnv } from "@/tools/getEnv"

import { apiUpdateSession } from "@/api/session.js"

import SessionNotStarted from "@/components/SessionNotStarted.vue"
import LabeledValue from "@/components/atoms/LabeledValue.vue"
import FormInput from "@/components/molecules/FormInput.vue"
import FormCheckbox from "@/components/molecules/FormCheckbox.vue"
import FormRadio from "@/components/molecules/FormRadio.vue"

import SessionChannelsTable from "@/components/SessionChannelsTable.vue"
import AppointmentSelector from "@/components/AppointmentSelector.vue"
import ModalForceDeleteSession from "@/components/ModalForceDeleteSession.vue"
import MainContent from "@/components/MainContent.vue"
import SessionStatus from "@/components/SessionStatus.vue"
import MetadataList from "@/components/MetadataList.vue"
import SessionHeader from "@/components/SessionHeader.vue"
import ModalEditSessionAlias from "@/components/ModalEditSessionAlias.vue"
import Qrcode from "@/components/atoms/Qrcode.vue"
import ModalWatermarkSettings from "@/components/ModalWatermarkSettings.vue"
import LayoutV2 from "@/layouts/v2-layout.vue"

export default {
  mixins: [sessionMixin, formsMixin],
  props: {},
  data() {
    return {
      privatePage: true,
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
            description: this.$i18n.t(
              "session.settings_page.visibility_private_description",
            ),
          },
          {
            name: "organization",
            label: this.$i18n.t(
              "session.settings_page.visibility_organization_label",
            ),
            description: this.$i18n.t(
              "session.settings_page.visibility_organization_description",
            ),
          },
          {
            name: "public",
            label: this.$i18n.t(
              "session.settings_page.visibility_public_label",
            ),
            description: this.$i18n.t(
              "session.settings_page.visibility_public_description",
            ),
          },
          {
            name: "password",
            label: this.$i18n.t(
              "session.settings_page.visibility_password_label",
            ),
            description: this.$i18n.t(
              "session.settings_page.visibility_password_description",
            ),
          },
        ],
      },
      fieldPassword: {
        ...EMPTY_FIELD,
        type: "password",
        disabled: true,
        label: this.$i18n.t("session.settings_page.password_label"),
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
    async settingUpdateVisibility() {
      if (
        this.fieldSessionVisibility.value === "password" &&
        !this.fieldPassword.value.trim()
      ) {
        this.fieldPassword.error = this.$t(
          "session.settings_page.empty_password_error",
        )
        return
      }

      this.fieldPassword.error = null

      if (
        await this.syncVisibility(
          this.fieldSessionVisibility.value.replace("password", "public"),
        )
      ) {
        await this.syncPassword(
          this.fieldSessionVisibility.value === "password"
            ? this.fieldPassword.value
            : null,
        )
      }
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
    LayoutV2,
  },
}
</script>

<style lang="scss" scoped>
.topbar {
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid var(--neutral-20);
  background-color: var(--background-primary-soft);
}
</style>
