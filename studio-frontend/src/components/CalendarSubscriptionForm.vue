<template>
  <Modal
    v-model="isOpen"
    :title="$t('integrations.calendar.form_title')"
    @confirm="submitForm"
    @close="$emit('close')">
    <div class="subscription-form flex col gap-medium">
      <div class="form-field">
        <label>{{ $t("integrations.calendar.graph_user_id_label") }}</label>
        <input
          v-model="form.graphUserId"
          type="text"
          :placeholder="
            $t('integrations.calendar.graph_user_id_placeholder')
          " />
        <small class="field-hint">
          {{ $t("integrations.calendar.graph_user_id_hint") }}
        </small>
      </div>

      <div class="form-field">
        <label>{{ $t("integrations.calendar.studio_token_label") }}</label>
        <select v-model="form.selectedTokenUserId">
          <option value="" disabled>
            {{ $t("integrations.calendar.studio_token_placeholder") }}
          </option>
          <option
            v-for="token in eligibleTokens"
            :key="token.userId"
            :value="token.userId">
            {{ token.firstname }}
          </option>
        </select>
      </div>

      <div class="form-field">
        <label>{{ $t("integrations.calendar.profile_label") }}</label>
        <select v-model="form.transcriberProfileId">
          <option value="" disabled>
            {{ $t("integrations.calendar.profile_placeholder") }}
          </option>
          <option
            v-for="profile in transcriberProfiles"
            :key="profile.id"
            :value="profile.id">
            {{ profile.config.name }}
          </option>
        </select>
      </div>

      <div class="form-field">
        <label>{{ $t("integrations.calendar.translations_label") }}</label>
        <PopoverList
          v-if="availableTranslations.length > 0"
          selection
          multiple
          searchable
          :close-on-click="false"
          v-model="selectedTranslations"
          :items="availableTranslations">
          <template #trigger="{ open }">
            <Button
              :icon-right="open ? 'caret-up' : 'caret-down'"
              size="sm"
              variant="secondary">
              {{
                selectedTranslations.length === 0
                  ? $t("integrations.calendar.translations_none")
                  : $tc(
                      "integrations.calendar.translations_count",
                      selectedTranslations.length,
                    )
              }}
            </Button>
          </template>
        </PopoverList>
        <span v-else class="field-hint">
          {{ $t("integrations.calendar.translations_no_profile") }}
        </span>
      </div>

      <div class="form-checkboxes flex col gap-small">
        <label class="checkbox-label">
          <input v-model="form.diarization" type="checkbox" />
          {{ $t("integrations.calendar.diarization_label") }}
        </label>
        <label class="checkbox-label">
          <input v-model="form.keepAudio" type="checkbox" />
          {{ $t("integrations.calendar.keep_audio_label") }}
        </label>
        <label class="checkbox-label">
          <input v-model="form.enableDisplaySub" type="checkbox" />
          {{ $t("integrations.calendar.display_sub_label") }}
        </label>
      </div>

      <div v-if="formError" class="form-error">{{ formError }}</div>
    </div>
  </Modal>
</template>

<script>
import { createCalendarSubscription } from "@/api/calendarSubscription.js"
import { listToken, apiGetToken } from "@/api/token.js"
import Modal from "@/components/molecules/Modal.vue"
import PopoverList from "@/components/atoms/PopoverList.vue"
import Button from "@/components/atoms/Button.vue"

const MIN_TOKEN_ROLE = 3

export default {
  name: "CalendarSubscriptionForm",
  props: {
    organizationId: {
      type: String,
      required: true,
    },
    transcriberProfiles: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    Modal,
    PopoverList,
    Button,
  },
  data() {
    return {
      isOpen: true,
      apiTokens: [],
      selectedTranslations: [],
      formError: null,
      form: {
        graphUserId: "",
        selectedTokenUserId: "",
        transcriberProfileId: "",
        diarization: false,
        keepAudio: true,
        enableDisplaySub: true,
      },
    }
  },
  computed: {
    eligibleTokens() {
      return this.apiTokens.filter(
        (token) => token.organizationRole >= MIN_TOKEN_ROLE,
      )
    },
    selectedProfile() {
      return this.transcriberProfiles.find(
        (p) => p.id === this.form.transcriberProfileId,
      )
    },
    availableTranslations() {
      const raw = this.selectedProfile?.config?.availableTranslations
      let codes = []
      if (Array.isArray(raw)) {
        codes = raw
      } else if (raw && Array.isArray(raw.discrete)) {
        codes = [...raw.discrete]
        if (Array.isArray(raw.external)) {
          for (const t of raw.external) {
            if (Array.isArray(t.languages)) {
              codes.push(...t.languages.filter((l) => !codes.includes(l)))
            }
          }
        }
      }
      const languageNames = new Intl.DisplayNames([this.$i18n.locale], {
        type: "language",
      })
      return codes
        .map((code) => ({
          id: code,
          text: languageNames.of(code),
        }))
        .sort((a, b) => a.text.localeCompare(b.text))
    },
  },
  watch: {
    "form.transcriberProfileId"() {
      this.selectedTranslations = []
    },
  },
  mounted() {
    this.fetchTokens()
  },
  methods: {
    async fetchTokens() {
      this.apiTokens = await listToken(this.organizationId)
    },
    async submitForm() {
      this.formError = null

      if (!this.form.graphUserId.trim()) {
        this.formError = this.$t(
          "integrations.calendar.error_graph_user_required",
        )
        return
      }
      if (!this.form.selectedTokenUserId) {
        this.formError = this.$t("integrations.calendar.error_token_required")
        return
      }
      if (!this.form.transcriberProfileId) {
        this.formError = this.$t("integrations.calendar.error_profile_required")
        return
      }

      const tokenRes = await apiGetToken(
        this.organizationId,
        this.form.selectedTokenUserId,
      )
      if (tokenRes.status !== "success") {
        this.formError = this.$t("integrations.calendar.error_token_fetch")
        return
      }

      const payload = {
        graphUserId: this.form.graphUserId.trim(),
        studioToken: tokenRes.data.auth_token,
        transcriberProfileId: this.form.transcriberProfileId,
        translations:
          this.selectedTranslations.length > 0
            ? this.selectedTranslations
            : undefined,
        diarization: this.form.diarization,
        keepAudio: this.form.keepAudio,
        enableDisplaySub: this.form.enableDisplaySub,
      }

      const res = await createCalendarSubscription(
        this.organizationId,
        payload,
      )

      if (res.status === "success") {
        this.$store.dispatch("system/addNotification", {
          message: this.$t("integrations.calendar.create_success"),
          type: "success",
          timeout: 5000,
        })
        this.$emit("created")
      } else {
        this.formError =
          res.message || this.$t("integrations.calendar.create_error")
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.subscription-form {
  .form-field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    label {
      font-weight: 600;
      font-size: 0.9em;
    }

    input[type="text"],
    select {
      padding: 0.5rem;
      border: 1px solid var(--neutral-20, #ccc);
      border-radius: 4px;
      font-size: 0.9em;
    }
  }

  .field-hint {
    color: var(--text-secondary);
    font-size: 0.8em;
  }
}

.form-checkboxes {
  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9em;
    cursor: pointer;

    input[type="checkbox"] {
      width: 16px;
      height: 16px;
    }
  }
}

.form-error {
  color: var(--red-chart, #e53e3e);
  font-size: 0.9em;
  font-weight: 600;
}
</style>
