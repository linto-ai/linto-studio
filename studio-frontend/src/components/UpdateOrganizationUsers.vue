<template>
  <section>
    <div class="flex row gap-medium">
      <h2 style="width: auto">{{ $t("organisation.organization_users") }}</h2>
      <!-- Inviting a member is a team-plan capability in cloud mode. Locked:
           the button stays visible and opens the upgrade flow. -->
      <HasEntitlement
        v-if="
          isAtLeastMaintainer || (isSystemAdministrator && isBackofficePage)
        "
        capability="collaboration">
        <UserInvite
          @inviteUser="addToMembers"
          @removeUser="removeFromMembers"
          :currentUsers="orgaMembers"
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
      <IsCloud>
        <span
          v-if="hasSeatCapacity"
          class="flex row align-center gap-small"
          :title="seatsFull ? $t('billing.seats_full') : null">
          <ph-icon :name="seatsFull ? 'lock' : 'users'" />
          {{ $t("billing.seats_usage", { used: collaborators, total: seats }) }}
        </span>
      </IsCloud>
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
          @input="applyRoleChange(element)"
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
  </section>
</template>
<script>
import { mapGetters } from "vuex"
import { bus } from "@/main.js"
import { getEnv } from "@/tools/getEnv"
import EMPTY_FIELD from "@/const/emptyField"
import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { platformRoleMixin } from "@/mixins/platformRole.js"

import { isCollaboratorRole } from "@/tools/isCollaboratorRole.js"

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
import HasEntitlement from "@/components-cloud/HasEntitlement.vue"

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
      // previous role per member, to revert a refused promotion
      prevRoles: Object.fromEntries(users.map((u) => [u._id, u.role])),
    }
  },
  computed: {
    ...mapGetters("billing", ["isPerSeat", "isUnmetered", "seats"]),
    // Seats cap the collaborators (role >= uploader) of a per-seat plan; a comp
    // or managed org is never capped.
    hasSeatCapacity() {
      return this.isPerSeat && !this.isUnmetered
    },
    collaborators() {
      return this.orgaMembers.filter((member) =>
        isCollaboratorRole(member.role),
      ).length
    },
    seatsFull() {
      return this.hasSeatCapacity && this.collaborators >= this.seats
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
    // The seat cap is enforced by the API (402 opens the upgrade modal)
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
    revertRole(user) {
      const member = this.orgaMembers.find((m) => m._id === user._id)
      if (member) member.role = this.prevRoles[user._id]
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
    ModalLeaveOrganization,
    ModalRemoveUserFromOrganization,
    OrgaRoleSelector,
    IsCloud,
    MemberUsageTable,
    HasEntitlement,
  },
}
</script>
