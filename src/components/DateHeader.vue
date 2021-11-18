<template>
    <ion-toolbar color="primary">
        <ion-title> {{ month }} </ion-title>
        
        <ion-title> {{ year }} </ion-title>
    </ion-toolbar>
</template>

<script setup>
    import { computed } from 'vue';

    const months = [ 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre' ];

    const date = new Date();

    const month = computed(() => months[date.getMonth() - 1]);
    const year = computed(() => date.getFullYear());
</script>

<style lang="scss" scoped>
    ion-header + ion-header > ion-toolbar ion-title {
        --ion-color-md-primary-contrast: white;
        --ion-color-primary-contrast: white;

        &:nth-child(2) {
            text-align: right;
        }
    }
</style>