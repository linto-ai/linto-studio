<template>
  <div class="flex col transcriber-profile-editor">
    <div class="flex gap-medium align-end">
      <div class="form-field flex col">
        <label class="form-label">{{ $t(
          "backoffice.transcriber_profile_detail.type_label",
        ), }}</label>
        <select v-model="currentType">
          <option v-for="type in types" :key="type" :value="type">
            {{ typesLabels[type] }}
          </option>
        </select>
      </div>

      <FormCheckbox
        column
        switchDisplay
        v-model="quickMeetingField.value"
        :field="quickMeetingField" />

      <div></div>
    </div>
    <div class="fixed-notif small-margin-bottom" v-if="!organizationId">
      <div class="app-notif__message">
        {{ $t("backoffice.transcriber_profile_detail.warning_global.line_1") }}
        <br />
        {{ $t("backoffice.transcriber_profile_detail.warning_global.line_2") }}
      </div>
    </div>
    <TranscriberProfileEditorPlain
      v-model="l_transcriberProfile"
      class="flex1"
      ref="editorPlain" />
  </div>
</template>
<script>
import { bus } from "@/main.js"
import TRANSCRIBER_PROFILES_TEMPLATES from "@/const/transcriberProfilesTemplates"
import EMPTY_FIELD from "@/const/emptyField"
import Tabs from "@/components/molecules/Tabs.vue"
import TranscriberProfileEditorPlain from "@/components/TranscriberProfileEditorPlain.vue"
import FormCheckbox from "@/components/molecules/FormCheckbox.vue"

export default {
  props: {
    transcriberProfile: {
      type: Object,
      required: false,
      default: () => {
        return TRANSCRIBER_PROFILES_TEMPLATES.linto
      },
    },
    organizationId: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      types: ["linto", "microsoft"],
      typesLabels: {
        linto: "LinTO",
        microsoft: "Microsoft",
      },
      quickMeetingField: {
        ...EMPTY_FIELD,
        value: this.transcriberProfile.quickMeeting,
        label: this.$t(
          "backoffice.transcriber_profile_detail.quick_meeting_label",
        ),
      },
      l_transcriberProfile: structuredClone(this.transcriberProfile),
    }
  },
  mounted() {},
  computed: {
    currentType: {
      get() {
        return this.transcriberProfile.config.type
      },
      set(value) {
        this.$emit("input", TRANSCRIBER_PROFILES_TEMPLATES[value])
        this.$nextTick(() => {
          this.reset()
        })
      },
    },
  },
  watch: {
    l_transcriberProfile: {
      handler(value) {
        this.$emit("input", value)
      },
      deep: true,
    },
    "quickMeetingField.value"(value) {
      this.l_transcriberProfile.quickMeeting = value
      this.$nextTick(() => {
        this.reset()
      })
    },
    "transcriberProfile.quickMeeting"(value) {
      this.quickMeetingField.value = value
    },
  },
  methods: {
    reset() {
      this.l_transcriberProfile = structuredClone(this.transcriberProfile)
      this.$nextTick(() => {
        this.$refs.editorPlain.resetValue()
      })
    },
  },
  components: {
    Tabs,
    TranscriberProfileEditorPlain,
    FormCheckbox,
  },
}
</script>
