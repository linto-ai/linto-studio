<template>
  <div class="flex row">
    <form
      class="flex col flex1"
      @submit="createSession"
      :disabled="formState === 'sending'">
      <!-- Template selection section -->
      <section>
        <h2>{{ $t("session.create_page.template_selection_title") }}</h2>
        <CustomSelect
          :options="optionsSelectTemplate"
          id="template-selector"
          v-model="selectedTemplateId" />
      </section>

      <!-- Main info section -->
      <section>
        <h2>{{ $t("session.create_page.main_info_title") }}</h2>
        <FormInput :field="name" v-model="name.value" />
        <AppointmentSelector
          :field="fieldAppointment"
          v-bind:error.sync="fieldAppointment.error"
          v-model="fieldAppointment.value" />
        <FormCheckbox
          class="medium-margin-top"
          :field="fieldAutoStop"
          v-model="fieldAutoStop.value"></FormCheckbox>
      </section>

      <section>
        <div class="flex row gap-medium align-center">
          <h2 style="width: auto">
            {{ $t("session.settings_page.metadata.title") }}
          </h2>

          <Button
            :label="$t('session.settings_page.metadata.button_edition')"
            variant="secondary"
            size="sm"
            icon="plus-circle"
            @click="startMedatadaEdition" />
        </div>
        <MetadataList :field="fieldMetadata" />
        <!-- <MetadataEditor v-model="fieldMetadata.value" :field="fieldMetadata" /> -->
      </section>

      <!-- Visibility section -->
      <section class="flex col">
        <h2>{{ $t("session.settings_page.visibility_title") }}</h2>
        <FormRadio
          :field="fieldSessionVisibility"
          v-model="fieldSessionVisibility.value">
          <template #content-after-public> </template>
        </FormRadio>
        <div
          style="margin-left: 24px"
          v-if="fieldSessionVisibility.value === 'password'">
          <FormInput :field="fieldPassword" v-model="fieldPassword.value" />
        </div>
      </section>

      <!-- Channels section -->
      <section class="flex col">
        <div>
          <div class="flex row gap-medium align-center">
            <h2 style="width: auto">
              {{ $t("session.channels_list.title") }}
            </h2>

            <Button
              :label="$t('session.channels_list.add')"
              type="button"
              variant="secondary"
              size="sm"
              icon="plus-circle"
              @click="addChannel" />
          </div>
          <div v-if="channelsError" class="error-field">
            {{ channelsError }}
          </div>
        </div>
        <FormCheckbox
          class="medium-margin-top"
          :field="fieldDiarizationEnabled"
          v-model="fieldDiarizationEnabled.value"></FormCheckbox>
        <FormCheckbox
          class=""
          :field="fieldKeepAudio"
          v-model="fieldKeepAudio.value"></FormCheckbox>
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

      <!-- Bottom footer-->
      <div class="flex gap-medium align-center conversation-create-footer">
        <Button
          type="button"
          variant="secondary"
          intent="destructive"
          :disabled="formState === 'sending' || selectedTemplateId == ''"
          :label="$t('session.create_page.delete_template_button')"
          @click="deleteSelectedTemplate">
        </Button>
        <div class="error-field flex1" v-if="formError">{{ formError }}</div>
        <div v-else class="flex1"></div>
        <Button
          type="button"
          :disabled="formState === 'sending'"
          variant="secondary"
          @click="saveTemplate"
          :label="$t('session.create_page.save_as_template_button')" />

        <Button
          type="submit"
          variant="primary"
          :loading="formState === 'sending'"
          :label="$t('session.create_page.submit_button')" />
      </div>
    </form>
    <ModalEditMetadata
      v-model="modalEditMetadataIsOpen"
      :field="fieldMetadata"
      @on-confirm="confirmEditMetadata"
      @on-cancel="closeModalEditMetadata"></ModalEditMetadata>
    <ModalAddSessionChannels
      v-if="modalAddChannelsIsOpen"
      :transcriberProfiles="transcriberProfiles"
      v-model="selectedProfiles"
      @on-confirm="confirmAddSessionChannels"
      @on-cancel="closeModalAddSessionChannels" />
    <ModalDeleteTemplate
      v-if="modalDeleteTemplateIsOpen"
      :template="selectedTemplate"
      :currentOrganizationScope="currentOrganizationScope"
      @on-confirm="confirmDeleteTemplate"
      @on-cancel="closeModalDeleteTemplate" />
  </div>
</template>
<script>
import { bus } from "@/main.js"

import { testName } from "@/tools/fields/testName"
import { getEnv } from "@/tools/getEnv"

import EMPTY_FIELD from "@/const/emptyField"

import { apiCreateSession, apiCreateSessionTemplate } from "@/api/session.js"

import { formsMixin } from "@/mixins/forms.js"

import MainContent from "@/components/MainContent.vue"
import FormInput from "@/components/molecules/FormInput.vue"
import FormCheckbox from "@/components/molecules/FormCheckbox.vue"
import SessionChannelsTable from "@/components/SessionChannelsTable.vue"
import ModalAddSessionChannels from "@/components/ModalAddSessionChannels.vue"
import AppointmentSelector from "@/components/AppointmentSelector.vue"
import FormRadio from "@/components/molecules/FormRadio.vue"
import CustomSelect from "@/components/molecules/CustomSelect.vue"
import ModalDeleteTemplate from "@/components/ModalDeleteTemplate.vue"
import MetadataEditor from "@/components/MetadataEditor.vue"
import MetadataList from "@/components/MetadataList.vue"
import ModalEditMetadata from "@/components/ModalEditMetadata.vue"

export default {
  mixins: [formsMixin],
  props: {
    currentOrganizationScope: {
      type: String,
      required: true,
    },
    transcriberProfiles: {
      type: Array,
      Required: true,
    },
    sessionTemplates: {
      type: Object, // { sessionTemplates: [...] totalItems: number }
      Required: true,
    },
  },
  data() {
    let defaultMetadata = []
    try {
      defaultMetadata = getEnv("VUE_APP_DEFAULT_METADATA")
        .split(",")
        .filter((k) => k)
        .map((k) => [k, ""])
    } catch (error) {
      console.error("Error while parsing VUE_APP_DEFAULT_METADATA", error)
      defaultMetadata = []
    }
    return {
      localSessionTemplates: structuredClone(this.sessionTemplates),
      selectedTemplateId: "",
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
      fieldDiarizationEnabled: {
        ...EMPTY_FIELD,
        value: false,
        label: this.$t("session.create_page.diarization_label"),
      },
      fieldKeepAudio: {
        ...EMPTY_FIELD,
        value: false,
        label: this.$t("session.create_page.keep_audio_label"),
      },
      fieldAppointment: {
        ...EMPTY_FIELD,
        value: [null, null], // startDateTime, endDateTime
        label: this.$t("session.create_page.appointment_label"),
      },
      fieldAutoStop: {
        ...EMPTY_FIELD,
        value: false,
        label: this.$t("session.create_page.auto_stop_label"),
      },
      fieldMetadata: {
        ...EMPTY_FIELD,
        value: defaultMetadata,
        label: this.$t("session.create_page.metadata_label"),
      },
      modalEditMetadataIsOpen: false,
      channels: [],
      selectedProfiles: [],
      modalAddChannelsIsOpen: false,
      modalDeleteTemplateIsOpen: false,
      channelsError: null,
      formError: null,
    }
  },
  mounted() {},
  watch: {
    selectedProfiles() {
      this.channelsError = null
    },
    "fieldAppointment.value": {
      handler(value) {
        if (value[1]) {
          this.fieldAutoStop.value = true
        }
      },
      deep: true,
    },
    selectedTemplateId(newId, oldId) {
      if (newId == "") {
        this.channels = []
        this.name.value = ""
        return
      }

      this.applyTemplate(this.selectedTemplate)
    },
  },
  computed: {
    selectedTemplate() {
      return this.localSessionTemplates.sessionTemplates.find(
        (t) => t.id === Number(this.selectedTemplateId),
      )
    },
    optionsSelectTemplate() {
      return {
        placeholder: [
          {
            value: "",
            text: this.$t("session.create_page.template_selection_placeholder"),
          },
        ],
        templates: this.localSessionTemplates.sessionTemplates.map(
          (template) => ({
            value: template.id,
            text: template.name,
          }),
        ),
      }
    },
  },

  methods: {
    applyTemplate(template) {
      let nameToApply
      let channelsToApply
      let metadataToApply
      try {
        nameToApply = template.name
        channelsToApply = template.channelTemplates.map(
          this.convertTemplateChannelToEditableChannel,
        )
        metadataToApply = Object.entries(template.meta)
      } catch (error) {
        console.error(error)
        bus.$emit("app_notif", {
          status: "error",
          message: this.$i18n.t("session.create_page.template_apply_error"),
          timeout: null,
        })
        this.formState = "error"
        return false
      }

      this.name.value = nameToApply
      this.channels = structuredClone(channelsToApply)
      this.fieldMetadata.value = metadataToApply

      bus.$emit("app_notif", {
        status: "success",
        message: this.$i18n.t("session.create_page.template_apply_success"),
        redirect: false,
      })
      return true
    },
    convertTemplateChannelToEditableChannel(templateChannel) {
      let channel = {}

      channel.id = templateChannel.id
      channel.name = templateChannel.name
      channel.translations = structuredClone(templateChannel.translations)
      channel.languages = templateChannel.languages
      channel.profileId = templateChannel.transcriberProfileId

      const profile = this.transcriberProfiles.find(
        (p) => p.id == templateChannel.transcriberProfileId,
      )
      if (!profile) {
        throw "Transcriber profiles does not exists"
      }
      channel.type = profile.config.type
      channel.availableTranslations = profile.config.availableTranslations ?? []
      channel.profileName = profile.config.name

      return channel
    },
    async saveTemplate(e) {
      // TODO: refactore with createSession function
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

        const res = await apiCreateSessionTemplate(
          this.currentOrganizationScope,
          {
            name: this.name.value,
            meta: Object.fromEntries(this.fieldMetadata.value),
            channels: this.channels.map(
              ({ profileId, name, translations }) => ({
                transcriberProfileId: profileId,
                name,
                translations: translations ?? [],
                diarization: this.fieldDiarizationEnabled.value,
                keepAudio: this.fieldKeepAudio.value,
              }),
            ),
            scheduleOn: startDateTime,
            endOn: endDateTime,
            autoStart: true,
            autoEnd: this.fieldAutoStop.value,
            visibility: this.fieldSessionVisibility.value ?? "organization",
          },
        )

        if (res.status == "success") {
          this.formState = "success"
          bus.$emit("app_notif", {
            status: "success",
            message: this.$i18n.t(
              "session.create_page.save_as_template_success",
            ),
            redirect: false,
          })
          this.localSessionTemplates.sessionTemplates.push(res.data)
          this.localSessionTemplates.totalItems++
        } else {
          bus.$emit("app_notif", {
            status: "error",
            message: this.$i18n.t("session.create_page.save_as_template_error"),
            timeout: null,
          })
          this.formState = "error"
        }
      } else {
        this.formState = "error"
      }
    },
    startMedatadaEdition() {
      this.modalEditMetadataIsOpen = true
    },
    closeModalEditMetadata() {
      this.modalEditMetadataIsOpen = false
    },
    confirmEditMetadata(metadata) {
      this.fieldMetadata.value = metadata
      this.closeModalEditMetadata()
    },
    async createSession(e) {
      e.preventDefault()
      this.formState = "sending"
      if (this.channels.length === 0) {
        this.channelsError = this.$i18n.t("session.create_page.channels_error")
        this.formState = "error"
        return false
      }

      if (
        this.fieldSessionVisibility.value === "password" &&
        !this.fieldPassword.value.trim()
      ) {
        this.fieldPassword.error = this.$t(
          "session.settings_page.empty_password_error",
        )
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
          password: this.fieldPassword.value || null,
          channels: this.channels.map(({ profileId, name, translations }) => ({
            transcriberProfileId: profileId,
            name,
            translations: translations ?? [],
            diarization: this.fieldDiarizationEnabled.value,
            keepAudio: this.fieldKeepAudio.value,
            compressAudio: true,
          })),
          meta: Object.fromEntries(this.fieldMetadata.value),
          scheduleOn: startDateTime,
          endOn: endDateTime,
          autoStart: true,
          autoEnd: this.fieldAutoStop.value,
          visibility: (
            this.fieldSessionVisibility.value ?? "organization"
          ).replace("password", "public"),
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
    confirmDeleteTemplate() {
      this.closeModalDeleteTemplate()
      this.localSessionTemplates.sessionTemplates =
        this.localSessionTemplates.sessionTemplates.filter(
          (t) => t.id !== this.selectedTemplateId,
        )
      this.localSessionTemplates.totalItems--
      this.selectedTemplateId = ""
    },
    closeModalDeleteTemplate() {
      this.modalDeleteTemplateIsOpen = false
    },
    deleteSelectedTemplate() {
      this.modalDeleteTemplateIsOpen = true
    },
  },
  components: {
    MainContent,
    FormInput,
    SessionChannelsTable,
    ModalAddSessionChannels,
    ModalDeleteTemplate,
    FormCheckbox,
    FormRadio,
    AppointmentSelector,
    CustomSelect,
    MetadataEditor,
    MetadataList,
    ModalEditMetadata,
  },
}
</script>
