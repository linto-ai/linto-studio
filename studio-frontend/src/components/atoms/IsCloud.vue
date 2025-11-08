<template>
    <template v-if="isCloud"><slot /></template>
</template>

<script>
import { getEnv } from '@/tools/getEnv';

const IS_MODE_CLOUD = getEnv("VUE_APP_MODE") === "cloud"

export default {
    name: 'IsCloud',
    computed: {
        isCloud() {
            return IS_MODE_CLOUD
        }
    }
}
</script>
