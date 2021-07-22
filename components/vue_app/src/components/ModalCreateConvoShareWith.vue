<template>
  <div class="modal-wrapper flex col" :class="modalShow ? 'visible' : 'hidden'">
    <div class="modal" v-if="dataLoaded">
      <div class="modal--header flex row">
        <span class="title flex1">{{ $t('modals.share_with.title') }}</span>
        <button class="btn--icon btn--icon__no-bg editspeaker" @click="closeModal()">
          <span class="icon icon--close"></span>
        </button>
      </div>
      <div class="modal--body">
        <p v-html="$t('modals.share_with.content_html')"></p>
        <div class="flex col">
          <table class="share-with-list" v-if="userListOptions.length > 0">
            <thead>
              <tr>
                <th>Select</th>
                <th colspan="2">{{ $t('array_labels.user') }}</th>
                <th>{{ $t('array_labels.editer') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="user in userListOptions" 
                :key="user._id"
                :class="user.selected ? 'selected' : ''"
              >
                <td>
                  <button class="custom-checkbox" :class="user.selected === true ? 'selected' : ''" @click="updateUserSelected(user)"></button>
                </td>
                <td class="img"><img :src="imgPath(user.img)" class="share-with-list-img"></td>
                <td>{{CapitalizeFirstLetter(user.firstname)}} {{CapitalizeFirstLetter(user.lastname)}}</td>
                <td>
                  <button class="btn-toggle" :class="user.writeAccess === 3 ? 'enabled' : 'disabled'" @click="updateUserWriteAccess(user)"><span class="btn-toggle-circle" :class="user.writeAccess === 3 ? 'enabled' : 'disabled'" ></span></button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else>No user found</div>
        </div>
      </div>
      <div class="modal--footer">
        <button class="btn btn--txt-icon grey" @click="closeModal()">
          <span class="label">{{$t('buttons.cancel')}}</span>
          <span class="icon icon__cancel"></span>
        </button>
        <button class="btn btn--txt-icon green" @click="updateShareWith()">
          <span class="label">{{$t('buttons.apply')}}</span>
          <span class="icon icon__apply"></span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { bus } from '../main.js'
export default {
  data () {
    return {
      modalShow: false,
      usersLoaded: false,
      userInfosLoaded: false,
      userListOptions: [],
      sharedWith: []
    }
  },
  async mounted () {
    await this.dispatchUsers()
    await this.dispatchUserInfos()
    this.setUserListOptions()
    bus.$on('modal_share_with', async (data) => {
      this.sharedWith = data.sharedWith
      this.showModal()
    })

    bus.$on('modal_share_with_remove_user', async (data) => {
      let index = this.userListOptions.findIndex(usr => usr._id === data.user._id)
      if(index >= 0) {
        this.userListOptions[index].selected = false
      }
    })
  },
  computed: {
    dataLoaded () {
      return this.usersLoaded
    },
    appUsers () {
      return this.$store.getters.allUsers()
    },
    currentUser () {
      return this.$store.state.userInfo
    },
    usersToShareWith () {
      return this.appUsers.filter(user => this.currentUser._id !== user._id)
    }
  },
  methods: {
    setUserListOptions () {
      let data = this.usersToShareWith
      if (data.length > 0) {
        for(let user of data) {
          if(this.userListOptions.findIndex(usr => usr.email === user.email) >= 0) {
            let selected = this.userListOptions[this.userListOptions.findIndex(usr => usr.email === user.email)].selected
            let writeAccess = this.userListOptions[this.userListOptions.findIndex(usr => usr.email === user.email)].writeAccess

            this.userListOptions[this.userListOptions.findIndex(usr => usr.email === user.email)] = user
            this.userListOptions[this.userListOptions.findIndex(usr => usr.email === user.email)].selected = selected
            this.userListOptions[this.userListOptions.findIndex(usr => usr.email === user.email)].writeAccess = writeAccess
          } else {
            this.userListOptions.push({...user, selected: false, writeAccess: 1})
          }
        }
      }
    },
    async showModal () {
      this.modalShow = true
    },
    closeModal () {
      this.modalShow = false
    },
    CapitalizeFirstLetter(string) {
      return this.$options.filters.CapitalizeFirstLetter(string)
    },
    updateShareWith () {
      let sharedWith = []
      if(this.userListOptions.length > 0) {
        for(let user of this.userListOptions) {
          if(user.selected) {
            sharedWith.push(user)
          }
        }
        bus.$emit('update_share_with', { sharedWith })
        this.closeModal()
      }
    },
    updateUserSelected (user) {
      let index = this.userListOptions.findIndex(usr => usr._id === user._id)
      if (index >= 0) {
        this.userListOptions[index].selected = !this.userListOptions[index].selected
      }
    },
    updateUserWriteAccess (user) {
      let index = this.userListOptions.findIndex(usr => usr._id === user._id)
      if (index >=0) {
        this.userListOptions[index].writeAccess === 1 ? this.userListOptions[index].writeAccess = 3 : this.userListOptions[index].writeAccess = 1
      }
    },
    async dispatchUsers () {
      try {
        const resp = await this.$options.filters.dispatchStore('getUsers')
        if (resp.status === 'success') {
          this.usersLoaded = true
        }
      } catch (error) {
        console.error(error)
        this.usersLoaded = false
      }
    },
    async dispatchUserInfos () {
      try {
        const resp = await this.$options.filters.dispatchStore('getuserInfo')
        if (resp.status === 'success') {
          this.userInfosLoaded = true
        }
      } catch (error) {
        console.error(error)
        this.userInfosLoaded = false
      }
    },
    imgPath(url) {
      return `${process.env.VUE_APP_URL}/${url}`
    }
  }
}
</script>
