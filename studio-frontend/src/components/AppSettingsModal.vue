<template>
  <Modal v-model="isModalOpen" title="Settings" subtitle="Manage your account and preferences" size="lg">
    <div class="app-settings">
      <aside>
        <ul>
          <li>
            <div class="app-settings__user-info flex align-center gap-small">
                <div class="flex flex1 align-center gap-small">
                    <UserProfilePicture :hover="false" :user="user" />
                    <span class="user-account-selector__name">{{ userName }}</span>
                </div>
            </div>
          </li>
          <li :class="{ active: selectedTab === 'account-information' }">
            <a href="#" @click="selectTab('account-information')">
              <ph-icon name="user"></ph-icon>
              <span>Account information</span>
            </a>
          </li>
          <li :class="{ active: selectedTab === 'preferences' }">
            <a href="#" @click="selectTab('preferences')">
              <ph-icon name="user"></ph-icon>
              <span>Preferences</span>
            </a>
          </li>
          <is-cloud>
            <li :class="{ active: selectedTab === 'billing' }">
              <a href="#" @click="selectTab('billing')">
                <ph-icon name="user"></ph-icon>
                <span>Billing</span>
              </a>
            </li>
          </is-cloud>
        </ul>
      </aside>
      <div
        class="app-settings__section"
        :class="{ active: selectedTab === 'account-information' }">
        <pre>{{ user }}</pre>
        <table class="table">
          <tr>
            <th>Name</th>
            <td>
              <input type="text" id="name" class="input" :value="user.name" placeholder="Name" autocomplete="off" />
            </td>
          </tr>
          <tr>
            <th>Email</th>
            <td>
              <input type="text" id="email" class="input" :value="user.email" placeholder="Email" autocomplete="off" />
            </td>
          </tr>
          <tr>
            <th>Password</th>
            <td>
              <span class="input">********</span>
            </td>
          </tr>
        </table>
      </div>
      <div
        class="app-settings__section"
        :class="{ active: selectedTab === 'preferences' }">
      </div>
      <div
        class="app-settings__section"
        :class="{ active: selectedTab === 'billing' }">
      </div>
    </div>
  </Modal>
</template>

<script>
import { mapGetters } from "vuex"
import Modal from "./molecules/Modal.vue"
import UserProfilePicture from "./atoms/UserProfilePicture.vue"

export default {
  name: "AppSettingsModal",
  components: {
    Modal,
    UserProfilePicture,
  },
  data() {
    return {
      selectedTab: "account-information",
    }
  },
  computed: {
    ...mapGetters({
      user: "user/getUserInfos",
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
  },
  methods: {
    selectTab(tab) {
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
    display: none;

    &.active {
      display: block;
    }

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
</style>
