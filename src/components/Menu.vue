<template>
    <nav id="nav">
        <router-link :to="{name: 'Budget'}" :style="linkTheme('Budget')">Mon budget</router-link>
        <router-link :to="{name: 'Settings'}" :style="linkTheme('Settings')">Paramètres</router-link>

        <DarkModeButton style="--margin-right: 5px; --margin-left: 5px; --color: white" />
    </nav>
</template>

<script setup>
import DarkModeButton from './DarkModeButton.vue';
import { useRoute } from 'vue-router';
import { useTheme, useDark } from '@/hooks';

const $route = useRoute();
const { isDark } = useDark();

const selectedRoute = $route.name;

const { colorPrimary, colorSecondary } = useTheme();

const linkTheme = name => ({
    color: (selectedRoute === name ? colorPrimary[isDark.value] : colorSecondary[isDark.value])
});
</script>

<style lang="scss">
    #nav {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;

        a {
            margin: 5px;
        }
    }
</style>