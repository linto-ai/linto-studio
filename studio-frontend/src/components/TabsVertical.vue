<template>
  <div>
    <div class="flex col tabs" role="tablist">
      <div
        v-for="tab of tabs"
        class="tab"
        role="tab"
        :title="tab.label"
        :selected="value == tab.name"
        :aria-selected="value == tab.name"
        :id="tab.id ? tab.id : undefined"
        :aria-controls="tab.ariaControl ? tab.ariaControl : undefined"
        @click="$emit('input', tab.name)">
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
