<template>
  <div class="modal-wrapper flex col" :class="modalShow ? 'visible' : 'hidden'">
    <div class="modal">
      <div class="modal-header flex row">
        <span class="title flex1">{{ title }}</span>
        <button class="btn btn-small red" @click="close()">
          <span class="icon icon__close"></span>
        </button>
      </div>
      <div class="modal-body flex col">
        {{ content }}
      </div>
      <div class="modal-footer flex row">
        <button class="btn btn-medium grey" @click="close()">
          <span class="label">Cancel</span>
          <span class="icon icon__cancel"></span>
        </button>
        <button class="btn btn-txt-icon green" @click="exec(actionName)">
          <span class="label">{{ actionBtnLabel }}</span>
          <span class="icon icon__apply"></span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { bus } from '../main.js'
export default ({
  data() {
      return {
        modalShow: false,
        title: '',
        content: '',
        actionBtnLabel: '',
        actionName: '',
        modalData: ''
      }
  },
  mounted() {
    bus.$on('show_modal', (data) => {
      this.modalData = data
      this.title = data.title
      this.content = data.content
      this.actionBtnLabel = data.actionBtnLabel
      this.actionName = data.actionName
      this.show()
    })
  },
  methods:{
    close(){
      this.hide()
    },
    show(){
      this.modalShow = true
    }, 
    hide(){
      this.modalShow = false
    },
    async exec (actionName) {
      if(actionName === 'leave_organization') {
        this.leaveOrganization()
      } 
      else if (actionName === 'remove_user_from_organization') {
         this.removeUserFromOrganization()
      }/*else if (actionName === 'delete_organization') {
        this.deleteOrganization()
      }  else if (actionName === 'unshare_conversation') {
         this.unshareConversationWithUser()
      } else if (actionName === 'leave_conversation') {
         this.leaveConversation()
      } */
    },
    async leaveOrganization() {
      try {
        let req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/organizations/user/${this.modalData.organization._id}`, 'delete', {})
        
        if(req.status >= 200 && req.status < 300) {
          bus.$emit('app_notif', {
            status: 'success',
            message: req.data.message || req.data.msg || `You leaved the organization "${this.modalData.organization.name}"`,
            timeout: 0,
            redirect: '/interface/organizations'
          })
          this.close()
        } else {
          throw req
        }
      } catch (error) {
        console.error(error)
        bus.$emit('app_notif', {
            status: 'error',
            message: error.message || error.msg || 'Error on leaving organization',
            timeout: null
        })
      }
    },
    async deleteOrganization() {
      try {
        let req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/organizations/${this.modalData.organization._id}`, 'delete', {})
        
        if(req.status >= 200 && req.status < 300) {
          bus.$emit('refresh_user_organizations', {})
          bus.$emit('app_notif', {
            status: 'success',
            message: req.data.message || req.data.msg || `he orgnaization "${this.modalData.orga.name}" has been deleted`,
            timeout: 3000
          })
          this.close()
        } else {
          throw req
        }
      } catch (error) {
        console.error(error)
        bus.$emit('app_notif', {
            status: 'error',
            message: error.message || error.msg || 'Error on leaving organization',
            timeout: null
        })
      }
    },
    async removeUserFromOrganization() {
      try {
        console.log('ModalData', this.modalData)
        let req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/organizations/${this.modalData.organizationId}/user`, 'delete', {userId: this.modalData.user._id})
        
        if(req.status >= 200 && req.status < 300) {
          bus.$emit('remove_organization_user', {user: this.modalData.user})
          bus.$emit('app_notif', {
            status: 'success',
            message: req.data.message || req.data.msg || `User "${this.modalData.user.email}" has been removed form the organization`,
            timeout: 3000
          })
          this.close()
        } else {
          throw req
        }
      } catch (error) {
        console.error(error)
        bus.$emit('app_notif', {
            status: 'error',
            message: error.message || error.msg || 'Error on removing user from organization',
            timeout: null
        })
      }
    },
    async unshareConversationWithUser() {
      console.log('TODO: Unshare conversation')
    },
    async leaveConversation() {
      console.log('TODO: Leave conversation')
    }
  }
})
</script>
