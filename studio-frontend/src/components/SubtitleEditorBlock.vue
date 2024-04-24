<template>
  <div
    :class="['flex', focused ? 'focused' : '', 'screen']"
    @click="handleClick($event)"
    :id="screen.screen_id">
    <div class="flex col screen-timestamp justify-center">
      <div class="screen-timestamp-line">
        {{ stime }}
      </div>
      <div class="screen-timestamp-line">
        {{ etime }}
      </div>
    </div>

    <div v-if="isempty" class="empty-screen-block flex1">
      {{ $t("conversation.subtitles.screen_is_empty") }}
    </div>
    <div v-else class="flex1 flex col justify-center">
      <div v-for="line of screen.text">
        {{ line }}
      </div>
    </div>
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
    isInitiallySelected: {
      type: Boolean,
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
        (this.screen.stime - Math.floor(this.screen.stime)) * 100
      )
      return timeToHMS(this.screen.stime, {
        stripHourZeros: true,
        withCentisecond: true,
      })
    },
    etime() {
      let ms = Math.floor(
        (this.screen.etime - Math.floor(this.screen.etime)) * 100
      )
      return timeToHMS(this.screen.etime, {
        stripHourZeros: true,
        withCentisecond: true,
      })
    },
    isempty() {
      return (
        this.screen.text.length === 0 ||
        this.screen.text.filter((line) => line.length > 0).length === 0
      )
    },
  },
  mounted() {
    if (this.isInitiallySelected) {
      let domElem = document.getElementById(this.screen.screen_id)
      domElem.classList.add("playing")
      domElem.scrollIntoView({
        behavior: "instant",
        block: "center",
        inline: "center",
      })
    }
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
