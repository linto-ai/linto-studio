<template>
    <div>
        <div class="app-settings-modal" v-if="isModalOpen">
            <div class="app-settings-modal__content">
                <div class="app-settings-modal__header">
                    <h2>Settings</h2>
                    <button @click="closeModal" class="transparent only-icon">
                        <ph-icon name="x"></ph-icon>
                    </button>
                </div>
                <div class="app-settings-modal__body">
                    <aside>
                        <ul>
                            <li :class="{ 'active': selectedTab === 'account-information' }">
                                <a href="#" @click="selectTab('account-information')">
                                    <ph-icon name="user"></ph-icon>
                                    <span>Account information</span>
                                </a>
                            </li>
                            <li :class="{ 'active': selectedTab === 'preferences' }">
                                <a href="#" @click="selectTab('preferences')">
                                    <ph-icon name="user"></ph-icon>
                                    <span>Preferences</span>
                                </a>
                            </li>
                            <is-cloud>
                                <li :class="{ 'active': selectedTab === 'billing' }">
                                    <a href="#" @click="selectTab('billing')">
                                        <ph-icon name="user"></ph-icon>
                                        <span>Billing</span>
                                    </a>
                                </li>
                            </is-cloud>
                        </ul>
                    </aside>
                    <div class="app-settings-modal__body__section" :class="{ 'active': selectedTab === 'account-information' }">
                        <h3>Account information</h3>
                        <hr>    

                        <table class="app-settings-modal__body__section__table">
                            <tr>
                                <th>Language</th>
                                <td>
                                    <select id="language">
                                    </select>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="app-settings-modal__body__section" :class="{ 'active': selectedTab === 'preferences' }">
                        <h3>Preferences</h3>
                        <hr>
                    </div>
                    <div class="app-settings-modal__body__section" :class="{ 'active': selectedTab === 'billing' }">
                        <h3>Billing</h3>
                        <hr>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
    name: "AppSettingsModal",
    data() {
        return {
            selectedTab: "account-information",
        }
    },
    computed: {
        ...mapGetters({
            isModalOpen: "settings/isModalOpen",
        }),
    },
    methods: {
        selectTab(tab) {
            this.selectedTab = tab
        },
        closeModal() {
            this.$store.dispatch("settings/closeModal")
        },
    },
}
</script>

<style lang="scss">
.app-settings-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;

    &__content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 640px;
        height: 500px;
        background-color: var(--primary-soft);
        border-radius: 10px;
        padding: 20px;
        max-width: 100%;
        display: flex;
        flex-direction: column;
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__body {
        flex: 1;
        display: flex;
        gap: 20px;

        aside {
            display: flex;
            flex-direction: column;
            gap: 10px;
            flex-basis: 200px;
            background-color: var(--background-secondary);
            border-radius: 10px;
            height: 100%;

            ul {
                list-style: none;
                padding: 0;
                margin: 0;

                li {
                    padding: 0;
                    margin: 0;

                    &.active {
                        background-color: var(--primary-soft);

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
                        border-radius: 2px;
                        
                    }
                }
            }
        }

        &__section {
            flex: 1;
            background-color: var(--background-secondary);
            border-radius: 10px;
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
    }
}
</style>