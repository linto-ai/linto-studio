<template>
  <component class="stat-card flex align-center" :is="componentType" :to="to">
    <span class="stat-card__icon">
      <PhIcon :name="icon" size="lg" />
    </span>
    <div class="flex col flex1">
      <div class="flex stat-card__header align-center">
        <span class="flex1 stat-card__count" v-if="count">{{ count }}</span>
        <span class="flex1 stat-card__count" v-else>–</span>
      </div>
      <div class="stat-card__title">
        <span>{{ title }}</span>
      </div>
    </div>
  </component>
</template>
<script>
import PhIcon from "@/components/atoms/PhIcon.vue"

export default {
  props: {
    count: { type: Number, required: false },
    title: { type: String, required: true },
    icon: { type: String, required: true },
    to: { type: Object, default: null },
  },
  data() {
    return {}
  },
  mounted() {},
  computed: {
    componentType() {
      return this.to ? "router-link" : "div"
    },
  },
  methods: {},
  components: { PhIcon },
}
</script>
<style lang="scss" scoped>
.stat-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
