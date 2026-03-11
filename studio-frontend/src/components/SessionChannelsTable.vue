<template>
  <GenericTable
    :columns="columns"
    :content="channelsList"
    :sortListKey="sortListKey"
    :sortListDirection="sortListDirection"
    idKey="id"
    @list_sort_by="sortBy">
    <template #header-diarization>
      <PhIcon
        name="users"
        :title="$t('session.channels_list.labels.diarization')" />
    </template>
    <template v-if="from === 'formCreateSession'" #cell-type="{ element }">
      <img
        class="icon medium"
        :src="channelTypeImage(element)"
        :alt="element.type || ''"
        :title="element.type || ''" />
    </template>
    <template #cell-name="{ element }">
      <FormInput
        :value="nameFieldFor(element).value"
        @input="onNameInput(element, $event)"
        :field="nameFieldFor(element)"
        :readonly="from === 'sessionSettings'" />
    </template>
    <template
      v-if="from === 'formCreateSession'"
      #cell-profileName="{ element }">
      {{ element.profileName || "" }}
    </template>
    <template v-if="from === 'sessionSettings'" #cell-endpoint="{ element }">
      <SessionChannelsEndpoints :endpoints="element.streamEndpoints || {}" />
    </template>
    <template
      v-if="from === 'sessionSettings'"
      #cell-stream_status="{ element }">
      <pre>{{ element.streamStatus || "" }}</pre>
    </template>
    <template #cell-language="{ element }">
      {{ (element.languages || []).join(", ") }}
    </template>
    <template #cell-translations="{ element }">
      <template v-if="from === 'formCreateSession'">
        <PopoverList
          v-if="translationOptionsFor(element).length > 0"
          selection
          multiple
          :value="element.translations || []"
          @input="onTranslationsInput(element, $event)"
          :items="translationOptionsFor(element)">
          <template #trigger="{ open }">
            <Button :icon-right="open ? 'caret-up' : 'caret-down'" size="sm">
              {{
                $tc(
                  "session.profile_selector.n_translations_selected",
                  (element.translations || []).length,
                )
              }}
            </Button>
          </template>
        </PopoverList>
      </template>
      <template v-else>
        {{ formatTranslations(element) }}
      </template>
    </template>
    <template v-if="from === 'sessionSettings'" #cell-diarization="{ element }">
      <Checkbox
        :value="element.diarization"
        disabled
        :id="'diarization-' + element.id" />
    </template>
    <template #cell-actions="{ element }">
      <Button
        v-if="from === 'formCreateSession'"
        @click="removeChannel(channelsList.indexOf(element))"
        icon="trash"
        :label="$t('session.channels_list.remove')"
        variant="secondary"
        intent="destructive" />
      <Button
        v-if="from === 'sessionSettings'"
        @click="connectMicrophone(channelsList.indexOf(element))"
        :title="$t('session.channels_list.connect_microphone')"
        :aria-label="$t('session.channels_list.connect_microphone')"
        icon="microphone" />
    </template>
  </GenericTable>
</template>
<script>
import GenericTable from "@/components/molecules/GenericTable.vue"
import FormInput from "@/components/molecules/FormInput.vue"
import SessionChannelsEndpoints from "@/components/SessionChannelsEndpoints.vue"
import Checkbox from "@/components/atoms/Checkbox.vue"
import EMPTY_FIELD from "@/const/emptyField"
import transriberImageFromtype from "@/tools/transriberImageFromtype.js"
import {
  normalizeAvailableTranslations,
  extractTranslationLangCode,
} from "@/tools/translationUtils.js"

export default {
  props: {
    channelsList: {
      type: Array,
      required: true,
    },
    from: {
      type: String,
      default: "formCreateSession",
    },
  },
  data() {
    return {
      sortListKey: "name",
      sortListDirection: "asc",
      nameFields: {},
    }
  },
  computed: {
    columns() {
      const cols = []
      if (this.from === "formCreateSession") {
        cols.push({
          key: "type",
          label: this.$t("session.channels_list.labels.type"),
          width: "auto",
        })
      }
      cols.push({
        key: "name",
        label: this.$t("session.channels_list.labels.name"),
        width: "1fr",
      })
      if (this.from === "formCreateSession") {
        cols.push({
          key: "profileName",
          label: this.$t("session.channels_list.labels.profile_name"),
          width: "auto",
        })
      }
      if (this.from === "sessionSettings") {
        cols.push({
          key: "endpoint",
          label: this.$t("session.channels_list.labels.endpoint"),
          width: "auto",
        })
        cols.push({
          key: "stream_status",
          label: this.$t("session.channels_list.labels.stream_status"),
          width: "auto",
        })
      }
      cols.push({
        key: "language",
        label: this.$t("session.channels_list.labels.language"),
        width: "auto",
      })
      cols.push({
        key: "translations",
        label: this.$t("session.channels_list.labels.translations"),
        width: "auto",
      })
      if (this.from === "sessionSettings") {
        cols.push({ key: "diarization", label: "", width: "auto" })
      }
      cols.push({ key: "actions", label: "", width: "auto" })
      return cols
    },
  },
  methods: {
    nameFieldFor(channel) {
      if (!this.nameFields[channel.id]) {
        this.$set(this.nameFields, channel.id, {
          ...EMPTY_FIELD,
          value: channel.name || "",
        })
      }
      return this.nameFields[channel.id]
    },
    onNameInput(channel, value) {
      if (this.nameFields[channel.id]) {
        this.nameFields[channel.id].value = value
      }
      const index = this.channelsList.indexOf(channel)
      this.$emit("updateName", index, value)
    },
    translationOptionsFor(channel) {
      const translations = normalizeAvailableTranslations(
        channel.availableTranslations,
      )
      const languageNames = new Intl.DisplayNames([this.$i18n.locale], {
        type: "language",
      })
      return translations
        .map((t) => ({ id: t, text: languageNames.of(t) }))
        .sort((a, b) => a.text.localeCompare(b.text))
    },
    onTranslationsInput(channel, value) {
      channel.translations = value
    },
    channelTypeImage(channel) {
      return transriberImageFromtype(channel.type)
    },
    formatTranslations(channel) {
      const translations = channel.translations || []
      if (translations.length === 0) {
        return this.$t("session.channels_list.no_translations")
      }
      return translations.map(extractTranslationLangCode).join(", ")
    },
    sortBy(key) {
      // not implemented yet
    },
    removeChannel(index) {
      this.$emit("removeChannel", index)
    },
    connectMicrophone(index) {
      this.$emit("connectMicrophone", index)
    },
  },
  components: {
    GenericTable,
    FormInput,
    SessionChannelsEndpoints,
    Checkbox,
  },
}
</script>
