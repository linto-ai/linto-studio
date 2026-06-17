<template>
  <div class="upgrade-modal" @click.self="$emit('close')">
    <div class="upgrade-modal__card">
      <button
        class="upgrade-modal__close"
        :aria-label="$t('billing.cancel')"
        @click="$emit('close')">
        ×
      </button>

      <div class="upgrade-modal__badge">★ {{ $t("billing.premium") }}</div>
      <h2 class="upgrade-modal__title">{{ $t("billing.upgrade_title") }}</h2>
      <p class="upgrade-modal__sub">{{ $t("billing.upgrade_subtitle") }}</p>
      <p v-if="contextMessage" class="upgrade-modal__context">
        {{ contextMessage }}
      </p>

      <ul class="upgrade-modal__features">
        <li>{{ $t("billing.feature.unlimited") }}</li>
        <li>{{ $t("billing.feature.collaboration") }}</li>
        <li>{{ $t("billing.feature.speaker_id") }}</li>
        <li>{{ $t("billing.feature.no_watermark") }}</li>
        <li>{{ $t("billing.feature.api") }}</li>
      </ul>

      <div class="upgrade-modal__price">{{ $t("billing.per_seat") }}</div>

      <div v-if="done" class="upgrade-modal__done">
        ✓ {{ $t("billing.upgrade_done") }}
      </div>

      <div class="upgrade-modal__actions" v-else>
        <Button variant="secondary" @click="$emit('close')">{{
          $t("billing.cancel")
        }}</Button>
        <Button variant="primary" :loading="busy" @click="confirm">{{
          $t("billing.confirm_upgrade")
        }}</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import Button from "@/components/atoms/Button.vue"

export default {
  name: "UpgradeModal",
  components: { Button },
  props: {
    // Optional gating detail ({ reason, capability, remaining }) when opened
    // from a 402/403 response, to show a contextual line.
    reason: { type: Object, default: null },
  },
  data() {
    return { busy: false, done: false }
  },
  computed: {
    ...mapGetters("billing", ["premiumPlan"]),
    contextMessage() {
      if (!this.reason) return ""
      if (this.reason.reason === "quota_exceeded") {
        return this.$t("billing.limit_reached")
      }
      if (this.reason.reason === "feature_disabled") {
        return this.$t("billing.feature_locked")
      }
      return ""
    },
  },
  mounted() {
    if (!this.premiumPlan) this.fetchPlans()
  },
  methods: {
    ...mapActions("billing", ["upgrade", "fetchPlans"]),
    async confirm() {
      this.busy = true
      try {
        const result = await this.upgrade({ planKey: "premium", seats: 1 })
        // Real Stripe returns a clientSecret to confirm with Stripe.js; the
        // local/fake path activates immediately. (Payment confirm = it.next.)
        if (result) {
          this.done = true
          setTimeout(() => this.$emit("close"), 1400)
        }
      } finally {
        this.busy = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.upgrade-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1em;

  &__card {
    position: relative;
    background: var(--neutral-0, #fff);
    border-radius: 10px;
    padding: 1.75em;
    width: 100%;
    max-width: 380px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  }
  &__close {
    position: absolute;
    top: 0.5em;
    right: 0.6em;
    background: none;
    border: none;
    font-size: 1.6rem;
    line-height: 1;
    cursor: pointer;
    color: var(--neutral-60);
  }
  &__badge {
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--primary-color);
  }
  &__title {
    margin: 0.2em 0 0.1em;
    font-size: 1.25rem;
  }
  &__sub {
    color: var(--neutral-70);
    font-size: 0.85rem;
    margin-bottom: 1em;
  }
  &__features {
    list-style: none;
    padding: 0;
    margin: 0 0 1em;
    li {
      padding: 0.25em 0 0.25em 1.4em;
      position: relative;
      font-size: 0.88rem;
      &::before {
        content: "✓";
        position: absolute;
        left: 0;
        color: var(--success-color, #30a46c);
        font-weight: 700;
      }
    }
  }
  &__price {
    font-weight: 600;
    margin-bottom: 1em;
  }
  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5em;
  }
  &__done {
    text-align: center;
    color: var(--success-color, #30a46c);
    font-weight: 600;
    padding: 0.5em 0;
  }
}
</style>
