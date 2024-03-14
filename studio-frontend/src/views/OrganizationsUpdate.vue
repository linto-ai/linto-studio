<template>
  <MainContent sidebar box>
    <OrganizationUpdateHelper
      :showHelper="helperVisible"
      @close="closeHelper()"></OrganizationUpdateHelper>

    <template v-slot:breadcrumb-actions>
      <div class="flex gap-medium">
        <button
          v-if="isAdmin"
          @click="deleteOrganization()"
          class="btn red-border">
          <span class="icon trash"></span>
          <span class="label">{{
            $t("organisation.delete_organization")
          }}</span>
        </button>
        <button class="btn" @click="showHelper()" style="min-width: 80px">
          <span class="icon help"></span>
          <span class="label">{{
            $t("conversation.transcription_help.help_button_label")
          }}</span>
        </button>
      </div>
    </template>

    <form @submit="updateOrganization">
      <section>
        <h2>{{ $t("organisation.general_settings") }}</h2>
        <!--Organization Name -->
        <FormInput v-if="isAdmin" :field="orgaName" v-model="orgaName.value" />
        <labeled-value
          v-else
          class="form-field flex col"
          :label="$t('organisation.name_label')"
          :value="orgaName.value" />
        <FormInput
          v-if="isAdmin"
          :field="orgaDescription"
          v-model="orgaDescription.value" />
        <labeled-value
          v-else-if="orgaDescription.value !== ''"
          class="form-field flex col"
          :label="$t('organisation.description_label')"
          :value="orgaDescription.value" />
        <button type="submit" class="btn green" v-if="isAdmin">
          <span class="icon apply"></span>
          <span class="label">{{ $t("organisation.update_button") }}</span>
        </button>
      </section>
    </form>
    <section>
      <div class="flex row gap-medium">
        <h2 style="width: auto">{{ $t("organisation.organization_users") }}</h2>
        <UserInvite
          v-if="isAtLeastMaintainer"
          @inviteUser="addToMembers"
          @removeUser="removeFromMembersValidation"
          :currentUsers="orgaMembers"
          :usersEmailPending="usersEmailPending"></UserInvite>
      </div>

      <!--Organization Members -->

      <div v-if="sortedUsers.length > 0" class="flex row">
        <table style="width: 100%">
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
                <select
                  v-model="user.role"
                  v-if="
                    isAtLeastMaintainer &&
                    userRole >= user.role &&
                    userInfo._id !== user._id
                  "
                  @change="updateUserRole(user)">
                  <option
                    v-for="role in userRoles"
                    :key="role.value"
                    :value="role.value"
                    :disabled="userRole < role.value">
                    {{ role.name }}
                  </option>
                </select>
                <span v-else-if="user.role > maxRoleValue">
                  inconsistent role value: {{ user.role }}</span
                >
                <span v-else>{{
                  userRoles.find((ur) => ur.value === user.role).name
                }}</span>
              </td>
              <td>
                <button
                  v-if="
                    isAtLeastMaintainer &&
                    userRole >= user.role &&
                    userInfo._id !== user._id
                  "
                  @click="removeFromMembersValidation(user)"
                  class="red-border">
                  <span class="icon remove" />
                  <span class="label">{{
                    $t("organisation.user.remove_button")
                  }}</span>
                </button>
                <button
                  v-if="userInfo._id === user._id"
                  @click="leaveOrganization()">
                  {{ $t("organisation.user.leave_button") }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <ModalDeleteOrganization
      v-if="displayDeleteModal"
      :currentOrganization="currentOrganization"
      :currentOrganizationScope="currentOrganizationScope"
      @on-confirm="closeDeleteModal"
      @on-cancel="closeDeleteModal" />

    <ModalLeaveOrganization
      v-if="displayLeaveModal"
      :currentOrganization="currentOrganization"
      :currentOrganizationScope="currentOrganizationScope"
      @on-confirm="closeLeaveModal"
      @on-cancel="closeLeaveModal" />
  </MainContent>
</template>
<script>
import { bus } from "../main.js"

import {
  apiAddUserToOrganisation,
  apiUpdateUserRoleInOrganisation,
} from "@/api/user.js"
import { apiUpdateOrganisation } from "@/api/organisation.js"

import { formsMixin } from "@/mixins/forms.js"
import { orgaRoleMixin } from "@/mixins/orgaRole.js"

import EMPTY_FIELD from "@/const/emptyField"

import { setCookie } from "@/tools/setCookie"
import { testName } from "@/tools/fields/testName"
import { testContent } from "@/tools/fields/testContent"
import { sortArray } from "@/tools/sortList.js"

import OrganizationUpdateHelper from "@/components/OrganizationUpdateHelper.vue"
import FormInput from "@/components/FormInput.vue"
import UserInfoInline from "@/components/UserInfoInline.vue"
import UserInvite from "@/components/UserInvite.vue"
import ModalDeleteOrganization from "@/components/ModalDeleteOrganization.vue"
import ModalLeaveOrganization from "@/components/ModalLeaveOrganization.vue"
import SearchUsersListComponent from "@/components/SearchUsersList.vue"
import ArrayHeader from "@/components/ArrayHeader.vue"
import LabeledValue from "@/components/LabeledValue.vue"
import MainContent from "@/components/MainContent.vue"

export default {
  mixins: [formsMixin, orgaRoleMixin],
  props: {
    userInfo: {
      type: Object,
      required: true,
    },
    currentOrganization: {
      type: Object,
      required: true,
    },
    currentOrganizationScope: {
      type: String,
      required: true,
    },
  },
  data() {
    const orgaMembers = []
    const orgaMembersIds = []
    for (let user of this.currentOrganization.users) {
      orgaMembersIds.push(user._id)
      orgaMembers.push(user)
    }

    return {
      fields: ["orgaName", "orgaDescription"],
      orgaName: {
        ...EMPTY_FIELD,
        value: this.currentOrganization.name,
        label: this.$t("organisation.name_label"),
        testField: testName,
      },
      orgaDescription: {
        ...EMPTY_FIELD,
        value: this.currentOrganization.description,
        label: this.$t("organisation.description_label"),
        testField: testContent,
      },
      userVisibility: {
        ...EMPTY_FIELD,
        value: this.currentOrganization.users.find(
          (usr) => usr._id === this.userInfo._id
        ).visibility,
      },
      orgaMembers,
      orgaMembersIds,
      sortListDirection: "asc",
      sortListKey: "user",
      helperVisible: false,
      usersEmailPending: [],
      displayDeleteModal: false,
      displayLeaveModal: false,
    }
  },
  computed: {
    userRole() {
      return this.$store.getters.getUserRoleInOrganization()
    },
    sortedUsers() {
      return sortArray(
        this.orgaMembers,
        this.sortListKey,
        this.sortListDirection
      )
    },
    organizationId() {
      return this.currentOrganizationScope
    },
  },
  async mounted() {
    bus.$on("remove_organization_user", async (data) => {
      await this.dispatchOrganization()
      this.removeFromMembers(data.userId)
    }) // event from the modal component, TODO: use new modal component instead
  },
  beforeDestroy() {
    bus.$off("remove_organization_user")
  },
  methods: {
    showHelper() {
      this.helperVisible = true
    },
    closeHelper() {
      this.helperVisible = false
    },
    async deleteOrganization() {
      this.displayDeleteModal = true
    },
    closeDeleteModal(apiRes) {
      if (apiRes) {
        if (apiRes.status === "success") {
          setCookie("cm_orga_scope", "")
          window.location.href = "/"
        } else {
          bus.$emit("app_notif", {
            status: "error",
            message: this.$i18n.t("organisation.delete_error_message"),
          })
        }
      }
      this.displayDeleteModal = false
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
        }
      )
      if (req.status === "success") {
        await this.dispatchOrganization()
        this.orgaMembers.push({ ...user, role: 1 })
        this.orgaMembersIds.push(user._id)
        this.searchMemberValue = ""
      }
      this.usersEmailPending = this.usersEmailPending.filter(
        (email) => email !== user.email
      )
    },
    removeFromMembersValidation(user) {
      bus.$emit("show_modal", {
        title: "Remove user from organization",
        content: `Are you sure you want to remove "${user.email}" from the organization "${this.currentOrganization.name}"`,
        actionBtnLabel: "Remove user",
        actionName: "remove_user_from_organization",
        organizationId: this.currentOrganization._id,
        user,
      })
    },
    removeFromMembers(userId) {
      let memberIdIndex = this.orgaMembersIds.findIndex((id) => id === userId)
      this.orgaMembersIds.splice(memberIdIndex, 1)

      let memberIndex = this.orgaMembers.findIndex((usr) => usr._id === userId)
      this.orgaMembers.splice(memberIndex, 1)
    },
    leaveOrganization() {
      this.displayLeaveModal = true
    },
    closeLeaveModal(apiRes) {
      if (apiRes) {
        if (apiRes.status === "success") {
          setCookie("cm_orga_scope", "")
          window.location.href = "/"
        } else {
          bus.$emit("app_notif", {
            status: "error",
            message: this.$i18n.t("organisation.leave_error_message"),
          })
        }
      }
      this.displayLeaveModal = false
    },
    imgFullPath(imgPath) {
      return process.env.VUE_APP_PUBLIC_MEDIA + "/" + imgPath
    },
    async updateUserRole(user) {
      let req = await apiUpdateUserRoleInOrganisation(
        this.organizationId,
        user._id,
        user.role,
        {
          timeout: 3000,
          redirect: false,
        }
      )

      if (req.status === "success") {
        await this.dispatchOrganization()
      }
    },
    async updateOrganization(event) {
      event.preventDefault()
      if (this.testFields()) {
        let payload = {
          name: this.orgaName.value.trim(),
          description: this.orgaDescription.value,
        }

        let req = await apiUpdateOrganisation(this.organizationId, payload, {
          timeout: 3000,
          redirect: false,
        })

        if (req.status === "success") {
          await this.dispatchOrganization()
        }
      }
      return false
    },

    async dispatchOrganization() {
      bus.$emit("user_orga_update")
      // this.orgaLoaded = await this.$options.filters.dispatchStore(
      //   "getCurrentOrganizationById",
      //   this.organizationId
      // )
    },
  },
  components: {
    SearchUsersListComponent,
    ArrayHeader,
    LabeledValue,
    OrganizationUpdateHelper,
    MainContent,
    FormInput,
    UserInfoInline,
    UserInvite,
    ModalDeleteOrganization,
    ModalLeaveOrganization,
  },
}
</script>
