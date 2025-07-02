<template>
    <div class="media-explorer-tags">
        <div v-if="tags.loading">
            Loading…
        </div>
        <div v-else-if="tags.error">
            Error: {{ tags.error }}
        </div>
        <div v-else>
            <div v-for="tag in tags.tags" :key="tag._id">
                {{ tag.name }}
            </div>
            <div v-if="tags.tags.length === 0">
                No tags found
            </div>
        </div>
        <div class="media-explorer-tags__actions">
            <button @click="addTag">
                <span class="icon add"></span>
                <span>
                    Add tag
                </span>
            </button>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex"

export default {
    computed: {
        ...mapState(["tags"])
    },
    methods: {
        addTag() {
            this.$store.dispatch("tags/addTag", this.newTag)
        }
    }
}
</script>

<style>
.media-explorer-tags {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>