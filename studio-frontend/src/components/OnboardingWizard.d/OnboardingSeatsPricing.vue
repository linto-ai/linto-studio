<template>
  <div class="flex col gap-medium">
    <OnboardingPricingRow
      :title="$t('onboarding.organization.collaborators_title')"
      :details="collaboratorsDetails"
      :note="seatPriceLabel">
      <template #value="{ titleId, detailsId }">
        <NumberStepper
          :value="value"
          :min="minSeats"
          :max="maxSeats"
          :decrement-label="$t('onboarding.organization.remove_seat')"
          :increment-label="$t('onboarding.organization.add_seat')"
          :aria-labelledby="titleId"
          :aria-describedby="detailsId"
          @input="$emit('input', $event)" />
      </template>
    </OnboardingPricingRow>

    <OnboardingPricingRow
      :title="$t('onboarding.organization.members_title')"
      :details="[$t('onboarding.organization.members_description')]"
      :value="$t('onboarding.organization.members_unlimited')"
      :note="$t('onboarding.organization.members_free')"
      note-variant="highlight" />

    <div class="flex col gap-small">
      <OnboardingPricingTotal
        :title="totalTitle"
        :detail="totalDetail"
        :amount="formatPrice(totalCents)" />
      <p class="onboarding-seats-pricing__note">
        {{ $t("onboarding.organization.seats_note") }}
      </p>
    </div>
  </div>
</template>
<script>
import { formatCurrencyAmount } from "@/tools/formatCurrencyAmount"
import { computeSeatPrice } from "@/tools/seats/computeSeatPrice"
import NumberStepper from "@/components/molecules/NumberStepper.vue"
import OnboardingPricingRow from "./OnboardingPricingRow.vue"
import OnboardingPricingTotal from "./OnboardingPricingTotal.vue"

// Limit of POST /cloud/subscriptions (seatsSchema in linto-studio-cloud-service routes/subscriptions.js)
const MAX_SEATS = 500

// Collaborator seats of a per-seat plan (v-model), the free members and the
// total they come to over the billing period.
export default {
  name: "OnboardingSeatsPricing",
  components: {
    NumberStepper,
    OnboardingPricingRow,
    OnboardingPricingTotal,
  },
  props: {
    // Seats bought
    value: { type: Number, required: true },
    // Per-seat entry of the plan catalog (pricing.amountCents, currency…)
    plan: { type: Object, required: true },
    billingPeriod: { type: String, required: true },
    minSeats: { type: Number, required: true },
  },
  computed: {
    maxSeats() {
      return MAX_SEATS
    },
    seatPrice() {
      return computeSeatPrice(this.plan.pricing, this.billingPeriod)
    },
    totalCents() {
      return this.value * this.seatPrice.amountCents
    },
    collaboratorsDetails() {
      return [
        this.$t("onboarding.organization.collaborators_description", {
          min: this.minSeats,
        }),
        this.$t("onboarding.organization.collaborators_admin"),
      ]
    },
    seatPriceLabel() {
      return this.$t(
        this.seatPrice.isAnnual
          ? "onboarding.organization.seat_price_yearly"
          : "onboarding.organization.seat_price_monthly",
        { price: this.formatPrice(this.seatPrice.amountCents) },
      )
    },
    totalTitle() {
      return this.$t(
        this.seatPrice.isAnnual
          ? "onboarding.organization.total_yearly"
          : "onboarding.organization.total_monthly",
      )
    },
    totalDetail() {
      return this.$t(
        this.seatPrice.isAnnual
          ? "onboarding.organization.total_yearly_detail"
          : "onboarding.organization.total_monthly_detail",
        {
          seats: this.value,
          price: this.formatPrice(this.seatPrice.amountCents),
        },
      )
    },
  },
  methods: {
    formatPrice(amountCents) {
      return formatCurrencyAmount(
        amountCents,
        this.plan.pricing.currency,
        this.$i18n?.locale || "fr-FR",
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.onboarding-seats-pricing__note {
  margin: 0;
  font-size: var(--text-xs);
  color: var(--text-secondary);
}
</style>
