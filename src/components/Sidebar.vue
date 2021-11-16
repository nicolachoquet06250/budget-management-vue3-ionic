<template>
    <ion-menu side="start" type="overlay" menu-id="menu" content-id="main" ref="sidebar">
        <ion-header>
            <ion-toolbar color="danger" :style="sidebarToolbarTheme()">
                <ion-title> Menu </ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :style="sidebarContentTheme()">
            <ion-list>
                <ion-item>
                    <router-link :to="{ name: 'Budget' }" :style="linkTheme('Budget')"> Mon budget </router-link>
                </ion-item>

                <ion-item>
                    <router-link :to="{ name: 'Settings' }" :style="linkTheme('Settings')"> Paramètres </router-link>
                </ion-item>

                <ion-item>
                    <DarkModeButton :style="darkModeButtonTheme()">
                        <template v-slot:end>
                            {{ isDark ? "Dark mode" : "Light mode" }}
                        </template>
                    </DarkModeButton>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-menu>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from "vue-router";
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem } from '@ionic/vue';
import DarkModeButton from "@/components/DarkModeButton.vue";
import { useMutationObserver } from "@vueuse/core";
import { useTheme } from "@/hooks";

const { bgPrimary, colorPrimary, bgSecondary, colorSecondary } = useTheme();
const $route = useRoute();

const selectedRoute = computed(() => $route.name);

const el = ref(document.querySelector("html"));
const isDark = ref(document.querySelector("html").classList.contains("dark"));

const sidebarToolbarTheme = () => ({
  "--ion-color-md-danger": bgPrimary[isDark.value],
  "--color": colorPrimary[isDark.value],
});

const sidebarContentTheme = () => ({
  "--ion-background-md-color": bgSecondary[isDark.value],
  "--ion-background-color": bgSecondary[isDark.value],
  "--ion-text-md-color": colorSecondary[isDark.value],
  "--ion-text-color": colorSecondary[isDark.value],
});

const darkModeButtonTheme = () => ({
  "--margin-right": "5px",
  "--margin-left": "10px",
  "--color": colorSecondary[isDark.value],
  '--ion-color-md-primary': isDark.value ? '#222428' : '#0000FF',
  '--ion-color-primary': isDark.value ? '#222428' : '#0000FF',
  '--ion-color-md-primary-contrast': 'white',
  '--ion-color-primary-contrast': 'white'
});

const linkTheme = (name) => ({
  color:
    selectedRoute.value === name
      ? (isDark.value ? 'white' : 'gray')
      : colorSecondary[isDark.value],
});

useMutationObserver(
  el,
  (mutations) => {
    const mutation = mutations[0];

    if (!mutation) return;

    isDark.value = document.querySelector("html").classList.contains("dark");
  },
  { attributes: true }
);

</script>