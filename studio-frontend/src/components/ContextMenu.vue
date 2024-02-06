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
import findParentByClass from "../tools/findParentByClass"
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
    topRelativeParent: {
      type: HTMLElement,
      default: null,
    },
    container: {
      type: HTMLElement,
      default: () => {
        return document.getElementById("app")
      },
    },
    first: {
      type: Boolean,
      default: false,
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
      contentY: 0,
      contentX: 0,
      resizeObserverContent: null,
      resizeObserverContainer: null,
    }
  },
  mounted() {
    //await this.$nextTick()
    this.heightContent = this.$refs.content.clientHeight
    const relativeParent = findParentByClass(
      this.$refs.content,
      "context-menu__element"
    )

    if (this.first) {
      this.contentYTop = this._topRelativeParent.getBoundingClientRect().top
      this.contentYBottom =
        this._topRelativeParent.getBoundingClientRect().top +
        this._topRelativeParent.getBoundingClientRect().height
      this.contentX = this._topRelativeParent.getBoundingClientRect().left
    } else {
      this.contentYTop = relativeParent.getBoundingClientRect().top
      this.contentYBottom =
        relativeParent.getBoundingClientRect().top +
        relativeParent.getBoundingClientRect().height
      this.contentX =
        relativeParent.getBoundingClientRect().left +
        relativeParent.getBoundingClientRect().width
    }

    this.initObserverContent()
    this.initObserverContainer()
  },
  beforeDestroy() {
    this.resizeObserverContent?.disconnect()
    this.resizeObserverContainer?.disconnect()
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
          res["top"] = `${this.YpositionBottom}px`
          break
      }

      switch (this.positionMenuHorizontal) {
        case "left":
          res["right"] = `1rem`
          break
        case "right":
          res["left"] = `${this.Xposition}px`
          break
      }

      return res
    },
    positionMenuVertical() {
      if (this.heightContent === 0) {
        return "hidden"
      }

      if (this.heightContent + this.YpositionBottom > this.heightContainer) {
        return "top"
      }

      return "bottom"
    },
    positionMenuHorizontal() {
      if (this.widthContent + this.Xposition > this.widthContainer)
        return "left"
      return "right"
    },
    YpositionTop() {
      return this.y || this.contentYTop || 0
    },
    YpositionBottom() {
      return this.y || this.contentYBottom || 0
    },
    Xposition() {
      return this.x || this.contentX || 0
    },
    _topRelativeParent() {
      return (
        this.topRelativeParent ||
        findParentByClass(this.$refs.content, "popover-parent")
      )
    },
  },
  methods: {
    initObserverContent() {
      this.resizeObserverContent = new ResizeObserver(
        function (entries) {
          this.heightContent = this.$refs.content.clientHeight
          this.widthContent = this.$refs.content.clientWidth
        }.bind(this)
      )

      this.resizeObserverContent.observe(this.$refs.content)

      // this.observerContent = new MutationObserver(
      //   function (mutations) {
      //     this.heightContent = this.$refs.content.clientHeight
      //     this.widthContent = this.$refs.content.clientWidth
      //   }.bind(this)
      // )

      // this.observerContent.observe(this.$refs.content, {
      //   attributes: true,
      //   childList: true,
      //   characterData: true,
      //   subtree: true,
      // })
    },
    initObserverContainer() {
      this.resizeObserverContainer = new ResizeObserver(
        function (entries) {
          this.heightContainer = this.container.clientHeight
          this.widthContainer = this.container.clientWidth
        }.bind(this)
      )

      this.resizeObserverContainer.observe(this.container)
    },
  },
  components: { Fragment },
}
</script>
