<template>
  <div class="saas-usage-footer flex col" v-if="!isUnmetered && primaryMeter">
    <div
      class="saas-usage-footer__summary flex row align-center justify-between gap-small">
      <p class="saas-usage-footer__label">
        <span class="saas-usage-footer__plan">{{ planLabel }}</span>
        <span aria-hidden="true"> · </span>
        <span>{{ usageLabel }}</span>
      </p>
      <button
        v-if="!isPaid"
        type="button"
        class="saas-usage-footer__upgrade"
        @click="openUpgradeModal()">
        {{ $t("billing.footer.upgrade_cta") }}
      </button>
    </div>

    <progress
      v-if="!primaryMeter.unlimited"
      class="saas-usage-footer__bar"
      :value="progressValue"
      :max="progressMax"></progress>

    <!-- The billing tab is for org admins: others only read the reset date -->
    <button
      v-if="isAdmin"
      type="button"
      class="saas-usage-footer__details flex row align-center justify-between custom"
      @click="openBillingDetails">
      <time v-if="primaryMeter.resetAt" :datetime="primaryMeter.resetAt">
        {{ $t("billing.reset_on", { date: resetDateLabel }) }}
      </time>
      <PhIcon name="caret-right" size="xs" color="neutral" />
    </button>
    <p v-else-if="primaryMeter.resetAt" class="saas-usage-footer__reset">
      <time :datetime="primaryMeter.resetAt">
        {{ $t("billing.reset_on", { date: resetDateLabel }) }}
      </time>
    </p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

import PhIcon from "@/components/atoms/PhIcon.vue"
import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { formatMinutesDuration } from "@/tools/formatMinutesDuration.js"
import { formatDateDayMonth } from "@/tools/formatDateDayMonth.js"

export default {
  name: "SaasUsageFooter",
  mixins: [orgaRoleMixin],
  components: { PhIcon },
  computed: {
    ...mapGetters("billing", [
      "isPaid",
      "isUnmetered",
      "planLabel",
      "primaryMeter",
    ]),
    // An unlimited quota has nothing to count against: the word says it all
    usageLabel() {
      const meter = this.primaryMeter
      if (meter.unlimited) return this.$t("billing.unlimited")
      return this.$t("billing.footer.usage", {
        used: this.formatMeterAmount(meter.used),
        total: this.formatMeterAmount(meter.limit),
      })
    },
    progressValue() {
      return this.primaryMeter.used
    },
    progressMax() {
      return this.primaryMeter.limit
    },
    resetDateLabel() {
      return formatDateDayMonth(this.primaryMeter.resetAt, this.$i18n.locale)
    },
  },
  methods: {
    ...mapActions("billing", ["openUpgradeModal"]),
    ...mapActions("settings", ["openModalOnTab"]),
    formatMeterAmount(amount) {
      return this.primaryMeter.unit === "minutes"
        ? formatMinutesDuration(amount)
        : amount
    },
    openBillingDetails() {
      this.openModalOnTab("billing")
    },
  },
}
</script>

<style lang="scss" scoped>
.saas-usage-footer {
  display: flex;
  flex-direction: column;
  gap: var(--tiny-gap);
  padding: 0.75em 1em 1em;

  &__label,
  &__reset {
    margin: 0;
    color: var(--text-secondary);
  }

  &__plan {
    font-weight: 700;
    color: var(--text-primary);
  }

  &__upgrade {
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    font-weight: 600;
    color: var(--primary-color);
    cursor: pointer;

    &:hover,
    &:focus-visible {
      text-decoration: underline;
    }
  }

  &__bar {
    width: 100%;
    height: 6px;
    border: none;
    border-radius: 3px;
    overflow: hidden;

    &::-webkit-progress-bar {
      background: var(--neutral-30);
      border-radius: 3px;
    }
    &::-moz-progress-bar {
      border-radius: 3px;
    }
  }

  &__details {
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    color: var(--text-secondary);
    cursor: pointer;
    align-self: stretch;

    &:hover,
    &:focus-visible {
      color: var(--text-primary);

      time {
        text-decoration: underline;
      }
    }
  }
}
</style>
