<template>
  <section>
    <h2>{{ $t("conversation.conversation_creation_security_title") }}</h2>
    <div class="form-field flex col">
      <label class="form-label">
        {{ $t("conversation.conversation_creation_security_label") }}
      </label>
      <select :value="value" @change="$emit('input', $event.target.value)">
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
import SECURITY_LEVELS_LIST from "@/const/securityLevelsList"

export default {
  name: "SecurityLevelSelector",
  props: {
    value: {
      type: String,
      default: "insecure",
    },
  },
  computed: {
    securityLevels() {
      return SECURITY_LEVELS_LIST((key) => this.$i18n.t(key))
    },
  },
}
</script>
