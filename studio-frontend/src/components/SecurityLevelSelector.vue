<template>
  <section>
    <h2>{{ $t("conversation.conversation_creation_security_title") }}</h2>
    <div class="form-field flex col">
      <label class="form-label">
        {{ $t("conversation.conversation_creation_security_label") }}
      </label>
      <select :value="value" @change="handleChange">
        <option
          v-for="level in securityLevels"
          :key="level.value"
          :value="level.value">
          {{ level.txt }}
        </option>
      </select>
    </div>
  </section>
</template>

<script>
import { DEFAULT_SECURITY_LEVEL } from "@/const/securityLevels"
import SECURITY_LEVELS_LIST from "@/const/securityLevelsList"

export default {
  name: "SecurityLevelSelector",
  props: {
    value: {
      type: Number,
      default: DEFAULT_SECURITY_LEVEL,
    },
    // Lowest selectable level (e.g. the organization floor). Levels below it
    // are not listed.
    minLevel: {
      type: Number,
      default: DEFAULT_SECURITY_LEVEL,
    },
  },
  computed: {
    securityLevels() {
      return SECURITY_LEVELS_LIST((key) => this.$i18n.t(key)).filter(
        (level) => level.value >= this.minLevel,
      )
    },
  },
  methods: {
    handleChange(event) {
      this.$emit("input", Number(event.target.value))
    },
  },
}
</script>
