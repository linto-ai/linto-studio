<template>
  <section class="organization-users">
    <div class="flex row gap-medium align-center">
      <h2 style="width: auto">{{ $t("organisation.organization_users") }}</h2>
      <!-- Inviting a member is a team-plan capability in cloud mode. Locked:
           the button stays visible and opens the upgrade flow. -->
      <HasEntitlement v-if="canInvite" capability="collaboration">
        <UserInvite
          @inviteUser="addToMembers"
          @removeUser="removeFromMembers"
          :currentUsers="members"
          :usersEmailPending="usersEmailPending"
          :includeSelf="isBackofficePage"></UserInvite>
        <template #locked>
          <Button
            :label="$t('invite_user.button')"
            icon="lock"
            variant="secondary"
            size="sm"
            :title="$t('billing.feature_locked')"
            @click="lockedInvite" />
        </template>
      </HasEntitlement>
    </div>

    <IsCloud>
      <SeatsPanel
        v-if="hasSeatCapacity"
        :used="seatSummary.used"
        :capacity="seatSummary.capacity"
        @manage="displayManageModal = true" />
    </IsCloud>

    <Tabs v-model="activeTab" variant="secondary" :tabs="tabs" />

    <form class="organization-users__search" role="search" @submit.prevent>
      <SearchInput
        v-model="search"
        :label="$t('seats.search_label')"
        :placeholder="$t('seats.search_placeholder')" />
    </form>

    <SeatSelectionBar
      v-if="isMembersTab && selectedIds.length"
      :count="selectedIds.length"
      :caption="selectionCaption"
      @clear="clearSelection"
      @grant="openGrantSeats(selectedMembers)" />

    <GenericTable
      v-if="visibleRows.length > 0"
      :key="activeTab"
      :columns="columns"
      :content="visibleRows"
      :sortListKey="sort.key"
      :sortListDirection="sort.direction"
      :selectable="isMembersTab"
      :selectedRows="selectedIds"
      :selectableRowIds="grantableIds"
      :rowClass="getUserRowClass"
      @list_sort_by="sortBy"
      @update:selectedRows="setSelection">
      <template #cell-user="{ element }">
        <UserInfoInline :user="element" :user-id="element._id" />
      </template>

      <template #cell-role="{ element }">
        <OrgaRoleSelector
          :value="displayedRole(element)"
          :readonly="!rightsOf(element).canChangeRole"
          @input="changeRole(element, $event)" />
      </template>

      <template #cell-hint>
        <span class="organization-users__hint">{{
          $t("seats.member_hint")
        }}</span>
      </template>

      <template
        v-for="column in usageColumns"
        #[`cell-${column.key}`]="{ element }">
        <output :key="column.key" class="organization-users__usage">
          {{ formatUsage(element[column.key], column.unit) }}
        </output>
      </template>

      <template #cell-actions="{ element }">
        <div class="flex row gap-tiny justify-end" @click.stop>
          <Button
            v-if="rightsOf(element).canGrantSeat"
            size="sm"
            variant="secondary"
            icon="arrow-fat-up"
            :label="$t('seats.row.give_seat')"
            @click="openGrantSeats([element])" />
          <Button
            v-if="rightsOf(element).canLeave"
            size="sm"
            icon="sign-out"
            variant="secondary"
            intent="destructive"
            :title="$t('organisation.user.leave_button')"
            :aria-label="$t('organisation.user.leave_button')"
            @click="leaveOrganization()" />
          <Button
            v-else-if="rightsOf(element).canRemove"
            size="sm"
            icon="trash"
            variant="secondary"
            intent="destructive"
            :title="$t('organisation.user.remove_button')"
            :aria-label="removeLabel(element)"
            @click="removeFromMembers(element)" />
        </div>
      </template>
    </GenericTable>

    <p v-else class="organization-users__empty">{{ emptyLabel }}</p>

    <ModalGrantSeats
      v-model="displayGrantModal"
      :organizationId="organizationId"
      :members="grantTargets"
      :roleOptions="seatRoleOptions"
      :defaultRole="defaultSeatRole"
      :seatsAvailable="seatSummary.available"
      :seatsCapacity="seatSummary.capacity"
      :purchase="seatPurchase"
      @done="onSeatsGranted" />

    <ModalManageSeats
      v-if="hasSeatCapacity"
      v-model="displayManageModal"
      :organizationId="organizationId"
      :capacity="seatSummary.capacity"
      :minimumSeats="minimumSeats"
      :purchase="seatPurchase"
      @done="onSeatsChanged" />

    <ModalLeaveOrganization
      v-model="displayLeaveModal"
      :currentOrganization="currentOrganization"
      :currentOrganizationScope="currentOrganizationScope"
      @on-confirm="closeLeaveModal"
      @on-cancel="closeLeaveModal" />

    <ModalRemoveUserFromOrganization
      v-model="displayRemoveUserModal"
      :currentOrganization="currentOrganization"
      :user="userToRemove"
      @on-confirm="closeRemoveFromMembersModal"
      @on-cancel="closeRemoveFromMembersModal" />
  </section>
</template>

<script>
import { mapGetters } from "vuex"
import { bus } from "@/main.js"
import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { platformRoleMixin } from "@/mixins/platformRole.js"
import { ORGANIZATION_ROLES } from "@/const/organizationRoles.js"

import { computeBillingInterval } from "@/tools/computeBillingInterval.js"
import { computeMemberRights } from "@/tools/computeMemberRights.js"
import { computeMemberUsageRows } from "@/tools/computeMemberUsageRows.js"
import { computeSeatRoleOptions } from "@/tools/computeSeatRoleOptions.js"
import { computeSeatPrice } from "@/tools/computeSeatPrice"
import { computeSeatSummary } from "@/tools/computeSeatSummary.js"
import { computeSeatsNeeded } from "@/tools/computeSeatsNeeded.js"
import { computeUsageColumns } from "@/tools/computeUsageColumns.js"
import { filterMembersByText } from "@/tools/filterMembersByText.js"
import { formatUsageAmount } from "@/tools/formatUsageAmount.js"
import { partitionMembersBySeat } from "@/tools/partitionMembersBySeat.js"
import { sortArray } from "@/tools/sortList.js"
import { userName } from "@/tools/userName.js"

import {
  apiAddUserToOrganisation,
  apiUpdateUserRoleInOrganisation,
} from "@/api/user.js"

import UserInvite from "@/components/UserInvite.vue"
import UserInfoInline from "@/components/molecules/UserInfoInline.vue"
import GenericTable from "@/components/molecules/GenericTable.vue"
import ModalGrantSeats from "@/components/ModalGrantSeats.vue"
import ModalManageSeats from "@/components/ModalManageSeats.vue"
import ModalLeaveOrganization from "@/components/ModalLeaveOrganization.vue"
import ModalRemoveUserFromOrganization from "@/components/ModalRemoveUserFromOrganization.vue"
import OrgaRoleSelector from "@/components/molecules/OrgaRoleSelector.vue"
import SeatSelectionBar from "@/components/molecules/SeatSelectionBar.vue"
import Tabs from "@/components/molecules/Tabs.vue"
import IsCloud from "@/components/atoms/IsCloud.vue"
import SeatsPanel from "@/components-cloud/SeatsPanel.vue"
import HasEntitlement from "@/components-cloud/HasEntitlement.vue"

const SEATS_TAB = "seats"
const MEMBERS_TAB = "members"

export default {
  mixins: [orgaRoleMixin, platformRoleMixin],
  props: {
    currentOrganization: {
      type: Object,
      required: true,
    },
    userInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      members: [],
      // Role changes in flight, by member id. The table reads through them, so
      // the counters move at once and fall back on their own when a call fails.
      pendingRoleByUserId: {},
      activeTab: MEMBERS_TAB,
      search: "",
      selectedIds: [],
      // One sort state per tab: their columns differ, and GenericTable requires
      // a key that exists in the columns it is given.
      sortByTab: {
        [SEATS_TAB]: { key: "user", direction: "asc" },
        [MEMBERS_TAB]: { key: "user", direction: "asc" },
      },
      usersEmailPending: [],
      displayLeaveModal: false,
      displayRemoveUserModal: false,
      displayGrantModal: false,
      displayManageModal: false,
      grantTargets: [],
      userToRemove: null,
    }
  },
  watch: {
    "currentOrganization.users": {
      handler(users) {
        this.setMembers(users)
      },
      immediate: true,
    },
    organizationId: {
      handler() {
        this.resetScreenState()
        this.loadUsage()
      },
      immediate: true,
    },
    // Acting on a member that scrolled out of view is the classic mistake:
    // narrowing the list or changing tab drops the selection.
    activeTab() {
      this.clearSelection()
    },
    search() {
      this.clearSelection()
    },
  },
  computed: {
    ...mapGetters("billing", [
      "isPerSeat",
      "isUnmetered",
      "seats",
      "usage",
      "usageByMember",
      "currentPlan",
      "subscription",
    ]),
    ...mapGetters("organizations", {
      currentOrganizationScopeId: "getCurrentOrganizationScope",
    }),
    organizationId() {
      return this.currentOrganization._id
    },
    currentOrganizationScope() {
      return this.currentOrganization._id
    },
    // The billing store holds the viewer's own organization: reading it for
    // another organization (backoffice) would show the wrong figures.
    isOwnOrganization() {
      return this.organizationId === this.currentOrganizationScopeId
    },
    // Seats cap the collaborators (role >= uploader) of a per-seat plan; a comp
    // or managed organization is never capped.
    hasSeatCapacity() {
      return this.isOwnOrganization && this.isPerSeat && !this.isUnmetered
    },
    viewer() {
      return {
        id: this.userInfo._id,
        role: this.userRole,
        isSystemAdministrator: this.isSystemAdministrator,
        isBackoffice: this.isBackofficePage,
      }
    },
    canInvite() {
      return (
        this.isAtLeastMaintainer ||
        (this.isSystemAdministrator && this.isBackofficePage)
      )
    },
    // Members as the screen shows them: a role change in flight is displayed
    // before the API confirms it, and so are the counters derived from it.
    displayedMembers() {
      return this.members.map((member) => {
        const pending = this.pendingRoleByUserId[member._id]
        return pending === undefined ? member : { ...member, role: pending }
      })
    },
    partition() {
      return partitionMembersBySeat(this.displayedMembers)
    },
    seatSummary() {
      return computeSeatSummary(
        this.partition.seated.length,
        this.hasSeatCapacity ? this.seats : null,
      )
    },
    isMembersTab() {
      return this.activeTab === MEMBERS_TAB
    },
    tabs() {
      return [
        {
          name: SEATS_TAB,
          label: this.$t("seats.tabs.seats"),
          count: this.partition.seated.length,
        },
        {
          name: MEMBERS_TAB,
          label: this.$t("seats.tabs.members"),
          count: this.partition.free.length,
        },
      ]
    },
    sort() {
      return this.sortByTab[this.activeTab]
    },
    // Per-member usage only makes sense for the organization being billed, and
    // only quota capabilities are metered per user.
    usageColumns() {
      if (!this.isOwnOrganization || this.isMembersTab) return []
      return computeUsageColumns(this.usage?.capabilities)
    },
    tabMembers() {
      return this.isMembersTab ? this.partition.free : this.partition.seated
    },
    rows() {
      return computeMemberUsageRows(
        this.tabMembers,
        this.usageByMember?.members,
        this.usageColumns,
      )
    },
    visibleRows() {
      const found = filterMembersByText(this.rows, this.search)
      return sortArray([...found], this.sort.key, this.sort.direction)
    },
    visibleIds() {
      return this.visibleRows.map((row) => row._id)
    },
    // Only a free member can be given a seat, and only by someone allowed to.
    grantableIds() {
      return this.visibleRows
        .filter((row) => this.rightsOf(row).canGrantSeat)
        .map((row) => row._id)
    },
    columns() {
      const columns = [
        {
          key: "user",
          label: this.$t("organisation.user_label"),
          width: "minmax(12rem, 1.5fr)",
        },
      ]
      if (this.isMembersTab) {
        columns.push({
          key: "hint",
          label: "",
          width: "minmax(10rem, 2fr)",
          sortable: false,
        })
      } else {
        columns.push({
          key: "role",
          label: this.$t("organisation.user.role_label"),
          // Role names run long ("Collaborateur en direct"), so this column
          // takes a bigger share than a usage counter.
          width: "minmax(13rem, 1.5fr)",
        })
        for (const column of this.usageColumns) {
          columns.push({
            key: column.key,
            label: this.$t(column.labelKey),
            // Counters are short: they claim less of the leftover space than
            // the name and the role, which are the columns that actually read.
            width: "minmax(7rem, 0.7fr)",
          })
        }
      }
      columns.push({
        key: "actions",
        label: "",
        width: "auto",
        sortable: false,
      })
      return columns
    },
    selectedMembers() {
      return this.displayedMembers.filter((member) =>
        this.selectedIds.includes(member._id),
      )
    },
    selectionCaption() {
      const needed = computeSeatsNeeded(
        this.selectedMembers.map((member) => ({
          role: this.defaultSeatRole,
          currentRole: member.role,
        })),
      )
      if (this.seatSummary.capacity === null) return ""
      return this.$t("seats.bar.caption_capacity", {
        needed,
        available: this.seatSummary.available,
      })
    },
    seatRoleOptions() {
      const maxRole = this.isBackofficePage
        ? ORGANIZATION_ROLES.ADMINISTRATOR
        : this.userRole
      return computeSeatRoleOptions(this.userRoles, maxRole)
    },
    defaultSeatRole() {
      return this.seatRoleOptions[0]?.value ?? ORGANIZATION_ROLES.UPLOADER
    },
    // Everything the seat modals need to price and buy a seat. The subscription
    // is readable by org admins only, so a manager gets no figure — and cannot
    // buy either: both cloud routes are admin-guarded.
    seatPurchase() {
      if (!this.hasSeatCapacity) return null
      const pricing = this.currentPlan?.pricing
      const periodStart = this.subscription?.currentPeriodStart || null
      const periodEnd = this.subscription?.currentPeriodEnd || null
      const interval = computeBillingInterval(periodStart, periodEnd)
      return {
        canManage: this.isAdmin && !this.isBackofficePage,
        unitCents: computeSeatPrice(pricing, interval).amountCents,
        currency: pricing?.currency || "eur",
        periodStart,
        periodEnd,
      }
    },
    // Seats can never drop below the collaborators in place, nor below what the
    // plan includes: the API raises the figure silently otherwise.
    minimumSeats() {
      return Math.max(
        this.partition.seated.length,
        this.currentPlan?.pricing?.seatsIncluded || 1,
      )
    },
    emptyLabel() {
      if (this.search) return this.$t("seats.empty_search")
      return this.isMembersTab
        ? this.$t("seats.empty_members")
        : this.$t("seats.empty_seats")
    },
  },
  methods: {
    setMembers(users) {
      this.members = [...(users || [])]
    },
    resetScreenState() {
      this.pendingRoleByUserId = {}
      this.selectedIds = []
      this.search = ""
      this.grantTargets = []
    },
    loadUsage() {
      if (!this.isOwnOrganization) return
      this.$store.dispatch("billing/fetchUsageByMember", this.organizationId)
      // Admin-only route: it carries the billing period the seat price is
      // prorated against.
      if (this.isAdmin && !this.isBackofficePage) {
        this.$store.dispatch("billing/fetchSubscriptions", this.organizationId)
      }
    },
    rightsOf(member) {
      return computeMemberRights(member, this.viewer)
    },
    displayedRole(member) {
      const pending = this.pendingRoleByUserId[member._id]
      return pending === undefined ? member.role : pending
    },
    removeLabel(member) {
      return `${this.$t("organisation.user.remove_button")} — ${userName(member)}`
    },
    formatUsage(value, unit) {
      return formatUsageAmount(value, unit)
    },
    getUserRowClass(user) {
      return this.userInfo._id === user._id ? "currentuser" : ""
    },
    sortBy(key) {
      const current = this.sortByTab[this.activeTab]
      const direction =
        key === current.key
          ? current.direction === "desc"
            ? "asc"
            : "desc"
          : "desc"
      this.$set(this.sortByTab, this.activeTab, { key, direction })
    },
    setSelection(ids) {
      // The header checkbox selects every row at once: keep only the rows that
      // may actually be given a seat.
      this.selectedIds = ids.filter((id) => this.grantableIds.includes(id))
    },
    clearSelection() {
      this.selectedIds = []
    },
    startRoleChange(member, role) {
      this.$set(this.pendingRoleByUserId, member._id, role)
    },
    endRoleChange(member) {
      this.$delete(this.pendingRoleByUserId, member._id)
    },
    applyMemberRole(userId, role) {
      this.members = this.members.map((member) =>
        member._id === userId ? { ...member, role } : member,
      )
    },
    // The seat cap is enforced by the API: a 402 opens the upgrade flow from
    // sendRequest, whoever the caller is.
    async changeRole(member, role) {
      if (role === this.displayedRole(member)) return
      this.startRoleChange(member, role)
      const req = await apiUpdateUserRoleInOrganisation(
        this.organizationId,
        member._id,
        role,
      )
      if (req?.status === "success") {
        this.applyMemberRole(member._id, role)
        this.notifySuccess(this.$t("seats.notification.role_updated"))
        this.dispatchOrganization()
      } else if (req) {
        this.notifyError(req.message)
      }
      this.endRoleChange(member)
    },
    openGrantSeats(members) {
      if (!members.length) return
      this.grantTargets = members
      this.displayGrantModal = true
    },
    onSeatsGranted(result) {
      for (const grant of result.succeeded) {
        this.applyMemberRole(grant.userId, grant.role)
      }
      this.selectedIds = this.selectedIds.filter(
        (id) => !result.succeeded.some((grant) => grant.userId === id),
      )
      if (result.succeeded.length) {
        this.notifySuccess(
          this.$tc(
            "seats.grant.success_notification",
            result.succeeded.length,
            {
              count: result.succeeded.length,
            },
          ),
        )
        this.dispatchOrganization()
        this.loadUsage()
      }
    },
    onSeatsChanged(subscription) {
      this.notifySuccess(
        this.$tc("seats.manage.success", subscription.seats, {
          count: subscription.seats,
        }),
      )
    },
    async addToMembers(user) {
      this.usersEmailPending.push(user.email)
      const req = await apiAddUserToOrganisation(
        this.organizationId,
        user.email,
        ORGANIZATION_ROLES.MEMBER,
        {
          timeout: 3000,
          redirect: false,
        },
      )
      if (req.status === "success") {
        this.members = [
          ...this.members,
          { ...user, role: ORGANIZATION_ROLES.MEMBER },
        ]
        // A new member is free and read-only: show the tab they landed in.
        this.activeTab = MEMBERS_TAB
      }
      this.usersEmailPending = this.usersEmailPending.filter(
        (email) => email !== user.email,
      )
    },
    removeFromMembers(user) {
      this.userToRemove = user
      this.displayRemoveUserModal = true
    },
    closeRemoveFromMembersModal(apiRes) {
      if (apiRes) {
        if (apiRes.status === "success") {
          const userId = this.userToRemove._id
          this.members = this.members.filter((member) => member._id !== userId)
          this.selectedIds = this.selectedIds.filter((id) => id !== userId)
        } else {
          this.notifyError(
            this.$i18n.t("organisation.remove_user_error_message"),
          )
        }
      }

      this.userToRemove = null
      this.displayRemoveUserModal = false
    },
    leaveOrganization() {
      this.displayLeaveModal = true
    },
    closeLeaveModal(apiRes) {
      if (apiRes) {
        if (apiRes.status === "success") {
          // TODO: delete orga in store instead
          location.reload()
        }
      }
      this.displayLeaveModal = false
    },
    notifySuccess(message) {
      bus.$emit("app_notif", { status: "success", message })
    },
    notifyError(message) {
      bus.$emit("app_notif", { status: "error", message })
    },
    dispatchOrganization() {
      bus.$emit("user_orga_update")
    },
    // Same gating detail sendRequest dispatches on a 403 SAAS_FEATURE_LOCKED:
    // opens the onboarding/upgrade wizard (OnboardingWizard.vue, App.vue).
    lockedInvite() {
      this.$store.dispatch("billing/openUpgradeModal", {
        code: "SAAS_FEATURE_LOCKED",
        reason: "feature_disabled",
        capability: "collaboration",
      })
    },
  },
  components: {
    UserInvite,
    UserInfoInline,
    GenericTable,
    ModalGrantSeats,
    ModalManageSeats,
    ModalLeaveOrganization,
    ModalRemoveUserFromOrganization,
    OrgaRoleSelector,
    SeatSelectionBar,
    SeatsPanel,
    Tabs,
    IsCloud,
    HasEntitlement,
  },
}
</script>

<style lang="scss" scoped>
// Rows are display: contents, so each cell is a grid item — and a grid item
// defaults to min-width: auto, which lets a long control overflow its column
// instead of shrinking. Nothing here should ever be wider than its track.
.organization-users :deep(td),
.organization-users :deep(th) {
  min-width: 0;
}

.organization-users__search {
  margin: 0.75rem 0;
}

.organization-users__hint {
  color: var(--text-secondary);
  font-size: 0.9em;
}

.organization-users__usage {
  font-variant-numeric: tabular-nums;
}

.organization-users__empty {
  color: var(--text-secondary);
  padding: 1rem 0;
}
</style>
