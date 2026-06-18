<template>
  <section>
    <div class="flex row gap-medium">
      <h2 style="width: auto">{{ $t("organisation.organization_users") }}</h2>
      <UserInvite
        v-if="
          isAtLeastMaintainer || (isSystemAdministrator && isBackofficePage)
        "
        @inviteUser="addToMembers"
        @removeUser="removeFromMembers"
        :currentUsers="orgaMembers"
        :usersEmailPending="usersEmailPending"
        :includeSelf="isBackofficePage"></UserInvite>
    </div>

    <!--Organization Members -->

    <GenericTable
      v-if="sortedUsers.length > 0"
      :columns="columns"
      :content="sortedUsers"
      :sortListKey="sortListKey"
      :sortListDirection="sortListDirection"
      :rowClass="getUserRowClass"
      @list_sort_by="sortBy">
      <template #cell-user="{ element }">
        <UserInfoInline :user="element" :user-id="element._id" />
      </template>
      <template #cell-role="{ element }">
        <OrgaRoleSelector
          v-model="element.role"
          @input="updateUserRole(element)"
          :readonly="!canUpdateRole(element)" />
      </template>
      <template #cell-actions="{ element }">
        <Button
          v-if="userInfo._id === element._id && !isBackofficePage"
          size="sm"
          variant="secondary"
          intent="destructive"
          :label="$t('organisation.user.leave_button')"
          @click="leaveOrganization()" />
        <Button
          v-else-if="
            (isAtLeastMaintainer &&
              userRole >= element.role &&
              userInfo._id !== element._id) ||
            (isSystemAdministrator && isBackofficePage)
          "
          size="sm"
          icon="trash"
          variant="secondary"
          intent="destructive"
          :label="$t('organisation.user.remove_button')"
          @click="removeFromMembers(element)" />
      </template>
    </GenericTable>

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

    <IsCloud>
      <MemberUsageTable />
    </IsCloud>

    <!-- Explicit confirmation when a promotion adds a billable seat (premium). -->
    <div
      v-if="pendingPromo"
      class="seat-promo-modal"
      @click.self="cancelPromotion">
      <div class="seat-promo-modal__card">
        <div class="seat-promo-modal__badge">＋ {{ $t("billing.seat_promo.seat") }}</div>
        <h3 class="seat-promo-modal__title">{{ $t("billing.seat_promo.title") }}</h3>
        <p class="seat-promo-modal__msg">
          {{
            $t("billing.seat_promo.message", {
              name:
                pendingPromo.user.firstname ||
                pendingPromo.user.email ||
                $t("billing.seat_promo.this_member"),
              price: seatPriceLabel,
            })
          }}
        </p>
        <p class="seat-promo-modal__prorate">{{ $t("billing.seat_promo.prorated") }}</p>
        <div class="seat-promo-modal__actions">
          <Button variant="secondary" @click="cancelPromotion">{{ $t("billing.cancel") }}</Button>
          <Button variant="primary" @click="confirmPromotion">{{ $t("billing.seat_promo.confirm") }}</Button>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { mapGetters } from "vuex"
import { bus } from "@/main.js"
import { getEnv } from "@/tools/getEnv"
import EMPTY_FIELD from "@/const/emptyField"
import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { platformRoleMixin } from "@/mixins/platformRole.js"

const IS_MODE_CLOUD = getEnv("VUE_APP_MODE") === "cloud"
const UPLOADER = 2 // lib/dao/organization/roles: a billable seat starts at uploader

import { sortArray } from "@/tools/sortList.js"

import {
  apiAddUserToOrganisation,
  apiUpdateUserRoleInOrganisation,
} from "@/api/user.js"

import UserInvite from "@/components/UserInvite.vue"
import UserInfoInline from "@/components/molecules/UserInfoInline.vue"
import GenericTable from "@/components/molecules/GenericTable.vue"
import ModalLeaveOrganization from "@/components/ModalLeaveOrganization.vue"
import ModalRemoveUserFromOrganization from "@/components/ModalRemoveUserFromOrganization.vue"
import OrgaRoleSelector from "@/components/molecules/OrgaRoleSelector.vue"
import IsCloud from "@/components/atoms/IsCloud.vue"
import MemberUsageTable from "@/components-cloud/MemberUsageTable.vue"

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
    const orgaMembers = []
    const orgaMembersIds = []

    const users = this.currentOrganization.users || []
    for (let user of users) {
      orgaMembersIds.push(user._id)
      orgaMembers.push(user)
    }
    return {
      userVisibility: {
        ...EMPTY_FIELD,
        value: users.find((usr) => usr._id === this.userInfo._id)?.visibility,
      },
      orgaMembers,
      orgaMembersIds,
      sortListDirection: "asc",
      sortListKey: "user",
      usersEmailPending: [],
      displayLeaveModal: false,
      displayRemoveUserModal: false,
      userToRemove: null,
      // previous role per member, to detect a seat-adding promotion
      prevRoles: Object.fromEntries(users.map((u) => [u._id, u.role])),
      pendingPromo: null, // { user, oldRole } awaiting billing confirmation
    }
  },
  computed: {
    ...mapGetters("billing", ["isPremium", "premiumPlan", "billingExempt"]),
    // The org currently pays per seat (premium, not complimentary/exempt). Only
    // then does promoting to a contributor role add a billable seat.
    seatBilled() {
      return IS_MODE_CLOUD && this.isPremium && !this.billingExempt
    },
    seatPriceLabel() {
      const cents = this.premiumPlan?.pricing?.amountCents
      if (!cents) return ""
      const v = cents / 100
      try {
        return new Intl.NumberFormat(this.$i18n?.locale || "fr-FR", {
          style: "currency",
          currency: (this.premiumPlan?.pricing?.currency || "eur").toUpperCase(),
        }).format(v)
      } catch (e) {
        return `${v} €`
      }
    },
    columns() {
      return [
        {
          key: "user",
          label: this.$t("organisation.user_label"),
          width: "1fr",
        },
        {
          key: "role",
          label: this.$t("organisation.user.role_label"),
          width: "1fr",
        },
        { key: "actions", label: "", width: "auto" },
      ]
    },
    sortedUsers() {
      return sortArray(
        this.orgaMembers,
        this.sortListKey,
        this.sortListDirection,
      )
    },
    organizationId() {
      return this.currentOrganization._id
    },
    currentOrganizationScope() {
      return this.currentOrganization._id
    },
  },
  mounted() {},
  methods: {
    getUserRowClass(user) {
      return this.userInfo._id === user._id ? "currentuser" : ""
    },
    sortBy(key) {
      if (key === this.sortListKey) {
        this.sortListDirection =
          this.sortListDirection === "desc" ? "asc" : "desc"
      } else {
        this.sortListDirection = "desc"
      }
      this.sortListKey = key
    },
    async addToMembers(user) {
      this.usersEmailPending.push(user.email)
      let req = await apiAddUserToOrganisation(
        this.currentOrganization._id,
        user.email,
        1,
        {
          timeout: 3000,
          redirect: false,
        },
      )
      if (req.status === "success") {
        this.orgaMembers.push({ ...user, role: 1 })
        this.orgaMembersIds.push(user._id)
        this.searchMemberValue = ""
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
          let memberIdIndex = this.orgaMembersIds.findIndex(
            (id) => id === userId,
          )
          this.orgaMembersIds.splice(memberIdIndex, 1)

          let memberIndex = this.orgaMembers.findIndex(
            (usr) => usr._id === userId,
          )
          this.orgaMembers.splice(memberIndex, 1)
        } else {
          bus.$emit("app_notif", {
            status: "error",
            message: this.$i18n.t("organisation.remove_user_error_message"),
          })
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
    imgFullPath(imgPath) {
      return getEnv("VUE_APP_PUBLIC_MEDIA") + "/" + imgPath
    },
    async updateUserRole(user) {
      const oldRole = this.prevRoles[user._id] ?? user.role
      const newRole = user.role
      // Premium org: promoting a member to a contributor role (>= uploader) adds
      // a billable seat. Make it explicit (prorated) before applying.
      if (this.seatBilled && oldRole < UPLOADER && newRole >= UPLOADER) {
        this.pendingPromo = { user, oldRole }
        return
      }
      await this.applyRoleChange(user)
    },
    async applyRoleChange(user) {
      const req = await apiUpdateUserRoleInOrganisation(
        this.organizationId,
        user._id,
        user.role,
        { timeout: 3000, redirect: false },
      )
      if (req.status === "success") {
        this.prevRoles = { ...this.prevRoles, [user._id]: user.role }
        this.orgaMembers = this.orgaMembers.map((member) => {
          if (member._id === user._id) member.role = user.role
          return member
        })
      } else {
        this.revertRole(user)
      }
    },
    confirmPromotion() {
      if (!this.pendingPromo) return
      const { user } = this.pendingPromo
      this.pendingPromo = null
      this.applyRoleChange(user)
    },
    cancelPromotion() {
      if (!this.pendingPromo) return
      const { user, oldRole } = this.pendingPromo
      this.pendingPromo = null
      this.revertRole(user, oldRole)
    },
    revertRole(user, role) {
      const back = role != null ? role : this.prevRoles[user._id]
      const member = this.orgaMembers.find((m) => m._id === user._id)
      if (member) member.role = back
    },
    canUpdateRole(user) {
      if (this.isBackofficePage) {
        return this.isSystemAdministrator
      } else {
        return (
          this.isAtLeastMaintainer &&
          this.userRole >= user.role &&
          this.userInfo._id !== user._id
        )
      }
    },
    async dispatchOrganization() {
      bus.$emit("user_orga_update")
    },
  },
  components: {
    UserInvite,
    UserInfoInline,
    GenericTable,
    ModalLeaveOrganization,
    ModalRemoveUserFromOrganization,
    OrgaRoleSelector,
    IsCloud,
    MemberUsageTable,
  },
}
</script>

<style lang="scss" scoped>
.seat-promo-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1em;

  &__card {
    background: var(--neutral-0, #fff);
    border-radius: 10px;
    padding: 1.5em;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  }
  &__badge {
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--primary-color);
  }
  &__title {
    margin: 0.2em 0 0.4em;
    font-size: 1.2rem;
  }
  &__msg {
    color: var(--neutral-80);
    font-size: 0.9rem;
    margin: 0 0 0.4em;
  }
  &__prorate {
    color: var(--neutral-60);
    font-size: 0.82rem;
    margin: 0 0 1em;
  }
  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5em;
  }
}
</style>
