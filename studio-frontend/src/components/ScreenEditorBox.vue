<template>
  <div v-if="screen" @click="(e) => $emit('click', e)">
    <div class="form-label" :id="isCurrent ? 'current-screen-label' : ''">
      {{ label }}
    </div>
    <div
      v-if="!isCurrent || !canEdit || !focused"
      :class="['screen-preview', isCurrent ? 'current' : '']"
      @click="onCurrentScreenClick">
      <p v-for="line of screen.text">
        {{ line }}
      </p>
    </div>
    <CollaborativeField
      v-else
      :label="false"
      :startValue="startValue"
      :flag="flag"
      :users-connected="usersConnected"
      :conversation-users="conversationUsers"
      :conversation-id="conversationId"
      :user-id="userInfo._id"
      :customClass="'fullwidth screen-preview current'"
      :hide-users-connected="true"
      :editor-turn="true"
      :can-edit="canEdit"
      :turn-words="screenWords"
      :cursor-position="cursorPosition"
      :disabled-enter="false"
      :enable-multi-line="true"
      @blur="handleBlur">
    </CollaborativeField>
  </div>
</template>
<script>
import CollaborativeField from "./CollaborativeField.vue"

export default {
  props: {
    userInfo: {
      type: Object,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    screen: {
      type: Object,
      default: null,
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    canEdit: {
      type: Boolean,
      required: true,
    },
    conversationId: {
      type: String,
      required: true,
    },
    conversationUsers: {
      type: Array,
      required: true,
      default: () => [],
    },
    usersConnected: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      focused: false,
      cursorPosition: {
        wordIndex: 0,
        wordCharIndex: 0,
      },
    }
  },
  computed: {
    flag() {
      return `screen-${this.screen.screen_id}`
    },
    startValue() {
      return this.screen.text.join("\n")
    },
    screenWords() {
      return this.screen.words.filter((word) => word.word !== "")
    },
  },
  methods: {
    onCurrentScreenClick() {
      this.focused = true
    },
    handleBlur() {
      // this.focused = false
    },
  },

  components: {
    CollaborativeField,
  },
}
</script>
