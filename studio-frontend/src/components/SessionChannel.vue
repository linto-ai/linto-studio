<template>
  <div class="flex col gap-small small-padding-bottom">
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
  },
  data() {
    return {
      turns: this.channel?.closed_captions || [],
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
  methods: {
    init() {
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
