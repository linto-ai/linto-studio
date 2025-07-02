<template>
  <ModalNew
    value
    @on-cancel="($event) => this.$emit('on-cancel')"
    @on-confirm="deleteCategory"
    :title="$t('manage_tags.delete_category.title', { name: category.name })"
    :actionBtnLabel="$t('manage_tags.delete_category.action')"
    size="sm">
    <div class="form-field flex col">
      {{ $t("manage_tags.delete_category.description") }}
    </div>
  </ModalNew>
</template>
<script>
import { Fragment } from "vue-fragment"

import { formsMixin } from "@/mixins/forms.js"
import { apiDeleteCategory } from "@/api/tag.js"
import ModalNew from "@/components/molecules/Modal.vue"
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
      conversationNumber: 0,
    }
  },
  mounted() {
    this.countConversation().then((res) => {
      this.conversationNumber = res
    })
  },
  methods: {
    async deleteCategory() {
      const res = await apiDeleteCategory(
        this.currentOrganizationScope,
        this.category._id,
      )
      this.$emit("on-confirm", res)
    },
    async countConversation() {
      return 55
    },
  },
  components: { Fragment, ModalNew },
}
</script>
