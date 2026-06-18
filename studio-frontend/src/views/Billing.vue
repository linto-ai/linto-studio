<template>
  <div class="billing-page" v-if="isCloud">
    <div class="billing-page__inner">
      <header class="billing-page__header">
        <div>
          <h1 class="billing-page__title">{{ $t("billing.page.title") }}</h1>
          <p class="billing-page__sub">{{ $t("billing.page.subtitle") }}</p>
        </div>
        <div class="billing-page__badge" :class="{ premium: isPremium }">
          <span v-if="isPremium">★ {{ $t("billing.premium") }}</span>
          <span v-else>{{ $t("billing.page.free_plan") }}</span>
        </div>
      </header>

      <!-- Usage meters -->
      <section class="billing-card">
        <h2 class="billing-card__title">{{ $t("billing.page.usage") }}</h2>
        <div v-if="meters.length" class="billing-meters">
          <div v-for="m in meters" :key="m.key" class="billing-meter">
            <div class="billing-meter__head">
              <span class="billing-meter__label">{{ $t(m.label) }}</span>
              <span class="billing-meter__value">{{ usedOfLimit(m) }}</span>
            </div>
            <div class="billing-meter__bar">
              <div
                class="billing-meter__fill"
                :class="{ full: !m.unlimited && m.remaining <= 0, unlimited: m.unlimited }"
                :style="{ width: (m.unlimited ? 100 : m.percent) + '%' }"></div>
            </div>
            <div class="billing-meter__reset" v-if="m.resetAt && !m.unlimited">
              {{ $t("billing.reset_on", { date: formatDate(m.resetAt) }) }}
            </div>
          </div>
        </div>
        <p v-else class="billing-card__empty">{{ $t("billing.page.no_usage") }}</p>
      </section>

      <!-- Plan & management -->
      <section class="billing-card">
        <h2 class="billing-card__title">{{ $t("billing.page.your_plan") }}</h2>

        <!-- FREE: feature comparison + upgrade -->
        <div v-if="isFree" class="billing-plan">
          <p class="billing-plan__pitch">{{ $t("billing.upgrade_subtitle") }}</p>
          <ul class="billing-features">
            <li>{{ $t("billing.feature.unlimited") }}</li>
            <li>{{ $t("billing.feature.collaboration") }}</li>
            <li>{{ $t("billing.feature.speaker_id") }}</li>
            <li>{{ $t("billing.feature.no_watermark") }}</li>
            <li>{{ $t("billing.feature.api") }}</li>
          </ul>
          <div class="billing-plan__row">
            <span class="billing-plan__price">{{ $t("billing.per_seat") }}</span>
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

        <!-- PREMIUM: subscription detail + cancel -->
        <div v-else class="billing-plan">
          <dl class="billing-detail">
            <div class="billing-detail__row">
              <dt>{{ $t("billing.page.seats") }}</dt>
              <dd>{{ seats }}</dd>
            </div>
            <div class="billing-detail__row" v-if="renewalDate">
              <dt>{{ $t("billing.page.renews") }}</dt>
              <dd>{{ formatDate(renewalDate) }}</dd>
            </div>
            <div class="billing-detail__row" v-if="billingExempt">
              <dt>{{ $t("billing.page.status") }}</dt>
              <dd>{{ $t("billing.page.comp") }}</dd>
            </div>
            <div
              class="billing-detail__row"
              v-else-if="subscription && subscription.cancelAtPeriodEnd">
              <dt>{{ $t("billing.page.status") }}</dt>
              <dd class="billing-detail__warn">
                {{ $t("billing.page.cancels_at_period_end") }}
              </dd>
            </div>
          </dl>

          <div
            class="billing-plan__row"
            v-if="isOrgAdmin && !billingExempt && subscription && !subscription.cancelAtPeriodEnd">
            <Button
              v-if="!confirmingCancel"
              variant="secondary"
              @click="confirmingCancel = true">
              {{ $t("billing.page.cancel_sub") }}
            </Button>
            <template v-else>
              <span class="billing-plan__confirm">{{
                $t("billing.page.cancel_confirm")
              }}</span>
              <Button variant="secondary" @click="confirmingCancel = false">{{
                $t("billing.cancel")
              }}</Button>
              <Button
                variant="secondary"
                intent="destructive"
                :loading="busy"
                @click="doCancel">
                {{ $t("billing.page.cancel_yes") }}
              </Button>
            </template>
          </div>
        </div>
      </section>

      <!-- Per-member usage (admins) -->
      <section class="billing-card" v-if="isOrgAdmin">
        <MemberUsageTable />
      </section>

      <UpgradeModal v-if="showUpgrade" @close="onUpgradeClose" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import { getEnv } from "@/tools/getEnv"
import Button from "@/components/atoms/Button.vue"
import UpgradeModal from "@/components-cloud/UpgradeModal.vue"
import MemberUsageTable from "@/components-cloud/MemberUsageTable.vue"

const IS_MODE_CLOUD = getEnv("VUE_APP_MODE") === "cloud"
const ADMIN = 6 // lib/dao/organization/roles: ADMIN

export default {
  name: "Billing",
  components: { Button, UpgradeModal, MemberUsageTable },
  data() {
    return { showUpgrade: false, busy: false, confirmingCancel: false }
  },
  computed: {
    ...mapGetters("billing", [
      "isFree",
      "isPremium",
      "meters",
      "subscription",
      "usage",
    ]),
    ...mapGetters("organizations", {
      currentOrgScope: "getCurrentOrganizationScope",
      userRoleInOrg: "getUserRoleInOrganization",
    }),
    isCloud() {
      return IS_MODE_CLOUD
    },
    isOrgAdmin() {
      return (this.userRoleInOrg || 0) >= ADMIN
    },
    seats() {
      return (
        this.subscription?.seats ||
        this.usage?.seats ||
        1
      )
    },
    billingExempt() {
      return !!this.subscription?.billingExempt || !!this.usage?.billingExempt
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
    ...mapActions("billing", ["refresh", "cancel"]),
    load() {
      if (this.currentOrgScope) this.refresh(this.currentOrgScope)
    },
    async doCancel() {
      this.busy = true
      try {
        await this.cancel({ immediate: false })
        this.confirmingCancel = false
      } finally {
        this.busy = false
      }
    },
    onUpgradeClose() {
      this.showUpgrade = false
      this.load()
    },
    usedOfLimit(m) {
      return this.$t("billing.used_of", {
        used: this.fmt(m, m.used),
        total: m.unlimited ? "∞" : this.fmt(m, m.limit),
      })
    },
    fmt(m, v) {
      return m.kind === "duration" ? this.fmtDuration(v) : v
    },
    fmtDuration(sec) {
      sec = Math.round(sec || 0)
      const h = Math.floor(sec / 3600)
      const mn = Math.round((sec % 3600) / 60)
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
.billing-page {
  padding: 1.5em;
  overflow-y: auto;

  &__inner {
    max-width: 760px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.25em;
  }
  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1em;
  }
  &__title {
    margin: 0;
    font-size: 1.5rem;
  }
  &__sub {
    margin: 0.2em 0 0;
    color: var(--neutral-70);
    font-size: 0.9rem;
  }
  &__badge {
    flex-shrink: 0;
    padding: 0.35em 0.8em;
    border-radius: 999px;
    background: var(--neutral-20);
    color: var(--neutral-80);
    font-weight: 600;
    font-size: 0.85rem;
    &.premium {
      background: var(--primary-color);
      color: #fff;
    }
  }
}

.billing-card {
  background: var(--neutral-0, #fff);
  border: 1px solid var(--neutral-30);
  border-radius: 10px;
  padding: 1.25em;

  &__title {
    margin: 0 0 0.75em;
    font-size: 1.05rem;
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
  &__price {
    font-weight: 600;
    flex: 1;
  }
  &__note,
  &__confirm {
    color: var(--neutral-60);
    font-size: 0.85rem;
  }
}

.billing-features {
  list-style: none;
  padding: 0;
  margin: 0;
  li {
    position: relative;
    padding: 0.25em 0 0.25em 1.5em;
    font-size: 0.9rem;
    &::before {
      content: "✓";
      position: absolute;
      left: 0;
      color: var(--success-color, #30a46c);
      font-weight: 700;
    }
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
