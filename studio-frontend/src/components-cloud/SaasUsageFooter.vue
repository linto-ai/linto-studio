<template>
  <div class="saas-usage-footer">
    <div class="saas-usage-footer__brand">
      <span class="saas-usage-footer__brand-badge">L</span>
      <span>LINAGORA — {{ $t("billing.beta") }}</span>
    </div>

    <template v-if="isFree">
      <div class="saas-usage-footer__meter" v-if="primaryMeter">
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

      <Button
        variant="primary"
        size="sm"
        block
        class="saas-usage-footer__cta"
        @click="showUpgrade = true">
        {{ $t("billing.upgrade_cta") }}
      </Button>
    </template>

    <div v-else class="saas-usage-footer__premium">
      <span class="saas-usage-footer__premium-badge"
        >★ {{ $t("billing.premium") }}</span
      >
    </div>

    <button
      type="button"
      class="saas-usage-footer__manage"
      @click="goToBilling">
      {{ $t("billing.page.manage") }}
    </button>

    <UpgradeModal v-if="showUpgrade" @close="showUpgrade = false" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import Button from "@/components/atoms/Button.vue"
import UpgradeModal from "@/components-cloud/UpgradeModal.vue"

export default {
  name: "SaasUsageFooter",
  components: { Button, UpgradeModal },
  data() {
    return { showUpgrade: false }
  },
  computed: {
    ...mapGetters("billing", ["isFree", "isPremium", "primaryMeter", "meters"]),
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
    goToBilling() {
      const params = this.currentOrgScope
        ? { organizationId: this.currentOrgScope }
        : {}
      if (this.$route.name !== "billing") {
        this.$router.push({ name: "billing", params }).catch(() => {})
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
  padding: 0.75em 1em;
  border-top: 1px solid var(--neutral-40);
  background-color: var(--neutral-10);
  display: flex;
  flex-direction: column;
  gap: 0.5em;

  &__brand {
    display: flex;
    align-items: center;
    gap: 0.4em;
    font-size: 0.72rem;
    color: var(--neutral-70);
  }
  &__brand-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.1em;
    height: 1.1em;
    border-radius: 3px;
    background: var(--primary-color);
    color: #fff;
    font-weight: 700;
    font-size: 0.7rem;
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
  &__cta {
    margin-top: 0.25em;
  }
  &__premium-badge {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--primary-color);
  }
  &__manage {
    background: none;
    border: none;
    padding: 0;
    margin-top: 0.1em;
    align-self: flex-start;
    font-size: 0.72rem;
    color: var(--neutral-60);
    text-decoration: underline;
    cursor: pointer;
    &:hover {
      color: var(--primary-color);
    }
  }
}
</style>
