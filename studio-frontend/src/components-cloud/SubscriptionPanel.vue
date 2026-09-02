<template>
  <div class="sub-panel">
    <div class="sub-panel__head">
      <h2 class="sub-panel__title">{{ $t("billing.page.title") }}</h2>
      <div
        class="sub-panel__badge"
        :class="{ paid: isPaid, unmetered: isUnmetered }">
        <span v-if="isUnmetered">★ {{ $t("billing.mode." + mode) }}</span>
        <span v-else-if="isPaid">★ {{ planLabel }}</span>
        <span v-else>{{ $t("billing.page.free_plan") }}</span>
      </div>
    </div>

    <!-- Usage meters -->
    <div class="sub-panel__section">
      <h3 class="sub-panel__h3">{{ $t("billing.page.usage") }}</h3>
      <div v-if="meters.length" class="billing-meters">
        <div v-for="m in meters" :key="m.key" class="billing-meter">
          <div class="billing-meter__head">
            <span class="billing-meter__label">{{ $t(m.label) }}</span>
            <span class="billing-meter__value">{{ usedOfLimit(m) }}</span>
          </div>
          <div class="billing-meter__bar">
            <div
              class="billing-meter__fill"
              :class="{
                full: !m.unlimited && m.remaining <= 0,
                unlimited: m.unlimited,
              }"
              :style="{ width: (m.unlimited ? 100 : m.percent) + '%' }"></div>
          </div>
          <div class="billing-meter__reset" v-if="m.resetAt && !m.unlimited">
            {{ $t("billing.reset_on", { date: formatDate(m.resetAt) }) }}
          </div>
        </div>
      </div>
      <p v-else class="sub-panel__empty">{{ $t("billing.page.no_usage") }}</p>
    </div>

    <!-- Live balance (prepaid minutes) -->
    <div class="sub-panel__section" v-if="live">
      <h3 class="sub-panel__h3">{{ $t("billing.live.title") }}</h3>
      <p v-if="live.unmetered" class="sub-panel__empty">
        {{ $t("billing.live.unmetered") }}
      </p>
      <template v-else>
        <dl class="billing-detail">
          <div class="billing-detail__row">
            <dt>{{ $t("billing.live.balance") }}</dt>
            <dd :class="{ 'billing-detail__warn': live.lowBalance }">
              {{ fmtMinutes(live.balance) }}
            </dd>
          </div>
          <div class="billing-detail__row" v-if="live.expiresAt">
            <dt>{{ $t("billing.live.expires") }}</dt>
            <dd>{{ formatDate(live.expiresAt) }}</dd>
          </div>
        </dl>
        <p v-if="live.lowBalance" class="billing-plan__note">
          {{ $t("billing.live.low") }}
        </p>
        <div class="billing-plan__row">
          <Button
            v-if="isOrgAdmin"
            variant="primary"
            :disabled="!live.purchasable"
            :title="live.purchasable ? null : $t('billing.live.not_purchasable')"
            @click="buyMinutes">
            {{ $t("billing.live.buy") }}
          </Button>
        </div>
      </template>
    </div>

    <!-- Plan & management -->
    <div class="sub-panel__section">
      <h3 class="sub-panel__h3">{{ $t("billing.page.your_plan") }}</h3>

      <p v-if="isUnmetered" class="sub-panel__empty">
        {{ $t("billing.page.unmetered_hint") }}
      </p>

      <div v-else-if="isFree" class="billing-plan">
        <p class="billing-plan__pitch">{{ $t("billing.upgrade_subtitle") }}</p>
        <div class="billing-plan__row">
          <Button
            v-if="isOrgAdmin"
            variant="primary"
            @click="showUpgrade = true">
            {{ $t("billing.upgrade_cta") }}
          </Button>
          <span v-else class="billing-plan__note">{{
            $t("billing.page.admin_only")
          }}</span>
        </div>
      </div>

      <div v-else class="billing-plan">
        <p class="billing-plan__pitch" v-if="currentPlan">
          {{ currentPlan.description }}
        </p>
        <dl class="billing-detail">
          <div class="billing-detail__row" v-if="isPerSeat">
            <dt>{{ $t("billing.page.seats") }}</dt>
            <dd>{{ seats }}</dd>
          </div>
          <div class="billing-detail__row" v-if="renewalDate">
            <dt>{{ $t("billing.page.renews") }}</dt>
            <dd>{{ formatDate(renewalDate) }}</dd>
          </div>
          <div
            class="billing-detail__row"
            v-if="subscription && subscription.cancelAtPeriodEnd">
            <dt>{{ $t("billing.page.status") }}</dt>
            <dd class="billing-detail__warn">
              {{ $t("billing.page.cancels_at_period_end") }}
            </dd>
          </div>
        </dl>
        <div class="billing-plan__row" v-if="isOrgAdmin">
          <Button variant="secondary" @click="managePortal">
            {{ $t("billing.page.manage") }}
          </Button>
        </div>
      </div>
    </div>

    <UpgradeModal v-if="showUpgrade" @close="onUpgradeClose" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import { bus } from "@/main.js"
import Button from "@/components/atoms/Button.vue"
import UpgradeModal from "@/components-cloud/UpgradeModal.vue"
import { ORGANIZATION_ROLES } from "@/const/organizationRoles"

export default {
  name: "SubscriptionPanel",
  components: { Button, UpgradeModal },
  data() {
    return { showUpgrade: false }
  },
  computed: {
    ...mapGetters("billing", [
      "isFree",
      "isPaid",
      "isPerSeat",
      "isUnmetered",
      "mode",
      "planLabel",
      "currentPlan",
      "meters",
      "subscription",
      "usage",
      "live",
    ]),
    ...mapGetters("organizations", {
      currentOrgScope: "getCurrentOrganizationScope",
      userRoleInOrg: "getUserRoleInOrganization",
    }),
    isOrgAdmin() {
      return (this.userRoleInOrg || 0) >= ORGANIZATION_ROLES.ADMINISTRATOR
    },
    seats() {
      return this.subscription?.seats || this.usage?.seats || 1
    },
    renewalDate() {
      return this.subscription?.currentPeriodEnd || null
    },
  },
  watch: {
    currentOrgScope() {
      this.load()
    },
  },
  mounted() {
    this.load()
  },
  methods: {
    ...mapActions("billing", ["refresh", "fetchSubscriptions"]),
    load() {
      if (!this.currentOrgScope) return
      this.refresh(this.currentOrgScope)
      // Admin-guarded route: only ask for it when the caller can read it.
      if (this.isOrgAdmin) this.fetchSubscriptions(this.currentOrgScope)
    },
    onUpgradeClose() {
      this.showUpgrade = false
      this.load()
    },
    // Stripe Customer Portal (invoices, card, cancellation) arrives in J2.
    managePortal() {
      bus.$emit("app_notif", {
        status: "info",
        message: this.$t("billing.page.portal_soon"),
        timeout: 4000,
      })
    },
    // Pack purchase through Stripe Checkout arrives in J2.
    buyMinutes() {
      bus.$emit("app_notif", {
        status: "info",
        message: this.$t("billing.live.buy_soon"),
        timeout: 4000,
      })
    },
    usedOfLimit(m) {
      return this.$t("billing.used_of", {
        used: this.fmt(m, m.used),
        total: m.unlimited ? "∞" : this.fmt(m, m.limit),
      })
    },
    fmt(m, v) {
      return m.unit === "minutes" ? this.fmtMinutes(v) : v
    },
    fmtMinutes(min) {
      min = Math.round(min || 0)
      const h = Math.floor(min / 60)
      const mn = min % 60
      if (h > 0) return `${h}h${mn > 0 ? mn + "min" : ""}`
      return `${mn}min`
    },
    formatDate(iso) {
      try {
        return new Date(iso).toLocaleDateString(this.$i18n?.locale || "fr-FR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      } catch (e) {
        return ""
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.sub-panel {
  margin-top: 1.5em;
  display: flex;
  flex-direction: column;
  gap: 1.25em;

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__title {
    margin: 0;
  }
  &__badge {
    flex-shrink: 0;
    padding: 0.3em 0.75em;
    border-radius: 999px;
    background: var(--neutral-20);
    color: var(--neutral-80);
    font-weight: 600;
    font-size: 0.82rem;
    &.paid {
      background: var(--primary-color);
      color: #fff;
    }
    &.unmetered {
      background: var(--success-color, #30a46c);
      color: #fff;
    }
  }
  &__section {
    background: var(--neutral-0, #fff);
    border: 1px solid var(--neutral-30);
    border-radius: 10px;
    padding: 1.1em 1.25em;
  }
  &__h3 {
    margin: 0 0 0.75em;
    font-size: 1rem;
  }
  &__empty {
    color: var(--neutral-60);
    font-size: 0.9rem;
    margin: 0;
  }
}

.billing-meters {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.billing-meter {
  &__head {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    margin-bottom: 0.3em;
  }
  &__value {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
  &__bar {
    height: 8px;
    border-radius: 4px;
    background: var(--neutral-30);
    overflow: hidden;
  }
  &__fill {
    height: 100%;
    background: var(--primary-color);
    transition: width 0.3s ease;
    &.full {
      background: var(--error-color, #e5484d);
    }
    &.unlimited {
      background: var(--success-color, #30a46c);
      opacity: 0.5;
    }
  }
  &__reset {
    font-size: 0.72rem;
    color: var(--neutral-60);
    margin-top: 0.25em;
  }
}

.billing-plan {
  &__pitch {
    color: var(--neutral-70);
    font-size: 0.9rem;
    margin: 0 0 0.75em;
  }
  &__row {
    display: flex;
    align-items: center;
    gap: 0.75em;
    margin-top: 1em;
    flex-wrap: wrap;
  }
  &__note {
    color: var(--neutral-60);
    font-size: 0.85rem;
  }
}
.billing-detail {
  margin: 0;
  &__row {
    display: flex;
    justify-content: space-between;
    padding: 0.4em 0;
    border-bottom: 1px solid var(--neutral-20);
    font-size: 0.9rem;
    dt {
      color: var(--neutral-70);
    }
    dd {
      margin: 0;
      font-weight: 600;
    }
  }
  &__warn {
    color: var(--error-color, #e5484d);
  }
}
</style>
