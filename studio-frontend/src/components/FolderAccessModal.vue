<template>
  <Modal
    v-model="_value"
    @on-cancel="$emit('on-cancel')"
    @on-confirm="handleSave"
    :title="$t('folders.manage_access')"
    :loading="saving"
    :close-on-apply="false"
    :disabled-action-apply="saveBlocked"
    size="md">
    <div class="folder-access-modal">
      <div class="folder-access-modal__visibility">
        <h4 class="section-caption">{{ $t("folders.visibility_label") }}</h4>
        <SegmentedControl
          :value="visibility"
          :options="visibilityOptions"
          :aria-label="$t('folders.visibility_label')"
          @input="setVisibility" />
      </div>

      <NotificationBanner
        v-if="showForceOption"
        variant="warning"
        icon="warning"
        align="start">
        <div class="flex col gap-small">
          <p class="folder-access-modal__force-text">
            {{ $t("folders.visibility_parent_private_force") }}
          </p>
          <label class="folder-access-modal__force-check">
            <input
              type="checkbox"
              :checked="forcePublic"
              @change="forcePublic = $event.target.checked" />
            <span>{{ $t("folders.force_public_parents") }}</span>
          </label>
        </div>
      </NotificationBanner>

      <NotificationBanner
        v-else-if="isPrivate"
        variant="neutral"
        icon="info"
        align="start">
        {{ $t("folders.visibility_warning") }}
      </NotificationBanner>

      <NotificationBanner
        v-if="isPrivate && hasPrivateAncestor"
        variant="info"
        icon="info"
        align="start">
        {{ $t("folders.members_propagate_to_parents") }}
      </NotificationBanner>

      <div v-if="isPrivate" class="folder-access-modal__members">
        <h4 class="section-caption">{{ $t("folders.members_label") }}</h4>
        <p v-if="orgUsers.length === 0" class="folder-access-modal__no-members">
          {{ $t("folders.no_members") }}
        </p>

        <GenericTable
          v-if="orgUsers.length > 0"
          :columns="columns"
          :content="orgUsers"
          sortListDirection=""
          sortListKey="">
          <template #cell-user="{ element }">
            <UserInfoInline :user="element" :user-id="element._id" />
          </template>
          <template #cell-right="{ element }">
            <FolderRightSelector
              :value="getMemberRight(element._id)"
              @input="setMemberRight(element._id, $event)" />
          </template>
        </GenericTable>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/molecules/Modal.vue"
import GenericTable from "@/components/molecules/GenericTable.vue"
import UserInfoInline from "@/components/molecules/UserInfoInline.vue"
import FolderRightSelector from "@/components/molecules/FolderRightSelector.vue"
import NotificationBanner from "@/components/atoms/NotificationBanner.vue"
import SegmentedControl from "@/components/molecules/SegmentedControl.vue"
import { mapGetters } from "vuex"

export default {
  name: "FolderAccessModal",
  components: {
    Modal,
    GenericTable,
    UserInfoInline,
    FolderRightSelector,
    NotificationBanner,
    SegmentedControl,
  },
  props: {
    folder: { type: Object, required: true },
    value: { type: Boolean, required: true },
  },
  data() {
    return {
      isPrivate: this.folder.visibility === "private",
      forcePublic: false,
      saving: false,
      selectedMembers: this.folder.members
        ? this.folder.members.map((m) => ({ ...m }))
        : [],
    }
  },
  computed: {
    ...mapGetters("organizations", {
      orgUsers: "getCurrentOrganizationUsers",
    }),
    parentIsPrivate() {
      if (!this.folder.parentId) return false
      const parent = this.$store.getters["folders/getFolderById"](
        this.folder.parentId,
      )
      return parent && parent.visibility === "private"
    },
    hasPrivateAncestor() {
      let currentId = this.folder.parentId
      while (currentId) {
        const parent = this.$store.getters["folders/getFolderById"](currentId)
        if (!parent) break
        if (parent.visibility === "private") return true
        currentId = parent.parentId
      }
      return false
    },
    visibility() {
      return this.isPrivate ? "private" : "public"
    },
    visibilityOptions() {
      return [
        { name: "public", label: this.$t("folders.visibility_public") },
        { name: "private", label: this.$t("folders.visibility_private") },
      ]
    },
    showForceOption() {
      return this.parentIsPrivate && !this.isPrivate
    },
    // Making the folder public under a private parent needs the explicit
    // "force" opt-in, which also makes the parents public
    saveBlocked() {
      return this.showForceOption && !this.forcePublic
    },
    columns() {
      return [
        { key: "user", label: this.$t("folders.members_label"), width: "1fr" },
        { key: "right", label: this.$t("folders.right_label"), width: "auto" },
      ]
    },
    _value: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit("input", val)
      },
    },
  },
  methods: {
    getMemberRight(userId) {
      const member = this.selectedMembers.find((m) => m.userId === userId)
      return member ? member.right : 0
    },
    setMemberRight(userId, right) {
      if (right === 0) {
        this.selectedMembers = this.selectedMembers.filter(
          (m) => m.userId !== userId,
        )
      } else {
        const member = this.selectedMembers.find((m) => m.userId === userId)
        if (member) {
          member.right = right
        } else {
          this.selectedMembers.push({ userId, right })
        }
      }
    },
    setVisibility(visibility) {
      this.isPrivate = visibility === "private"
      if (this.isPrivate) {
        this.forcePublic = false
      }
    },
    async handleSave() {
      const visibility = this.visibility
      const members = this.isPrivate
        ? this.selectedMembers.filter((m) => m.userId)
        : []
      const force = this.showForceOption && this.forcePublic

      this.saving = true
      const saved = await this.$store.dispatch(
        "folders/updateFolderVisibility",
        { folderId: this.folder._id, visibility, members, force },
      )
      this.saving = false
      // On failure the store notifies and the modal stays open with the edits
      if (saved) this.$emit("input", false)
    },
  },
}
</script>

<style lang="scss">
.folder-access-modal {
  display: flex;
  flex-direction: column;
  gap: 1em;

  &__force-text {
    margin: 0;
  }

  &__force-check {
    display: flex;
    align-items: center;
    gap: 0.5em;
    cursor: pointer;
    font-weight: 600;

    input {
      cursor: pointer;
    }
  }

  &__visibility,
  &__members {
    display: flex;
    flex-direction: column;
    gap: 0.5em;

    // Typographic identity comes from .section-caption — only layout here.
    h4 {
      margin: 0;
    }
  }

  &__no-members {
    font-size: 0.85em;
    color: var(--text-secondary);
    margin: 0;
  }
}
</style>
