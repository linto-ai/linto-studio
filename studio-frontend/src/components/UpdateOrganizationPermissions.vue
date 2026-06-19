<template>
  <section class="flex col gap-small justify-start align-top">
    <h2>{{ $t("organisation.organization_permissions.title") }}</h2>
    <FormCheckbox
      :field="fieldUploadPermission"
      v-model="fieldUploadPermission.value"></FormCheckbox>

    <FormCheckbox
      :field="fieldSummaryPermission"
      v-model="fieldSummaryPermission.value"></FormCheckbox>

    <FormCheckbox
      :field="fieldMicrophonePermission"
      v-model="fieldMicrophonePermission.value"></FormCheckbox>

    <FormCheckbox
      :field="fieldBotPermission"
      v-model="fieldBotPermission.value"></FormCheckbox>

    <FormCheckbox
      :field="fieldSessionPermission"
      v-model="fieldSessionPermission.value"></FormCheckbox>

    <FormCheckbox
      v-if="speakerIdentificationEnabled"
      :field="fieldSpeakerIdentificationPermission"
      v-model="fieldSpeakerIdentificationPermission.value"></FormCheckbox>

    <div>
      <Button
        v-if="isAdmin || isSystemAdministrator"
        variant="primary"
        @click="updateOrganization"
        icon="check"
        :label="$t('organisation.organization_permissions.update_button')" />
    </div>
    <!-- <button
      type="submit"
      class="btn primary"
      @click="updateOrganization"
      v-if="isAdmin || isSystemAdministrator">
      <ph-icon name="check" size="md" class="icon" />
      <span class="label">{{
        $t("organisation.organization_permissions.update_button")
      }}</span>
    </button> -->
  </section>
</template>
<script>
import { organizationPermissionsMixin } from "@/mixins/organizationPermissions"
import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { platformRoleMixin } from "@/mixins/platformRole.js"

import EMPTY_FIELD from "@/const/emptyField"
import { getEnv } from "@/tools/getEnv"

import { apiAdminUpdateOrganisation } from "@/api/organisation.js"

import FormRadio from "@/components/molecules/FormRadio.vue"
import FormCheckbox from "@/components/molecules/FormCheckbox.vue"

export default {
  mixins: [organizationPermissionsMixin, orgaRoleMixin, platformRoleMixin],
  props: {
    currentOrganization: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      fieldUploadPermission: {
        ...EMPTY_FIELD,
        value: this.hasUploadPermission(this.currentOrganization.permissions),
        label: this.$t(
          "organisation.organization_permissions.upload_permission",
        ),
      },
      fieldSummaryPermission: {
        ...EMPTY_FIELD,
        value: this.hasSummaryPermission(this.currentOrganization.permissions),
        label: this.$t(
          "organisation.organization_permissions.summary_permission",
        ),
      },
      fieldMicrophonePermission: {
        ...EMPTY_FIELD,
        value: this.hasMicrophonePermission(
          this.currentOrganization.permissions,
        ),
        label: this.$t(
          "organisation.organization_permissions.microphone_permission",
        ),
      },
      fieldBotPermission: {
        ...EMPTY_FIELD,
        value: this.hasBotPermission(this.currentOrganization.permissions),
        label: this.$t(
          "organisation.organization_permissions.bot_permission",
        ),
      },
      fieldSessionPermission: {
        ...EMPTY_FIELD,
        value: this.hasSessionPermission(this.currentOrganization.permissions),
        label: this.$t(
          "organisation.organization_permissions.session_permission",
        ),
      },
      fieldSpeakerIdentificationPermission: {
        ...EMPTY_FIELD,
        value: this.hasSpeakerIdentificationPermission(
          this.currentOrganization.permissions,
        ),
        label: this.$t(
          "organisation.organization_permissions.speaker_identification_permission",
        ),
      },
      organizationId: this.currentOrganization._id,
    }
  },
  computed: {
    speakerIdentificationEnabled() {
      return getEnv("VUE_APP_ENABLE_SPEAKER_IDENTIFICATION") === "true"
    },
  },
  mounted() {},
  methods: {
    async updateOrganization(event) {
      event.preventDefault()
      let payload = {
        permissions: this.computePermissionsNumber({
          upload: this.fieldUploadPermission.value,
          summary: this.fieldSummaryPermission.value,
          microphone: this.fieldMicrophonePermission.value,
          bot: this.fieldBotPermission.value,
          session: this.fieldSessionPermission.value,
          speakerIdentification: this.fieldSpeakerIdentificationPermission.value,
        }),
      }

      let req = await apiAdminUpdateOrganisation(this.organizationId, payload, {
        timeout: 3000,
        redirect: false,
      })

      if (req.status === "success") {
        //await this.dispatchOrganization()
      }

      return false
    },
  },
  components: {
    FormRadio,
    FormCheckbox,
  },
}
</script>
