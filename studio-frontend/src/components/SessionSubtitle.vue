<template>
   <canvas id="scroller" width="100%" height="97px"></canvas>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
import {SubtitleScroller} from "@/models/SubtitleDrawer.js"

export default {
  props: {
    partialText: {
      type: String,
      required: true,
    },
    finalText: {
      type: Object,
      required: true,
    },
    fontSize: {
      type: String,
      default: "40",
    },
  },
  data() {
    return {
      canvas: null,
      lineHeight:1.2*this.fontSize,
      subtitleDrawer: null,
    }
  },
  watch: {
    partialText: function (newVal, oldVal) {
      //console.log("partialText", newVal)
      this.subtitleDrawer.newPartial(newVal)
    },
    finalText: function (newVal, oldVal) {
      //console.log("finalText", newVal)
      this.subtitleDrawer.newFinal(newVal.text)
    },
  },
  mounted() {
    this.canvas = document.getElementById("scroller")
    // set width canvas equal to the width of the parent element
    this.canvas.width = this.canvas.clientWidth
    // set height canvas equal to the height of the parent element
    this.canvas.height = this.canvas.clientHeight

    this.subtitleDrawer = new SubtitleScroller(this.canvas, this.fontSize, this.lineHeight)
  },
  methods: {
  },
  components: { Fragment },
}
</script>