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
    <TranscriberProfileEditorPlain
      v-model="l_transcriberProfile"
      class="flex1" />
  </div>
</template>
<script>
import { bus } from "@/main.js"
import TRANSCRIBER_PROFILES_TEMPLATES from "@/const/transcriberProfilesTemplates"
import EMPTY_FIELD from "@/const/emptyField"
import Tabs from "@/components/Tabs.vue"
import TranscriberProfileEditorPlain from "@/components/TranscriberProfileEditorPlain.vue"
import FormCheckbox from "@/components/FormCheckbox.vue"

export default {
  props: {
    transcriberProfile: {
      type: Object,
      required: false,
      default: () => {
        return TRANSCRIBER_PROFILES_TEMPLATES.linto
      },
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
    }
  },
  mounted() {},
  computed: {
    l_transcriberProfile: {
      get() {
        return this.transcriberProfile
      },
      set(value) {
        this.$emit("update:transcriberProfile", value)
      },
    },
    currentType: {
      get() {
        return this.transcriberProfile.config.type
      },
      set(value) {
        this.l_transcriberProfile = TRANSCRIBER_PROFILES_TEMPLATES[value]
      },
    },
  },
  watch: {
    "quickMeetingField.value"(value) {
      this.l_transcriberProfile.quickMeeting = value
    },
    "transcriberProfile.quickMeeting"(value) {
      this.quickMeetingField.value = value
    },
  },
  methods: {},
  components: {
    Tabs,
    TranscriberProfileEditorPlain,
    FormCheckbox,
  },
}
</script>
