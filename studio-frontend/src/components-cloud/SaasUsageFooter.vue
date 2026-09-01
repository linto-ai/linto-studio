<template>
  <!-- A compact usage REMINDER only. Subscription management lives in the org
       settings page; clicking the footer takes you there. -->
  <button
    type="button"
    class="saas-usage-footer"
    :title="$t('billing.page.manage')"
    @click="goToOrgSettings">
    <div class="saas-usage-footer__title">
      <span>{{ $t("billing.page.usage") }}</span>
      <span class="saas-usage-footer__plan" :class="{ paid: isPaid }">{{
        planLabel || $t("billing.page.free_plan")
      }}</span>
    </div>

    <div class="saas-usage-footer__meter" v-if="isFree && primaryMeter">
      <div class="saas-usage-footer__meter-head">
        <span class="saas-usage-footer__meter-label">{{
          $t(primaryMeter.label)
        }}</span>
        <span class="saas-usage-footer__meter-value">{{
          usedOfLimit(primaryMeter)
        }}</span>
      </div>
      <div class="saas-usage-footer__bar">
        <div
          class="saas-usage-footer__bar-fill"
          :class="{ full: primaryMeter.remaining <= 0 }"
          :style="{ width: primaryMeter.percent + '%' }"></div>
      </div>
      <div class="saas-usage-footer__reset" v-if="primaryMeter.resetAt">
        {{ $t("billing.reset_on", { date: formatDate(primaryMeter.resetAt) }) }}
      </div>
    </div>

    <div v-else-if="!isFree" class="saas-usage-footer__premium">
      ★ {{ $t("billing.feature.unlimited") }}
    </div>
  </button>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

export default {
  name: "SaasUsageFooter",
  computed: {
    ...mapGetters("billing", ["isFree", "isPaid", "planLabel", "primaryMeter"]),
    ...mapGetters("organizations", {
      currentOrgScope: "getCurrentOrganizationScope",
    }),
  },
  watch: {
    currentOrgScope() {
      this.loadBilling()
    },
  },
  mounted() {
    this.loadBilling()
  },
  methods: {
    ...mapActions("billing", ["refresh"]),
    loadBilling() {
      if (this.currentOrgScope) this.refresh(this.currentOrgScope)
    },
    // Subscription management lives in the org settings page.
    goToOrgSettings() {
      if (!this.currentOrgScope) return
      const target = {
        name: "organizations update",
        params: { organizationId: this.currentOrgScope },
      }
      if (this.$route.name !== "organizations update") {
        this.$router.push(target).catch(() => {})
      }
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
        })
      } catch (e) {
        return ""
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.saas-usage-footer {
  // reset <button> defaults — this is a full-width clickable reminder card
  width: 100%;
  text-align: left;
  font: inherit;
  cursor: pointer;
  padding: 0.75em 1em;
  border: none;
  border-top: 1px solid var(--neutral-40);
  background-color: var(--neutral-10);
  display: flex;
  flex-direction: column;
  gap: 0.5em;

  &:hover {
    background-color: var(--neutral-20);
  }

  &__title {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5em;
    flex-wrap: wrap;
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--neutral-60);
  }
  &__plan {
    font-weight: 700;
    text-transform: none;
    letter-spacing: 0;
    color: var(--neutral-70);
    &.premium {
      color: var(--primary-color);
    }
  }

  &__meter-head {
    display: flex;
    justify-content: space-between;
    font-size: 0.74rem;
    color: var(--neutral-80);
    margin-bottom: 0.25em;
  }
  &__meter-value {
    font-weight: 600;
  }
  &__bar {
    height: 6px;
    border-radius: 3px;
    background: var(--neutral-30);
    overflow: hidden;
  }
  &__bar-fill {
    height: 100%;
    background: var(--primary-color);
    transition: width 0.3s ease;
    &.full {
      background: var(--error-color, #e5484d);
    }
  }
  &__reset {
    font-size: 0.68rem;
    color: var(--neutral-60);
    margin-top: 0.25em;
  }
  &__premium {
    font-size: 0.78rem;
    color: var(--neutral-70);
  }
}
</style>
