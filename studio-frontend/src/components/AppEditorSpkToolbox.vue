<template>
  <div
    :class="['spk-toolbox', 'flex', 'col']"
    @keydown="(e) => e.stopPropagation()">
    <!-- Add speaker form -->
    <div v-if="showAddSpeakerForm" class="speaker-toolbox-form flex col">
      <div class="flex col">
        <span class="speaker-toolbox-input-label">{{
          $t("conversation.transcription.add_speaker")
        }}</span>
        <input
          type="text"
          :class="[
            'speaker-toolbox-input',
            addSpeakerName.error !== null ? 'error' : '',
          ]"
          :placeholder="$t('conversation.transcription.speaker_name')"
          v-model="addSpeakerName.value" />
        <span v-if="addSpeakerName.error !== null" class="error-field">{{
          addSpeakerName.error
        }}</span>
      </div>
      <div class="flex row justify-evenly">
        <button
          @click="toggleAddSpeaker()"
          class="speaker-toolbox-input-btn red">
          <span class="icon close"></span>
        </button>
        <button class="speaker-toolbox-input-btn green" @click="addSpeaker()">
          <span class="icon valid"></span>
        </button>
      </div>
    </div>

    <!-- Edit speaker form -->
    <div v-else-if="showEditSpeakerForm" class="speaker-toolbox-form flex col">
      <div class="flex col">
        <span class="speaker-toolbox-input-label">{{
          $t("conversation.transcription.edit_speaker")
        }}</span>
        <input
          type="text"
          :class="[
            'speaker-toolbox-input',
            editSpeakerName.error !== null ? 'error' : '',
          ]"
          :placeholder="$t('conversation.transcription.speaker_name')"
          v-model="editSpeakerName.value"
          @input="editSpeakerName.error = null" />
        <span v-if="editSpeakerName.error !== null" class="error-field">{{
          editSpeakerName.error
        }}</span>
      </div>
      <div class="flex row justify-evenly">
        <button
          @click="toggleEditSpeaker()"
          class="speaker-toolbox-input-btn red">
          <span class="icon close"></span>
        </button>
        <button class="speaker-toolbox-input-btn green" @click="editSpeaker()">
          <span class="icon valid"></span>
        </button>
      </div>
    </div>

    <!-- Speaker list -->
    <div v-show="showList" class="speaker-toolbox-list flex col">
      <button
        v-for="spk of speakersList"
        :key="spk.speaker_id"
        class="speaker-toolbox-item"
        @click="updateSpeaker(spk.speaker_id)">
        <span class="label" style="">{{ spk.speaker_name }}</span>
      </button>
      <button class="speaker-toolbox-item" @click="toggleEditSpeaker()">
        <span class="icon edit"></span>
        <span class="label">{{
          $t("conversation.transcription.edit_speaker")
        }}</span>
      </button>
      <button class="speaker-toolbox-item" @click="toggleAddSpeaker()">
        <span class="icon add"></span>
        <span class="label">{{
          $t("conversation.transcription.add_speaker")
        }}</span>
      </button>
    </div>
  </div>
</template>
<script>
import { workerSendMessage } from "../tools/worker-message.js"
import { bus } from "../main.js"
export default {
  props: {
    speakers: {
      type: Array,
      required: true,
    },
    speakerId: {
      type: String,
      required: true,
    },
    turnId: {
      type: String,
      required: true,
    },
    turnIndex: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      showAddSpeakerForm: false,
      showEditSpeakerForm: false,
      editSpeakerName: {
        value: "",
        error: null,
        valid: false,
      },
      addSpeakerName: {
        value: "",
        error: null,
        valid: false,
      },
      spkBtn: null,
    }
  },
  computed: {
    speakersList() {
      return this.speakers
        .filter((spk) => spk.speaker_id !== this.speakerId)
        .sort((a, b) => a.speaker_name.localeCompare(b.speaker_name))
    },
    showList() {
      return !this.showAddSpeakerForm && !this.showEditSpeakerForm
    },
    "addSpeakerName.value"(val) {
      this.$options.filters.testFieldEmpty(this.addSpeakerName)
    },
  },
  mounted() {
    this.editSpeakerName = {
      value: this.speakers.find((spk) => spk.speaker_id === this.speakerId)
        .speaker_name,
      error: null,
      valid: true,
    }
  },
  methods: {
    toggleAddSpeaker() {
      this.showAddSpeakerForm = !this.showAddSpeakerForm
      // reset form
      if (this.addSpeakerName.value !== "") {
        this.addSpeakerName = {
          value: "",
          error: null,
          valid: false,
        }
      }
    },
    toggleEditSpeaker() {
      this.showEditSpeakerForm = !this.showEditSpeakerForm
      // reset form
      let currentSpeakerName = this.speakers.find(
        (spk) => spk.speaker_id === this.speakerId
      ).speaker_name
      if (this.editSpeakerName.value !== currentSpeakerName) {
        this.editSpeakerName = {
          value: currentSpeakerName,
          error: null,
          valid: true,
        }
      }
    },
    editSpeaker() {
      this.$options.filters.testFieldEmpty(this.editSpeakerName)
      if (this.editSpeakerName.valid) {
        let speakersNames = this.speakers.map((spk) => spk.speaker_name)
        // TODO: put this logic in testName ?
        if (speakersNames.includes(this.editSpeakerName.value)) {
          this.editSpeakerName.error = "This name is already used"
          this.editSpeakerName.valid = false
        } else {
          let payload = {
            conversationId: this.conversationId,
            newSpeakerName: this.editSpeakerName.value,
            speakerId: this.speakerId,
          }
          workerSendMessage("update_conversation_speaker_name", payload)
        }
      }
      return
    },
    addSpeaker() {
      this.$options.filters.testFieldEmpty(this.addSpeakerName)
      if (this.addSpeakerName.valid) {
        workerSendMessage("update_conversation_add_speaker", {
          speakerName: this.addSpeakerName.value,
          turnId: this.turnId,
          turnIndex: this.turnIndex,
        })
      }
    },
    updateSpeaker(newSpeakerId) {
      this.$options.filters.testFieldEmpty(this.addSpeakerName)

      workerSendMessage("turn_edit_speaker", {
        turnId: this.turnId,
        turnIndex: this.turnIndex,
        newSpeakerId,
      })
    },
    closeToolbox() {
      bus.$emit("close_spk_toolbox", { turnId: this.turnId })
    },
  },
}
</script>
