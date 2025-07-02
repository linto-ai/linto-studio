<template>
  <Modal
    :title="$t('modal_switch_org.title')"
    :subtitle="$t('modal_switch_org.subtitle')"
    v-model="isOpen"
    :with-actions="false"
    :style="{ display: isOpen ? 'inline-block' : 'none' }"
    @close="close">
    <div class="modal-switch-org">
      <div class="modal-switch-org__list flex col gap-small">
        <router-link
          :to="{
            name: 'explore',
            params: { organizationId: org._id },
          }"
          @click.native="close"
          v-for="org in organizations"
          :key="org._id"
          class="modal-switch-org__list__item">
          <Avatar
            :text="org.name.slice(0, 1)"
            size="sm"
            class="modal-switch-org__list__item__avatar" />
          <div class="modal-switch-org__list__item__name flex flex1">
            <div class="modal-switch-org__list__item__name__text flex1">
              {{ org.name }}
            </div>
            <div
              v-if="currentOrganization && org._id === currentOrganization._id"
              class="modal-switch-org__list__item__name__current">
              {{ $t("modal_switch_org.current") }}
            </div>
          </div>
        </router-link>
        <div class="modal-switch-org__list__item new-org">
          <Button
            :label="$t('modal_switch_org.create_organization')"
            icon="plus"
            size="sm"
            variant="outline"
            color="primary"
            @click="isCreateModalOpen = true" />
        </div>
      </div>
      <ModalCreateOrganization
        v-model="isCreateModalOpen"
        @on-cancel="isCreateModalOpen = false" />
    </div>
  </Modal>
</template>

<script>
import { mapGetters } from "vuex"
import Modal from "@/components/molecules/Modal.vue"
import ModalCreateOrganization from "@/components/ModalCreateOrganization.vue"
import ChipTag from "./atoms/ChipTag.vue"

export default {
  name: "ModalSwitchOrg",
  components: {
    Modal,
    ModalCreateOrganization,
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      isCreateModalOpen: false,
    }
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

      &__name {
        display: flex;
        align-items: center;
        gap: 0.5em;

        &__current {
          color: var(--text-secondary);
        }
      }

      &.new-org {
        margin-top: 1em;
        justify-content: flex-end;
      }
    }
  }
}
</style>
