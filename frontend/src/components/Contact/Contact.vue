<script setup lang="ts">
import {
    PhoneFilled,
    MailFilled
} from '@ant-design/icons-vue';

    const props = defineProps<{
        type: 'PHONE' | 'EMAIL' | string,
        data: string,
    }>()
</script>

<template>
    <template v-if="props.type === 'PHONE'">
        <a type="tel" :href="`tel:${data}`"><PhoneFilled/></a>
    </template>
    <template v-else-if="props.type === 'EMAIL'">
        <a :href="`mailto:${data}`"><MailFilled/></a>
    </template>
</template>