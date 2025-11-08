<template>
  <!-- TODO: use <form> and submit button for accessibility-->
  <!-- Add speaker form -->
  <ContextMenu
    first
    :x="1"
    :y="18"
    name="speaker-menu"
    @keydown="stopPropagation"
    @click="stopPropagation"
    class="context-menu__speaker reset-color">
    <!-- -- -- Change speaker -- -- -->

    <div class="context-menu__element" v-if="speakersList.length > 0">
      <Button
        block
        variant="text"
        icon="user-switch"
        iconRight="caret-right"
        multiline
        :label="$t('conversation.speaker_toolbox.change_speaker_button')"
        :selected="state == STATES.CHANGE_SPEAKER"
        @click="enterChangeSpeaker" />

      <ContextMenu
        name="change-speaker"
        v-if="state == STATES.CHANGE_SPEAKER"
        class="overflow-vertical-auto">
        <div class="flex col gap-small">
          <Button
            v-for="spk of speakersList"
            icon="user"
            :label="spk.speaker_name"
            @click="updateSpeaker(spk.speaker_id)" />
        </div>
      </ContextMenu>
    </div>

    <!-- -- -- Edit speaker -- -- -->

    <div class="context-menu__element">
      <Button
        block
        variant="text"
        icon="pencil"
        iconRight="caret-right"
        :label="
          $t('conversation.speaker_toolbox.edit_speaker_button', {
            current: currentSpeakerName,
          })
        "
        @click="enterEditSpeaker" />

      <ContextMenu name="edit-speaker" v-if="state == STATES.EDIT_SPEAKER">
        <form class="flex col gap-small">
          <FormInput
            :field="editSpeakerName"
            v-model="editSpeakerName.value"
            withConfirmation
            @on-confirm="editSpeaker" />
        </form>
      </ContextMenu>
    </div>

    <!-- -- -- Merge speaker -- -- -->

    <div
      class="context-menu__element"
      @click="enterMergeSpeaker"
      v-if="speakersList.length > 0">
      <Button
        block
        variant="text"
        :selected="state == STATES.MERGE_SPEAKER"
        @click="enterMergeSpeaker"
        icon="link"
        iconRight="caret-right"
        :label="
          $t('conversation.speaker_toolbox.merge_speaker_button', {
            name: currentSpeakerName,
          })
        "></Button>

      <ContextMenu
        name="change-speaker"
        v-if="state == STATES.MERGE_SPEAKER"
        class="overflow-vertical-auto">
        <div class="flex col gap-small">
          <Button
            v-for="spk of speakersList"
            icon="user"
            :label="spk.speaker_name"
            @click="mergeSpeaker(spk.speaker_id)" />
        </div>
      </ContextMenu>
    </div>

    <!-- -- -- Create speaker -- -- -->

    <div class="context-menu__element">
      <Button
        :selected="state == STATES.CREATE_SPEAKER"
        block
        variant="text"
        icon="plus"
        iconRight="caret-right"
        @click="enterCreateSpeaker"
        :label="$t('conversation.speaker_toolbox.create_speaker_button')" />

      <ContextMenu name="create-speaker" v-if="state == STATES.CREATE_SPEAKER">
        <form class="flex col gap-small">
          <FormInput
            :field="addSpeakerName"
            v-model="addSpeakerName.value"
            withConfirmation
            @on-confirm="addSpeaker" />
        </form>
      </ContextMenu>
    </div>
  </ContextMenu>
</template>
<script>
import { workerSendMessage } from "../tools/worker-message.js"
import { bus } from "@/main.js"
import EMPTY_FIELD from "@/const/emptyField.js"
import { testFieldEmpty } from "@/tools/fields/testEmpty.js"

import ContextMenu from "@/components/atoms/ContextMenu.vue"
import FormInput from "@/components/molecules/FormInput.vue"

const STATES = {
  CHANGE_SPEAKER: 1,
  EDIT_SPEAKER: 2,
  MERGE_SPEAKER: 3,
  CREATE_SPEAKER: 4,
}

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
      editSpeakerName: {
        ...EMPTY_FIELD,
        value: this.currentSpeakerName,
        label: this.$t("conversation.speaker_toolbox.edit_speaker_label"),
      },
      addSpeakerName: {
        ...EMPTY_FIELD,
        value: "",
        error: null,
        valid: false,
        label: this.$t("conversation.speaker_toolbox.create_speaker_label"),
      },
      spkBtn: null,
      state: null,
      STATES,
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
      testFieldEmpty(this.addSpeakerName, (key) => this.$t(key))
    },
    currentSpeakerName() {
      try {
        return this.speakers.find((spk) => spk.speaker_id === this.speakerId)
          .speaker_name
      } catch (e) {
        return "unknown speaker name"
      }
    },
  },
  mounted() {},
  methods: {
    stopPropagation(e) {
      e.stopPropagation()
    },
    enterChangeSpeaker(e) {
      this.state = STATES.CHANGE_SPEAKER
      e.stopPropagation()
    },
    enterEditSpeaker(e) {
      this.state = STATES.EDIT_SPEAKER
      e.stopPropagation()
    },
    enterMergeSpeaker(e) {
      this.state = STATES.MERGE_SPEAKER
      e.stopPropagation()
    },
    enterCreateSpeaker(e) {
      this.state = STATES.CREATE_SPEAKER
      e.stopPropagation()
    },
    addSpeakerKeyDown(e) {
      if (e.key === "Enter") {
        this.addSpeaker()
      }
    },
    editSpeakerKeyDown(e) {
      if (e.key === "Enter") {
        this.editSpeaker()
      }
    },
    toggleAddSpeaker() {
      this.state = null
      this.addSpeakerName.value = ""
      this.addSpeakerName.error = null
      this.addSpeakerName.valid = false
    },
    toggleEditSpeaker() {
      this.state = null
      this.editSpeakerName.value = this.currentSpeakerName
      this.editSpeakerName.error = null
      this.editSpeakerName.valid = true
    },
    editSpeaker(e) {
      e?.preventDefault()
      e?.stopPropagation()
      testFieldEmpty(this.editSpeakerName, (key) => this.$t(key))
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
      return false
    },
    addSpeaker(e) {
      e?.preventDefault()
      e?.stopPropagation()
      testFieldEmpty(this.addSpeakerName, (key) => this.$t(key))
      if (this.addSpeakerName.valid) {
        workerSendMessage("update_conversation_add_speaker", {
          speakerName: this.addSpeakerName.value,
          turnId: this.turnId,
          turnIndex: this.turnIndex,
        })
      }
      return false
    },
    updateSpeaker(newSpeakerId) {
      testFieldEmpty(this.addSpeakerName, (key) => this.$t(key))

      workerSendMessage("turn_edit_speaker", {
        turnId: this.turnId,
        turnIndex: this.turnIndex,
        newSpeakerId,
      })
    },
    mergeSpeaker(newSpeakerId) {
      workerSendMessage("turn_merge_speaker", {
        currentSpeakerId: this.speakerId,
        newSpeakerId,
      })
    },
    closeToolbox() {
      bus.emit("close_spk_toolbox", { turnId: this.turnId })
    },
  },
  components: { ContextMenu, FormInput },
}
</script>
