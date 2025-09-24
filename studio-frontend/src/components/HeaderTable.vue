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
    <Button
      v-if="add_button_label"
      variant="primary"
      icon="plus"
      @click="$emit('on-create')"
      :label="add_button_label" />

    <Button
      v-if="remove_button_label"
      variant="secondary"
      intent="destructive"
      icon="trash"
      @click="$emit('on-delete')"
      :disabled="disableDelete"
      :label="remove_button_label" />
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
