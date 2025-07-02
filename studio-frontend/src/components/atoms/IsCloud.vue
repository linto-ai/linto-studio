<template>
    <fragment v-if="isCloud"><slot /></fragment>
</template>

<script>
import { Fragment } from 'vue-fragment';
import { getEnv } from '@/tools/getEnv';

const IS_MODE_CLOUD = getEnv("VUE_APP_MODE") === "cloud"

export default {
    name: 'IsCloud',
    components: {
        Fragment
    },
    computed: {
        isCloud() {
            return IS_MODE_CLOUD
        }
    }
}
</script>
