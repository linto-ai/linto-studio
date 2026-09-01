<template>
  <div class="sub-panel">
    <div class="sub-panel__head">
      <h2 class="sub-panel__title">{{ $t("billing.page.title") }}</h2>
      <div
        class="sub-panel__badge"
        :class="{ paid: isPaid, comp: billingExempt }">
        <span v-if="billingExempt">★ {{ $t("billing.page.comp") }}</span>
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
          <!-- Live (direct) breakdown: per-profile minutes + translation languages -->
          <div
            v-if="m.key === 'live.duration' && liveDetail"
            class="billing-meter__detail">
            <span v-if="liveDetail.channels != null">{{
              $t("billing.live.channels", { n: liveDetail.channels })
            }}</span>
            <span
              v-if="
                liveDetail.translationLangs &&
                liveDetail.translationLangs.length
              "
              >{{
                $t("billing.live.translations", {
                  langs: liveDetail.translationLangs.join(", "),
                })
              }}</span
            >
            <span
              v-for="(secs, cat) in liveDetail.byProfile"
              :key="cat"
              class="billing-meter__chip">
              {{ $t("billing.live.profile." + cat) }}: {{ fmtDuration(secs) }}
            </span>
          </div>
          <div class="billing-meter__reset" v-if="m.resetAt && !m.unlimited">
            {{ $t("billing.reset_on", { date: formatDate(m.resetAt) }) }}
          </div>
        </div>
      </div>
      <p v-else class="sub-panel__empty">{{ $t("billing.page.no_usage") }}</p>
    </div>

    <!-- Plan & management -->
    <div class="sub-panel__section">
      <h3 class="sub-panel__h3">{{ $t("billing.page.your_plan") }}</h3>

      <!-- Comp / complete-free org: managed from the backoffice -->
      <p v-if="billingExempt" class="sub-panel__comp">
        {{ $t("billing.page.comp_hint") }}
      </p>

      <!-- FREE -->
      <div v-else-if="isFree" class="billing-plan">
        <p class="billing-plan__pitch">{{ $t("billing.upgrade_subtitle") }}</p>
        <ul class="billing-features">
          <li>{{ $t("billing.feature.unlimited") }}</li>
          <li>{{ $t("billing.feature.collaboration") }}</li>
          <li>{{ $t("billing.feature.speaker_id") }}</li>
          <li>{{ $t("billing.feature.no_watermark") }}</li>
          <li>{{ $t("billing.feature.api") }}</li>
        </ul>
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

      <!-- PAID (flat solo or per-seat team) -->
      <div v-else class="billing-plan">
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
        <div
          class="billing-plan__row"
          v-if="isOrgAdmin && subscription && !subscription.cancelAtPeriodEnd">
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
    </div>

    <!-- Invoices -->
    <div class="sub-panel__section" v-if="isOrgAdmin && invoices.length">
      <h3 class="sub-panel__h3">{{ $t("billing.invoices.title") }}</h3>
      <table class="sub-panel__invoices">
        <thead>
          <tr>
            <th>{{ $t("billing.invoices.date") }}</th>
            <th>{{ $t("billing.invoices.amount") }}</th>
            <th>{{ $t("billing.invoices.status") }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="inv in invoices" :key="inv.id">
            <td>{{ formatDate(inv.created) }}</td>
            <td>{{ fmtAmount(inv.amount, inv.currency) }}</td>
            <td>{{ inv.status }}</td>
            <td class="sub-panel__invoice-dl">
              <a
                v-if="inv.pdf || inv.url"
                :href="inv.pdf || inv.url"
                target="_blank"
                rel="noopener">
                {{ $t("billing.invoices.download") }}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <UpgradeModal v-if="showUpgrade" @close="onUpgradeClose" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import Button from "@/components/atoms/Button.vue"
import UpgradeModal from "@/components-cloud/UpgradeModal.vue"

const ADMIN = 6 // lib/dao/organization/roles: ADMIN

export default {
  name: "SubscriptionPanel",
  components: { Button, UpgradeModal },
  data() {
    return { showUpgrade: false, busy: false, confirmingCancel: false }
  },
  computed: {
    ...mapGetters("billing", [
      "isFree",
      "isPaid",
      "isPerSeat",
      "planLabel",
      "meters",
      "subscription",
      "usage",
      "invoices",
      "liveDetail",
    ]),
    ...mapGetters("organizations", {
      currentOrgScope: "getCurrentOrganizationScope",
      userRoleInOrg: "getUserRoleInOrganization",
    }),
    isOrgAdmin() {
      return (this.userRoleInOrg || 0) >= ADMIN
    },
    seats() {
      return this.subscription?.seats || this.usage?.seats || 1
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
    ...mapActions("billing", ["refresh", "cancel", "fetchInvoices"]),
    load() {
      if (!this.currentOrgScope) return
      this.refresh(this.currentOrgScope)
      this.fetchInvoices(this.currentOrgScope)
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
    fmtAmount(cents, currency) {
      const v = (cents || 0) / 100
      try {
        return new Intl.NumberFormat(this.$i18n?.locale || "fr-FR", {
          style: "currency",
          currency: (currency || "eur").toUpperCase(),
        }).format(v)
      } catch (e) {
        return `${v.toFixed(2)} ${(currency || "eur").toUpperCase()}`
      }
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
    &.premium {
      background: var(--primary-color);
      color: #fff;
    }
    &.comp {
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
  &__empty,
  &__comp {
    color: var(--neutral-60);
    font-size: 0.9rem;
    margin: 0;
  }
  &__invoices {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.88rem;
    th,
    td {
      text-align: left;
      padding: 0.45em 0.6em;
      border-bottom: 1px solid var(--neutral-20);
    }
    th {
      color: var(--neutral-60);
      font-weight: 600;
      font-size: 0.78rem;
    }
  }
  &__invoice-dl {
    text-align: right;
    a {
      color: var(--primary-color);
      text-decoration: underline;
    }
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
  &__detail {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4em;
    margin-top: 0.35em;
    font-size: 0.72rem;
    color: var(--neutral-70);
  }
  &__chip {
    background: var(--neutral-20);
    border-radius: 4px;
    padding: 0.05em 0.4em;
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
