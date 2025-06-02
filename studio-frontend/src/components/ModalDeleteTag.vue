<template>
  <ModalNew
    @on-cancel="($event) => this.$emit('on-cancel')"
    @on-confirm="deleteTag"
    :title="$t('manage_tags.delete_tag.title', { name: tag.name })"
    :actionBtnLabel="$t('manage_tags.delete_tag.action')"
    small>
    <div class="form-field flex col">
      {{
        $t("manage_tags.delete_tag.description", {
          number: conversationNumber,
        })
      }}
    </div>
  </ModalNew>
</template>
<script>
import { Fragment } from "vue-fragment"

import { bus } from "@/main.js"
import { apiDeleteTag } from "@/api/tag.js"
import { formsMixin } from "@/mixins/forms.js"
import { apiCountConversation } from "@/api/conversation.js"

import ModalNew from "@/components/molecules/Modal.vue"
export default {
  mixins: [formsMixin],
  props: {
    tag: {
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
    async deleteTag() {
      const res = await apiDeleteTag(
        this.currentOrganizationScope,
        this.tag._id,
      )
      //TODO: handle error
      this.$emit("on-confirm", res)
      bus.$emit("tag-category-changed", {
        categoryIdTarget: this.tag.categoryId,
      })
    },
    async countConversation() {
      const res = await apiCountConversation(this.currentOrganizationScope, [
        this.tag._id,
      ])
      return res
    },
  },
  components: { Fragment, ModalNew },
}
</script>
