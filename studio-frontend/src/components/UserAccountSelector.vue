<template>
    <div class="user-account-selector" :class="{ active: active }">
        <div class="overlay" v-if="active" @click="active = false"></div>
        <div class="root block" @click="active = !active">
            <div class="btn head flex align-center gap-small">
                <div class="flex flex1 align-center gap-small">
                    <UserProfilePicture :hover="false" :user="userInfo"
                        class="user-account-selector__profile-picture" />
                    <span class="user-account-selector__name">{{ UserName }}</span>
                </div>
                <button class="btn sm only-icon outline">
                    <ph-icon :name="active ? 'caret-up' : 'caret-down'"></ph-icon>
                </button>
            </div>
            <div class="submenu flex1 flex col gap-small">
                <a href="#" class="submenu__item" @click="openSettingsModal">
                    <ph-icon name="user"></ph-icon>
                    <span class="submenu__item__text">Settings</span>
                </a>
                <a class="submenu__item" @click="logout">
                    <ph-icon name="sign-out"></ph-icon>
                    <span class="submenu__item__text">Logout</span>
                </a>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.user-account-selector {
    position: relative;

    &.active {
        .submenu {
            display: block;
        }
    }

    .root {
        cursor: default;
        padding: 0;
        user-select: none;
        border: 0;
        box-sizing: border-box;
        border-radius: 0;
    }

    .root:hover {
        background-color: var(--button-background);
    }

    .head {
        border-radius: 0;
        user-select: none;
        border: 0;
        width: 100%;
        height: 54px;
        padding: 0 1em;
    }

    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999;
        background-color: hsla(0, 0%, 0%, 0.05);
        backdrop-filter: blur(1px);
    }

    .submenu {
        position: absolute;
        top: 54px;
        left: 0;
        z-index: 1000;
        display: none;
        border-radius: 4px;
        border: 2px solid var(--primary-color);
        padding: 1em;
        width: 100%;
        box-sizing: border-box;
        justify-content: flex-start;
        align-items: flex-start;
        background-color: #fff;

        &__item {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 1em;
            cursor: pointer;
            padding: 0.5em;
        }
    }
}
</style>

<script>
import { mapActions, mapGetters } from "vuex"
import { bus } from "@/main.js"

import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { platformRoleMixin } from "@/mixins/platformRole.js"
import { userName } from "@/tools/userName"

import UserProfilePicture from "@/components/atoms/UserProfilePicture.vue"

export default {
    mixins: [orgaRoleMixin, platformRoleMixin],
    props: {},
    data() {
        return {
            active: false,
        }
    },
    mounted() {
        bus.$on("navigation", this.closeMenu)
    },
    beforeDestroy() {
        bus.$off("navigation", this.closeMenu)
    },
    computed: {
        ...mapGetters("user", {
            userInfo: "getUserInfos",
        }),
        UserName() {
            return userName(this.userInfo)
        },
        name() {
            // if (this.$route.name === "shared with me") {
            //   return this.$t("navigation.tabs.shared")
            // } else if (this.$route.name === "favorites") {
            //   return this.$t("navigation.tabs.favorites")
            // } else if (this.$route.meta.userPage) {
            //   return this.$t("navigation.tabs.user_page")
            // }
            return `${this.currentOrganization?.name} (${this.roleToString})`
        },
        navList() {
            const userMenu = [
                {
                    value: "account",
                    text: this.$t("navigation.account.account_link"),
                    icon: "speaker",
                    iconText: "Account",
                    badge: this.badgeValue,
                },
                {
                    value: "logout",
                    text: this.$t("navigation.account.logout"),
                    icon: "logout",
                    iconText: "Logout",
                },
            ]

            if (this.isSessionOperator || this.isSystemAdministrator) {
                userMenu.unshift({
                    value: "backoffice",
                    text: this.$t("navigation.backoffice.link_title"),
                    icon: "settings",
                    iconText: "Backoffice",
                })
            }

            if (this.isAtLeastOrganizationInitiator) {
                settingsItems.push({
                    value: "create",
                    icon: "new",
                    text: this.$t("navigation.organisation.create"),
                })
            }
            return {
                userMenu,
            }
        },
    },
    methods: {
        closeMenu() {
            this.navUserAccountVisible = false
        },
        openSettingsModal() {
            this.$store.dispatch("settings/openModal")
        },
        logout() {
            this.$store.dispatch("user/logout")
        },
    },
    components: {
        UserProfilePicture,
    },
}
</script>