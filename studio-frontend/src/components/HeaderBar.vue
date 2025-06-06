<template>
  <div class="flex align-center header-bar">
    <div class="flex align-center header-bar__left">
      <action-conversation-create />
      <Modal title="test" subtitle="test">
        <template #trigger="{ open }">
          <button @click="open">test</button>
        </template>
        <template #content>
          <div>
            content test
            <Popover>
              <template #trigger>
                <button>test</button>
              </template>
              <template #content>
                <div>
                  content popover test
                </div>
              </template>
            </Popover>
          </div>
        </template>
      </Modal>
      <Popover>
        <template #trigger>
          <button>test</button>
        </template>
        <template #content>
          <div>
            content popover test 2
            <Popover>
              <template #trigger>
                <button>test</button>
              </template>
              <template #content>
                <div>content popover test 3</div>
              </template>
            </Popover>
            <Modal title="test" subtitle="test">
              <template #trigger>
                <button>test</button>
              </template>
              <template #content>
                <div>content modal test</div>
              </template>
            </Modal>
          </div>
        </template>
      </Popover>
      <!--
      <form class="flex row align-center flex1" @submit="handleSearch">
        <input v-model="search" type="search" name="q" placeholder="Search something…" class="header-bar__search flex1"
          ref="searchInput" />
        <button type="submit" class="transparent">
          <ph-icon name="MagnifyingGlass" size="md" />
          <span class="label">Search</span>
        </button>
        <button v-if="search" type="reset" class="transparent icon-only" @click="clearSearch">
          <span class="icon close" />
        </button>
        <CustomSelect
        buttonClass="transparent icon-only"
        v-model="selectedFilters"
        multipleSelection
        class="icon-only"
        :options="filterOptions">
        <template slot="button-content"><span class="icon filter" /></template>
</CustomSelect>
      </form> -->

      <!-- V-MODEL POPOVER TEST -->
      <button ref="simplePopoverTrigger" @click="simplePopoverOpen = !simplePopoverOpen">test: {{ simplePopoverOpen }}</button>
    </div>
    <div class="header-bar__right">
      <MediaExplorerStorageSize />
      <Popover v-model="simplePopoverOpen" trigger="click" :trigger-element="$refs.simplePopoverTrigger">
        <template #content>
          <div>
            This is a test. If you see this, v-model with internal trigger
            works.
          </div>
        </template>
      </Popover>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex"

import ActionConversationCreate from "./molecules/ActionConversationCreate.vue"
import CustomSelect from "./molecules/CustomSelect.vue"
import PhIcon from "./atoms/PhIcon.vue"
import MediaExplorerStorageSize from "./MediaExplorerStorageSize.vue"
import Modal from "./molecules/Modal.vue"
import Popover from "@/components/atoms/Popover.vue"

export default {
  props: {},
  data() {
    return {
      simplePopoverOpen: false,
      filterOptions: {
        tags: [
          { value: "tag1", text: "tag1" },
          { value: "tag2", text: "tag2" },
          { value: "tag3", text: "tag3" },
        ],
      },
      selectedFilters: [],
      search: this.$route.query.q || "",
    }
  },
  mounted() {
    // autofocus when user type [CMD] + K
    document.addEventListener("keydown", (e) => {
      if (e.metaKey && e.key === "k") {
        this.$refs.searchInput.focus()
      }
    })
  },
  computed: {
    ...mapGetters("organizations", {
      currentOrganizationScope: "getCurrentOrganizationScope",
    }),
  },
  methods: {
    handleSearch(e) {
      e.preventDefault()
      this.$router.push({
        name: "explore",
        query: { q: this.search },
        params: { organizationId: this.currentOrganizationScope },
      })
      return false
    },
    clearSearch() {
      this.$router.push({
        name: "explore",
        query: { q: "" },
        params: { organizationId: this.currentOrganizationScope },
      })
    },
  },
  components: {
    ActionConversationCreate,
    PhIcon,
    CustomSelect,
    MediaExplorerStorageSize,
    Modal,
    Popover,
  },
}
</script>
