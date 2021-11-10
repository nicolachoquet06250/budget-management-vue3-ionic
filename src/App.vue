<template>
  <ion-app>
    <ion-content>
      <router-view id="main"> </router-view>

      <ion-menu side="start" type="push" menu-id="menu" content-id="main">
        <ion-header>
          <ion-toolbar color="danger" :style="sidebarToolbarTheme()">
            <ion-title>
              End Menu
            </ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-content :style="sidebarContentTheme()">
          <ion-list>
            <ion-item>
              <router-link :to="{name: 'Budget'}" :style="linkTheme('Budget')">Mon budget</router-link>
            </ion-item>

            <ion-item>
              <router-link :to="{name: 'Settings'}" :style="linkTheme('Settings')">Paramètres</router-link>
            </ion-item>

            <ion-item>
              <DarkModeButton :style="darkModeButtonTheme()">
                <template v-slot:end> {{ isDark ? 'Dark mode' : 'Light mode' }} </template>
              </DarkModeButton>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-menu>
    </ion-content>
  </ion-app>
</template>

<script setup>
  import DarkModeButton from '@/components/DarkModeButton.vue';
  import { ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useMutationObserver } from '@vueuse/core';
  import { useTheme } from '@/hooks';

  const { bgPrimary, colorPrimary, bgSecondary, colorSecondary } = useTheme();

  const $route = useRoute();

  const selectedRoute = computed(() => $route.name);

  const el = ref(document.querySelector('html'));
  const isDark = ref(document.querySelector('html').classList.contains('dark'));

  const sidebarContentTheme = () => ({
    '--ion-background-md-color': bgSecondary[isDark.value],
    '--ion-background-color': bgSecondary[isDark.value],
    '--ion-text-md-color': colorSecondary[isDark.value],
    '--ion-text-color': colorSecondary[isDark.value]
  });

  const sidebarToolbarTheme = () => ({
    '--ion-color-md-danger': bgPrimary[isDark.value],
    '--color': colorPrimary[isDark.value]
  });

  const linkTheme = name => ({
      color: (selectedRoute.value === name ? colorPrimary[isDark.value] : colorSecondary[isDark.value])
  });

  const darkModeButtonTheme = () => ({
    '--margin-right': '5px', 
    '--margin-left': '10px', 
    '--color': colorSecondary[isDark.value]
  })

  useMutationObserver(el, mutations => {
    const mutation = mutations[0];

    if (!mutation) return;

    isDark.value = document.querySelector('html').classList.contains('dark');
  }, { attributes: true });
</script>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
