<template>
  <BottomSheet
    :value="value"
    :title="$t('mobile.instance.title')"
    @input="$emit('input', $event)">
    <p class="m-muted m-instance-picker__intro">
      {{ $t("mobile.instance.intro") }}
    </p>

    <!-- Step 2, only when unsent recordings would be lost -->
    <div v-if="confirming" class="m-instance-picker">
      <NotificationBanner variant="warning" icon="warning" align="start">
        {{ $tc("mobile.instance.unsent_warning", unsentCount) }}
      </NotificationBanner>
      <Button
        ref="confirmSwitch"
        variant="primary"
        intent="destructive"
        size="lg"
        block
        icon="trash"
        :label="$t('mobile.instance.delete_and_switch')"
        :loading="pending"
        @click="confirmSwitch" />
      <Button
        variant="transparent"
        block
        :label="$t('mobile.common.cancel')"
        @click="confirming = false" />
    </div>

    <form v-else class="m-instance-picker" @submit.prevent="submit">
      <fieldset class="m-instance-picker__choices">
        <legend class="m-visually-hidden">
          {{ $t("mobile.instance.title") }}
        </legend>
        <InstanceOption
          v-for="option in options"
          :key="option.value"
          v-model="choice"
          name="instance"
          :option-value="option.value"
          :label="option.label"
          :address="option.address"
          :badge="option.badge" />
      </fieldset>

      <label v-if="choice === OTHER" class="m-instance-picker__field">
        <span>{{ $t("mobile.instance.address") }}</span>
        <!-- type="text": type="url" would refuse an address typed without
             https://, which findInstance adds. -->
        <input
          ref="address"
          v-model="typedAddress"
          type="text"
          inputmode="url"
          autocomplete="url"
          autocapitalize="off"
          spellcheck="false"
          enterkeyhint="go"
          required
          :placeholder="$t('mobile.instance.address_placeholder')" />
      </label>

      <p v-if="error" class="m-instance-picker__error" role="alert">
        <PhIcon name="warning-circle" size="sm" />
        {{ $t(error) }}
      </p>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        block
        :label="$t('mobile.instance.use')"
        :loading="pending" />
      <Button
        variant="transparent"
        block
        :label="$t('mobile.common.cancel')"
        @click="$emit('input', false)" />
    </form>
  </BottomSheet>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"
import NotificationBanner from "@/components/atoms/NotificationBanner.vue"
import BottomSheet from "@/mobile/components/BottomSheet.vue"
import InstanceOption from "@/mobile/components/instance/InstanceOption.vue"
import { DEFAULT_INSTANCE } from "@/mobile/const/defaultInstance.js"
import {
  loadRecentInstances,
  loadSavedInstance,
} from "@/mobile/services/native/instanceStorage.js"
import {
  countUnsentRecordings,
  findInstance,
  switchInstance,
} from "@/mobile/services/native/switchInstance.js"
import { formatInstanceAddress } from "@/mobile/tools/formatInstanceAddress.js"

const OTHER = "other"

const ERROR_MESSAGES = {
  invalid: "mobile.instance.invalid_address",
  unreachable: "mobile.instance.unreachable",
}

// Native app only: points the app at another LinTO Studio instance. The
// default and recent instances are known; a typed address is checked first
// (findInstance). Unsent recordings are lost on the way: the user confirms.
export default {
  name: "InstancePickerSheet",
  components: { BottomSheet, InstanceOption, NotificationBanner, PhIcon },
  props: {
    value: { type: Boolean, default: false },
  },
  data() {
    return {
      OTHER,
      current: loadSavedInstance(),
      recents: loadRecentInstances(),
      choice: null,
      typedAddress: "",
      pending: false,
      error: "",
      confirming: false,
      unsentCount: 0,
      pickedInstance: null,
    }
  },
  computed: {
    options() {
      return [
        {
          value: DEFAULT_INSTANCE.address,
          label: this.$t("mobile.instance.production"),
          address: formatInstanceAddress(DEFAULT_INSTANCE.address),
          badge: this.$t("mobile.instance.default"),
          instance: DEFAULT_INSTANCE,
        },
        ...this.recents.map((instance) => ({
          value: instance.address,
          label: this.$t("mobile.instance.recent"),
          address: formatInstanceAddress(instance.address),
          badge: "",
          instance,
        })),
        {
          value: OTHER,
          label: this.$t("mobile.instance.other"),
          address: this.$t("mobile.instance.other_hint"),
          badge: "",
          instance: null,
        },
      ]
    },
  },
  watch: {
    // Closing the sheet cancels a check in progress: the instance the user
    // turned away from must not be switched to once the check answers.
    value(open) {
      this.cancelSubmission()
      if (open) this.reset()
    },
    async choice(value) {
      this.error = ""
      if (value !== OTHER) return
      await this.$nextTick()
      this.$refs.address?.focus()
    },
  },
  created() {
    // The submission in progress; not reactive, nothing renders it
    this.submission = null
    this.reset()
  },
  beforeDestroy() {
    this.cancelSubmission()
  },
  methods: {
    reset() {
      this.current = loadSavedInstance()
      this.recents = loadRecentInstances()
      this.choice = this.current.address
      this.typedAddress = ""
      this.pending = false
      this.error = ""
      this.confirming = false
    },
    // Each await may outlive the sheet (closed, reopened, submitted again):
    // past one, an aborted submission stops without touching anything.
    async submit() {
      this.cancelSubmission()
      const submission = new AbortController()
      this.submission = submission
      this.error = ""
      this.pending = true
      const result = await this.resolveChoice(submission.signal)
      if (submission.signal.aborted) return
      if (!result.ok) {
        this.pending = false
        this.error = ERROR_MESSAGES[result.reason]
        return
      }
      if (result.instance.base === this.current.base) {
        this.pending = false
        this.$emit("input", false)
        return
      }
      const unsentCount = await countUnsentRecordings()
      if (submission.signal.aborted) return
      this.pickedInstance = result.instance
      this.unsentCount = unsentCount
      if (this.unsentCount > 0) {
        this.pending = false
        this.askConfirmation()
        return
      }
      await switchInstance(this.pickedInstance)
    },
    cancelSubmission() {
      this.submission?.abort()
      this.submission = null
      this.pending = false
    },
    resolveChoice(signal) {
      if (this.choice === OTHER) return findInstance(this.typedAddress, signal)
      const option = this.options.find((item) => item.value === this.choice)
      return { ok: true, instance: option.instance }
    },
    async askConfirmation() {
      this.confirming = true
      await this.$nextTick()
      this.$refs.confirmSwitch.$el.focus()
    },
    async confirmSwitch() {
      this.pending = true
      await switchInstance(this.pickedInstance)
    },
  },
}
</script>

<style scoped>
.m-instance-picker__intro {
  margin: 0;
}

.m-instance-picker {
  display: flex;
  flex-direction: column;
  gap: var(--m-space-3);
}

.m-instance-picker__choices {
  display: flex;
  flex-direction: column;
  gap: var(--m-space-2);
  margin: 0;
  padding: 0;
  border: none;
}

.m-instance-picker__field {
  display: flex;
  flex-direction: column;
  gap: var(--m-space-1);
  font-size: var(--m-font-size-sm);
  color: var(--m-text-muted);
}

.m-instance-picker__field input {
  font: inherit;
  font-family: monospace;
  font-size: var(--m-font-size);
  color: var(--m-text);
  min-height: 48px;
  padding: 0 var(--m-space-3);
  border: 1px solid var(--m-border);
  border-radius: var(--m-radius-sm);
  background: var(--m-surface);
}

.m-instance-picker__error {
  display: flex;
  align-items: center;
  gap: var(--m-space-2);
  margin: 0;
  color: var(--m-danger);
}
</style>
