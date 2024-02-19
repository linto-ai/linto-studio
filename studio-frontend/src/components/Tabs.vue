<template>
  <div>
    <div class="flex row gap-medium tabs" role="tablist">
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
        <span class="icon" v-if="tab.icon" :class="tab.icon"></span>
        <img v-else-if="tab.img" :src="tab.img" class="icon large" />
        <span class="tab__label" v-if="tab.label">{{ tab.label }}</span>
      </div>
    </div>
    <div class="tabs-content-divider"></div>
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
