<template>
  <div class="selector">
    <div class="selector__items">
      <div class="selector__item" v-for="item in items" :key="item.id">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Selector",
  props: {
    items: {
      type: Array,
      required: true,
    },
    selectedItems: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.selector {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
</style>