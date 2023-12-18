<template>
  <ModalNew
    @on-cancel="($event) => this.$emit('on-cancel')"
    @on-confirm="updateCategory"
    :title="$t('manage_tags.edit_category.title', { name: category.name })"
    :actionBtnLabel="$t('manage_tags.edit_category.save')"
    small>
    <FormInput :field="name" v-model="name.value" />
    <div class="form-field flex col">
      <label class="form-label" for="editCategoryColor">
        {{ $t("manage_tags.edit_category.category_color") }}
      </label>
      <ColorPicker
        id="editCategoryColor"
        class="small-margin"
        v-model="color.value"
        :palette="palette" />
    </div>
  </ModalNew>
</template>
<script>
import { Fragment } from "vue-fragment"
import { Compact as ColorPicker } from "vue-color"

import { bus } from "../main.js"
import EMPTY_FIELD from "../const/emptyField"
import COLORS_VALUE from "../const/colorsValue"
import { apiUpdateCategory } from "@/api/tag.js"
import { testFieldEmpty } from "@/tools/fields/testEmpty.js"
import { formsMixin } from "@/mixins/forms.js"

import ModalNew from "./ModalNew.vue"
import FormInput from "./FormInput.vue"
export default {
  mixins: [formsMixin],
  props: {
    category: {
      type: Object,
      required: true,
    },
    currentOrganizationScope: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      fields: ["name", "color"],
      name: {
        ...EMPTY_FIELD,
        value: this.category.name,
        originalValue: this.category.name,
        testField: testFieldEmpty,
        label: this.$t("manage_tags.edit_category.category_name"),
      },
      color: {
        ...EMPTY_FIELD,
        value: COLORS_VALUE?.[this.category.color]?.[500],
      },
      palette: Object.keys(COLORS_VALUE).map((key) => {
        return COLORS_VALUE[key][500]
      }),
      paletteToColorName: Object.keys(COLORS_VALUE).reduce((acc, key) => {
        acc[COLORS_VALUE[key][500]] = key
        return acc
      }, {}),
    }
  },
  mounted() {},
  methods: {
    testFields() {
      for (const field of this.fields) {
        if (!this[field].testField) {
          continue
        }

        if (!this[field].testField(this[field])) {
          return false
        }
      }
      return true
    },
    async updateCategory(event) {
      event?.preventDefault()
      if (this.testFields()) {
        const color = this.color.value?.hex?.toLowerCase() ?? this.color.value

        const res = await apiUpdateCategory(
          this.currentOrganizationScope,
          this.category._id,
          {
            name:
              this.name.value !== this.name.originalValue
                ? this.name.value
                : undefined,
            color: this.paletteToColorName[color],
          }
        )

        if (res.status == "error") {
          // TODO: handle other errors
          this.name.error = "Name already exist"
          return
        }
        this.$emit("on-confirm", {
          name: this.name.value,
          color: this.paletteToColorName[color],
        })
      }
    },
  },
  components: { Fragment, ModalNew, ColorPicker, FormInput },
}
</script>
