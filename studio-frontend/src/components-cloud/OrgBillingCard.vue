<template>
  <details class="org-billing-card" :open="open">
    <summary class="org-billing-card__summary">
      <ph-icon name="caret-right" size="sm" class="org-billing-card__caret" />
      <Avatar :icon="org.icon" size="lg" tone="soft" border />
      <span class="org-billing-card__info">
        <span class="org-billing-card__name-row">
          <span class="org-billing-card__name">{{ org.name }}</span>
          <Chip :value="org.planLabel" :primary="!org.isFree" />
        </span>
        <span class="org-billing-card__subtitle">{{ org.subtitleLabel }}</span>
      </span>
      <span class="org-billing-card__price">
        <strong>{{ org.priceLabel }}</strong>
        <small v-if="org.priceSubLabel">{{ org.priceSubLabel }}</small>
      </span>
    </summary>

    <div class="org-billing-card__body">
      <div class="org-billing-card__tiles">
        <LiveCreditStatus
          v-if="org.liveCredit"
          :balance="org.liveCredit.balance"
          :expires-at-label="org.liveCredit.expiresAtLabel"
          :unmetered="org.liveCredit.unmetered" />
        <QuotaMeter
          v-for="meter in org.meters"
          :key="meter.key"
          :label="$t(meter.labelKey)"
          :used="meter.used"
          :limit="meter.limit"
          :unit="meter.unit" />
      </div>

      <!-- Not wired yet: per-org member usage detail (MemberUsageTable) needs
           a target/route decision. -->
      <a
        v-if="org.showMemberConsumptionLink"
        href="#"
        class="org-billing-card__member-link"
        @click.prevent
        >{{ $t("billing.account.member_consumption_link") }} →</a
      >
    </div>

    <footer class="org-billing-card__footer">
      <span v-if="footerLabel" class="org-billing-card__footer-label">{{
        footerLabel
      }}</span>
      <Button
        v-if="canBuyLivePack"
        variant="secondary"
        size="sm"
        icon="plus"
        :disabled="!org.liveCredit.purchasable"
        :title="
          org.liveCredit.purchasable
            ? null
            : $t('billing.live.not_purchasable')
        "
        @click="onBuyLiveMinutes">
        {{ $t("billing.live.buy") }}
      </Button>
      <Button
        v-if="org.isFree"
        variant="primary"
        size="sm"
        icon="sparkle"
        @click="$emit('upgrade')">
        {{ $t("billing.account.upgrade_premium") }}
      </Button>
      <Button
        v-if="org.isPaid"
        variant="secondary"
        size="sm"
        @click="onManageSubscriptionClick">
        {{ $t("billing.account.manage_subscription") }}
      </Button>
    </footer>
  </details>
</template>

<script>
import { bus } from "@/main.js"
import LiveCreditStatus from "@/components/molecules/LiveCreditStatus.vue"

export default {
  name: "OrgBillingCard",
  components: { LiveCreditStatus },
  props: {
    org: { type: Object, required: true },
    open: { type: Boolean, default: false },
  },
  computed: {
    canBuyLivePack() {
      return !!this.org.liveCredit && !this.org.liveCredit.unmetered
    },
    // Paid orgs show their renewal date, which also bounds the quota
    // period; free orgs only have the quota reset date.
    footerLabel() {
      if (this.org.renewalLabel) return this.org.renewalLabel
      if (!this.org.resetDateLabel) return null
      return this.$t("billing.account.reset_on", {
        date: this.org.resetDateLabel,
      })
    },
  },
  methods: {
    onManageSubscriptionClick() {
      // Subscription management goes through the Stripe Customer Portal,
      // not shipped yet.
      bus.$emit("app_notif", {
        status: "info",
        message: this.$t("billing.page.portal_soon"),
        timeout: 4000,
      })
    },
    onBuyLiveMinutes() {
      // Pack purchase through Stripe Checkout arrives in J2.
      bus.$emit("app_notif", {
        status: "info",
        message: this.$t("billing.live.buy_soon"),
        timeout: 4000,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.org-billing-card {
  // Summary padding + caret + gap + avatar + gap: lines the expanded
  // content up with the org name column.
  --content-inset: calc(1em + 1.25rem + 0.75em + 1.75rem + 0.75em);

  border: 1px solid var(--neutral-20);
  border-radius: 4px;
  background: var(--background-primary);
  box-shadow: var(--shadow-1);

  & + & {
    margin-top: 0.75em;
  }

  &__summary {
    display: flex;
    align-items: center;
    gap: 0.75em;
    padding: 0.85em 1em;
    cursor: pointer;
    list-style: none;

    &::-webkit-details-marker {
      display: none;
    }
  }

  &__caret {
    transition: transform 0.15s ease;
    flex-shrink: 0;
  }

  &[open] &__caret {
    transform: rotate(90deg);
  }

  &__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.15em;
    min-width: 0;
  }

  &__name-row {
    display: flex;
    align-items: center;
    gap: 0.5em;
  }

  &__name {
    font-weight: 600;
  }

  &__subtitle {
    color: var(--text-secondary);
    font-size: 0.85rem;
  }

  &__price {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    line-height: 1.2;

    small {
      color: var(--text-secondary);
      font-size: 0.78rem;
    }
  }

  &__body {
    padding: 0 1em 1em var(--content-inset);
  }

  &__tiles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(8.5rem, 1fr));
    gap: 0.75em;
  }

  &__member-link {
    display: inline-block;
    margin-top: 0.75em;
    font-size: 0.85rem;
    color: var(--primary-color);
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 0.75em;
    padding: 0.75em 1em 0.75em var(--content-inset);
    border-top: 1px solid var(--neutral-20);
  }

  &__footer-label {
    flex: 1;
    font-size: 0.85rem;
    color: var(--text-secondary);
  }
}
</style>
