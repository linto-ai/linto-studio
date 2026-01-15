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
        :usersEmailPending="usersEmailPending"></UserInvite>
    </div>

    <!--Organization Members -->

    <div v-if="sortedUsers.length > 0" class="flex row">
      <table
        class="table-grid"
        style="grid-template-columns: 1fr 1fr auto; width: 100%">
        <thead>
          <tr>
            <ArrayHeader
              :eventLabel="'user'"
              :label="$t('organisation.user_label')"
              :sortListKey="sortListKey"
              :sortListDirection="sortListDirection"
              @list_sort_by="sortBy" />
            <ArrayHeader
              :eventLabel="'role'"
              :label="$t('organisation.user.role_label')"
              :sortListKey="sortListKey"
              :sortListDirection="sortListDirection"
              @list_sort_by="sortBy" />
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user of sortedUsers"
            :key="user._id"
            :class="userInfo._id === user._id ? 'currentuser' : ''">
            <td>
              <UserInfoInline :user="user" :user-id="user._id" />
            </td>
            <td>
              <OrgaRoleSelector
                v-model="user.role"
                @input="updateUserRole(user)"
                :readonly="!canUpdateRole(user)" />
            </td>
            <td class="content-size">
              <Button
                v-if="userInfo._id === user._id"
                size="sm"
                variant="secondary"
                intent="destructive"
                :label="$t('organisation.user.leave_button')"
                @click="leaveOrganization()" />

              <Button
                v-else-if="
                  (isAtLeastMaintainer &&
                    userRole >= user.role &&
                    userInfo._id !== user._id) ||
                  (isSystemAdministrator && isBackofficePage)
                "
                size="sm"
                icon="trash"
                variant="secondary"
                intent="destructive"
                :label="$t('organisation.user.remove_button')"
                @click="removeFromMembers(user)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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
import { bus } from "@/main.js"
import { getEnv } from "@/tools/getEnv"
import EMPTY_FIELD from "@/const/emptyField"
import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { platformRoleMixin } from "@/mixins/platformRole.js"

import { sortArray } from "@/tools/sortList.js"

import {
  apiAddUserToOrganisation,
  apiUpdateUserRoleInOrganisation,
} from "@/api/user.js"

import UserInvite from "@/components/UserInvite.vue"
import UserInfoInline from "@/components/molecules/UserInfoInline.vue"
import ArrayHeader from "@/components/ArrayHeader.vue"
import ModalLeaveOrganization from "@/components/ModalLeaveOrganization.vue"
import ModalRemoveUserFromOrganization from "@/components/ModalRemoveUserFromOrganization.vue"
import OrgaRoleSelector from "@/components/molecules/OrgaRoleSelector.vue"
import { readonly } from "vue"

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
    }
  },
  computed: {
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
      let req = await apiUpdateUserRoleInOrganisation(
        this.organizationId,
        user._id,
        user.role,
        {
          timeout: 3000,
          redirect: false,
        },
      )

      if (req.status === "success") {
        //await this.dispatchOrganization()
        this.orgaMembers = this.orgaMembers.map((member) => {
          if (member._id === user._id) {
            member.role = user.role
          }
          return member
        })
      }
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
    ArrayHeader,
    ModalLeaveOrganization,
    ModalRemoveUserFromOrganization,
    OrgaRoleSelector,
  },
}
</script>
