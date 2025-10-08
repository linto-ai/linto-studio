<template>
  <Modal
    :title="$t('modal_switch_org.title')"
    v-model="isOpen"
    :with-actions="false"
    :style="{ display: isOpen ? 'inline-block' : 'none' }"
    @close="close">
    <div class="modal-switch-org">
      <div class="modal-switch-org__list flex col gap-small">
        <router-link
          v-if="isAtLeastSystemAdministrator"
          :to="{
            name: 'backoffice',
          }"
          class="modal-switch-org__list__item">
          <Avatar
            icon="key"
            size="sm"
            class="modal-switch-org__list__item__avatar" />
          <div class="modal-switch-org__list__item__name flex flex1">
            <div class="modal-switch-org__list__item__name__text flex1">
              {{ $t("modal_switch_org.backoffice") }}
            </div>
          </div>
        </router-link>
        <router-link
          :to="{
            name: 'explore',
            params: { organizationId: org._id },
          }"
          @click.native="close"
          v-for="org in sortedOrganizations"
          :key="org._id"
          class="modal-switch-org__list__item">
          <Avatar
            :text="org.name.slice(0, 1)"
            :size="isMobile ? 'md' : 'sm'"
            class="modal-switch-org__list__item__avatar" />
          <div
            class="modal-switch-org__list__item__name flex flex1"
            :class="{
              current:
                currentOrganization && org._id === currentOrganization._id,
            }">
            <div class="modal-switch-org__list__item__name__text flex1">
              {{ org.name }}
            </div>
            <!-- <div
              v-if="currentOrganization && org._id === currentOrganization._id"
              class="modal-switch-org__list__item__name__current">
              {{ $t("modal_switch_org.current") }}
            </div> -->
            <div class="modal-switch-org__list__item__name__role">
              {{ roleToString(org.role) }}
            </div>
          </div>
        </router-link>
        <div class="modal-switch-org__list__item new-org">
          <Button
            v-if="isOrganizationInitiator"
            :label="$t('modal_switch_org.create_organization')"
            icon="plus"
            size="sm"
            variant="primary"
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
import { platformRoleMixin } from "@/mixins/platformRole.js"
import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { getUserRoleInOrganization } from "@/tools/getUserRoleInOrganization"

export default {
  name: "ModalSwitchOrg",
  components: {
    Modal,
    ModalCreateOrganization,
  },
  mixins: [platformRoleMixin, orgaRoleMixin],
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
    ...mapGetters("user", {
      userInfo: "getUserInfos",
    }),
    ...mapGetters("system", ["isMobile"]),
    isOpen: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      },
    },
    sortedOrganizations() {
      return this.organizations
        .map((org) => ({
          ...org,
          role: getUserRoleInOrganization(org, this.userInfo._id),
        }))
        .sort((a, b) => {
          if (a.role > b.role) return -1
          if (a.role < b.role) return 1

          return a.name.localeCompare(b.name)
        })
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

        text-overflow: ellipsis;

        &__text {
          overflow: hidden;
          text-overflow: ellipsis;
        }

        &.current {
          font-weight: bold;

          .modal-switch-org__list__item__name__text {
            //color: var(--primary-color);
          }

          .modal-switch-org__list__item__name__role {
            color: var(--text-primary);
          }
        }

        &__role {
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
