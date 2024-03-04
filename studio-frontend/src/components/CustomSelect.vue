<template>
  <div
    class="select"
    v-click-outside="close"
    :class="showList ? 'open' : 'close'"
    :inline="inline"
    role="menu">
    <button
      @click="toggleMenu"
      class="select__head flex row"
      :class="buttonClass"
      aria-haspopup="true"
      :aria-expanded="showList">
      <span
        v-if="icon && iconType == 'icon'"
        class="icon select__head__icon"
        :class="icon"
        :title="iconText" />
      <img
        v-if="icon && iconType == 'img'"
        :src="icon"
        :alt="iconText"
        class="icon select__head__icon" />
      <span class="flex1 select__head__label label">{{ valueText }}</span>
      <span class="icon small-arrow-down"></span>
      <span class="badge" v-if="badge">
        <span class="badge__content">{{ badge }}</span>
      </span>
    </button>
    <!-- Menu list-->
    <!--  
      TODO: refactore with contextMenu component ? 
      TODO: else use popover api: https://developer.mozilla.org/fr/docs/Web/API/Popover_API/Using
    -->
    <div class="select__list" v-if="showList">
      <div
        class="select__list__inner flex col"
        :class="menuPosition"
        role="listbox">
        <div
          class="select__list__section flex col"
          v-for="sectionName in Object.keys(options)">
          <Fragment v-for="option in options[sectionName]" :key="option.value">
            <button
              @click="onClickOption($event, option.value)"
              class="select__list__item"
              role="option">
              <span v-if="option.icon" class="icon" :class="option.icon"></span>
              <span class="label">{{ option.text }}</span>
            </button>
          </Fragment>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/*
TODO :
- keyboard navigation
*/
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
export default {
  props: {
    valueText: { required: true },
    value: { required: true },
    icon: { type: String, default: "" },
    iconText: { type: String, default: "" },
    iconType: { type: String, default: "icon" }, //can be img (for user menu...)
    options: { required: true }, // { key: [{ text: "", value: "", icon: "" }, ...]}], key2: [{}, ...]}
    menuPosition: { type: String, default: "right" },
    badge: { type: Number, required: false },
    inline: { type: Boolean, default: false },
    buttonClass: { type: String, default: "" },
  },
  data() {
    return {
      showList: false,
    }
  },
  mounted() {
    bus.$on("navigation", this.close)
  },
  beforeDestroy() {
    bus.$off("navigation", this.close)
  },
  methods: {
    onClickOption(e, value) {
      this.showList = false
      this.$emit("input", value)
      e.preventDefault()
    },
    toggleMenu(e) {
      this.showList = !this.showList
      e.preventDefault()
    },
    close() {
      this.showList = false
    },
  },
  components: { Fragment },
}
</script>
