<template>
  <form @submit.prevent="updateMediaRetention">
    <FormInput :field="retentionValue" v-model="retentionValue.value">
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

    <Button
      type="submit"
      variant="primary"
      size="md"
      :label="$t('organisation.update_button')" />
  </form>
</template>
<script>
import { bus } from "@/main.js"

import { formsMixin } from "@/mixins/forms.js"

import EMPTY_FIELD from "@/const/emptyField"

import {
  testMediaRetentionValue,
  MEDIA_RETENTION_MAX_VALUE,
} from "@/tools/fields/testMediaRetentionValue"
import { buildMediaRetention } from "@/tools/buildMediaRetention"

import { apiUpdateOrganisation } from "@/api/studio-api/organisation.js"

import FormInput from "@/components/molecules/FormInput.vue"

export default {
  mixins: [formsMixin],
  props: {
    currentOrganization: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      fields: ["retentionValue"],
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
      retentionUnits: ["hour", "day", "week", "month", "year"],
    }
  },
  computed: {
    // The unit agrees with the duration, plural while none is typed
    retentionCount() {
      return Number(this.retentionValue.value) || 2
    },
  },
  methods: {
    async updateMediaRetention() {
      if (!this.testFields()) return

      const payload = {
        mediaRetention: buildMediaRetention(
          this.retentionValue.value,
          this.retentionUnit,
        ),
      }
      const req = await apiUpdateOrganisation(
        this.currentOrganization._id,
        payload,
        { timeout: 3000, redirect: false },
      )
      if (req.status === "success") {
        bus.$emit("user_orga_update")
      }
    },
  },
  components: { FormInput },
}
</script>
