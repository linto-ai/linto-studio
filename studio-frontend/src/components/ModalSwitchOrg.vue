<template>
  <Modal
    title="Switch Organization"
    subtitle="Select the organization you want to switch to"
    v-model="isOpen"
    :with-actions="false"
    @close="close">
    <div class="modal-switch-org">
      <div class="modal-switch-org__list">
        <div
          v-for="org in organizations"
          :key="org._id"
          class="modal-switch-org__list__item">
          <Avatar :text="org.name.slice(0, 1)" size="sm" />
          <div class="modal-switch-org__list__item__name">
            <div class="modal-switch-org__list__item__name__text">
              {{ org.name }}
            </div>
            <div v-if="org._id === currentOrganization._id" class="modal-switch-org__list__item__name__current">
              Current
            </div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import { mapGetters } from "vuex"
import Modal from "@/components/molecules/Modal.vue"
import Avatar from "@/components/atoms/Avatar.vue"

export default {
  name: "ModalSwitchOrg",
  components: {
    Modal,
    Avatar,
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapGetters("organizations", {
      currentOrganization: "getCurrentOrganization",
      organizations: "getOrganizationsAsArray",
    }),
    isOpen: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      },
    },
  },
  methods: {
    close() {
      this.$emit("close")
    },
  },
}
</script>

<style lang="scss" scoped>
.modal-switch-org {
  &__list {
    &__item {
      display: flex;
      align-items: center;
      gap: 1em;
    }
  }
}
</style>
