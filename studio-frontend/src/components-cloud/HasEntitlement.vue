<template>
  <fragment v-if="allowed"><slot /></fragment>
  <fragment v-else-if="$scopedSlots.locked">
    <slot name="locked" :plan="lockedPlan" :showUpgrade="showUpgrade" />
  </fragment>
  <fragment v-else-if="lockedPlaceholder">
    <div
      class="has-entitlement__locked flex col align-center justify-center gap-small">
      <ph-icon name="lock" size="lg" />
      <p>
        {{
          lockedPlan
            ? $t("billing.feature_locked_plan", {
                plan: lockedPlan.displayName,
              })
            : $t("billing.feature_locked")
        }}
      </p>
      <Button
        variant="primary"
        size="sm"
        :label="$t('billing.upgrade_cta')"
        @click="showUpgrade" />
    </div>
  </fragment>
</template>

<script>
import { Fragment } from "vue-fragment"
import { mapGetters, mapActions } from "vuex"
import { getEnv } from "@/tools/getEnv"

const IS_MODE_CLOUD = getEnv("VUE_APP_MODE") === "cloud"

// Render the default slot only when the current plan grants `capability`.
// In non-cloud modes (premise / self-hosted) nothing is gated, so it always
// renders. Locked fallback, in order of precedence:
//   #locked slot     — caller-defined replacement (e.g. a locked button/menu
//                       entry standing in for the real one); receives the
//                       cheapest plan that grants the capability as `plan`
//                       (null while the catalog is still loading, or if none
//                       does) and `showUpgrade` to open the upgrade modal.
//   lockedPlaceholder — generic icon+message+upgrade-button panel, for callers
//                       that just want "this is locked" with no custom layout.
//   neither           — renders nothing.
export default {
  name: "HasEntitlement",
  components: { Fragment },
  props: {
    capability: { type: String, required: true },
    lockedPlaceholder: { type: Boolean, default: false },
  },
  computed: {
    ...mapGetters("billing", ["can", "plans", "planFor"]),
    allowed() {
      if (!IS_MODE_CLOUD) return true
      return this.can(this.capability)
    },
    lockedPlan() {
      return this.planFor(this.capability)
    },
  },
  watch: {
    // Fetch the catalog once, only when it's actually needed to name the
    // plan behind a lock (mirrors OnboardingWizard's own lazy load).
    allowed: {
      immediate: true,
      handler(value) {
        if (!value) this.ensurePlansLoaded()
      },
    },
  },
  methods: {
    ...mapActions("billing", ["fetchPlans", "openUpgradeModal"]),
    ensurePlansLoaded() {
      if (this.plans.length) return
      this.fetchPlans()
    },
    // Same gating detail sendRequest dispatches on a 403 SAAS_FEATURE_LOCKED:
    // opens the onboarding/upgrade wizard (OnboardingWizard.vue, App.vue).
    showUpgrade() {
      this.openUpgradeModal({
        code: "SAAS_FEATURE_LOCKED",
        reason: "feature_disabled",
        capability: this.capability,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.has-entitlement__locked {
  // Fills the height of whatever container renders it (AppSettingsModal's
  // section has an explicit height, not auto), so justify-center actually
  // has room to center the icon/message/button vertically.
  height: 100%;
  box-sizing: border-box;
  padding: 1rem;
  text-align: center;
  color: var(--text-secondary);

  p {
    margin: 0;
  }
}
</style>
