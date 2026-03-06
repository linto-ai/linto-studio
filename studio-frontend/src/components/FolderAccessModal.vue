<template>
  <Modal
    v-model="_value"
    @on-cancel="$emit('on-cancel')"
    @on-confirm="handleSave"
    :title="$t('folders.manage_access')"
    size="md">
    <div class="folder-access-modal">
      <div class="folder-access-modal__toggle">
        <label class="folder-access-modal__label">
          {{ $t("folders.visibility_public") }}
        </label>
        <label class="folder-access-modal__switch">
          <input
            type="checkbox"
            :checked="isPrivate"
            @change="onVisibilityChange($event.target.checked)" />
          <span class="folder-access-modal__slider"></span>
        </label>
        <label class="folder-access-modal__label">
          {{ $t("folders.visibility_private") }}
        </label>
      </div>

      <div v-if="showForceOption" class="folder-access-modal__warning folder-access-modal__warning--blocked">
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

      <p v-else-if="isPrivate" class="folder-access-modal__warning">
        {{ $t("folders.visibility_warning") }}
      </p>

      <p v-if="isPrivate && hasPrivateAncestor" class="folder-access-modal__warning folder-access-modal__warning--info">
        {{ $t("folders.members_propagate_to_parents") }}
      </p>

      <div v-if="isPrivate" class="folder-access-modal__members">
        <h4>{{ $t("folders.members_label") }}</h4>
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
import { mapGetters } from "vuex"

export default {
  name: "FolderAccessModal",
  components: { Modal, GenericTable, UserInfoInline, FolderRightSelector },
  props: {
    folder: { type: Object, required: true },
    value: { type: Boolean, required: true },
  },
  data() {
    return {
      isPrivate: this.folder.visibility === "private",
      forcePublic: false,
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
      const parent = this.$store.getters["folders/getFolderById"](this.folder.parentId)
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
    showForceOption() {
      return this.parentIsPrivate && !this.isPrivate
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
    onVisibilityChange(checked) {
      this.isPrivate = checked
      if (checked) {
        this.forcePublic = false
      }
    },
    async handleSave() {
      // Block save if switching to public with private parent and force not checked
      if (this.showForceOption && !this.forcePublic) return

      const visibility = this.isPrivate ? "private" : "public"
      const members = this.isPrivate ? this.selectedMembers : []
      const force = this.showForceOption && this.forcePublic

      await this.$store.dispatch("folders/updateFolderVisibility", {
        folderId: this.folder._id,
        visibility,
        members,
        force,
      })
      this.$emit("input", false)
    },
  },
}
</script>

<style lang="scss">
.folder-access-modal {
  display: flex;
  flex-direction: column;
  gap: 1em;

  &__toggle {
    display: flex;
    align-items: center;
    gap: 0.75em;
  }

  &__label {
    font-size: 0.9em;
    color: var(--text-primary);
  }

  &__switch {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 22px;
    flex-shrink: 0;

    input {
      opacity: 0;
      width: 0;
      height: 0;
    }

  }

  &__slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--neutral-30);
    border-radius: 22px;
    transition: 0.2s;

    &::before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      border-radius: 50%;
      transition: 0.2s;
    }

    input:checked + & {
      background-color: var(--primary-color);
    }

    input:checked + &::before {
      transform: translateX(18px);
    }
  }

  &__warning {
    font-size: 0.85em;
    color: var(--text-secondary);
    padding: 0.6em 0.8em;
    background-color: var(--neutral-10, #f5f5f5);
    border-left: 3px solid var(--neutral-40, #999);
    border-radius: 2px;
    margin: 0;

    &--blocked {
      color: var(--warning-color, #b45309);
      background-color: var(--warning-soft, #fef3c7);
      border-left-color: var(--warning-color, #b45309);
    }

    &--info {
      color: var(--info-color, #1d4ed8);
      background-color: var(--info-soft, #dbeafe);
      border-left-color: var(--info-color, #1d4ed8);
    }
  }

  &__force-text {
    margin: 0 0 0.5em 0;
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

  &__members {
    display: flex;
    flex-direction: column;
    gap: 0.5em;

    h4 {
      margin: 0;
      font-size: 0.9em;
      color: var(--text-secondary);
    }
  }

  &__no-members {
    font-size: 0.85em;
    color: var(--text-secondary);
    margin: 0;
  }

}
</style>
