<template>
  <li class="conversation-line-container">
    <input
      type="checkbox"
      class="conversation-line__checkbox"
      :value="conversation._id"
      v-if="selectable"
      v-model="_selectedConversation" />
    <div
      class="conversation-line relative flex col flex1"
      ref="line"
      @click="selectLine">
      <header class="conversation-line__head flex row gap-medium align-center">
        <!--
      <div
        class="list-profil-picture-container"
        :data-info="convOwner.fullname">
        <img :src="convOwner.img" class="list-profil-picture" />
      </div>
      -->
        <div class="flex flex1 align-center gap-small">
          <span
            class="icon star conversation-line__favorite"
            v-if="!isFavorite"
            :title="$t('conversation.add_to_favorites')"
            @click="toggleFavorite"></span>
          <span
            class="icon star-filled conversation-line__favorite"
            v-if="isFavorite"
            :title="$t('conversation.remove_from_favorites')"
            @click="toggleFavorite"></span>
          <span
            class="flex row align-center list-profil-picture-container"
            v-if="conversation.sharedBy"
            :data-info="sharedBy.fullName">
            <img :src="sharedBy.img" class="list-profil-picture icon" />
          </span>

          <router-link
            :title="conversation.name"
            :to="`/interface/conversations/${conversation._id}/transcription`"
            class="conversation-line__title h3 no-padding">
            {{ conversation.name }}
          </router-link>
          <CustomSelect
            :valueText="$t('conversation.open_editor')"
            value="editor"
            aria-label="select how to open the conversation"
            :options="{
              actions: [
                { value: 'overview', text: $t('conversation.open_overview') },
                { value: 'editor', text: $t('conversation.open_editor') },
                {
                  value: 'subtitle_editor',
                  text: $t('conversation.open_subtitles'),
                },
                { value: 'publish', text: $t('conversation.open_publish') },
              ],
            }"
            inline
            @input="openWith"></CustomSelect>
        </div>
        <div class="flex gap-medium">
          <div
            class="conversation-line__duration"
            :title="$t('conversation.duration', { duration: audioDuration })">
            <LabeledValueSmall
              :label="$t('conversation.duration_label')"
              :value="audioDuration" />
          </div>
          <div
            class="conversation-line__last-update"
            :title="$t('conversation.updated', { date: lastUpdate })">
            <LabeledValueSmall
              :label="$t('conversation.update_label')"
              :value="lastUpdate" />
          </div>
          <div
            class="conversation-line__last-update"
            :title="$t('conversation.created', { date: created })">
            <LabeledValueSmall
              :label="$t('conversation.created_label')"
              :value="created" />
          </div>
          <!-- <div>{{ highlightedTags.length }} Highlights</div> -->
        </div>
      </header>
      <div
        class="conversation-line__description"
        @click="startDescriptionEdition"
        v-if="!descriptionIsEditing">
        <span>{{ description }}</span>
        <button v-if="canEditConv" class="transparent">
          <span class="icon edit" />
        </button>
      </div>
      <FormInput
        v-else
        :field="descriptionFormData"
        v-model="descriptionFormData.value"
        withConfirmation
        inputFullWidth
        focus
        @on-cancel="resetDescriptionEdition"
        @on-confirm="saveNewDescription"></FormInput>
      <div
        class="conversation-line__tags flex row gap-small align-bottom"
        v-if="displayTags">
        <span class="conversation-line__tag" v-for="tag in tags" :key="tag._id">
          <Tag
            :value="tag.name"
            :categoryId="tag.categoryId"
            :categoryName="tag.categoryName"
            :color="tag.color"
            :deletable="canEditTag"
            @delete="unSelectTag(tag)" />
        </span>
        <span v-if="tags.length === 0" @click="showDropDown">{{
          $t("tags.no_tags")
        }}</span>
        <div class="conversation-line__dropDown-container">
          <ContextMenu
            v-if="dropDownVisible"
            :y="dropDownY"
            :x="dropDownX"
            name="main-tag-menu">
            <DropDownAddTag
              v-click-outside="closeDropDown"
              :conversationId="conversation._id"
              :value="tags"
              @close="closeDropDown"
              @selectTag="selectTag"
              @unSelectTag="unSelectTag"></DropDownAddTag>
          </ContextMenu>
        </div>
        <button
          :title="$t('conversation.add_tag')"
          v-if="canEditTag && !tagsReadOnly"
          @click="showDropDown"
          class="transparent inline">
          <span class="icon add" />
          <span class="label">{{ $t("tags.add_tags") }}</span>
        </button>
      </div>
      <!-- <div>
      <span v-for="highlight in highlightedTags" :key="highlight._id">{{
        highlight.name
      }}</span>
    </div> -->
    </div>
  </li>
</template>

<script>
import {
  apiAddTagToConversation,
  apiDeleteTagFromConversation,
  apiUpdateConversation,
} from "@/api/conversation"
import { apiSearchTagsById } from "@/api/tag.js"

import { extractTagsFromCategoryTree } from "@/tools/extractTagsFromCategoryTree.js"
import { getUserRightFromConversation } from "@/tools/getUserRightFromConversation.js"

import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { convRoleMixin } from "@/mixins/convRole.js"

import Tag from "@/components/Tag.vue"
import DropDownAddTag from "@/components/DropDownAddTag.vue"
import CustomSelect from "@/components/CustomSelect.vue"
import LabeledValueSmall from "./LabeledValueSmall.vue"
import FormInput from "@/components/FormInput.vue"
import ContextMenu from "./ContextMenu.vue"

export default {
  mixins: [orgaRoleMixin, convRoleMixin],
  props: {
    conversation: { type: Object, required: true },
    currentOrganizationScope: { type: String, required: true },
    displayTags: { type: Boolean, default: true },
    pageSharedWith: { type: Boolean, default: false },
    indexedTags: { type: Object, required: false }, // tags indexed by id, if not provided will be fetched
    tagsReadOnly: { type: Boolean, default: false },
    selectable: { type: Boolean, default: false },
    //selected: { type: Boolean, default: false },
    selectedConversations: { type: Array, default: () => [] },
  },
  data() {
    return {
      dropDownVisible: false,
      tags: [],
      highlightedTags: [],
      originalTags: [],
      loadingTags: false,
      dropDownX: 0,
      dropDownY: 0,
      descriptionIsEditing: false,
      descriptionFormData: {
        value: this.conversation.description || "",
        error: null,
      },
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.displayTags) this.loadTags()
    })
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
    rolesInOrganizations() {
      return this.$store.state.rolesInOrganizations
    },
    userRightInConv() {
      return getUserRightFromConversation(this.conversation, this.userInfo._id)
    },
    canEditConv() {
      if (this.hasWriteRight(this.userRightInConv)) {
        return true
      }

      if (this.conversation.organization) {
        return this.isAtLeastMaintainerOfOrganization(
          this.conversation.organization.organizationId
        )
      }

      return false
    },
    canEditTag() {
      return this.canEditConv
    },
    canReadTag() {
      if (this.hasReadRight(this.userRightInConv)) {
        return true
      }

      if (this.conversation.organization) {
        return this.isInOrganization(this.conversation.organization._id)
      }
    },
    description() {
      return this.conversation.description || "No description"
    },
    audioDuration() {
      return this.$options.filters.timeToHMS(
        this.conversation?.metadata?.audio?.duration
      )
    },
    lastUpdate() {
      var options = {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
      const d = new Date(this.conversation?.last_update)
      return d.toLocaleDateString(undefined, options)
    },
    created() {
      var options = {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
      const d = new Date(this.conversation?.created)
      return d.toLocaleDateString(undefined, options)
    },
    sharedBy() {
      if (this.conversation.sharedBy) {
        return {
          ...this.conversation.sharedBy,
          img:
            process.env.VUE_APP_PUBLIC_MEDIA +
            "/" +
            this.conversation.sharedBy.img,
          fullName: `${this.conversation.sharedBy.firstname} ${this.conversation.sharedBy.lastname}`,
        }
      }
    },
    /*
    convOwner() {
      if (this.conversation.sharedBy) {
        //console.log(conv)
        let owner = this.conversation.usersList.organization_members.find(
          (usr) => usr._id === this.conversation.owner
        )
        if (owner) {
          return {
            ...owner,
            fullname: `${owner.firstname} ${owner.lastname}`,
            img: process.env.VUE_APP_PUBLIC_MEDIA + "/" + owner.img,
          }
        }
      }

      return {
        fullname: "Private user",
        img: process.env.VUE_APP_PUBLIC_MEDIA + "/pictures/default.jpg",
      }
    },*/
    isFavorite() {
      return this.$store.getters.isFavoriteConversation(this.conversation._id)
    },
    _selectedConversation: {
      get() {
        return this.selectedConversations
      },
      set(value) {
        this.$emit("onSelect", {
          value,
          conversation: this.conversation,
        })
      },
    },
  },
  watch: {
    tags: function (newTags, oldTags) {},
  },
  methods: {
    selectLine() {
      this.$emit("onSelect", {
        value: null,
        conversation: this.conversation,
      })
    },
    showDropDown(e) {
      this.dropDownVisible = true

      this.dropDownY = e.clientY
      this.dropDownX = e.clientX

      e.stopPropagation()
    },
    closeDropDown() {
      this.dropDownVisible = false
    },
    toggleFavorite(e) {
      if (this.isFavorite) {
        this.$store.dispatch(
          "removeFavoriteConversation",
          this.conversation._id
        )
      } else {
        this.$store.dispatch("addFavoriteConversation", this.conversation)
      }
      e.stopPropagation()
    },
    async loadTags() {
      this.loadingTags = true

      let allTags = []

      if (this.indexedTags) {
        allTags = this.getTagsFromIndex()
      } else {
        allTags = await this.getTagsFromApi()
      }

      this.tags = allTags.filter((tag) => {
        return tag && tag.type == "conversation_metadata"
      })
      this.highlightedTags = allTags.filter(
        (tag) => tag && tag.type == "highlight"
      )
      this.originalTags = [...this.tags]
      this.loadingTags = false
    },
    getTagsFromIndex() {
      return this.conversation.tags.map((tagId) => this.indexedTags[tagId])
    },
    async getTagsFromApi() {
      const tagsTree = await apiSearchTagsById(
        this.conversation._id,
        this.conversation.tags,
        "conversation"
      )

      return extractTagsFromCategoryTree(tagsTree)
    },
    async selectTag(tag, category) {
      this.tags.push({
        ...tag,
        color: category.color,
        categoryName: category.name,
      })
      await apiAddTagToConversation(this.conversation._id, tag._id)
    },
    async unSelectTag(tag) {
      this.tags = this.tags.filter((t) => t._id !== tag._id)
      await apiDeleteTagFromConversation(this.conversation._id, tag._id)
    },
    openWith(value) {
      switch (value) {
        case "editor":
          this.$router.push({
            name: "conversations transcription",
            params: { conversationId: this.conversation._id },
          })
          break
        case "subtitle_editor":
          this.$router.push({
            name: "conversations subtitles",
            params: { conversationId: this.conversation._id },
          })
          break
        case "overview":
          this.$router.push({
            name: "conversations overview",
            params: { conversationId: this.conversation._id },
          })
          break
        case "publish":
          this.$router.push({
            name: "conversations publish",
            params: { conversationId: this.conversation._id },
          })
          break
        default:
          break
      }
    },
    startDescriptionEdition(e) {
      if (this.canEditConv) this.descriptionIsEditing = true
      else this.descriptionIsEditing = false

      e.stopPropagation()
    },
    stopDescriptionEdition() {
      this.descriptionIsEditing = false
    },
    resetDescriptionEdition() {
      this.descriptionFormData.value = this.conversation.description
      this.descriptionFormData.error = null
      this.stopDescriptionEdition()
    },
    saveNewDescription() {
      apiUpdateConversation(this.conversation._id, {
        description: this.descriptionFormData.value,
      })
      this.conversation.description = this.descriptionFormData.value
      this.stopDescriptionEdition()
    },
  },
  components: {
    Tag,
    DropDownAddTag,
    CustomSelect,
    LabeledValueSmall,
    FormInput,
    ContextMenu,
  },
}
</script>
