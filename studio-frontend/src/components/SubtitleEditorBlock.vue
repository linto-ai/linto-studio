<template>
  <div :class="['turn-container', focused ? 'focused' : '']">
    <div
      class="flex row screen"
      @click="handleClick($event)"
      :id="screen.screen_id">
      <div class="conversation-speaker flex screen-timestamp">
        <span class="conversation-speaker-name disabled flex1">
          {{ stime }}<br />
          {{ etime }}
        </span>
      </div>
      <div v-if="!editing || !canEdit">
        <div v-for="line of screen.text">
          <div>{{ line }}</div>
        </div>
      </div>
      <!-- <CollaborativeField v-else> </CollaborativeField> -->
      <div v-else>
        <span>{{ screen.text }}</span>
      </div>
    </div>
    <div class="flex row user-connected-container align-center"></div>
  </div>
</template>
<script>
import CollaborativeField from "@/components/CollaborativeField.vue"
import { bus } from "../main.js"
import { timeToHMS } from "../tools/timeToHMS"
export default {
  props: {
    userInfo: {
      type: Object,
      required: true,
    },
    canEdit: {
      type: Boolean,
      required: true,
    },
    block: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editing: false,
      focused: false,
    }
  },
  computed: {
    screen() {
      return this.block.screen
    },
    stime() {
      let ms = Math.floor(
        (this.screen.stime - Math.floor(this.screen.stime)) * 100,
      )
      return timeToHMS(this.screen.stime) + "." + ms
    },
    etime() {
      let ms = Math.floor(
        (this.screen.etime - Math.floor(this.screen.etime)) * 100,
      )
      return timeToHMS(this.screen.etime) + "." + ms
    },
  },
  methods: {
    handleClick() {
      bus.$emit("player_set_time", { stime: this.screen.stime })
    },
  },
  components: {
    CollaborativeField,
  },
}
</script>
