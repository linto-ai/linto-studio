<script setup>
defineProps({
  nodes: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <component v-for="(node, index) in nodes" :key="index" :is="node" />
</template> 