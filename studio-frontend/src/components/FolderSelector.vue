<template>
  <div class="folder-selector" v-click-outside="closeDropdown">
    <button
      class="folder-selector__trigger"
      :class="{ 'folder-selector__trigger--open': isOpen, 'folder-selector__trigger--readonly': readonly }"
      @click="toggle"
      :disabled="readonly">
      <ph-icon :name="selectedFolder ? 'folder' : 'folder-dashed'" size="16" />
      <span class="folder-selector__label">
        {{ selectedFolder ? selectedFolder.name : $t("folders.uncategorized") }}
      </span>
      <ph-icon v-if="!readonly" name="caret-down" size="14" class="folder-selector__caret" />
    </button>

    <div v-if="isOpen" class="folder-selector__dropdown">
      <div
        class="folder-selector__option"
        :class="{ 'folder-selector__option--active': !value }"
        @click="select(null)">
        <ph-icon name="folder-dashed" size="16" />
        <span>{{ $t("folders.uncategorized") }}</span>
      </div>
      <div
        v-for="folder in flatFolders"
        :key="folder._id"
        class="folder-selector__option"
        :class="{ 'folder-selector__option--active': value === folder._id }"
        :style="{ paddingLeft: (folder.depth * 0.75) + 0.5 + 'rem' }"
        @click="select(folder._id)">
        <ph-icon name="folder" size="16" :style="folder.color ? { color: folder.color } : {}" />
        <span>{{ folder.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "FolderSelector",
  props: {
    value: {
      type: String,
      default: null,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isOpen: false,
    }
  },
  computed: {
    ...mapGetters("folders", {
      folderTree: "getFolderTree",
      getFolderById: "getFolderById",
    }),
    selectedFolder() {
      if (!this.value) return null
      return this.getFolderById(this.value)
    },
    flatFolders() {
      const result = []
      const flatten = (nodes, depth = 0) => {
        for (const node of nodes) {
          result.push({ ...node, depth })
          if (node.children && node.children.length > 0) {
            flatten(node.children, depth + 1)
          }
        }
      }
      flatten(this.folderTree)
      return result
    },
  },
  directives: {
    "click-outside": {
      bind(el, binding) {
        el._clickOutside = (event) => {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value()
          }
        }
        document.addEventListener("click", el._clickOutside)
      },
      unbind(el) {
        document.removeEventListener("click", el._clickOutside)
      },
    },
  },
  methods: {
    toggle() {
      if (this.readonly) return
      this.isOpen = !this.isOpen
    },
    closeDropdown() {
      this.isOpen = false
    },
    select(folderId) {
      this.$emit("input", folderId)
      this.$emit("change", folderId)
      this.isOpen = false
    },
  },
}
</script>

<style lang="scss" scoped>
.folder-selector {
  position: relative;

  &__trigger {
    display: flex;
    align-items: center;
    gap: 0.4em;
    width: 100%;
    padding: 0.4em 0.6em;
    background: var(--background-tertiary, #f5f5f5);
    border: 1px solid var(--neutral-20, #e0e0e0);
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85rem;
    color: var(--text-primary);
    transition: border-color 0.2s;

    &:hover:not(:disabled) {
      border-color: var(--primary-color);
    }

    &--open {
      border-color: var(--primary-color);
    }

    &--readonly {
      cursor: default;
      opacity: 0.7;
    }
  }

  &__label {
    flex: 1;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__caret {
    flex-shrink: 0;
    color: var(--text-secondary);
  }

  &__dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    background: white;
    border: 1px solid var(--neutral-20, #e0e0e0);
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    z-index: 20;
    max-height: 200px;
    overflow-y: auto;
    padding: 0.25rem 0;
  }

  &__option {
    display: flex;
    align-items: center;
    gap: 0.4em;
    padding: 0.4em 0.5rem;
    cursor: pointer;
    font-size: 0.85rem;
    color: var(--text-primary);

    &:hover {
      background-color: var(--primary-soft, #f0f0ff);
    }

    &--active {
      background-color: var(--primary-soft, #f0f0ff);
      font-weight: 600;
    }
  }
}
</style>
