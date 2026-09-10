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
          <span class="modal-switch-org__list__item__favorite-spacer" />
          <Avatar
            icon="key"
            size="sm"
            tone="soft"
            class="modal-switch-org__list__item__avatar" />
          <div
            class="modal-switch-org__list__item__name flex flex1"
            :class="{ current: isBackofficePage }">
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
          <FavoriteStar
            :value="isFavoriteOrganization(org._id)"
            :title="$t('modal_switch_org.favorite')"
            @input="toggleFavoriteOrganization(org._id)" />
          <Avatar
            :icon="org.icon"
            size="md"
            tone="primary"
            class="modal-switch-org__list__item__avatar" />
          <div
            class="modal-switch-org__list__item__name flex flex1"
            :class="{
              current:
                currentOrganization && org._id === currentOrganization._id,
            }">
            <div class="modal-switch-org__list__item__name__text flex1">
              {{ org.displayName }}
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
        <!-- Creating an extra organization is a team-plan capability in cloud
             mode. The backend gates it on the caller's PERSONAL org (the billing
             subject); the front shows the lock from the CURRENT org's plan, which
             is the same org for the common case and only a hint otherwise. Always
             rendered in OSS builds. -->
        <HasEntitlement capability="organization.create">
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
        </HasEntitlement>
      </div>
      <ModalCreateOrganization
        v-model="isCreateModalOpen"
        @on-cancel="isCreateModalOpen = false" />
    </div>
  </Modal>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import Modal from "@/components/molecules/Modal.vue"
import ModalCreateOrganization from "@/components/ModalCreateOrganization.vue"
import FavoriteStar from "@/components/atoms/FavoriteStar.vue"
import HasEntitlement from "@/components-cloud/HasEntitlement.vue"
import { platformRoleMixin } from "@/mixins/platformRole.js"
import { orgaRoleMixin } from "@/mixins/orgaRole.js"

export default {
  name: "ModalSwitchOrg",
  components: {
    Modal,
    ModalCreateOrganization,
    FavoriteStar,
    HasEntitlement,
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
      sortedOrganizations: [],
    }
  },
  computed: {
    ...mapGetters("organizations", {
      currentOrganization: "getCurrentOrganization",
      organizations: "getOrganizationsWithUserContext",
    }),
    ...mapGetters("user", {
      isFavoriteOrganization: "isFavoriteOrganization",
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
  },
  watch: {
    value: {
      immediate: true,
      handler(open) {
        if (open) {
          this.sortedOrganizations = this.organizations
            .map((org) => ({
              ...org,
              isFav: this.isFavoriteOrganization(org._id),
            }))
            .sort((a, b) => {
              if (a.isFav !== b.isFav) return a.isFav ? -1 : 1

              if (a.role > b.role) return -1
              if (a.role < b.role) return 1

              return a.name.localeCompare(b.name)
            })
        }
      },
    },
  },
  methods: {
    ...mapActions("user", ["toggleFavoriteOrganization"]),
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

          .modal-switch-org__list__item__name__role {
            color: var(--text-primary);
          }
        }

        &__role {
          color: var(--text-secondary);
        }
      }

      &__favorite-spacer {
        display: inline-block;
        width: 20px;
        flex-shrink: 0;
      }

      &.new-org {
        margin-top: 1em;
        justify-content: flex-end;
      }
    }
  }
}
</style>
