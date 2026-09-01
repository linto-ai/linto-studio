<template>
  <MainContentPublic>
    <form
      class="flex col login-page__form gap-small"
      @submit.prevent="submitStep">
      <h2 class="login-title">{{ $t("onboarding.welcome_title") }}</h2>
      <p class="onboarding__help">{{ $t("onboarding.name_org_help") }}</p>

      <!-- Step 1: name the organization -->
      <div class="form-field flex col">
        <label class="form-label" for="onboarding-org-name">
          {{ $t("onboarding.org_name_label") }}<strong>*</strong> :
        </label>
        <input
          id="onboarding-org-name"
          ref="orgNameInput"
          type="text"
          v-model="orgName.value"
          class="fullwidth"
          :class="orgName.error !== null ? 'error' : ''"
          :placeholder="$t('onboarding.org_name_placeholder')"
          maxlength="120" />
        <span class="error-field" v-if="orgName.error !== null">
          {{ orgName.error }}
        </span>
      </div>

      <button type="submit" class="btn green" :disabled="loading">
        {{ $t("onboarding.continue") }}
      </button>
    </form>
  </MainContentPublic>
</template>

<script>
import MainContentPublic from "@/components/MainContentPublic.vue"
import { apiUpdateOrganisation } from "@/api/organisation.js"
import { apiUpdateUserInfo } from "@/api/user.js"

export default {
  name: "OnboardingWizard",
  components: { MainContentPublic },
  data() {
    return {
      orgName: { value: "", error: null },
      loading: false,
    }
  },
  computed: {
    defaultOrganizationId() {
      return this.$store.getters["organizations/getDefaultOrganizationId"]
    },
    defaultOrganization() {
      return this.$store.getters["organizations/getOrganizationById"](
        this.defaultOrganizationId,
      )
    },
  },
  mounted() {
    // Never prefill with the technical default name (the user's email): we want
    // them to type a real name. Just focus the field.
    this.$nextTick(() => this.$refs.orgNameInput?.focus())
  },
  methods: {
    async submitStep() {
      this.orgName.error = null
      const name = (this.orgName.value || "").trim()
      if (!name) {
        this.orgName.error = this.$t("onboarding.org_name_required")
        return
      }
      if (!this.defaultOrganizationId) {
        this.orgName.error = this.$t("onboarding.generic_error")
        return
      }

      this.loading = true
      try {
        const req = await apiUpdateOrganisation(
          this.defaultOrganizationId,
          { name },
          { timeout: 5000, redirect: false },
        )
        if (req?.status !== "success") {
          this.orgName.error =
            req?.message || this.$t("onboarding.generic_error")
          this.loading = false
          return
        }

        await apiUpdateUserInfo({ onboarded: true })

        // Refresh stores so the router guard lets us into the app.
        await this.$store.dispatch("user/fetchUser")
        await this.$store.dispatch("organizations/fetchOrganizations")

        this.$router.push({ name: "explore" })
      } catch (e) {
        this.orgName.error = this.$t("onboarding.generic_error")
        this.loading = false
      }
    },
  },
}
</script>

<style scoped lang="scss">
.onboarding__help {
  margin-bottom: 1rem;
  max-width: 36rem;
}
</style>
