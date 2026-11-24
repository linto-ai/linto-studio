<template>
  <div class="flex gap-medium backoffice-listing-header align-center flex1">
    <div
      class="flex gap-small backoffice-listing-header__title align-center"
      :class="search === undefined ? 'flex1' : 'no-shrink'">
      <h2>{{ title }}</h2>
      <span
        class="backoffice-listing-header__total"
        v-if="count !== undefined"
        >{{ count }}</span
      >
      <slot name="right-header"></slot>
    </div>
    <form
      v-if="search !== undefined"
      class="flex1"
      role="search"
      @submit.prevent>
      <SearchInput
        fullwidth
        :value="search"
        :label="$t('backoffice.search')"
        :placeholder="$t('backoffice.search')"
        @input="$emit('update:search', $event)" />
    </form>
    <Button
      v-if="add_button_label"
      variant="primary"
      icon="plus"
      @click="$emit('on-create')"
      :label="isMobile ? undefined : add_button_label"
      :aria-label="add_button_label" />

    <Button
      v-if="remove_button_label"
      variant="secondary"
      intent="destructive"
      icon="trash"
      @click="$emit('on-delete')"
      :disabled="disableDelete"
      :label="isMobile ? undefined : remove_button_label"
      :aria-label="remove_button_label" />
  </div>
</template>
<script>
import { mapGetters } from "vuex"

export default {
  props: {
    title: { type: String, required: true },
    count: { type: Number, required: false },
    add_button_label: { type: String, required: false },
    remove_button_label: { type: String, required: false },
    disableDelete: { type: Boolean, default: false },
    search: { type: String, required: false },
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters("system", ["isMobile"]),
  },
  mounted() {},
  methods: {},
  components: {},
}
</script>
