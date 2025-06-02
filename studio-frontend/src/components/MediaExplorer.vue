<template>
    <div class="media-explorer" @dragover.prevent="handleDragOver" @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop">
        <div v-if="$slots.header" class="media-explorer__header">
            <slot name="header" />
        </div>
        <div class="media-explorer__content">
            <div class="media-explorer__content__right">
                <div class="media-explorer__content__right__header">
                    <div class="media-explorer__content__right__header__cell">
                        <div class="media-explorer__content__right__header__left">
                            <div class="media-explorer__content__right__header__select-all"
                                :class="{ active: isSelectAll }">
                                <input type="checkbox" @change="handleSelectAll" :checked="isSelectAll" />
                                <span v-if="selectedMedias.length > 0">{{ selectedMedias.length }} selected</span>
                            </div>
                        </div>
                        <div class="media-explorer__content__right__header__right">
                        </div>
                    </div>
                </div>
                <div class="media-explorer__content__right__body">
                    <slot name="before" />
                    <MediaExplorerItem v-for="(media, index) in medias" 
                        :key="media._id" 
                        :media="media"
                        :ref="'mediaItem' + index"
                        class="media-explorer__content__right__body__item" />
                    <slot name="after" />
                </div>
            </div>
        </div>
        <MediaExplorerUpload v-if="isDraggingOver" :uploadProgress="uploadProgress" />
    </div>
</template>

<script>
import MediaExplorerActions from "./MediaExplorerActions.vue"
import MediaExplorerItem from "./MediaExplorerItem.vue"
import MediaExplorerUpload from "./MediaExplorerUpload.vue"
import MediaExplorerTags from "./MediaExplorerTags.vue"
import MediaExplorerStorageSize from "./MediaExplorerStorageSize.vue"

export default {
    name: "MediaExplorer",
    components: {
        MediaExplorerActions,
        MediaExplorerItem,
        MediaExplorerUpload,
        MediaExplorerTags,
        MediaExplorerStorageSize,
    },
    props: {
        medias: {
            type: Array,
            required: true
        },
        loading: {
            type: Boolean,
            required: true
        },
        error: {
            type: String | null,
            required: false
        }
    },
    computed: {
        selectedMedias() {
            return this.$store.state.inbox.selectedMedias
        },
        totalPages() {
            return Math.ceil(this.medias.length / this.pageSize)
        }
    },
    data() {
        return {
            page: 1,
            pageSize: 20,
            isDraggingOver: false,
            uploadProgress: [],
            isSelectAll: false,
            observer: null
        }
    },
    mounted() {
        this.setupIntersectionObserver();
        this.initializePageFromURL();
    },
    beforeDestroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    },
    watch: {
        isSelectAll(value) {
            this.$store.commit('inbox/setAutoselectMedias', value)
        },
        medias: {
            handler() {
                this.$nextTick(() => {
                    if (this.observer) {
                        this.observer.disconnect();
                        this.observeMediaItems();
                    }
                });
            },
            deep: true
        }
    },
    methods: {
        handleDragOver(event) {
            this.isDraggingOver = true;

            event.currentTarget.classList.add('drag-over');
        },
        handleDragLeave(event) {
            if (event.currentTarget.contains(event.relatedTarget)) {
                return;
            }

            this.isDraggingOver = false;
            event.currentTarget.classList.remove('drag-over');
        },
        handleDrop(event) {
            this.isDraggingOver = false;
            event.currentTarget.classList.remove('drag-over');

            const files = Array.from(event.dataTransfer.files);
            const mediaFiles = files.filter(file => {
                return file.type.startsWith('audio/') || file.type.startsWith('video/');
            });

            if (mediaFiles.length === 0) {
                alert('Seuls les fichiers audio et vidéo sont acceptés.');
                return;
            }

            this.uploadFiles(mediaFiles);
        },
        handleSelectAll() {
            this.isSelectAll = !this.isSelectAll;
        },
        uploadFiles(files) {
            this.uploadProgress = files.map(file => ({
                name: file.name,
                progress: 0,
                file
            }));

            this.isDraggingOver = true;

            files.forEach((file, index) => {
                const simulateUpload = () => {
                    if (this.uploadProgress[index].progress < 100) {
                        this.uploadProgress[index].progress += 5;
                        setTimeout(simulateUpload, 200);
                    } else if (this.uploadProgress.every(item => item.progress === 100)) {
                        setTimeout(() => {
                            this.isDraggingOver = false;
                            this.uploadProgress = [];
                            this.$emit('upload-complete', files);
                        }, 1000);
                    }
                };
                setTimeout(simulateUpload, 200);
            });
        },
        setupIntersectionObserver() {
            const options = {
                root: null,
                rootMargin: '0px',
                threshold: 0.5
            };

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const index = parseInt(entry.target.getAttribute('data-index'));
                        const currentPage = Math.floor(index / this.pageSize) + 1;
                        
                        console.log('Element visible:', {
                            index,
                            currentPage,
                            totalPages: this.totalPages,
                            totalItems: this.medias.length
                        });
                        
                        // Only update if the calculated page is valid
                        if (currentPage !== this.page && currentPage <= this.totalPages) {
                            this.updateURLPage(currentPage);
                        }
                    }
                });
            }, options);

            this.$nextTick(() => {
                this.observeMediaItems();
            });
        },
        observeMediaItems() {
            console.log('Setting up observers for', this.medias.length, 'items');
            this.medias.forEach((_, index) => {
                const itemRef = this.$refs['mediaItem' + index];
                if (itemRef && itemRef[0].$el) {
                    itemRef[0].$el.setAttribute('data-index', index);
                    this.observer.observe(itemRef[0].$el);
                }
            });
        },
        updateURLPage(page) {
            // Ensure page is within valid bounds
            const validPage = Math.max(1, Math.min(page, this.totalPages));
            
            console.log('Updating page:', {
                requestedPage: page,
                validPage,
                totalPages: this.totalPages
            });
            
            // Only update if the page is different and valid
            if (validPage !== this.page && validPage <= this.totalPages) {
                this.page = validPage;
                const url = new URL(window.location);
                url.searchParams.set('page', validPage.toString());
                window.history.replaceState({}, '', url);
            }
        },
        initializePageFromURL() {
            const urlParams = new URLSearchParams(window.location.search);
            const pageParam = urlParams.get('page');
            if (pageParam) {
                const parsedPage = parseInt(pageParam);
                if (!isNaN(parsedPage) && parsedPage > 0 && parsedPage <= this.totalPages) {
                    this.page = parsedPage;
                } else {
                    // Reset to page 1 if invalid
                    this.updateURLPage(1);
                }
            }
        }
    }
}
</script>

<style>
.media-explorer {
    display: flex;
    flex-direction: column;
    position: relative;
}

.media-explorer.drag-over {
    outline: 2px dashed #4caf50;
    outline-offset: -2px;
}

.media-explorer__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.media-explorer__header__title {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.media-explorer__content {
    display: flex;
    flex-direction: row;
}

.media-explorer__content__left {
    display: flex;
    flex-direction: column;
    width: 20%;
    max-width: 280px;
    border-right: 1px solid #e0e0e0;
}

.media-explorer__content__left__header {
    display: flex;
    align-items: center;
    gap: 1rem;
    height: 50px;
    line-height: 50px;
    background-color: #f0f0f0;
    box-sizing: border-box;
    padding: 0 1rem;
    border-bottom: 1px solid #e0e0e0;
}

.media-explorer__content__left__body {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
}

.media-explorer__content__left__body__item {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.media-explorer__content__right {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    overflow-y: auto;
}

.media-explorer__content__right__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    height: 54px;
    background-color: var(--primary-soft);
    box-sizing: border-box;
    padding: 0 0rem;
    border-bottom: var(--border-block);
    position: sticky;
    top: 0;
    z-index: 1;
}

.media-explorer__content__right__header__cell {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0 1rem;
}

.media-explorer__content__right__header h3 {
    padding: 0;
    margin: 0;
}

.media-explorer__content__right__header__left {
    flex: 1;
    display: flex;
    align-items: center;
    gap: .5rem;
    padding-left: 0.4rem;
}

.media-explorer__content__right__header__left__left {
    display: flex;
    align-items: center;
    flex: 1;

    h3 {
        font-size: 1rem;
        font-weight: 600;
        width: auto;
    }
}

.media-explorer__content__right__header__left .media-explorer__content__right__header__select-all {
    position: relative;
    margin-left: 1.2rem;
    min-width: 0 !important;
    padding-left: 24px;
    width: auto !important;
    height: 24px !important;
    background-color: #e1e1e1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.2rem;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
}

.media-explorer__content__right__header__left .media-explorer__content__right__header__select-all input {
    position: absolute;
    left: 0;
    top: 50%;
    left: 5.5px;
    transform: translateY(-50%);
    width: 13px;
    height: 13px;
    padding: 0;
    margin: 0;
}

.media-explorer__content__right__header__left .media-explorer__content__right__header__select-all span {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--primary-color);
    display: inline-block;
    padding-left: .5rem;
    padding-right: .5rem;
}

.media-explorer__content__right__header__left .media-explorer__content__right__header__select-all.active {
    background-color: var(--primary-color);

    span {
        color: white;
    }
}

.media-explorer__content__right__subheader {
    display: flex;
    align-items: center;
    gap: .5rem;
    padding: 0 1rem;
    padding-left: 2.5rem;
    border-bottom: var(--border-block);
    height: 54px;
    line-height: 54px;
    background-color: var(--primary-soft);
}

.media-explorer__content__right__header__left h2 {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.2rem;
    font-weight: 600;
    width: auto;
}

.media-explorer__content__right__header__right {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.media-explorer__content__right__body {
    display: flex;
    flex-direction: column;
    padding-top: .25em;
}

.media-explorer__content__right__body__item {
    margin: 0.25em .5em;
}
</style>