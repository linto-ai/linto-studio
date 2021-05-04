<template>
  <div class="modal-wrapper flex col" :class="modalShow ? 'visible' : 'hidden'">
    <div class="modal" v-if="dataLoaded">
      <div class="modal--header flex row">
        <span class="title flex1">Share conversation</span>
        <button class="btn--icon btn--icon__no-bg editspeaker" @click="closeModal()">
          <span class="icon icon--close"></span>
        </button>
      </div>
      <div class="modal--body">
        <p>You can share a conversation with other users, and give them access to the conversation overview and the transcription. Select one or mutliple users in the following list and manage them edition rights.</p>
        <table id="share-with-list" v-if="!!appUsers && appUsers.length > 0">
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th></th>
              <th>Edition</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="user in userListOptions" 
              :key="user._id"
              :class="user.selected ? 'selected' : ''"
            >
              <td>
                <button class="custom-checkbox" :class="user.selected ? 'selected' :''" @click="updateUserSelected(user)"></button>
              </td>
              <td><img :src="imgPath(user.img)" class="share-with-list-img"></td>
              <td>{{CapitalizeFirstLetter(user.firstname)}} {{CapitalizeFirstLetter(user.lastname)}}</td>
              <td>
                <button class="btn-toggle" :class="user.writeAccess ? 'enabled' : 'disabled'" @click="updateUserWriteAccess(user)"><span class="btn-toggle-circle" :class="user.writeAccess ? 'enabled' : 'disabled'" ></span></button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else>No user found</div>
        <button @click="updateShareWith()">Apply</button>
      </div>
      <div class="modal--footer">
        <button class="btn btn--txt-icon grey" @click="closeModal()">
          <span class="label">Cancel</span>
          <span class="icon icon__cancel"></span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { bus } from '../main.js'
export default {
  props: ['convoId'],
  data () {
    return {
      modalShow: false,
      usersLoaded: false,
      userListOptions: []
    }
  },
  async mounted () {
    bus.$on('modal_share_with', async (data) => {
      console.log('OPEN ?')
      this.showModal()
      await this.dispatchUsers()
    })
    
  },
  computed: {
   dataLoaded () {
     return this.usersLoaded
   },
   appUsers () {
     return this.$store.getters.allUsers()
   }
  },
  watch: {
    appUsers (data) {
      if (data.length > 0) {
        for(let user of data) {
          if(this.userListOptions.findIndex(usr => usr.email === user.email) >= 0) {
             let selected = this.userListOptions[this.userListOptions.findIndex(usr => usr.email === user.email)].selected
            this.userListOptions[this.userListOptions.findIndex(usr => usr.email === user.email)] = data
            this.userListOptions[this.userListOptions.findIndex(usr => usr.email === user.email)].selected = selected
          } else {
            this.userListOptions.push({...user, selected: false, writeAccess: false})
          }
        }
        console.log(this.userListOptions)
      }
    }
  },
  methods: {
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
            if(user.writeAccess) {
              user.writeAccess = 3
            } else {
              user.writeAccess = 1
            }
            sharedWith.push(user)
          }
        }
        bus.$emit('update_share_with', [ ...sharedWith ])
        this.closeModal()
      }
    },
    updateUserSelected (user) {
      let index = this.userListOptions.findIndex(usr => usr._id === user._id)
      if (index >=0) {
        this.userListOptions[index].selected = !this.userListOptions[index].selected
      }
    },
    updateUserWriteAccess (user) {
      let index = this.userListOptions.findIndex(usr => usr._id === user._id)
      if (index >=0) {
        this.userListOptions[index].writeAccess = !this.userListOptions[index].writeAccess
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
    imgPath(url) {
      return `${process.env.VUE_APP_URL}/${url}`
    }
  }
}
</script>
