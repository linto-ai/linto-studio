<template>
  <tr :class="{ error, 'conversation-line': true }">
    <td>
      <input
        type="checkbox"
        @input="onSelected"
        :checked="selected"
        ref="checkbox" />
    </td>
    <td class="conversation-line--name">
      <a
        :href="`/interface/conversations/${conversation._id}`"
        class="table-link"
        >{{ conversation.name }}</a
      >
    </td>
    <td class="description">{{ conversation.description }}</td>
    <td class="center">
      <a
        :href="`/interface/conversations/${conversation._id}/transcription`"
        class="btn green"
        v-if="statusTranscription === 'done'">
        <span class="icon transcription"></span>
      </a>
      <button class="btn" disabled v-else>
        <span class="icon transcription"></span>
      </button>
    </td>
    <td>{{ audioDuration }}</td>
    <td>{{ lastUpdate }}</td>
    <td class="center">
      <span :class="['state-icon', statusTranscription]"></span>
    </td>
    <!-- Owner -->
    <td v-if="pageSharedWith">
      <div
        class="list-profil-picture-container"
        :data-info="convOwner.fullname">
        <img :src="convOwner.img" class="list-profil-picture" />
      </div>
    </td>
    <td v-if="pageSharedWith">
      <i>{{ myRights }}</i>
    </td>
    <!-- Shared With -->
    <td v-if="!pageSharedWith">
      <div class="flex row" v-if="sharedWithUsers.length > 0">
        <div
          class="list-profil-picture-container"
          v-for="(usr, index) in sharedWithUsers"
          :key="usr._id"
          :data-info="usr.fullname"
          :style="`left: -${index * 15}px`">
          <img :src="usr.img" class="list-profil-picture" />
        </div>
      </div>
    </td>
  </tr>
</template>
<script>
import { getUserInfo } from "../tools/getUserInfo.js"
export default {
  props: {
    userInfo: {
      type: Object,
      required: true,
    },
    pageSharedWith: {
      type: Boolean,
      required: true,
    },
    conversation: {
      type: Object,
      required: true,
    },
    error: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      convoUsersLoaded: false,
      ownerInfo: {
        firstname: "",
        lastname: "",
        email: "",
        img: "",
      },
      sharedWithUsers: [],
    }
  },
  async mounted() {
    await this.getownerInfo()
    await this.getSharedWithUsers()
  },
  computed: {
    statusTranscription() {
      return this.conversation?.jobs?.transcription?.state
    },
    audioDuration() {
      return this.$options.filters.timeToHMS(
        this.conversation?.metadata?.audio?.duration
      )
    },
    lastUpdate() {
      return this.$options.filters.getTimeDiffText(
        this.conversation?.last_update
      )
    },
    convOwner() {
      if (this.conversation.usersList && this.pageSharedWith) {
        let owner = this.conversation.usersList.organization_members.find(
          (usr) => usr._id === this.conversation.owner
        )
        if (owner) {
          return {
            ...owner,
            fullname: `${owner.firstname} ${owner.lastname}`,
            img: process.env.VUE_APP_PUBLIC_MEDIA + "/" + owner.img,
          }
        } else {
          return {
            fullname: "Private user",
            img: process.env.VUE_APP_PUBLIC_MEDIA + "/pictures/default.jpg",
          }
        }
      }
      return {
        firstname: "Private",
        lastname: "User",
        fullname: "Private user",
        img: process.env.VUE_APP_PUBLIC_MEDIA + "/pictures/default.jpg",
      }
    },
    myRights() {
      if (!this.conversation.userAccess) return "Can read"

      return this.$store.getters.getUserRightTxt(
        this.conversation.userAccess.right
      )
    },
    userRights() {
      return this.$store.state.userRights
    },
  },
  watch: {
    selected(val) {
      if (val) {
        this.$refs["checkbox"].indeterminate = false
        this.$refs["checkbox"].checked = true
      } else {
        this.$refs["checkbox"].indeterminate = false
        this.$refs["checkbox"].checked = false
      }
    },
  },
  methods: {
    onSelected(event) {
      if (event.target.checked && !this.selected) {
        this.$refs["checkbox"].indeterminate = true
      }
      this.$emit("on-selected", event.target.checked)
    },
    async getownerInfo() {
      this.ownerInfo = {
        firstname: "",
        lastname: "",
        email: "",
        img: "",
      }
      this.ownerInfo = getUserInfo(this.userInfo._id)
    },

    async getSharedWithUsers() {
      if (
        this.conversation?.sharedWithUsers &&
        this.conversation?.sharedWithUsers.length > 0
      ) {
        for (let user of this.conversation.sharedWithUsers) {
          this.sharedWithUsers.push(await getUserInfo(user.userId))
          /*if (getSharedWithUsers.status === "error") {
            this.sharedWithUsers.push({
              firstname: "private",
              lastname: "user",
              fullname: "private user",
              email: "",
              img: process.env.VUE_APP_PUBLIC_MEDIA + "/pictures/default.jpg",
              visibility: "private",
            })
          } else {
            this.sharedWithUsers.push({
              firstname: getSharedWithUsers.data.firstname,
              lastname: getSharedWithUsers.data.lastname,
              fullname:
                getSharedWithUsers.data.firstname +
                " " +
                getSharedWithUsers.data.lastname,
              email: getSharedWithUsers.data.email,
              img:
                process.env.VUE_APP_PUBLIC_MEDIA +
                "/" +
                getSharedWithUsers.data.img,
              visibility: getSharedWithUsers.data.visibility,
            })
          }*/
        }
      }
    },
    getUserImgPath(imgPath) {
      return process.env.VUE_APP_PUBLIC_MEDIA + "/" + imgPath
    },
    timeToHMS(time) {
      return this.$options.filters.timeToHMS(time)
    },
    getTimeDiffText(dateVal) {
      return this.$options.filters.getTimeDiffText(dateVal)
    },
    imgPath(img) {
      return process.env.VUE_APP_PUBLIC_MEDIA + "/" + img
    },
  },
}
</script>
