<template>
  <div class="flex col">
    <div v-if="loading" class="flex1 relative" style="min-height: 50px">
      <loading></loading>
    </div>
    <div v-else-if="searchMemberValue.length > 0" class="">
      <div class="flex col gap-small">
        <user-info-inline
          :user="user"
          :userId="user._id"
          v-for="user of availableUsers"
          v-if="user._id !== userInfo._id"
          :key="user._id">
          <slot v-bind:user="user"></slot>
        </user-info-inline>
      </div>
    </div>
  </div>
</template>
<script>
import { debounceMixin } from "../mixins/debounce"
import Loading from "@/components/Loading.vue"
import { apiSearchUser } from "../api/user.js"
import UserInfoInline from "@/components/molecules/UserInfoInline.vue"
export default {
  props: {
    searchMemberValue: { required: true },
    currentUser: { required: true },
  },
  mixins: [debounceMixin],
  data() {
    return {
      searchUsersList: [],
      loading: false,
      inviteEmail: {
        value: "",
        error: null,
        valid: false,
      },
      inviteBtnEnabled: true,
    }
  },
  computed: {
    availableUsers() {
      if (this.searchMemberValue.length > 0) {
        return this.searchUsersList.map((user) => {
          const existingUserIndex = this.currentUser.findIndex(
            (usr) => usr._id === user._id,
          )
          if (existingUserIndex < 0) {
            return {
              ...user,
              right: 0,
            }
          } else {
            return {
              ...user,
              right: this.currentUser[existingUserIndex].right,
            }
          }
        })
      }
      return []
    },
    userInfo() {
      return this.$store.getters["user/getUserInfos"]
    },
  },
  watch: {
    searchMemberValue: {
      handler: async function (data) {
        if (data.length > 0) {
          const request = await this.debouncedSearch(apiSearchUser, data)
          this.searchUsersList = request?.data || []
        } else {
          this.searchUsersList = []
        }
        this.inviteEmail = {
          value: data,
          error: null,
          valid: false,
        }
      },
      immediate: true,
    },
  },
  methods: {
    cleanSearch(e) {
      e.preventDefault()
      this.searchMemberValue = ""
    },
    selectUser(user) {
      this.$emit("selectUser", user)
      setTimeout(() => {
        this.searchMemberValue = ""
      }, 50)
    },
    imgFullPath(imgPath) {
      return process.env.VUE_APP_PUBLIC_MEDIA + "/" + imgPath
    },
  },
  components: { Loading, UserInfoInline },
}
</script>
