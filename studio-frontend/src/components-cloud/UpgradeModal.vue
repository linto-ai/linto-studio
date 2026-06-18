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

      <!-- Card step: shown only when the backend returns a Stripe clientSecret
           (real Stripe). Fake/local mode skips straight to done. -->
      <div v-else-if="step === 'card'" class="upgrade-modal__card-step">
        <p class="upgrade-modal__card-label">{{ $t("billing.card.label") }}</p>
        <div ref="cardEl" class="upgrade-modal__card-input"></div>
        <p v-if="cardError" class="upgrade-modal__card-error">{{ cardError }}</p>
        <div class="upgrade-modal__actions">
          <Button variant="secondary" @click="$emit('close')">{{
            $t("billing.cancel")
          }}</Button>
          <Button variant="primary" :loading="busy" @click="pay">{{
            $t("billing.card.pay")
          }}</Button>
        </div>
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
import { getStripe, hasStripeKey } from "@/tools/loadStripe"

export default {
  name: "UpgradeModal",
  components: { Button },
  props: {
    // Optional gating detail ({ reason, capability, remaining }) when opened
    // from a 402/403 response, to show a contextual line.
    reason: { type: Object, default: null },
  },
  data() {
    return {
      busy: false,
      done: false,
      step: "pitch", // pitch -> (card) -> done
      clientSecret: null,
      stripe: null,
      cardElement: null,
      cardError: "",
    }
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
    ...mapActions("billing", ["upgrade", "fetchPlans", "refresh"]),
    async confirm() {
      this.busy = true
      try {
        const result = await this.upgrade({ planKey: "premium", seats: 1 })
        if (!result) return
        // Real Stripe returns a clientSecret (PaymentIntent) to confirm with a
        // card. Fake/local mode (or no publishable key) activates immediately.
        if (result.clientSecret && hasStripeKey()) {
          this.clientSecret = result.clientSecret
          this.step = "card"
          await this.$nextTick()
          await this.mountCard()
        } else {
          this.finishDone()
        }
      } finally {
        this.busy = false
      }
    },
    async mountCard() {
      try {
        this.stripe = await getStripe()
        if (!this.stripe) {
          // No Stripe.js / key after all -> treat the (already-created) sub as done.
          this.finishDone()
          return
        }
        const elements = this.stripe.elements()
        this.cardElement = elements.create("card")
        this.cardElement.mount(this.$refs.cardEl)
        this.cardElement.on("change", (e) => {
          this.cardError = e.error ? e.error.message : ""
        })
      } catch (e) {
        this.cardError = e.message || String(e)
      }
    },
    async pay() {
      if (!this.stripe || !this.cardElement || !this.clientSecret) return
      this.busy = true
      this.cardError = ""
      try {
        const { error } = await this.stripe.confirmCardPayment(
          this.clientSecret,
          { payment_method: { card: this.cardElement } },
        )
        if (error) {
          this.cardError = error.message
          return
        }
        // Payment succeeded; the webhook (invoice.paid / subscription.updated)
        // flips the subscription to active server-side. Refresh to reflect it.
        await this.refresh()
        this.finishDone()
      } finally {
        this.busy = false
      }
    },
    finishDone() {
      this.step = "done"
      this.done = true
      setTimeout(() => this.$emit("close"), 1400)
    },
  },
  beforeDestroy() {
    if (this.cardElement) {
      try {
        this.cardElement.unmount()
      } catch (e) {}
    }
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
  &__card-step {
    margin-top: 0.5em;
  }
  &__card-label {
    font-size: 0.82rem;
    color: var(--neutral-70);
    margin: 0 0 0.4em;
  }
  &__card-input {
    border: 1px solid var(--neutral-40);
    border-radius: 6px;
    padding: 0.7em 0.6em;
    margin-bottom: 0.6em;
    background: var(--neutral-0, #fff);
  }
  &__card-error {
    color: var(--error-color, #e5484d);
    font-size: 0.8rem;
    margin: 0 0 0.6em;
  }
}
</style>
