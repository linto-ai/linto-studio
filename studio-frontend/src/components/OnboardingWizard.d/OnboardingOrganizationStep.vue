<template>
  <form class="flex col" novalidate @submit.prevent="submit">
    <OnboardingCheckoutSteps />

    <div class="onboarding-organization__body flex col gap-medium">
      <header class="flex col gap-tiny">
        <h1 class="onboarding-organization__title">
          {{ $t("onboarding.organization.title") }}
        </h1>
        <p class="onboarding-organization__description">
          {{ $t("onboarding.organization.description") }}
        </p>
      </header>

      <FormInput
        :field="nameField"
        v-model="nameField.value"
        focus
        input-full-width
        @input="nameField.error = null" />

      <OnboardingPricingRow
        :title="$t('onboarding.organization.collaborators_title')"
        :details="collaboratorsDetails"
        :note="seatPriceLabel">
        <template #value="{ titleId, detailsId }">
          <NumberStepper
            v-model="seats"
            :min="minSeats"
            :max="maxSeats"
            :decrement-label="$t('onboarding.organization.remove_seat')"
            :increment-label="$t('onboarding.organization.add_seat')"
            :aria-labelledby="titleId"
            :aria-describedby="detailsId" />
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
        <p class="onboarding-organization__note">
          {{ $t("onboarding.organization.seats_note") }}
        </p>
      </div>
    </div>

    <footer
      class="onboarding-organization__footer flex wrap align-center justify-between gap-small">
      <p v-if="error" class="onboarding-organization__error" role="alert">
        {{ error }}
      </p>
      <Button
        type="button"
        variant="secondary"
        icon="arrow-left"
        :disabled="loading"
        @click="$emit('back', computeDraft())">
        {{ $t("onboarding.organization.back") }}
      </Button>
      <Button
        type="submit"
        variant="primary"
        icon-right="lock"
        :loading="loading"
        :disabled="loading">
        {{ $t("onboarding.organization.submit") }}
      </Button>
    </footer>
  </form>
</template>
<script>
import { formsMixin } from "@/mixins/forms.js"
import EMPTY_FIELD from "@/const/emptyField"
import { testName } from "@/tools/fields/testName"
import { formatCurrencyAmount } from "@/tools/formatCurrencyAmount"
import { computeSeatPrice } from "@/tools/computeSeatPrice"
import FormInput from "@/components/molecules/FormInput.vue"
import NumberStepper from "@/components/molecules/NumberStepper.vue"
import OnboardingCheckoutSteps from "./OnboardingCheckoutSteps.vue"
import OnboardingPricingRow from "./OnboardingPricingRow.vue"
import OnboardingPricingTotal from "./OnboardingPricingTotal.vue"

// Limits of POST /cloud/subscriptions (createSchema in linto-studio-cloud-service routes/subscriptions.js)
const MAX_SEATS = 500
const MAX_ORGANIZATION_NAME_LENGTH = 200

export default {
  name: "OnboardingOrganizationStep",
  mixins: [formsMixin],
  components: {
    FormInput,
    NumberStepper,
    OnboardingCheckoutSteps,
    OnboardingPricingRow,
    OnboardingPricingTotal,
  },
  props: {
    // Business entry of the plan catalog (pricing.seatsIncluded, amountCents…)
    plan: { type: Object, required: true },
    billingPeriod: { type: String, required: true },
    // { organizationName, seats }
    draft: { type: Object, required: true },
    loading: { type: Boolean, default: false },
    error: { type: String, default: "" },
  },
  data() {
    return {
      fields: ["nameField"],
      nameField: {
        ...EMPTY_FIELD,
        value: this.draft.organizationName || "",
        label: this.$t("onboarding.organization.name_label"),
        placeholder: this.$t("onboarding.organization.name_placeholder"),
        testField: testName,
        customParams: { maxlength: MAX_ORGANIZATION_NAME_LENGTH },
      },
      // A fresh draft, or one saved before seats existed, starts at the floor
      seats: Math.max(this.draft.seats || 0, this.plan.pricing.seatsIncluded),
    }
  },
  computed: {
    minSeats() {
      return this.plan.pricing.seatsIncluded
    },
    maxSeats() {
      return MAX_SEATS
    },
    seatPrice() {
      return computeSeatPrice(this.plan.pricing, this.billingPeriod)
    },
    totalCents() {
      return this.seats * this.seatPrice.amountCents
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
          seats: this.seats,
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
    computeDraft() {
      return {
        organizationName: this.nameField.value.trim(),
        seats: this.seats,
      }
    },
    submit() {
      if (!this.testFields()) return
      this.$emit("submit", this.computeDraft())
    },
  },
}
</script>

<style lang="scss" scoped>
.onboarding-organization__body {
  padding: var(--large-gap);
}

.onboarding-organization__title {
  margin: 0;
  font-size: var(--text-2xl);
}

.onboarding-organization__description,
.onboarding-organization__note {
  margin: 0;
  color: var(--text-secondary);
}

.onboarding-organization__note {
  font-size: var(--text-xs);
}

.onboarding-organization__footer {
  padding: var(--medium-gap) var(--large-gap);
  border-top: var(--border-block);
  background: var(--neutral-10);
}

.onboarding-organization__error {
  flex-basis: 100%;
  margin: 0;
  font-size: var(--text-sm);
  color: var(--danger-color);
}
</style>
