<template>
  <div class="modal-wrapper flex col" :class="modalShow ? 'visible' : 'hidden'">
    <div class="modal" v-if="dataLoaded">
      <div class="modal--header flex row">
        <span class="title flex1">{{ $t('modals.share_with.title') }}</span>
        <button class="btn--icon btn--icon__no-bg editspeaker" @click="closeModal()">
          <span class="icon icon--close"></span>
        </button>
      </div>
      <div class="modal--body flex col">
        <p v-html="$t('modals.share_with.content_html')"></p>
        <div class="flex col">
          <table class="share-with-list" v-if="!!shareList && shareList.length > 0">
            <thead>
              <tr>
                <th>{{ $t('array_labels.select') }}</th>
                <th colspan="2">{{ $t('array_labels.user') }}</th>
                <th>{{ $t('array_labels.editer') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="user in shareList" 
                :key="user._id"
                :class="user.selected ? 'selected' : ''"
              >
                <td>
                  <button class="custom-checkbox" :class="user.selected ? 'selected' :''" @click="updateUserSelected(user)"></button>
                </td>
                <td class="img"><img :src="imgPath(user.img)" class="share-with-list-img"></td>
                <td>{{CapitalizeFirstLetter(user.firstname)}} {{CapitalizeFirstLetter(user.lastname)}}</td>
                <td>
                  <button class="btn-toggle" :class="user.writeAccess === 3 ? 'enabled' : 'disabled'" @click="updateUserWriteAccess(user)"><span class="btn-toggle-circle" :class="user.writeAccess === 3 ? 'enabled' : 'disabled'" ></span></button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else>{{ $t('modals.share_with.no_user') }}</div>
          <span class="error-field" v-if="formError !== null">{{formError}}</span>
        </div>
      </div>
      <div class="modal--footer flex row">
        <button class="btn btn--txt-icon grey" @click="closeModal()">
          <span class="label">{{ $t('buttons.cancel') }}</span>
          <span class="icon icon__cancel"></span>
        </button>
        <button class="btn btn--txt-icon green" @click="shareWithUsers()">
          <span class="label">{{ $t('buttons.apply') }}</span>
          <span class="icon icon__apply"></span>
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
      conversationLoaded: false,
      usersLoaded: false,
      shareList: [],
      formError: null
    }
  },
  async mounted () {
    bus.$on('modal_share_conversation_with', async () => {
      await this.dispatchConversations()
      await this.dispatchUsers()
      this.shareList = []
      this.setShareList()
      this.showModal()
    })
  },
  computed: {
   dataLoaded () { 
     return this.usersLoaded && this.conversationLoaded
   },
   conversation () {
     return this.$store.getters.conversationById(this.conversationById)
   },
   userToShareWith () {
     return this.$store.getters.usersToShareWith(this.convoId)
   }
  },
  methods: {
    async shareWithUsers () {
       try {
        this.formError = null
        let sharewith = []
        for(let usr of this.shareList) {
          if(usr.selected) {
            sharewith.push({user_id: usr._id, rights: usr.writeAccess })
          }
        }
        if(sharewith.length === 0) {
          this.formError = 'You have to select at leat one user' 
        } else {
          let payload = { sharewith }
          let req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/conversation/${this.convoId}/sharewith`, 'put', payload)
          if(req.status === 200 && !!req.data.msg) {
            bus.$emit('app_notif', {
              status: 'success',
              message: req.data.msg,
              timeout: 3000
            })
            bus.$emit('refresh_conversation', {})
            this.closeModal()
          } else {
            throw req
          }
        }
      } catch (error) {
        if(process.env.VUE_APP_DEBUG === 'true') {
          console.error(error)
        }
        bus.$emit('app_notif', {
          status: 'error',
          message: !!error.msg ? error.msg : 'Error on updating speaker',
          timeout: null
        })
      }
    },
    setShareList () {
      let data = this.userToShareWith
      if(data.length > 0) {
        for(let user of data) {
          if(this.shareList.findIndex(sl => sl._id === user._id) >= 0) {
            let selected = this.shareList[this.shareList.findIndex(sl => sl._id === user._id)].selected
            let writeAccess = this.shareList[this.shareList.findIndex(sl => sl._id === user._id)].writeAccess
            this.shareList[this.shareList.findIndex(sl => sl._id === user._id)] = user
            this.shareList[this.shareList.findIndex(sl => sl._id === user._id)].selected = selected
            this.shareList[this.shareList.findIndex(sl => sl._id === user._id)].writeAccess = writeAccess 
          }
          else {
            this.shareList.push({...user, selected:false, writeAccess:1})
          }
        }
      }
    },
    updateUserSelected (user) {
      let index = this.shareList.findIndex(sl => sl._id === user._id)
      if (index >=0) {
        this.shareList[index].selected = !this.shareList[index].selected
      }
    },
    updateUserWriteAccess (user) {
      let index = this.shareList.findIndex(usr => usr._id === user._id)
      if (index >=0) {
        this.shareList[index].writeAccess === 1 ? this.shareList[index].writeAccess = 3 : this.shareList[index].writeAccess = 1
      }
    },
    showModal () {
      this.modalShow = true
    },
    closeModal () {
      this.modalShow = false
    },
    CapitalizeFirstLetter(string) {
      return this.$options.filters.CapitalizeFirstLetter(string)
      
    },
    imgPath(url) {
      return `${process.env.VUE_APP_URL}/${url}`
    },
    async dispatchConversations () {
      try {
        let resp = await this.$options.filters.dispatchStore('getConversations')
        if (resp.status === 'success') {
          this.conversationLoaded = true
        }
      } catch (error) {
        console.error(error)
        this.conversationLoaded = false
      }
    },
    
    async dispatchUsers () {
      try {
        let resp = await this.$options.filters.dispatchStore('getUsers')
        if (resp.status === 'success') {
          this.usersLoaded = true
        }
      } catch (error) {
        console.error(error)
        this.usersLoaded = false
      }
    }
  }
}
</script>
