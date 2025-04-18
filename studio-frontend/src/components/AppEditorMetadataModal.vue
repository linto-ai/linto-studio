<template>
  <ModalNew
    :title="$t('conversation.highlight_toolbox.add_metadata_modal.title')"
    @on-cancel="close"
    @on-confirm="done"
    :actionBtnLabel="
      $t('conversation.highlight_toolbox.add_metadata_modal.button_first')
    "
    customModalClass="modal--highlights modal--metadata">
    <div class="flex col gap-small">
      <div></div>
      <form class="flex col gap-small wrap form--highlights" @submit="done">
        <div class="form-field flex col">
          <label for="metadata-type">{{
            $t("conversation.highlight_toolbox.add_metadata_modal.description")
          }}</label>

          <select name="pets" id="metadata-type" v-model="selectedSchema">
            <option
              v-for="(schema, key) in schemas"
              :value="key"
              :key="schema.title">
              {{ schema.title }}
            </option>
          </select>
        </div>
        <div
          v-if="selectedSchema === null"
          class="modal-metadata__placeholder justify-center align-center flex">
          {{
            $t("conversation.highlight_toolbox.add_metadata_modal.placeholder")
          }}
        </div>
        <div
          v-else
          v-for="field in fields"
          :key="field.name"
          class="form-field flex col">
          <FormInput :field="field" v-model="field.value" />
        </div>
      </form>
    </div>
  </ModalNew>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"

import { apiGetNlpService } from "../api/service.js"
import METADATA_SCHEMAS from "../const/metadataSchemas.js"
import jsonSchemaToFields from "@/tools/jsonSchemaToFields.js"

import { formsMixin } from "@/mixins/forms.js"

import ModalNew from "./ModalNew.vue"
// import ServiceBox from "./ServiceBox.vue"
import FormInput from "./FormInput.vue"

export default {
  mixins: [formsMixin],
  props: {},
  data() {
    return {
      selectedSchema: null, // array of service names
      schemas: METADATA_SCHEMAS,
      fields: [],
    }
  },
  async mounted() {},
  methods: {
    close() {
      this.$emit("on-cancel")
    },
    done() {
      if (!this.selectedSchema) {
        return
      }

      if (this.testFields({ autoContains: true })) {
        this.$emit("on-confirm", this.fields, this.schemas[this.selectedSchema])
      }
    },
  },
  watch: {
    selectedSchema() {
      if (this.selectedSchema) {
        this.fields = jsonSchemaToFields(this.schemas[this.selectedSchema])
      }
    },
  },
  // computed: {
  //   fields() {
  //
  //     return []
  //   },
  // },
  components: { Fragment, ModalNew, FormInput },
}
</script>
