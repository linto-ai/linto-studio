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
      class="saas-usage-footer__bar"
      :value="progressValue"
      :max="progressMax"></progress>

    <button
      type="button"
      class="saas-usage-footer__details flex row align-center justify-between custom"
      @click="$emit('open-details')">
      <time v-if="primaryMeter.resetAt" :datetime="primaryMeter.resetAt">
        {{ $t("billing.reset_on", { date: resetDateLabel }) }}
      </time>
      <PhIcon name="caret-right" size="xs" color="neutral" />
    </button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

import PhIcon from "@/components/atoms/PhIcon.vue"
import { formatMinutesDuration } from "@/tools/formatMinutesDuration.js"
import { formatDateDayMonth } from "@/tools/formatDateDayMonth.js"

export default {
  name: "SaasUsageFooter",
  components: { PhIcon },
  computed: {
    ...mapGetters("billing", [
      "isPaid",
      "isUnmetered",
      "planLabel",
      "primaryMeter",
    ]),
    usageLabel() {
      const meter = this.primaryMeter
      return this.$t("billing.footer.usage", {
        used: this.formatMeterAmount(meter.used),
        total: meter.unlimited ? "∞" : this.formatMeterAmount(meter.limit),
      })
    },
    progressValue() {
      return this.primaryMeter.unlimited ? 1 : this.primaryMeter.used
    },
    progressMax() {
      return this.primaryMeter.unlimited ? 1 : this.primaryMeter.limit
    },
    resetDateLabel() {
      return formatDateDayMonth(this.primaryMeter.resetAt)
    },
  },
  methods: {
    ...mapActions("billing", ["openUpgradeModal"]),
    formatMeterAmount(amount) {
      return this.primaryMeter.unit === "minutes"
        ? formatMinutesDuration(amount)
        : amount
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

  &__label {
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
