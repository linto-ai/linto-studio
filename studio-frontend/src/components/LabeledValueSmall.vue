<template>
  <div class="small-labeled-value">
    <div class="small-labeled-value__label">{{ label }}</div>
    <div class="small-labeled-value__value">{{ value }}</div>
  </div>
</template>
<script>
export default {
  props: {
    value: { required: false },
    label: { required: false },
  },
}
</script>
