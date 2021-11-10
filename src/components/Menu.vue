<template>
    <nav id="nav">
        <router-link :to="{name: 'Budget'}" :style="linkTheme('Budget')">Mon budget</router-link>
        <router-link :to="{name: 'Settings'}" :style="linkTheme('Settings')">Paramètres</router-link>

        <DarkModeButton style="--margin-right: 5px; --margin-left: 5px; --color: white" @darkChange="handleDarkChange" />
    </nav>
</template>

<script setup>
import { useRoute } from 'vue-router';
import DarkModeButton from './DarkModeButton.vue';
import { useTheme } from '@/hooks';
import { useDark } from '@vueuse/core';

const $route = useRoute();

const selectedRoute = $route.name;

const _isDark = useDark();

const { colorPrimary, colorSecondary } = useTheme();

const linkTheme = name => ({
    color: (selectedRoute === name ? colorPrimary[_isDark.value] : colorSecondary[_isDark.value])
});

const handleDarkChange = ({ detail: { isDark } }) => {
    _isDark.value = isDark;
}
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