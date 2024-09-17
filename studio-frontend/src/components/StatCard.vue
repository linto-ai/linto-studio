<template>
  <div class="stat-card flex align-center">
    <span :class="['icon', icon]"></span>
    <div class="flex col flex1">
      <div class="flex stat-card__header align-center">
        <span class="flex1 stat-card__count">{{ count }}</span>
      </div>
      <div class="stat-card__title">
        <span>{{ title }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    count: { type: Number, required: true },
    title: { type: String, required: true },
    icon: { type: String, required: true },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  components: {},
}
</script>
