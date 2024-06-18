<template>
  <div class="flex col small-padding-bottom session-content__turns">
    <!-- <div v-for="turn in turns" :key="turn.id">
      <p>{{ turn.text }}</p>
    </div> -->
    <SessionChannelTurn
      v-for="turn in turns"
      :key="turn.id"
      :turn="turn"></SessionChannelTurn>

    <SessionChannelTurnPartial
      ref="partial"
      :partialText="partialText"></SessionChannelTurnPartial>

    <div ref="bottom"></div>
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"

import SessionChannelTurn from "@/components/SessionChannelTurn.vue"
import SessionChannelTurnPartial from "@/components/SessionChannelTurnPartial.vue"

export default {
  props: {
    channel: {
      type: Object,
      required: true,
    },
    sessionWS: {
      type: Object,
      required: true,
    },
    fontSize: {
      type: String,
      default: "16",
    },
  },
  data() {
    return {
      turns: [],
      partialText: "",
    }
  },
  mounted() {
    this.init()
  },
  computed: {
    selectedChannelId() {
      return this.channel?.transcriber_id
    },
  },
  watch: {
    channel: {
      handler() {
        this.init()
      },
      deep: true,
    },
  },
  methods: {
    init() {
      this.turns = this.channel?.closed_captions || []
      this.sessionWS.subscribe(
        this.selectedChannelId,
        this.onPartial.bind(this),
        this.onFinal.bind(this)
      )
    },
    onPartial(content) {
      this.partialText = content ?? ""
      this.scrollToBottom()
    },
    onFinal(content) {
      this.partialText = ""
      this.turns.push(content)
      this.scrollToBottom()
    },
    scrollToBottom() {
      this.$nextTick().then(() => this.$refs.bottom.scrollIntoView())
    },
  },
  components: { Fragment, SessionChannelTurn, SessionChannelTurnPartial },
}
</script>
