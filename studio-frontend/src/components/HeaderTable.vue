<template>
  <div class="flex gap-medium backoffice-listing-header align-center">
    <div
      class="flex1 flex gap-small backoffice-listing-header__title align-center">
      <h2>{{ title }}</h2>
      <span class="backoffice-listing-header__total">{{ count }}</span>
    </div>
    <form class="flex align-center gap-small">
      <input type="text" placeholder="Search" />
      <button type="submit">
        <span class="icon search"></span>
        <span class="label">Rechercher</span>
      </button>
    </form>
    <button class="btn green" @click="$emit('on-create')">
      <span class="icon plus"></span>
      <span class="label">{{ add_button_label }}</span>
    </button>
  </div>
</template>
<script>
export default {
  props: {
    title: { type: String, required: true },
    count: { type: Number, required: true },
    add_button_label: { type: String, required: true },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  components: {},
}
</script>
