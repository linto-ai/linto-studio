<template>
    <div class="action-conversation-create">
        <button class="btn md primary">
            <ph-icon :name="icon" size="md" />
            <span class="label">{{ label }}</span>
        </button>
    </div>
</template>

<script>
export default {
    name: "ActionConversationCreate",
    props: {
        label: {
            type: String,
            default() {
                return this.$t("navigation.conversation.start")
            }
        },
        icon: {
            type: String,
            default: "play"
        }
    }
}
</script>