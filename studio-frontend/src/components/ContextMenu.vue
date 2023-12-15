<template>
  <div
    class="context-menu"
    :style="style"
    ref="content"
    :positionHorizontal="positionMenuHorizontal"
    :positionVertical="positionMenuVertical">
    <slot></slot>
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"

import { bus } from "../main.js"

export default {
  props: {
    x: {
      type: Number,
      default: 0,
    },
    y: {
      type: Number,
      default: 0,
    },
    container: {
      type: HTMLElement,
      default: () => {
        return document.getElementById("app")
      },
    },
    name: {
      type: String,
      default: () => "context-menu-" + Math.floor(Math.random() * 1000000000),
    },
  },
  data() {
    return {
      heightContent: 0,
      widthContent: 0,
      heightContainer: 0,
      widthContainer: 0,
      observerContent: null,
      observerContainer: null,
      contentY: 0,
      contentX: 0,
    }
  },
  mounted() {
    this.heightContent = this.$refs.content.clientHeight
    const relativeParent = this.findParentByClass(
      this.$refs.content,
      "context-menu__element"
    )
    this.contentY = relativeParent.getBoundingClientRect().top
    this.contentX =
      relativeParent.getBoundingClientRect().left +
      relativeParent.getBoundingClientRect().width
    this.initObserverContent()
    this.initObserverContainer()
  },
  computed: {
    style() {
      let res = {}

      if (this.positionMenuVertical === "hidden") {
        return { hidden: true }
      }

      switch (this.positionMenuVertical) {
        case "top":
          res["bottom"] = `${this.heightContainer - this.y}px`
          break
        case "bottom":
          res["top"] = `${this.y}px`
          break
      }

      switch (this.positionMenuHorizontal) {
        case "left":
          res["right"] = `1rem`
          break
        case "right":
          res["left"] = `${this.x}px`
          break
      }

      return res
    },
    positionMenuVertical() {
      if (this.heightContent === 0) {
        return "hidden"
      }

      if (this.heightContent + this.Yposition > this.heightContainer) {
        return "top"
      }

      return "bottom"
    },
    positionMenuHorizontal() {
      if (this.widthContent + this.Xposition > this.widthContainer)
        return "left"
      return "right"
    },
    Yposition() {
      return this.y || this.contentY || 0
    },
    Xposition() {
      return this.x || this.contentX || 0
    },
  },
  methods: {
    initObserverContent() {
      this.observerContent = new MutationObserver(
        function (mutations) {
          this.heightContent = this.$refs.content.clientHeight
          this.widthContent = this.$refs.content.clientWidth
        }.bind(this)
      )

      this.observerContent.observe(this.$refs.content, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
      })
    },
    initObserverContainer() {
      this.observerContainer = new MutationObserver(
        function (mutations) {
          this.heightContainer = this.container.clientHeight
          this.widthContainer = this.container.clientWidth
        }.bind(this)
      )

      this.observerContainer.observe(this.container, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
      })
    },
    findParentByClass(el, className) {
      while (
        (el = el.parentElement) &&
        !el.classList.contains(className) &&
        el.tagName !== "BODY"
      );
      return el
    },
  },
  components: { Fragment },
}
</script>
