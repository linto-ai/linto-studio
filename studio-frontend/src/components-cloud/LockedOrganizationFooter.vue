<template>
  <div class="locked-organization-footer flex col gap-small">
    <p
      class="locked-organization-footer__status flex row align-center gap-small">
      <PhIcon name="lock" size="sm" />
      <span>{{ $t("billing.locked.status") }}</span>
    </p>
    <!-- Buying the plan back is the org admin's job -->
    <Button
      v-if="isAdmin"
      variant="primary"
      size="sm"
      icon="arrow-counter-clockwise"
      block
      :loading="opening"
      :disabled="opening"
      @click="reactivate">
      {{ $t("billing.locked.reactivate") }}
    </Button>
    <p v-else class="locked-organization-footer__hint">
      {{ $t("billing.locked.contact_admin") }}
    </p>
  </div>
</template>

<script>
import { mapActions } from "vuex"

import { bus } from "@/main.js"
import PhIcon from "@/components/atoms/PhIcon.vue"
import { orgaRoleMixin } from "@/mixins/orgaRole.js"

// Menu footer of a team organization that lost its plan (billing/locked):
// no quota to show, the way back to the plan instead.
export default {
  name: "LockedOrganizationFooter",
  mixins: [orgaRoleMixin],
  components: { PhIcon },
  data() {
    return {
      opening: false,
    }
  },
  methods: {
    ...mapActions("billing", ["openReactivationModal"]),
    async reactivate() {
      this.opening = true
      const opened = await this.openReactivationModal()
      this.opening = false
      if (opened) return
      bus.$emit("app_notif", {
        status: "error",
        message: this.$t("billing.locked.reactivation_unavailable"),
        timeout: 5000,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.locked-organization-footer {
  padding: 0.75em 1em 1em;

  &__status,
  &__hint {
    margin: 0;
  }

  &__status {
    font-weight: 700;
    color: var(--text-primary);
  }

  &__hint {
    color: var(--text-secondary);
  }
}
</style>
