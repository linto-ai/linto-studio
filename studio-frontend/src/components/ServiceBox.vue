<template>
  <div class="service-box flex" :alreadyGenerated="alreadyGenerated">
    <input
      type="checkbox"
      v-model="_selected"
      :disabled="disabled"
      :id="id"
      :name="title"
      :value="id" />
    <label :for="id" class="flex col">
      <h4 class="flex align-center service-box__title">
        <span class="icon apply" v-if="alreadyGenerated"></span>
        <span class="flex1">{{ title }}</span>
        <img class="icon large" :src="icon" :black="disabled" />
      </h4>
      <p class="flex1">{{ content }}</p>
      <p
        class="flex align-center gap-small service-box__erase-msg"
        v-if="alreadyGenerated">
        <span class="icon warning"></span>
        <span>{{ $t("app_editor_highlights_modal.erase_msg") }}</span>
      </p>
    </label>
  </div>
</template>
<script>
import { bus } from "@/main.js"
import SERVICE_ICONS from "../const/serviceIcons.js"

export default {
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    service: {
      type: Object,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    _selected: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      },
    },
    title: {
      get() {
        return this.extract_locales(this.service.desc).title
      },
    },
    content: {
      get() {
        return this.extract_locales(this.service.desc).content
      },
    },
    icon: {
      get() {
        return SERVICE_ICONS[this.service.desc.type]
      },
    },
    disabled() {
      return this.service.disabled
    },
    alreadyGenerated() {
      return this.service.alreadyGenerated
    },
  },
  mounted() {},
  methods: {
    extract_locales(value) {
      const lang = this.$i18n.locale.split("-")[0] || "en"
      return value[lang] || value["en"]
    },
  },
  components: { Fragment },
}
</script>
