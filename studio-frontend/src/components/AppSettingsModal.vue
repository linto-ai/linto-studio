<template>
  <Modal
    v-model="isModalOpen"
    :with-actions="false"
    :title="$t('app_settings_modal.title')"
    :size="computedSize">
    <div class="app-settings">
      <aside>
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
        <is-cloud>
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
            <li :class="{ active: selectedTab === 'billing' }">
              <a href="#" @click="selectTab('billing')">
                <ph-icon name="credit-card" weight="bold"></ph-icon>
                <span>{{ $t("app_settings_modal.billing") }}</span>
              </a>
            </li>
            <li :class="{ active: selectedTab === 'tags' }">
              <a href="#" @click="selectTab('tags')">
                <ph-icon name="tag" weight="bold"></ph-icon>
                <span>{{ $t("app_settings_modal.tags") }}</span>
              </a>
            </li>
          </ul>
        </is-cloud>
        {{ selectedTab }}
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
      <div
        v-if="selectedTab === 'account-notifications'"
        class="app-settings__section">
        <UserSettingsNotifications :userInfo="user" v-if="isAuthenticated" />
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
import Modal from "./molecules/Modal.vue"
import UserProfilePicture from "@/components/atoms/UserProfilePicture.vue"
import UserSettingsPersonal from "@/components/UserSettingsPersonal.vue"
import UserSettingsPassword from "@/components/UserSettingsPassword.vue"
import UserSettingsNotifications from "@/components/UserSettingsNotifications.vue"
import UserSettingsVisibility from "@/components/UserSettingsVisibility.vue"
import UserSettingsAvatar from "@/components/UserSettingsAvatar.vue"
export default {
  name: "AppSettingsModal",
  components: {
    Modal,
    UserProfilePicture,
    UserSettingsPersonal,
    UserSettingsPassword,
    UserSettingsNotifications,
    UserSettingsVisibility,
    UserSettingsAvatar,
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
      console.log("selectTab", tab)
      this.selectedTab = tab
    },
    closeModal() {
      this.$store.dispatch("settings/setModalOpen", false)
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
    height: 100%;

    h4 {
      font-size: 14px;
      color: var(--text-secondary);
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

    aside {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 10px;
      height: auto;
      flex-basis: auto;

      ul {
        display: flex;
        flex-direction: row;
        gap: 10px;
        width: 100%;
        overflow-x: auto;

        li {
        }
      }
    }

    &__user-info {
      display: none;
    }
  }
}
</style>
