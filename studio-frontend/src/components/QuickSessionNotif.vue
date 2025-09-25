<template>
  <div class="quick-session-notif flex gap-small align-center">
    <div class="flex1 flex col quick-session-notif__text" v-if="isVisio">
      <div class="quick-session-notif__title">
        {{ $t("quick_session.notif.visio.title") }}
      </div>
      <a :href="visioUrl" class="quick-session-notif__link">
        {{ visioUrl }}
      </a>
    </div>
    <Button
      :label="$t('quick_session.notif.visio.continue_button')"
      size="sm"
      variant="secondary" />
    <Button
      :label="$t('quick_session.notif.visio.stop_button')"
      size="sm"
      variant="secondary"
      intent="destructive" />
  </div>
</template>
<script>
import { bus } from "@/main.js"
export default {
  props: {},
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  computed: {
    isVisio() {
      return true
    },
    visioUrl() {
      return "https://jitsi.linagora.com/LinTOGreatAgain"
    },
  },
  components: {},
}
</script>

<style lang="scss" scoped>
.quick-session-notif {
  background-color: var(--warning-soft);
  border: 1px solid var(--neutral-20);
  padding: 0.5rem;
  border-radius: 4px;
}

.quick-session-notif__title {
  font-weight: bold;
}

.quick-session-notif__link {
  font-family: monospace;
  font-size: 0.9rem;
}

.quick-session-notif__text {
  line-height: 1.2rem;
}
</style>
