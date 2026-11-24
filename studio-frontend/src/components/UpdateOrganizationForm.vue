<template>
  <form @submit="updateOrganization">
    <section>
      <h2>{{ $t("organisation.general_settings") }}</h2>
      <!--Organization Name, fixed for the user's own personal space -->
      <FormInput
        :readonly="isOwnPersonalOrganization || !canEditOrganization"
        :field="orgaName"
        v-model="orgaName.value" />
      <FormInput
        :readonly="!canEditOrganization"
        :field="orgaDescription"
        v-model="orgaDescription.value" />

      <FormInput
        v-if="canEditOrganization"
        :field="retentionValue"
        v-model="retentionValue.value">
        <template #content-after-input>
          <select
            v-model="retentionUnit"
            :aria-label="$t('organisation.media_retention.unit_label')">
            <option v-for="unit of retentionUnits" :key="unit" :value="unit">
              {{
                $tc(`organisation.media_retention.unit_${unit}`, retentionCount)
              }}
            </option>
          </select>
        </template>
        <template #content-bottom-input>
          <p class="small-text">
            {{ $t("organisation.media_retention.hint") }}
          </p>
        </template>
      </FormInput>
      <FormInput v-else readonly :field="retentionSummary" />

      <Button
        type="submit"
        variant="primary"
        size="md"
        v-if="canEditOrganization"
        :label="$t('organisation.update_button')" />
    </section>
  </form>
</template>
<script>
import { mapGetters } from "vuex"
import { Fragment } from "vue-fragment"
import { bus } from "@/main.js"

import { formsMixin } from "@/mixins/forms.js"
import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { platformRoleMixin } from "@/mixins/platformRole.js"

import EMPTY_FIELD from "@/const/emptyField"

import { testName } from "@/tools/fields/testName"
import { testContent } from "@/tools/fields/testContent"
import {
  testMediaRetentionValue,
  MEDIA_RETENTION_MAX_VALUE,
} from "@/tools/fields/testMediaRetentionValue"
import { buildMediaRetention } from "@/tools/buildMediaRetention"
import { isOwnPersonalOrganization } from "@/tools/user/isOwnPersonalOrganization"

import { apiUpdateOrganisation } from "@/api/organisation.js"

import FormInput from "@/components/molecules/FormInput.vue"
import LabeledValue from "@/components/atoms/LabeledValue.vue"
export default {
  mixins: [formsMixin, orgaRoleMixin, platformRoleMixin],
  props: {
    currentOrganization: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      fields: ["orgaName", "orgaDescription", "retentionValue"],
      orgaName: {
        ...EMPTY_FIELD,
        value: this.currentOrganization.name,
        label: this.$t("organisation.name_label"),
        testField: testName,
      },
      orgaDescription: {
        ...EMPTY_FIELD,
        value: this.currentOrganization.description ?? "",
        label: this.$t("organisation.description_label"),
        testField: testContent,
      },
      retentionValue: {
        ...EMPTY_FIELD,
        value: String(this.currentOrganization.mediaRetention?.value ?? ""),
        label: this.$t("organisation.media_retention.label"),
        placeholder: this.$t("organisation.media_retention.placeholder"),
        type: "number",
        customParams: { min: 1, max: MEDIA_RETENTION_MAX_VALUE, step: 1 },
        testField: testMediaRetentionValue,
      },
      retentionUnit: this.currentOrganization.mediaRetention?.unit ?? "month",
      retentionUnits: ["month", "year"],
      organizationId: this.currentOrganization._id,
    }
  },
  created() {
    if (this.isOwnPersonalOrganization) {
      this.orgaName.value = this.$t("organisation.personal_space_name", {
        name: this.currentOrganization.name,
      })
    }
  },
  mounted() {},
  computed: {
    ...mapGetters("user", { userId: "getUserId" }),
    isOwnPersonalOrganization() {
      return isOwnPersonalOrganization(this.currentOrganization, this.userId)
    },
    canEditOrganization() {
      return (
        this.isAdmin || (this.isSystemAdministrator && this.isBackofficePage)
      )
    },
    // The unit agrees with the duration, plural while none is typed
    retentionCount() {
      return Number(this.retentionValue.value) || 2
    },
    retentionSummary() {
      const retention = this.currentOrganization.mediaRetention
      let value = this.$t("organisation.media_retention.placeholder")
      if (retention) {
        value = this.$tc(
          `organisation.media_retention.summary_${retention.unit}`,
          retention.value,
        )
      }
      return {
        ...EMPTY_FIELD,
        value,
        label: this.$t("organisation.media_retention.label"),
      }
    },
  },
  methods: {
    async updateOrganization(event) {
      event.preventDefault()
      if (this.testFields()) {
        let payload = { description: this.orgaDescription.value }
        if (!this.isOwnPersonalOrganization) {
          payload.name = this.orgaName.value.trim()
        }
        payload.mediaRetention = buildMediaRetention(
          this.retentionValue.value,
          this.retentionUnit,
        )

        let req = await apiUpdateOrganisation(this.organizationId, payload, {
          timeout: 3000,
          redirect: false,
        })

        if (req.status === "success") {
          await this.dispatchOrganization()
        }
      }
      return false
    },
    async dispatchOrganization() {
      bus.$emit("user_orga_update")
    },
  },
  components: { Fragment, FormInput, LabeledValue },
}
</script>
