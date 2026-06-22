<template>
  <header class="share-section-header">
    <PhIcon :name="icon" framed frameColor="primary" />
    <h4 class="share-section-header__title">{{ title }}</h4>
    <CountBadge>{{ count }}</CountBadge>
  </header>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"
import CountBadge from "@/components/atoms/CountBadge.vue"

export default {
  name: "ShareSectionHeader",
  components: { PhIcon, CountBadge },
  props: {
    icon: { type: String, required: true },
    title: { type: String, required: true },
    count: { type: [Number, String], default: 0 },
  },
}
</script>

<style lang="scss" scoped>
.share-section-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &__title {
    margin: 0;
    flex: 1;
    color: var(--text-primary);
    font-size: 1rem;
    font-weight: 600;
  }
}
</style>
