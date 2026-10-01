<template>
  <Button
    v-if="refusal.action === 'buy_pack'"
    type="button"
    variant="primary"
    icon="plus"
    @click="openModalOnTab('billing')">
    {{ $t("billing.settings.buy_pack") }}
  </Button>
  <Button
    v-else-if="refusal.action === 'plans'"
    type="button"
    variant="primary"
    icon="sparkle"
    @click="openUpgradeModal(errorData)">
    {{ $t("billing.upgrade_cta") }}
  </Button>
</template>

<script>
import { mapActions } from "vuex"

// The purchase that lifts a SaaS refusal, shown as the primary action beside
// the form's submit button. Renders nothing when no purchase applies (paid
// plan waiting for its reset, member who must ask an admin…).
export default {
  name: "SaasRefusalAction",
  props: {
    // saasRefusalView of saasRefusalFormMixin
    refusal: { type: Object, required: true },
    // Response body of the refused request, context for the upgrade wizard
    errorData: { type: Object, required: true },
  },
  methods: {
    ...mapActions("billing", ["openUpgradeModal"]),
    ...mapActions("settings", ["openModalOnTab"]),
  },
}
</script>
