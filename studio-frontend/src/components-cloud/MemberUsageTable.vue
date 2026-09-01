<template>
  <div class="member-usage">
    <div class="member-usage__head">
      <h3 class="member-usage__title">
        {{ $t("billing.member_usage.title") }}
      </h3>
      <div class="member-usage__plan">
        <span class="member-usage__plan-name">{{ planLabel }}</span>
        <span class="member-usage__seats">{{
          $t("billing.member_usage.seats", { n: seatCount })
        }}</span>
      </div>
    </div>

    <table class="member-usage__table" v-if="rows.length">
      <thead>
        <tr>
          <th>{{ $t("billing.member_usage.member") }}</th>
          <th>{{ $t("billing.member_usage.seat") }}</th>
          <th>{{ $t("billing.meter.import") }}</th>
          <th>{{ $t("billing.meter.ai") }}</th>
          <th>{{ $t("billing.meter.live") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="m in rows" :key="m.userId">
          <td class="member-usage__member">
            <UserInfoInline
              v-if="m.user"
              :user="m.user"
              :userId="m.userId"
              :role="m.role" />
            <span v-else class="member-usage__uid">{{ m.userId }}</span>
          </td>
          <td>
            <span v-if="m.isSeat" class="member-usage__badge" :title="$t('billing.member_usage.billable')">●</span>
            <span v-else class="member-usage__free">—</span>
          </td>
          <td>{{ fmtDuration(m.import) }}</td>
          <td>{{ m.ai }}</td>
          <td>{{ fmtDuration(m.live) }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else class="member-usage__empty">
      {{ $t("billing.member_usage.empty") }}
    </p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import UserInfoInline from "@/components/molecules/UserInfoInline.vue"

// Org role threshold for a billable seat (lib/dao/organization/roles: UPLOADER).
const UPLOADER = 2

export default {
  name: "MemberUsageTable",
  components: { UserInfoInline },
  computed: {
    ...mapGetters("billing", ["usageByMember", "planLabel"]),
    ...mapGetters("organizations", {
      currentOrganization: "getCurrentOrganization",
      allUsers: "getCurrentOrganizationAllUsers",
      currentOrgScope: "getCurrentOrganizationScope",
    }),

    rows() {
      const members =
        (this.currentOrganization && this.currentOrganization.users) || []
      const usage = (this.usageByMember && this.usageByMember.members) || {}
      const all = this.allUsers || []
      return members.map((m) => {
        const u = usage[m.userId] || {}
        return {
          userId: m.userId,
          // full user object (name/avatar) resolved like every other
          // UserInfoInline caller; undefined until allUsers loads (guarded in template).
          user: all.find((x) => x._id === m.userId),
          role: m.role,
          isSeat: m.role >= UPLOADER,
          import: (u["media.import.duration"] || {}).used || 0,
          ai: (u["ai.insights.count"] || {}).used || 0,
          live: (u["live.duration"] || {}).used || 0,
        }
      })
    },
    seatCount() {
      if (this.usageByMember && typeof this.usageByMember.seats === "number")
        return this.usageByMember.seats
      return this.rows.filter((r) => r.isSeat).length
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
    ...mapActions("billing", ["fetchUsageByMember"]),
    ...mapActions("organizations", ["loadCurrentOrganizationAllUsers"]),
    load() {
      if (!this.currentOrgScope) return
      this.fetchUsageByMember(this.currentOrgScope)
      this.loadCurrentOrganizationAllUsers()
    },
    fmtDuration(sec) {
      sec = Math.round(sec || 0)
      const h = Math.floor(sec / 3600)
      const mn = Math.round((sec % 3600) / 60)
      if (h > 0) return `${h}h${mn > 0 ? mn + "min" : ""}`
      return `${mn}min`
    },
  },
}
</script>

<style lang="scss" scoped>
.member-usage {
  margin-top: 1.5em;

  &__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 0.5em;
  }
  &__title {
    margin: 0;
  }
  &__plan {
    display: flex;
    gap: 0.5em;
    align-items: center;
    font-size: 0.85rem;
  }
  &__plan-name {
    font-weight: 600;
    color: var(--primary-color);
  }
  &__seats {
    color: var(--neutral-60);
  }
  &__table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.88rem;

    th,
    td {
      text-align: left;
      padding: 0.5em 0.75em;
      border-bottom: 1px solid var(--neutral-30);
    }
    th {
      color: var(--neutral-60);
      font-weight: 600;
      font-size: 0.78rem;
    }
    td:nth-child(n + 3),
    th:nth-child(n + 3) {
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
  }
  &__badge {
    color: var(--success-color, #30a46c);
  }
  &__free {
    color: var(--neutral-40);
  }
  &__empty {
    color: var(--neutral-60);
    font-size: 0.88rem;
  }
}
</style>
