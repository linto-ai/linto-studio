<template>
  <div
    class="select"
    v-click-outside="close"
    :class="showList ? 'open' : 'close'"
    :inline="inline"
    :id="id"
    role="menu">
    <button
      @click="toggleMenu"
      class="select__head flex row"
      :class="buttonClass"
      aria-haspopup="true"
      :disabled="disabled"
      :aria-expanded="showList">
      <span
        v-if="icon && iconType == 'icon'"
        class="icon select__head__icon no-propagation"
        :class="icon"
        :title="iconText" />
      <img
        v-if="icon && iconType == 'img'"
        :src="icon"
        :alt="iconText"
        class="icon select__head__icon no-propagation" />
      <span class="flex1 select__head__label label no-propagation">{{
        _valueText
      }}</span>
      <span class="icon small-arrow-down no-propagation"></span>
      <span class="badge no-propagation" v-if="badge">
        <span class="badge__content no-propagation">{{ badge }}</span>
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
          <Fragment
            v-for="option in options[sectionName]"
            :key="valueKey(option.value)">
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
    valueText: { required: false },
    value: { required: true },
    icon: { type: String, default: "" },
    iconText: { type: String, default: "" },
    iconType: { type: String, default: "icon" }, //can be img (for user menu...)
    options: { required: true }, // { key: [{ text: "", value: "", icon: "" }, ...]}], key2: [{}, ...]}
    menuPosition: { type: String, default: "right" },
    badge: { type: Number, required: false },
    inline: { type: Boolean, default: false },
    buttonClass: { type: String, default: "" },
    id: { type: String, default: null },
    disabled: { type: Boolean, default: false },
    valueKey: { type: Function, default: (value) => value },
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
  computed: {
    _valueText() {
      if (this.valueText) return this.valueText
      else {
        for (const sectionName in this.options) {
          for (const option of this.options[sectionName]) {
            if (this.valueKey(option.value) == this.valueKey(this.value)) {
              return option.text
            }
          }
        }
      }

      return ""
    },
  },
  methods: {
    onClickOption(e, value) {
      this.showList = false
      this.$emit("input", structuredClone(value))
      e.preventDefault()
      e.stopPropagation()
    },
    toggleMenu(e) {
      e.preventDefault()
      //e.stopPropagation()
      if (this.disabled) return
      this.showList = !this.showList
    },
    close() {
      this.showList = false
    },
  },
  components: { Fragment },
}
</script>
