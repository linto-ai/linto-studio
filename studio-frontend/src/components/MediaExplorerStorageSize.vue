<template>
    <div class="media-explorer-storage-size">
        <div class="media-explorer-storage-size__progress">
            <div class="media-explorer-storage-size__progress__bar">
                <div class="media-explorer-storage-size__progress__bar__fill" :style="{ width: `${progress}%` }"></div>
            </div>
            <span class="media-explorer-storage-size__progress__size">
                {{ progress }}%
            </span>
        </div>
        <is-cloud>
            <a href="#" class="btn xs outline upgrade-button with-icon">
                <ph-icon name="arrow-right" size="xs"></ph-icon>
                <span class="label">Upgrade</span>
            </a>
        </is-cloud>
    </div>
</template>

<script>
export default {
    props: {
        progress: {
            type: Number,
            default: 0
        }
    }
}
</script>

<style scoped>
.media-explorer-storage-size {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.media-explorer-storage-size__progress {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 12px;
}

.media-explorer-storage-size__progress__bar {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    background-color: var(--neutral-40);
    width: 100%;
    height: 12px;
    border-radius: 4px;
    overflow: hidden;
    padding: 2px;
    box-sizing: border-box;
}

.media-explorer-storage-size__progress__bar__fill {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: orange;
    width: 100%;
    height: 100%;
    border-radius: 10px;
}

.media-explorer-storage-size__progress__size {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    padding-left: .2rem;
}

.upgrade-button {
    display: inline-block;
    margin-left: 0.5rem;
}
</style>