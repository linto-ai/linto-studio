<template>
  <section v-if="enableSecurityLevel" class="flex col gap-small align-top">
    <h2>{{ $t("organisation.organization_security_level.title") }}</h2>
    <div class="form-field flex col">
      <label class="form-label">
        {{ $t("organisation.organization_security_level.label") }}
      </label>
      <select v-model.number="securityLevel">
        <option
          v-for="level in securityLevels"
          :key="level.value"
          :value="level.value">
          {{ level.txt }}
        </option>
      </select>
    </div>
    <div>
      <Button
        variant="primary"
        @click="updateSecurityLevel"
        icon="check"
        :label="$t('organisation.organization_security_level.update_button')" />
    </div>
  </section>
</template>
<script>
import { getEnv } from "@/tools/getEnv"
import { DEFAULT_SECURITY_LEVEL } from "@/const/securityLevels"
import SECURITY_LEVELS_LIST from "@/const/securityLevelsList"
import { apiAdminUpdateOrganisation } from "@/api/organisation.js"
import Button from "@/components/atoms/Button.vue"

export default {
  props: {
    currentOrganization: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      organizationId: this.currentOrganization._id,
      securityLevel:
        this.currentOrganization.securityLevel ?? DEFAULT_SECURITY_LEVEL,
    }
  },
  computed: {
    enableSecurityLevel() {
      return getEnv("VUE_APP_ENABLE_SECURITY_LEVEL") === "true"
    },
    securityLevels() {
      return SECURITY_LEVELS_LIST((key) => this.$i18n.t(key))
    },
  },
  methods: {
    async updateSecurityLevel(event) {
      event.preventDefault()
      await apiAdminUpdateOrganisation(
        this.organizationId,
        { securityLevel: this.securityLevel },
        { timeout: 3000, redirect: false },
      )
    },
  },
  components: { Button },
}
</script>
