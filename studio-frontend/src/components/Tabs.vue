<template>
  <div>
    <div class="flex row tabs horizontal-tabs" role="tablist">
      <div
        v-for="tab of tabs"
        class="tab"
        role="tab"
        :title="tab.label"
        :aria-disabled="tab.disabled"
        :selected="value == tab.name"
        :aria-selected="value == tab.name"
        :id="tab.id ? tab.id : undefined"
        :aria-controls="tab.ariaControl ? tab.ariaControl : undefined"
        @click="!tab.disabled && $emit('input', tab.name)">
        <span class="icon" :class="tab.icon"></span>
        <span class="tab__label">{{ tab.label }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    tabs: { type: Array, required: true }, // array of tab objects { name: 'inbox', label: 'Inbox', icon: 'box', ?id, ?aria-control }
    value: { type: String, required: true }, // selected tab
  },
  data() {
    return {}
  },
  watch: {},
  computed: {},
  methods: {},
}
</script>
