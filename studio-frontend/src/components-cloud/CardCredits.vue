<template>
    <div class="card-credits" :class="{ free: isFreePlan, paid: isPaidPlan }">
        <div class="card-credits__content">
            <div class="card-credits__content__label">
                <img :src="logo" alt="LinTO Studio" class="card-credits__content__label__logo">
                You enjoy LinTO Cloud BETA
            </div>
            <div class="card-credits__content__credits">
                With unlimited access to all features
            </div>
            <div class="card-credits__content__button">
                <Button href="https://linto.ai/" target="_blank" rel="noopener noreferrer" variant="link" size="xs">
                    Learn more
                </Button>
            </div>
        </div>
    </div>
</template>

<script>
import { getEnv } from "@/tools/getEnv"

export default {
    name: "CardCredits",
    data() {
        return {
            isFreePlan: true,
            isPaidPlan: false,
        }
    },
    computed: {
        logo() {
            return `/img/${getEnv("VUE_APP_LOGO")}`
        }
    },
}
</script>

<style lang="scss" scoped>
.card-credits {
    background-color: var(--neutral-10);
    padding: 1em;
    border-top: 1px solid var(--neutral-40);

    &__content__label {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--primary-color);
        display: flex;
        align-items: center;
        gap: 0.5em;
        margin-bottom: 0.5em;

        img {
            width: 1.5em;
            height: 1.5em;
        }
    }

    &__content__credits {
        font-size: 0.8rem;
    }

    &__content__button {
        margin-top: .5em;
        display: flex;
        justify-content: flex-end;
    }
}
</style>
