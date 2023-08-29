<template>
    <Suspense>
        <DataView />
        <template #fallback>
            <div>Loading...</div>
        </template>
    </Suspense>
</template>

<script setup lang="ts">
import DataView from './DataView.vue';
</script>

<style lang="scss" scoped>

</style>