<template>
  <div class="quick-session-notif flex gap-small align-center">
    <!-- label -->
    <div class="flex1 flex col quick-session-notif__text" v-if="isVisio">
      <div class="quick-session-notif__title">
        {{ $t("quick_session.notif.visio.title") }}
      </div>
      <a :href="visioUrl" class="quick-session-notif__link">
        {{ visioUrl }}
      </a>
    </div>

    <div class="flex1 flex col quick-session-notif__text" v-else>
      <div class="quick-session-notif__title">
        {{ $t("quick_session.notif.default.title") }}
      </div>
    </div>

    <!-- buttons -->
    <Button
      v-if="isVisio"
      :to="{ name: 'quick session' }"
      :label="$t('quick_session.notif.visio.continue_button')"
      size="sm"
      variant="secondary" />
    <Button
      v-else
      :to="{ name: 'quick session' }"
      :label="$t('quick_session.notif.default.continue_button')"
      size="sm"
      variant="secondary" />

    <Button
      @click="saveSession"
      :label="$t('quick_session.notif.visio.stop_button')"
      size="sm"
      variant="secondary"
      intent="destructive" />
    <ModalSaveQuickSession
      v-model="isModalSaveOpen"
      :placeholder="defaultName" />
  </div>
</template>
<script>
import { bus } from "@/main.js"
import { mapGetters } from "vuex"
import ModalSaveQuickSession from "@/components/ModalSaveQuickSession.vue"

export default {
  props: {},
  data() {
    return {
      isModalSaveOpen: false,
      defaultName: "",
    }
  },
  mounted() {},
  methods: {
    async saveSession() {
      if (this.quickSessionBot) {
        this.defaultName = this.$t("quick_session.live_visio.default_name", {
          type: this.quickSessionBot.provider,
        })
      } else {
        this.defaultName = this.$t("quick_session.live.default_name")
      }

      this.isModalSaveOpen = true
    },
  },
  computed: {
    isVisio() {
      return this.quickSessionBot !== null
    },
    visioUrl() {
      return this.quickSessionBot?.url
    },
    ...mapGetters("quickSession", ["quickSession", "quickSessionBot"]),
  },
  components: {
    ModalSaveQuickSession,
  },
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
