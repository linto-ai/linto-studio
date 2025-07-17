<template>
  <Modal
    v-model="isModalOpen"
    :with-actions="false"
    :title="$t('app_settings_modal.title')"
    :size="computedSize">
    <div class="app-settings flex1">
      <aside>
        <div class="flex1">
          <h4>{{ $t("app_settings_modal.account_title") }}</h4>
          <!-- <div class="app-settings__user-info flex align-center gap-small">
          <div class="flex flex1 align-center gap-small">
            <UserProfilePicture :hover="false" :user="user" />
            <span class="user-account-selector__name">{{ userName }}</span>
          </div>
        </div> -->
          <ul>
            <li :class="{ active: selectedTab === 'account-information' }">
              <a href="#" @click="selectTab('account-information')">
                <ph-icon name="user" weight="bold"></ph-icon>
                <span>{{ $t("app_settings_modal.account_information") }}</span>
              </a>
            </li>
            <li :class="{ active: selectedTab === 'notifications' }">
              <a href="#" @click="selectTab('notifications')">
                <ph-icon name="bell" weight="bold"></ph-icon>
                <span>{{ $t("app_settings_modal.notifications") }}</span>
              </a>
            </li>
            <li :class="{ active: selectedTab === 'preferences' }">
              <a href="#" @click="selectTab('preferences')">
                <ph-icon name="wrench" weight="bold"></ph-icon>
                <span>{{ $t("app_settings_modal.preferences") }}</span>
              </a>
            </li>
          </ul>
          <h4>{{ orgaName }}</h4>

          <ul>
            <li :class="{ active: selectedTab === 'organization-information' }">
              <a href="#" @click="selectTab('organization-information')">
                <ph-icon name="info" weight="bold"></ph-icon>
                <span>{{
                  $t("app_settings_modal.organization_information")
                }}</span>
              </a>
            </li>
            <li :class="{ active: selectedTab === 'members' }">
              <a href="#" @click="selectTab('members')">
                <ph-icon name="users" weight="bold"></ph-icon>
                <span>{{ $t("app_settings_modal.organization_members") }}</span>
              </a>
            </li>
            <is-cloud>
              <li :class="{ active: selectedTab === 'billing' }">
                <a href="#" @click="selectTab('billing')">
                  <ph-icon name="credit-card" weight="bold"></ph-icon>
                  <span>{{ $t("app_settings_modal.billing") }}</span>
                </a>
              </li>
            </is-cloud>
            <li :class="{ active: selectedTab === 'tags' }">
              <a href="#" @click="selectTab('tags')">
                <ph-icon name="tag" weight="bold"></ph-icon>
                <span>{{ $t("app_settings_modal.tags") }}</span>
              </a>
            </li>
          </ul>
        </div>
        <div>
          <Button
            :label="$t('app_settings_modal.logout')"
            @click="logout"
            icon="sign-out"
            color="tertiary"
            size="sm"></Button>
        </div>
      </aside>
      <div
        v-if="selectedTab === 'account-information'"
        class="app-settings__section">
        <!-- <pre>{{ user }}</pre> -->
        <UserSettingsAvatar :userInfo="user" v-if="isAuthenticated" />
        <UserSettingsPersonal :userInfo="user" v-if="isAuthenticated" />
        <UserSettingsVisibility :userInfo="user" v-if="isAuthenticated" />
        <UserSettingsPassword :userInfo="user" v-if="isAuthenticated" />
      </div>
      <div v-if="selectedTab === 'notifications'" class="app-settings__section">
        <UserSettingsNotifications :userInfo="user" v-if="isAuthenticated" />
      </div>
      <div v-if="selectedTab === 'tags'" class="app-settings__section">
        <TagManagement />
      </div>
      <div v-if="selectedTab === 'preferences'" class="app-settings__section">
        <UserSettingsPreferences />
      </div>

      <div
        v-if="selectedTab === 'organization-information'"
        class="app-settings__section">
        <UpdateOrganizationForm :currentOrganization="currentOrganization" />
        <UpdateOrganizationDeletion
          v-if="isAdmin"
          :currentOrganization="currentOrganization" />
      </div>
      <div v-if="selectedTab === 'members'" class="app-settings__section">
        <UpdateOrganizationUsers
          :currentOrganization="currentOrganization"
          :userInfo="user" />
      </div>
      <div
        v-if="selectedTab === 'billing'"
        class="app-settings__section"
        :class="{ active: selectedTab === 'billing' }"></div>
    </div>
  </Modal>
</template>

<script>
import { mapGetters } from "vuex"
import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { platformRoleMixin } from "@/mixins/platformRole.js"

import UserProfilePicture from "@/components/atoms/UserProfilePicture.vue"
import UserSettingsPersonal from "@/components/UserSettingsPersonal.vue"
import UserSettingsPassword from "@/components/UserSettingsPassword.vue"
import UserSettingsNotifications from "@/components/UserSettingsNotifications.vue"
import UserSettingsVisibility from "@/components/UserSettingsVisibility.vue"
import UserSettingsAvatar from "@/components/UserSettingsAvatar.vue"
import UserSettingsPreferences from "@/components/UserSettingsPreferences.vue"
import TagManagement from "@/components/TagManagement.vue"
import UpdateOrganizationForm from "@/components/UpdateOrganizationForm.vue"
import UpdateOrganizationUsers from "@/components/UpdateOrganizationUsers.vue"
import UpdateOrganizationDeletion from "./UpdateOrganizationDeletion.vue"
import Modal from "./molecules/Modal.vue"

export default {
  name: "AppSettingsModal",
  mixins: [orgaRoleMixin, platformRoleMixin],
  components: {
    UserProfilePicture,
    UserSettingsPersonal,
    UserSettingsPassword,
    UserSettingsNotifications,
    UserSettingsVisibility,
    UserSettingsAvatar,
    UserSettingsPreferences,
    TagManagement,
    UpdateOrganizationForm,
    UpdateOrganizationUsers,
    UpdateOrganizationDeletion,
    Modal,
  },
  data() {
    return {
      selectedTab: "account-information",
    }
  },
  computed: {
    ...mapGetters({
      user: "user/getUserInfos",
      isAuthenticated: "user/isAuthenticated",
    }),
    ...mapGetters("organizations", {
      currentOrganization: "getCurrentOrganization",
    }),
    isModalOpen: {
      get() {
        return this.$store.state.settings.isModalOpen
      },
      set(value) {
        this.$store.dispatch("settings/setModalOpen", value)
      },
    },
    userName() {
      return this.user.firstname + " " + this.user.lastname
    },
    computedSize() {
      if (window.innerWidth < 1100) {
        return "screen"
      }
      return "lg"
    },
    orgaName() {
      return this.currentOrganization?.name
    },
  },
  methods: {
    selectTab(tab) {
      this.selectedTab = tab
    },
    closeModal() {
      this.$store.dispatch("settings/setModalOpen", false)
    },
    logout() {
      this.$store.dispatch("user/logout")
      this.closeModal()
      document.location.reload()
    },
  },
}
</script>

<style lang="scss" scoped>
.app-settings {
  display: flex;

  aside {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex-basis: 200px;
    border-radius: 10px;
    //height: 100%;

    h4 {
      font-size: 14px;
      color: var(--text-secondary);
      margin-bottom: 0.25rem;
    }

    ul + h4 {
      margin-top: 1rem;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        padding: 0;
        margin: 0;
        border-radius: 4px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;

        &.active {
          background-color: var(--background-secondary);

          a {
            color: var(--primary-hard);
            font-weight: bold;
          }
        }

        a {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
        }
      }
    }
  }

  &__section {
    flex: 1;
    background-color: var(--background-secondary);
    border-radius: 4px;
    border-top-left-radius: 0;
    box-sizing: border-box;
    padding: 1em;
    //display: none;
    overflow-y: auto;
    align-self: stretch;
    height: min(800px, calc(100vh - 10rem));

    // &.active {
    //   display: block;
    // }

    h3 {
      margin: 0;
      padding: 0;
      font-size: 1.2em;
      font-weight: bold;
      color: var(--primary-hard);
    }

    hr {
      margin: 1em 0;
      border: 0;
      border-top: 1px solid var(--primary-hard);
    }

    &__table {
      border-collapse: collapse;
      border-spacing: 0;
      border: 1px solid #ccc;
      border-radius: 10px;

      width: 100%;

      tr {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      th {
        text-align: left;
        padding: 10px;
      }

      td {
        text-align: right;
        padding: 10px;
      }
    }
  }

  &__user-info {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0.5em;

    & > div {
      background-color: var(--background-secondary);
      flex: 1;
      padding: 0.5em;
      border-radius: 4px;
      border: 1px solid var(--neutral-60);
    }
  }
}

@media (max-width: 1100px) {
  .app-settings {
    flex-direction: column;
    gap: 1rem;

    aside {
      flex-direction: column;
      gap: 1rem;
      height: auto;
      flex-basis: auto;
      padding: 0.5rem;

      h4 {
        font-size: 12px;
        margin-bottom: 0.5rem;
        margin-top: 0;
        &:first-child {
          margin-top: 0;
        }
      }

      ul {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 0.5rem;
        width: 100%;
        margin-bottom: 1rem;

        li {
          border-radius: 8px;
          border: 1px solid var(--neutral-60);
          background-color: var(--background-primary);
          transition: all 0.2s ease;

          &.active {
            background-color: var(--primary-soft);
            border-color: var(--primary-hard);
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

            a {
              color: var(--primary-hard);
              font-weight: 600;
            }
          }

          a {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 0.5rem;
            text-align: center;
            font-size: 12px;
            line-height: 1.2;

            ph-icon {
              font-size: 18px;
            }

            span {
              word-wrap: break-word;
              hyphens: auto;
            }
          }

          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          }
        }
      }

      // Logout button repositioning for mobile
      > div:last-child {
        margin-top: auto;
        padding-top: 1rem;
        border-top: 1px solid var(--neutral-60);
      }
    }

    &__section {
      border-radius: 8px;
      border-top-left-radius: 8px;
      padding: 1rem;
      height: calc(100vh - 20rem);
      max-height: 60vh;
      min-height: 300px;
    }

    &__user-info {
      display: none;
    }
  }
}

@media (max-width: 768px) {
  .app-settings {
    aside {
      ul {
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));

        li {
          a {
            padding: 0.5rem 0.25rem;
            font-size: 11px;

            ph-icon {
              font-size: 16px;
            }
          }
        }
      }
    }

    &__section {
      padding: 0.75rem;
      height: calc(100vh - 18rem);
      max-height: 55vh;
    }
  }
}

@media (max-width: 480px) {
  .app-settings {
    aside {
      ul {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }
}
</style>
