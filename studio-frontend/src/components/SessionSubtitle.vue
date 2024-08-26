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
      type: String,
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
      if(newVal.trim().length > 0)
        this.subtitleDrawer.newPartial(newVal)
    },
    finalText: function (newVal, oldVal) {
      //console.log("finalText", newVal)
      this.subtitleDrawer.newFinal(newVal)
    },
  },
  mounted() {
    this.canvas = document.getElementById("scroller")
    this.subtitleDrawer = new SubtitleScroller(this.canvas, this.fontSize, this.lineHeight)
  },
  methods: {
  },
  components: { Fragment },
}
</script>