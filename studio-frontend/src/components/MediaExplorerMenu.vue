<template>
    <div class="media-explorer-menu-container">
        <small>
            {{ currentOrganization.name }}
        </small>
        <div class="media-explorer-menu">
            <div class="media-explorer-menu__item">
                <router-link :to="{ name: 'sessionsList', params: { organizationId: currentOrganizationScope } }"
                    class="flex row align-center gap-medium tab">
                    <ph-icon name="broadcast"></ph-icon>
                    <span class="media-explorer-menu__item__text">
                        {{ $t("navigation.tabs.sessions") }}
                    </span>
                </router-link>
            </div>
            <div class="media-explorer-menu__item">
                <router-link :to="{
                    name: 'explore',
                    params: { organizationId: currentOrganizationScope },
                }" class="flex row align-center gap-medium tab">
                    <ph-icon name="folder"></ph-icon>
                    <span class="media-explorer-menu__item__text">
                        {{ $t("navigation.tabs.explore") }}
                    </span>
                </router-link>
            </div>
            <div class="media-explorer-menu__item">
                <router-link :to="{ name: 'tags settings' }" class="flex row align-center gap-medium tab">
                    <ph-icon name="tag"></ph-icon>
                    <span class="media-explorer-menu__item__sub__item__text">
                        {{ $t("navigation.tabs.explore_labels") }}
                    </span>
                </router-link>
            </div>
        </div>
        <hr>
        <small>Private Inbox</small>
        <div class="media-explorer-menu">
            <div class="media-explorer-menu__item">
                <router-link :to="{ name: 'explore-favorites', params: { organizationId: currentOrganizationScope } }"
                    class="flex row align-center gap-medium tab">
                    <ph-icon name="star"></ph-icon>
                    <span class="media-explorer-menu__item__sub__item__text">
                        {{ $t("navigation.tabs.favorites") }}
                    </span>
                </router-link>
                <router-link :to="{ name: 'shared with me', params: { organizationId: currentOrganizationScope } }"
                    class="flex row align-center gap-medium tab">
                    <ph-icon name="star"></ph-icon>
                    <span class="media-explorer-menu__item__sub__item__text">
                        {{ $t("navigation.tabs.shared") }}
                    </span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
    name: "MediaExplorerMenu",
    computed: {
        ...mapGetters("organizations", {
            currentOrganization: "getCurrentOrganization",
            currentOrganizationScope: "getCurrentOrganizationScope",
        }),
    },
    data() {
        return {
            active: false,
        }
    },
    methods: {
        toggleActive() {
            this.active = !this.active
        }
    }
}
</script>

<style lang="scss">
.media-explorer-menu {
    display: flex;
    flex-direction: column;

    &__item {
        display: flex;
        flex-direction: column;
        overflow: hidden;

        a {
            display: flex;
            align-items: center;
            gap: 1em;
            padding: 0.5em 1em;
            border-radius: 0px;
            background: var(--background-secondary);
        }

        a.router-link-exact-active {
            background: var(--primary-soft);
        }
    }

    &__item__sub {
        display: flex;
        flex-direction: column;
        padding-left: .5em;
    }
}

.media-explorer-menu-container {
    hr {
        margin: 0;
        height: 0;
        border: none;
        border-top: 1px solid var(--neutral-40);
    }

    &>small {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.75em;
        color: var(--neutral-60);
        padding: 0.5em 0.5em;
        text-transform: uppercase;
    }
}
</style>