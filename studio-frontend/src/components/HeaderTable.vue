<template>
  <div class="flex gap-medium backoffice-listing-header align-center flex1">
    <div
      class="flex1 flex gap-small backoffice-listing-header__title align-center">
      <h2>{{ title }}</h2>
      <span class="backoffice-listing-header__total">{{ count }}</span>
      <slot name="right-header"></slot>
    </div>
    <form class="flex align-center gap-small" v-if="search !== undefined">
      <input
        type="text"
        placeholder="Search"
        :value="search"
        @input="updateSearch" />
    </form>
    <button
      v-if="add_button_label"
      class="btn primary"
      @click="$emit('on-create')">
      <span class="icon plus"></span>
      <span class="label">{{ add_button_label }}</span>
    </button>
    <button
      v-if="remove_button_label"
      class="btn tertiary outline"
      @click="$emit('on-delete')"
      :disabled="disableDelete">
      <ph-icon name="trash"></ph-icon>
      <span class="label">{{ remove_button_label }}</span>
    </button>
  </div>
</template>
<script>
export default {
  props: {
    title: { type: String, required: true },
    count: { type: Number, required: true },
    add_button_label: { type: String, required: false },
    remove_button_label: { type: String, required: false },
    disableDelete: { type: Boolean, default: false },
    search: { type: String, required: false },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    updateSearch(e) {
      this.$emit("update:search", e.target.value)
    },
  },
  components: {},
}
</script>
