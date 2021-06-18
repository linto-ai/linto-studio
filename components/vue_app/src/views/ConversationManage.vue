<template>
  <div class="flex row no-padding-left" v-if="dataLoaded">
    <!-- LEFT PART -->
    <div class="flex col conversation-infos-container">
      <h2>{{$t('page.conversation_manage.h2')}}</h2>
      <div class="conversation-infos-items">
        <!-- Date -->
        <div class="conversation-infos-item">
          <div class="conversation-infos-item--label">
            <span class="conversation-infos-item--icon conversation-infos-item--icon__date"></span>
            <span class="conversation-infos-item--title">{{ $t('array_labels.date') }}</span>
          </div>
          <span class="conversation-infos-item--value">{{ dateToJMY(convo.created) }}</span>
        </div>
        <!-- Duration -->
        <div class="conversation-infos-item">
          <div class="conversation-infos-item--label">
            <span class="conversation-infos-item--icon conversation-infos-item--icon__duration"></span>
            <span class="conversation-infos-item--title">{{ $t('array_labels.duration') }}</span>
          </div>
          <span class="conversation-infos-item--value">{{ timeToHMS(convo.audio.duration) }}</span>
        </div>
        <!-- Last update -->
        <div class="conversation-infos-item">
          <div class="conversation-infos-item--label">
            <span class="conversation-infos-item--icon conversation-infos-item--icon__lastupdate"></span>
            <span class="conversation-infos-item--title">{{ $t('array_labels.last_update') }}</span>
          </div>
          <span class="conversation-infos-item--value">{{ dateToJMYHMS(convo.last_update) }}</span>
        </div>
        <!-- Owner -->
        <div class="conversation-infos-item">
          <div class="conversation-infos-item--label">
            <span class="conversation-infos-item--icon conversation-infos-item--icon__owner"></span>
            <span class="conversation-infos-item--title">{{ $t('array_labels.owner') }}</span>
          </div>
          <span class="conversation-infos-item--value" v-if="!!allUsers && allUsers.length> 0">{{ `${CapitalizeFirstLetter(allUsers[allUsers.findIndex(usr => usr._id === convo.owner)].firstname)} ${CapitalizeFirstLetter(allUsers[allUsers.findIndex(usr => usr._id === convo.owner)].lastname)}` }}</span>
        </div>
        <!-- Shared with -->
        <div class="conversation-infos-item">
          <div class="conversation-infos-item--label">
            <span class="conversation-infos-item--icon conversation-infos-item--icon__sharedwith"></span>
            <span class="conversation-infos-item--title">{{ $t('array_labels.sharedWith') }}</span>
          </div>
          <table class="conversation-infos--shared-with" v-if="sharedWithEditers.length > 0">
            <thead>
              <tr>
                <th colspan="3">{{ $t('array_labels.editers') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user,i) in sharedWithEditers" :key="i"
              >
                <td class="user-name">{{ `${CapitalizeFirstLetter(allUsers[allUsers.findIndex(usr => usr._id === user.user_id)].firstname)} ${CapitalizeFirstLetter(allUsers[allUsers.findIndex(usr => usr._id === user.user_id)].lastname)}` }}
                </td>
                <td>
                  <button class="btn-toggle" :class="user.rights === 3 ? 'enabled' : 'disabled'" @click="updateUserWriteAccess(user)" v-if="userAccess.isOwner">
                    <span class="btn-toggle-circle" :class="user.rights === 3 ? 'enabled' : 'disabled'" ></span>
                  </button>
                </td>
                <td> 
                  <button 
                    class="btn--icon btn--icon__no-bg" 
                    @click="removeShareWith(user)"
                    v-if="userAccess.isOwner"
                  >
                    <span class="icon icon--remove"></span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="conversation-infos--shared-with" v-if="sharedWithReaders.length > 0">
            <thead>
              <tr>
                <th colspan="3">{{ $t('array_labels.readers') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user,i) in sharedWithReaders" :key="i"
              >
                <td class="user-name">{{ `${CapitalizeFirstLetter(allUsers[allUsers.findIndex(usr => usr._id === user.user_id)].firstname)} ${CapitalizeFirstLetter(allUsers[allUsers.findIndex(usr => usr._id === user.user_id)].lastname)}` }}
                </td>
                <td>
                  <button class="btn-toggle" :class="user.rights === 3 ? 'enabled' : 'disabled'" @click="updateUserWriteAccess(user)" v-if="userAccess.isOwner">
                    <span class="btn-toggle-circle" :class="user.rights === 3 ? 'enabled' : 'disabled'" ></span>
                  </button>
                </td>
                <td> 
                  <button 
                    class="btn--icon btn--icon__no-bg" 
                    @click="removeShareWith(user)"
                    v-if="userAccess.isOwner"
                  >
                    <span class="icon icon--remove"></span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="flex row">
            <button class="btn btn--txt-icon blue" @click="shareWith()" v-if="userAccess.isOwner">
              <span class="label">{{ $t('buttons.share') }}</span>
              <span class="icon icon__share"></span>
            </button>
          </div>
        </div>
        <!-- Documents -->
        <div class="conversation-infos-item">
          <div class="conversation-infos-item--label">
            <span class="conversation-infos-item--icon conversation-infos-item--icon__documents"></span>
            <span class="conversation-infos-item--title">{{ $t('array_labels.documents') }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- END LEFT PART -->
    <!-- RIGHT PART -->
    <div class="flex1 flex col conversation-settings">
      <!-- Title -->
      <div class="conversation-settings-item flex row">
        <span v-if="!titleEdit" class="conversation-settings-item--title">{{ convo.name.base }}</span>
        <div v-else class="conversation-settings-item--title__edit flex col flex1">
            <textarea v-model="convo.name.edit" class="textarea flex1"></textarea>
            <div class="textarea--btns flex row">
              <button class="btn btn--txt btn--txt__cancel" @click="cancelEditTitle()"><span class="label">{{ $t('buttons.cancel') }}</span></button>
              <button class="btn btn--txt btn--txt__save" @click="update('name')"><span class="label">{{ $t('buttons.save') }}</span></button>
            </div>
        </div>
        <button class="btn--icon" :class="titleEdit ? 'active': ''" @click="editTitle()" v-if="userAccess.canEdit">
          <span class="icon icon--edit"></span>
        </button>
      </div>

      <!-- Description -->
      <div class="conversation-settings-item flex row">
        <span v-if="!descriptionEdit" class="conversation-settings-item--description">{{ convo.description.base }}</span>
        <div v-else class="conversation-settings-item--title__edit flex col flex1">
            <textarea v-model="convo.description.edit" class="textarea flex1"></textarea>
            <div class="textarea--btns flex row">
              <button class="btn btn--txt btn--txt__cancel" @click="cancelEditDescription()"><span class="label">{{ $t('buttons.cancel') }}</span></button>
              <button class="btn btn--txt btn--txt__save" @click="update('description')"><span class="label">{{ $t('buttons.save') }}</span></button>
            </div>
        </div>
        <button class="btn--icon" :class="descriptionEdit ? 'active': ''" @click="editDescription()"  v-if="userAccess.canEdit">
          <span class="icon icon--edit"></span>
        </button>
      </div>

      <!-- Agenda -->
      <div class="conversation-settings-item">
        <div class="conversation-settings-item--label">
          <span class="conversation-settings-item--icon agenda"></span>
          <span class="conversation-settings-item--title">{{ $t('array_labels.agenda') }}</span>
          <button class="conversation-settings-item--toggle-btn" @click="toggleContent($event, 'agenda-content')"></button>
          <button class="btn--icon" :class="agendaEdit ? 'active': ''" @click="editAgenda()" v-if="userAccess.canEdit">
            <span class="icon icon--edit"></span>
          </button>
        </div>
        <!-- Agenda String --->
        <div v-if="!agendaEdit && typeOfAgenda === 'string'" class="conversation-settings-item--content" id="agenda-content">{{ convo.agenda.base }}</div>
        <div v-if="agendaEdit && typeOfAgenda === 'string'" class="flex col flex1">
          <textarea 
            v-model="convo.agenda.edit" class="textarea flex1"
          ></textarea>
        </div>
        <!-- Agenda Object -->
        <div v-if="!agendaEdit && typeOfAgenda === 'object'" class="conversation-settings-item--content" id="agenda-content">
          <ul v-if="convo.agenda.edit.length > 0 && convo.agenda.edit[0] !== ''" class="agenda-list">
            <li class="agenda-content-item" v-for="(agenda,i) in convo.agenda.edit" :key="i">{{ agenda }}</li>
          </ul>
        </div>
        <div v-if="agendaEdit && typeOfAgenda === 'object'">
          <div class="form-field" v-for="(agenda,i) in convo.agenda.edit" :key="i">
            <input type="text" v-model="convo.agenda.edit[i]" />
            <button class="list-btn-small minus" @click="removeAgendaField(i)" v-if="i !== 0"></button>
            <button class="list-btn-small plus" @click="addAgendaField()" v-if="i === convo.agenda.edit.length - 1"></button>
          </div>
          
        </div>
        <div class="textarea--btns flex row" v-if="userAccess.canEdit && agendaEdit">
          <button class="btn btn--txt btn--txt__cancel" @click="cancelEditAgenda()"><span class="label">{{ $t('buttons.cancel') }}</span></button>
          <button class="btn btn--txt btn--txt__save" @click="update('agenda')"><span class="label">{{ $t('buttons.save') }}</span></button>
        </div>
      </div>
      <!-- Abstract -->
      <div class="conversation-settings-item">
        <div class="conversation-settings-item--label">
          <span class="conversation-settings-item--icon abstract"></span>
          <span class="conversation-settings-item--title">{{ $t('array_labels.abstract') }}</span>
          <button class="conversation-settings-item--toggle-btn" @click="toggleContent($event, 'abstract-content')"></button>
          <button class="btn--icon" :class="abstractEdit ? 'active': ''" @click="editAbstract()" v-if="userAccess.canEdit">
            <span class="icon icon--edit"></span>
          </button>
        </div>
        <div v-if="!abstractEdit" class="conversation-settings-item--content" id="abstract-content">{{ convo.abstract.base }}</div>
        <div v-else class="flex col flex1">
          <textarea v-model="convo.abstract.edit" class="textarea flex1"></textarea>
          <div class="textarea--btns flex row">
            <button class="btn btn--txt btn--txt__cancel" @click="cancelEditAbstract()"><span class="label">{{ $t('buttons.cancel') }}</span></button>
            <button class="btn btn--txt btn--txt__save" @click="update('abstract')"><span class="label">{{ $t('buttons.save') }}</span></button>
          </div>
        </div>
      </div>

      <div class="flex row">
      <!-- Speakers -->
        <div class="conversation-settings-item flex1">
          <div class="conversation-settings-item--label">
            <span class="conversation-settings-item--icon speakers"></span>
            <span class="conversation-settings-item--title">{{ $t('array_labels.speakers') }}</span>
            <button class="conversation-settings-item--toggle-btn" @click="toggleContent($event, 'speakers-content')"></button>
          </div>
          <div class="conversation-settings-item--content" id="speakers-content">
            <table class="table table-speakers">
              <tbody v-if="convo.speakers.length > 0">
                <tr v-for="speaker in convo.speakers" :key="speaker.speaker_id">
                  <td>{{ speaker.speaker_name }}</td>
                  <td>
                    <button 
                      v-if="(!!speaker.stime && parseFloat(speaker.stime) > 0) && (!!speaker.etime && parseFloat(speaker.etime) > 0)"
                      class="btn--icon" 
                      @click="playSample($event, speaker.stime, speaker.etime)"
                    >
                      <span class="icon icon--play"></span>
                    </button>
                  <td>
                    <div class="table-speaker--edit">
                      <button class="btn--icon editspeaker" @click="editSpeaker($event, speaker)" v-if="userAccess.canEdit">
                        <span class="icon icon--edit"></span>
                      </button>
                     
                    </div>
                  </td>
                  <td>
                    <div v-if="userAccess.canEdit && !!speakTime[speaker.speaker_id].time" class="speaker-time-prct-container">
                      <span class="speaker-time-prct" :style="'width:'+ parseInt(parseFloat(speakTime[speaker.speaker_id].time) * 100 / parseFloat(convo.audio.duration))+'%'">
                      </span>
                    </div>
                  </td> 
                  <td>
                    <button 
                    class="btn--icon btn--icon__no-bg" 
                    @click="deleteSpeaker(speaker.speaker_id)" 
                    v-if="userAccess.canEdit && convo.speakers.length > 1"
                  >
                      <span class="icon" :class="!!speakTime[speaker.speaker_id] && speakTime[speaker.speaker_id].time > 0 ? 'icon--merge' : 'icon--remove'"></span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <button class="btn btn--txt-icon green" @click="addSpeaker()" v-if="userAccess.canEdit">
              <span class="label">{{ $t('buttons.new_speaker') }}</span>
              <span class="icon icon__plus"></span>
            </button>
          </div>
        </div>
        <!-- Keywords -->
        <div class="conversation-settings-item flex1">
          <div class="conversation-settings-item--label">
            <span class="conversation-settings-item--icon keywords"></span>
            <span class="conversation-settings-item--title">{{ $t('array_labels.keywords') }}</span>
            <button class="conversation-settings-item--toggle-btn" @click="toggleContent($event, 'keywords-content')"></button>
            <button class="btn--icon" :class="keywordsEdit ? ' active' :''" @click="editKeywords()"  v-if="userAccess.canEdit">
               <span class="icon icon--edit"></span>
            </button>
          </div>
          <div v-if="!keywordsEdit" class="conversation-settings-item--content" id="keywords-content">
            <span v-for="kw in convo.keywords.base" :key="kw.label">{{ kw.label }}</span>
          </div>
          <div v-else class="flex col flex1">
            <textarea v-model="convo.keywords.edit" class="textarea flex1"></textarea>
            <div class="textarea--btns flex row">
              <button class="btn btn--txt btn--txt__cancel" @click="cancelEditKeywords()"><span class="label">{{ $t('buttons.cancel') }}</span></button>
              <button class="btn btn--txt btn--txt__save" @click="update('keywords')"><span class="label">{{ $t('buttons.save') }}</span></button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex row">
        <a :href="`/interface/conversation/${convoId}/transcription`" class="btn btn--txt-icon blue"> 
          <span class="label">{{ $t('buttons.transcription')}}</span>
          <span class="icon icon__transcription"></span>
        </a>
      </div>
    </div>
    <ModalRemoveShareWith :convoId="convoId"></ModalRemoveShareWith>
    <ModalMergeSpeakersWithTarget :convoId="convoId"></ModalMergeSpeakersWithTarget>
    <ModalDeleteSpeaker :convoId="convoId"></ModalDeleteSpeaker>
    <EditSpeakerFrame></EditSpeakerFrame>

    <ModalConversationShareWith :convoId="convoId"></ModalConversationShareWith>
  </div>
  <div v-else>Loading</div>
</template>
<script>
import EditSpeakerFrame from '@/components/EditSpeakerFrame.vue'
import ModalMergeSpeakersWithTarget from '@/components/ModalMergeSpeakersWithTarget.vue'
import ModalDeleteSpeaker from '@/components/ModalDeleteSpeaker.vue'
import ModalRemoveShareWith from '@/components/ModalRemoveShareWith.vue'
import ModalConversationShareWith from '@/components/ModalConversationShareWith.vue'
import { bus } from '../main.js'
export default {
  props: ['userInfo'],
  data () {
    return {
      convo: '',
      convoId: '',
      titleEdit: false,
      descriptionEdit: false,
      agendaEdit: false,
      abstractEdit: false,
      keywordsEdit: false,
      convoLoaded: false,
      usersLoaded: false,
      speakerEdit: false,
      audioPlayer: null
    }
  },
  async mounted () {
    bus.$emit('vertical_nav_close', {})
    await this.dispatchConversations()
    await this.dispatchUsersInfo()
    
    this.convoId = this.$route.params.convoId
    this.audioPlayer = new Audio()

    bus.$on('refresh_conversation', async (data) => {
      await this.dispatchConversations()
    })

    bus.$on('update_speaker', async (data) => {
      await this.dispatchConversations()
      this.speakerEdit = false
      bus.$emit('close_edit_speaker_frame', {})
    })
  },
  computed: {
    dataLoaded () {
      return this.usersLoaded && this.convoLoaded && !!this.userAccess && this.convo !== ''
    },
    typeOfAgenda () {
      return typeof this.convo.agenda.edit
    },
    allUsers () {
      return this.$store.getters.allUsersInfos()
    },
    conversation () {
      return this.$store.getters.conversationById(this.convoId)
    },
    speakTime () {
      let res = {total: 0}
      this.convo.speakers.map(spk => {
        if (!res[spk.speaker_id]) {
          res[spk.speaker_id] = { time: 0.0 }
        }
      })
      this.convo.text.map(txt => {
        txt.words.map(word => {
            if(!!res[txt.speaker_id]) {
              let time = parseFloat(parseFloat(word.etime).toFixed(2) - parseFloat(word.stime).toFixed(2)).toFixed(2)
              res[txt.speaker_id].time += parseFloat(time)
              res.total = parseFloat(Number(parseFloat(res.total) + parseFloat(time)).toFixed(2))
            }
        })
      })
      return res
    },
    sharedWithEditers () {
      if(!!this.convo.sharedWith) {
        return this.convo.sharedWith.filter(usr => usr.rights === 3)
      }
      return []
    }, 
    sharedWithReaders () {
        if(!!this.convo.sharedWith) {
        return this.convo.sharedWith.filter(usr => usr.rights === 1)
      }
      return []
    },
    userAccess () {
      return this.$store.getters.getUserRightsByConversation(this.convoId)
    }
  },
  watch: {
    conversation (data) {
      if(typeof(data) === 'object' ){
        this.convo = data
        const titleVal = data.name
        this.convo.name = {
          base: titleVal,
          edit: titleVal
        }
        const descVal = data.description
        this.convo.description = {
          base: descVal,
          edit: descVal
        }
        const agendaVal = data.agenda
        this.convo.agenda = {
          base: agendaVal,
          edit: agendaVal
        }
        const abstractVal = data.abstract
        this.convo.abstract = {
          base: !!data.abstract.base ? data.abstract.base : abstractVal,
          edit: !!data.abstract.edit ? data.abstract.edit : abstractVal
        }
        const keyWordsVal = data.keywords
        this.convo.keywords = {
          base: keyWordsVal,
          edit: keyWordsVal
        }
      }
    }
  },
  methods: {
    async updateUserWriteAccess (user) {
      try {
        let req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/conversation/${this.convoId}/sharewith/${user.user_id}`, 'patch', {rights: user.rights === 1 ? 3 : 1})
        if(req.status === 200 && !!req.data.msg) {
          bus.$emit('app_notif', {
            status: 'success',
            message: req.data.msg,
            timeout: 3000
          })
          bus.$emit('refresh_conversation', {})
        } else {
          throw req
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
    shareWith () {
      bus.$emit('modal_share_conversation_with', {})
    },
    removeShareWith (user) {
      bus.$emit('modal_unshare_user', {
        userId: user.user_id,
        conversation_name: this.conversation.name.base
      })
    },
    toggleContent (elem, id) {
      const target = document.getElementById(id)
      if (target.classList.contains('hidden')) {
        target.classList.remove('hidden')
        elem.srcElement.classList.remove('closed')
      } else {
        target.classList.add('hidden')
        elem.srcElement.classList.add('closed')
      }
    },
    editTitle () {
      this.titleEdit = true
    },
    cancelEditTitle () {
      this.titleEdit = false
      this.convo.name.edit = this.convo.name.base
    },
    editDescription () {
      this.descriptionEdit = true
    },
    cancelEditDescription () {
      this.descriptionEdit = false
      this.convo.description.edit = this.convo.description.base
    },
    editAgenda () {
      this.agendaEdit = true
    },
    async cancelEditAgenda () {
      this.agendaEdit = false
      this.convo.agenda.edit = this.convo.agenda.base
      await this.dispatchConversations()
    },
    editAbstract () {
      this.abstractEdit = true
    },
    cancelEditAbstract () {
      this.abstractEdit = false
      this.convo.abstract.edit = this.convo.keywords.base
    },
    editKeywords () {
      this.keywordsEdit = true
    },
    cancelEditKeywords () {
      this.keywordsEdit = false
      this.convo.keywords.edit = this.convo.keywords.base
    },
    addAgendaField () {
      this.convo.agenda.edit.push('')
    },
    removeAgendaField (index) {
      this.convo.agenda.edit.splice(index, 1)
    },
    async update (key) {
      try {
        this.conversation[key].base = this.conversation[key].edit
        let payload = {}
        let uriKey = ''
        if (key === 'name') {
          this.titleEdit = false
          // REQUEST UPDATE title
          payload.title = this.conversation[key].edit
          uriKey = 'title'
        }
        if (key === 'description') {
          this.descriptionEdit = false
          payload.description = this.conversation[key].edit
          uriKey = 'description'
          // REQUEST UPDATE title
        }
        if (key === 'agenda') {
          // REQUEST UPDATE AGENDA
          this.agendaEdit = false
          let agenda = this.conversation[key].edit.filter(ag => ag !== "")
          if(agenda.length === 0) {
            agenda = [""]
          }

          payload.agenda = agenda
          uriKey = 'agenda'
        }
        if (key === 'abstract') {
          // REQUEST UPDATE ABSTRACT
          this.abstractEdit = false
        }
        if (key === 'keywords') {
          this.keywordsEdit = false
          // REQUEST UPDATE keywords
        }  

        let req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/conversation/${this.convoId}/${uriKey}`, 'put', payload)
        if(req.status === 200 && !!req.data.msg) {
          bus.$emit('app_notif', {
            status: 'success',
            message: req.data.msg,
            timeout: 3000
          })
          bus.$emit('refresh_conversation', {})
        } else {
          throw req
        }
      } catch (error) {
        if(process.env.VUE_APP_DEBUG === 'true') {
          console.error(error)
        }
        if(error.msg !== 'no match found') {
          bus.$emit('app_notif', {
            status: 'error',
            message: !!error.msg ? error.msg : 'Error on updating conversation',
            timeout: null
          })
        }
        bus.$emit('refresh_conversation', {})
      }
    },
    playSample (event, start, end) {
      const target = event.target
      const audio = this.convo.audio
      this.audioPlayer.src = `${process.env.VUE_APP_URL}/${audio.filepath}`
      this.audioPlayer.currentTime = start
      this.audioPlayer.play()
      target.classList.add('active')
      const time = end - start

      setTimeout(()=> {
        this.audioPlayer.pause()
        target.classList.remove('active')
      }, time * 1000)
    },

    /*** EDIT SPEAKERS ***/
    editSpeaker (event, speaker) {
      
      const btn = event.target
      const bounce = btn.getBoundingClientRect()
      const editSpeakerFrame = document.getElementById('edit-speaker-frame')
      editSpeakerFrame.setAttribute('style',`top: ${bounce.y}px; left: ${bounce.x - 60}px`)
      if (!this.speakerEdit) {
        bus.$emit('edit_speaker_frame', {
          speaker, 
          speakers: this.convo.speakers, 
          conversationId: this.convoId
        })
        this.speakerEdit = true
      }
    },
    defineNewSpeakerName (spkCount) {
        let newSpeakerName = `spk${parseInt(spkCount) + 1}`
        let speakerExist = this.conversation.speakers.filter(spk => spk.speaker_name === newSpeakerName)
        if(speakerExist.length > 0) {
          return this.defineNewSpeakerName(spkCount+1)
        } else {
          return newSpeakerName
        }
    },
    deleteSpeaker (speakerId) {
      bus.$emit('modal_delete_speaker', {
        convoId: this.convoId,
        speakerId
      })
    },
    async addSpeaker () {
      try {
        let newSpeakerName = this.defineNewSpeakerName(this.conversation.speakers.length)
        const payload =  {
          convoid: this.convoId,
          speakername: newSpeakerName
        }
        const req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/conversation/${this.convoId}/speakers`, 'post', payload)

        if(req.status === 200 && !!req.data.msg) {
          bus.$emit('app_notif', {
            status: 'success',
            message: req.data.msg,
            timeout: 3000
          })
          await this.dispatchConversations()
        } else {
          throw req
        }
      } catch (error) {
        if(process.env.VUE_APP_DEBUG === 'true') {
          console.error(error)
        }
        bus.$emit('app_notif', {
          status: 'error',
          message: !!error.msg ? error.msg : 'Error on adding speaker',
          timeout: null
        })
      }
    },
    timeToHMS (time) {
      return this.$options.filters.timeToHMS(time) 
    },
    dateToJMY (date) {
      return this.$options.filters.dateToJMY(date) 
    },
    dateToJMYHMS (date) {
      return this.$options.filters.dateToJMYHMS(date) 
    },
    CapitalizeFirstLetter (string) {
      return this.$options.filters.CapitalizeFirstLetter(string)
    },
    async dispatchConversations () {
      try {
        let getConvos = await this.$options.filters.dispatchStore('getConversations')
        if(getConvos.status === 'success') {
          this.convoLoaded = true
        }
      } catch (error) {
        console.error(error)
      }
    },
    async dispatchUsersInfo () {
      try {
        let getUsers = await this.$options.filters.dispatchStore('getUsers')
        if(getUsers.status === 'success') {
          this.usersLoaded = true
        }
      } catch (error) {
        console.error(error)
      }
    }
  },
  components: {
    EditSpeakerFrame,
    ModalMergeSpeakersWithTarget,
    ModalDeleteSpeaker,
    ModalRemoveShareWith,
    ModalConversationShareWith
  }
}
</script>