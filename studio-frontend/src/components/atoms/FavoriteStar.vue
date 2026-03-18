<template>
  <Button
    class="favorite-star"
    :class="{ active: value }"
    @click.native.stop.prevent="$emit('input', !value)"
    icon="star"
    :title="title"
    :iconWeight="value ? 'fill' : 'regular'"
    variant="transparent"
    size="sm" />
</template>

<script>
export default {
  name: "FavoriteStar",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
  },
}
</script>

<style lang="scss" scoped>
.favorite-star {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  color: var(--neutral-60);
  border-radius: 2px;
  cursor: pointer;
  transition: color 0.2s ease;
  box-shadow: none !important;

  &:hover {
    color: var(--primary-color);
    box-shadow: none !important;
    transform: none;
  }

  &.active {
    color: var(--primary-color);

    &:hover {
      color: var(--neutral-60);
    }
  }
}
</style>
