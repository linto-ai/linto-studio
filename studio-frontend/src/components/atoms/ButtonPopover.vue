<template>
    <div class="button-popover">
        <button class="btn" @click="toggle">
            <ph-icon name="Plus" size="md" />
            <span class="label">New transmission</span>
        </button>
        <div class="button-popover__background" :class="{ open: isOpen }" @click="toggle"></div>
        <div class="button-popover__content" :class="{ open: isOpen }">
            <ul>
                <li>
                    <a href="/interface/conversations/create">
                        <ph-icon name="upload" size="md" color="white" />
                        From a file
                    </a>
                </li>
                <li>
                    <a href="/interface/conversations/create">
                        <ph-icon name="Microphone" size="md" />
                        From a microphone
                    </a>
                </li>
                <li>
                    <a href="/interface/conversations/create">
                        <ph-icon name="Presentation" size="md" />
                        From a video conference
                    </a>
                </li>
                <li>
                    <a href="/interface/conversations/create">
                        <ph-icon name="YoutubeLogo" size="md" />
                        From a youtube video
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { Fragment } from "vue-fragment"

export default {
    components: { Fragment },
    data() {
        return {
            isOpen: false,
        }
    },
    methods: {
        toggle() {
            this.isOpen = !this.isOpen
        },
    },
}
</script>

<style scoped>
.button-popover {
    position: relative;
}

.button-popover__background {
    position: fixed;
    top: -100%;
    left: 0;
    width: 100vw;
    height: 100vh;
    transition: background-color 0.3s ease;
}

.button-popover__background.open {
    top: 0;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(1px);
}

.button-popover__content {
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 100;
    background-color: var(--primary-color);
    background-color: white;
    display: none;
    border-radius: 4px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    border: 2px solid var(--primary-color);
}

.button-popover__content.open {
    display: block;
}

.button-popover__content ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.button-popover__content ul li {
    border-bottom: 1px solid #ccc;
    padding: 0;
    margin: 0;
}

.button-popover__content ul li a {
    transition: background-color 0.3s ease;
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
        background-color: var(--primary-color);
        color: white;
    }
}

.button-popover__content ul li:last-child {
    border-bottom: none;
}
</style>