<template>
  <div
    id="loading-overlay"
    :class="background ? '' : 'overlay-transparent'"
    visible>
    <h2 v-if="title" class="loadind-overlay__title">{{ title }}</h2>
    <span class="icon loading loadind-overlay__icon"></span>
  </div>
</template>
<script>
export default {
  props: {
    title: { required: false },
    background: { required: false, type: Boolean },
  },
}
</script>
