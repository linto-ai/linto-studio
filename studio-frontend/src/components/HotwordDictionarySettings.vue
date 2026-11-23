<template>
  <div>
    <div class="flex row gap-medium">
      <h2 class="flex1">{{ $t("hotword_dictionaries.title") }}</h2>
      <Button
        @click="startCreate"
        size="sm"
        variant="primary"
        icon="plus"
        :label="$t('hotword_dictionaries.add')" />
    </div>
    <p>{{ $t("hotword_dictionaries.description") }}</p>

    <p v-if="!loading && dictionaries.length === 0">
      {{ $t("hotword_dictionaries.empty") }}
    </p>
    <GenericTable
      v-else
      :columns="columns"
      :content="dictionaries"
      :loading="loading"
      sortListDirection=""
      sortListKey="">
      <template #cell-actions="{ element }">
        <div class="flex gap-small">
          <Button
            icon="pencil"
            variant="tertiary"
            iconWeight="regular"
            :aria-label="$t('hotword_dictionaries.edit_title')"
            @click="openForm(element)" />
          <Button
            icon="trash"
            variant="secondary"
            intent="destructive"
            iconWeight="regular"
            :aria-label="$t('hotword_dictionaries.delete_title')"
            @click="confirmDelete(element)" />
        </div>
      </template>
    </GenericTable>

    <Modal
      v-model="showFormModal"
      isForm
      :closeOnApply="false"
      :title="formTitle"
      :textActionApply="$t('hotword_dictionaries.save')"
      @submit="save">
      <FormInput :field="name" v-model="name.value" />
      <FormInput :field="description" v-model="description.value" />
      <FormInput :field="words" v-model="words.value" textarea>
        <template #content-bottom-input>
          <p class="small-text">{{ $t("hotword_dictionaries.words_help") }}</p>
        </template>
      </FormInput>
    </Modal>

    <Modal
      v-model="showDeleteModal"
      :title="$t('hotword_dictionaries.delete_title')"
      withActionDelete
      :withActionApply="false"
      :textActionDelete="$t('modal.delete')"
      @delete="deleteDictionary">
      <p v-if="deletingDictionary">
        {{
          $t("hotword_dictionaries.delete_confirm", {
            name: deletingDictionary.name,
          })
        }}
      </p>
    </Modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import EMPTY_FIELD from "@/const/emptyField"
import { formsMixin } from "@/mixins/forms.js"
import FormInput from "@/components/molecules/FormInput.vue"
import GenericTable from "@/components/molecules/GenericTable.vue"
import Modal from "@/components/molecules/Modal.vue"
import {
  apiCreateHotwordDictionary,
  apiUpdateHotwordDictionary,
  apiDeleteHotwordDictionary,
} from "@/api/hotwordDictionary.js"
import { parseHotwords } from "@/tools/parseHotwords.js"
import { testFieldEmpty } from "@/tools/fields/testEmpty.js"
import { testHotwords } from "@/tools/fields/testHotwords.js"

const CONFLICT_STATUS = 409

export default {
  name: "HotwordDictionarySettings",
  components: { FormInput, GenericTable, Modal },
  mixins: [formsMixin],
  props: {
    organizationId: { type: String, required: true },
  },
  data() {
    return {
      loading: false,
      showFormModal: false,
      showDeleteModal: false,
      editedDictionaryId: null,
      deletingDictionary: null,
      fields: ["name", "words"],
      name: {
        ...EMPTY_FIELD,
        label: this.$t("hotword_dictionaries.name"),
        placeholder: this.$t("hotword_dictionaries.name_placeholder"),
        testField: testFieldEmpty,
      },
      description: {
        ...EMPTY_FIELD,
        label: this.$t("hotword_dictionaries.description_label"),
      },
      words: {
        ...EMPTY_FIELD,
        label: this.$t("hotword_dictionaries.words"),
        testField: testHotwords,
      },
    }
  },
  computed: {
    ...mapGetters("organizations", {
      dictionaries: "getHotwordDictionaries",
    }),
    columns() {
      return [
        {
          key: "name",
          label: this.$t("hotword_dictionaries.name"),
          width: "auto",
        },
        {
          key: "description",
          label: this.$t("hotword_dictionaries.description_label"),
          width: "1fr",
        },
        {
          key: "words",
          label: this.$t("hotword_dictionaries.words"),
          width: "auto",
          transformValue: (words) =>
            this.$tc("hotword_dictionaries.words_count", words.length),
        },
        { key: "actions", label: this.$t("actions"), width: "auto" },
      ]
    },
    formTitle() {
      if (this.editedDictionaryId) {
        return this.$t("hotword_dictionaries.edit_title")
      }
      return this.$t("hotword_dictionaries.create_title")
    },
  },
  mounted() {
    this.fetchDictionaries()
  },
  methods: {
    notify(key, type) {
      this.$store.dispatch("system/addNotification", {
        message: this.$t(`hotword_dictionaries.${key}`),
        type,
      })
    },
    async fetchDictionaries() {
      this.loading = true
      await this.$store.dispatch("organizations/loadHotwordDictionaries")
      this.loading = false
    },
    startCreate() {
      this.openForm({ _id: null, name: "", description: "", words: [] })
    },
    openForm(dictionary) {
      this.editedDictionaryId = dictionary._id
      this.name.value = dictionary.name
      this.name.error = null
      this.description.value = dictionary.description
      this.words.value = dictionary.words.join("\n")
      this.words.error = null
      this.showFormModal = true
    },
    async save() {
      if (!this.testFields()) return
      const payload = {
        name: this.name.value,
        description: this.description.value,
        words: parseHotwords(this.words.value),
      }
      let res
      if (this.editedDictionaryId) {
        res = await apiUpdateHotwordDictionary(
          this.organizationId,
          this.editedDictionaryId,
          payload,
        )
      } else {
        res = await apiCreateHotwordDictionary(this.organizationId, payload)
      }
      if (res.status !== "success") {
        if (res.error?.response?.status === CONFLICT_STATUS) {
          this.name.error = this.$t("hotword_dictionaries.name_taken")
        } else {
          this.notify("save_error", "error")
        }
        return
      }
      this.notify("save_success", "success")
      this.showFormModal = false
      this.fetchDictionaries()
    },
    confirmDelete(dictionary) {
      this.deletingDictionary = dictionary
      this.showDeleteModal = true
    },
    async deleteDictionary() {
      const res = await apiDeleteHotwordDictionary(
        this.organizationId,
        this.deletingDictionary._id,
      )
      if (res.status === "success") {
        this.notify("delete_success", "success")
      } else {
        this.notify("delete_error", "error")
      }
      this.fetchDictionaries()
    },
  },
}
</script>
