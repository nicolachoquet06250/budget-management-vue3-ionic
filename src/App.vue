<template>
  <ion-app>
    <ion-content>
      <router-view id="main"> </router-view>

      <ion-menu side="start" type="push" menu-id="menu" content-id="main">
        <ion-header>
          <ion-toolbar color="danger" :style="sidebarToolbarTheme()">
            <ion-title> Menu </ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-content :style="sidebarContentTheme()">
          <ion-list>
            <ion-item>
              <router-link :to="{ name: 'Budget' }" :style="linkTheme('Budget')"
                >Mon budget</router-link
              >
            </ion-item>

            <ion-item>
              <router-link :to="{ name: 'Settings' }" :style="linkTheme('Settings')"
                >Paramètres</router-link
              >
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

      <ion-modal :style="modalStyle()" >
        <ion-header>
          <ion-toolbar :style="modalToolbarTheme()">
            <ion-title>
              Ma modal custom
            </ion-title>

            <ion-button color="light" size="small" @click="closeModal" style="margin-right: 10px;">
              <ion-icon
                src="https://unpkg.com/ionicons@5.5.2/dist/svg/close-circle.svg"
                size="medium"
              ></ion-icon>
            </ion-button>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding" style="--padding-end: 15px; --padding-start: 15px;">
          <div style="padding-left: var(--padding-start); padding-right: var(--padding-end)">
            <p>
              coucou modal
            </p>
          </div>
          
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-app>
</template>

<script setup>
import DarkModeButton from "@/components/DarkModeButton.vue";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useMutationObserver } from "@vueuse/core";
import { useTheme, useModal } from "@/hooks";

const { bgPrimary, colorPrimary, bgSecondary, colorSecondary } = useTheme();
const $modal = useModal();

const $route = useRoute();

const selectedRoute = computed(() => $route.name);
const isOpen = computed(() => $modal.isOpen.value);

const el = ref(document.querySelector("html"));
const isDark = ref(document.querySelector("html").classList.contains("dark"));

const sidebarContentTheme = () => ({
  "--ion-background-md-color": bgSecondary[isDark.value],
  "--ion-background-color": bgSecondary[isDark.value],
  "--ion-text-md-color": colorSecondary[isDark.value],
  "--ion-text-color": colorSecondary[isDark.value],
});

const sidebarToolbarTheme = () => ({
  "--ion-color-md-danger": bgPrimary[isDark.value],
  "--color": colorPrimary[isDark.value],
});

const modalToolbarTheme = () => ({
  '--ion-toolbar-md-background-color': bgPrimary[isDark.value],
  '--ion-toolbar-background-color': bgPrimary[isDark.value],
  '--ion-toolbar-text-md-color': colorPrimary[isDark.value],
  '--ion-toolbar-text-color': colorPrimary[isDark.value]
});

const linkTheme = (name) => ({
  color:
    selectedRoute.value === name
      ? colorPrimary[isDark.value]
      : colorSecondary[isDark.value],
});

const darkModeButtonTheme = () => ({
  "--margin-right": "5px",
  "--margin-left": "10px",
  "--color": colorSecondary[isDark.value],
});

const modalStyle = () => ({
  '--height': '100%', 
  display: (!isOpen.value ? 'none' : 'block')
})

useMutationObserver(
  el,
  (mutations) => {
    const mutation = mutations[0];

    if (!mutation) return;

    isDark.value = document.querySelector("html").classList.contains("dark");
  },
  { attributes: true }
);

const closeModal = () => {
  $modal.setOpen(false);
};
</script>

<style lang="scss" scoped>
ion-modal ion-content {
    height: var(--height, 0);
}

.dark {
  ion-toolbar {
    --ion-color-md-primary: v-bind(bgPrimary[true]);
    --ion-color-primary: v-bind(bgPrimary[true]);

    --ion-color-md-primary-contrast: v-bind(colorPrimary[true]);
    --ion-color-primary-contrast: v-bind(colorPrimary[true]);

    --ion-text-color: v-bind(colorPrimary[true]);
    --ion-text-md-color: v-bind(colorPrimary[true]);

    --ion-background-md-color: v-bind(bgPrimary[true]);
    --ion-background-color: v-bind(bgPrimary[true]);
  }

  ion-content {
    --ion-color-md-primary: v-bind(bgSecondary[true]);
    --ion-color-primary: v-bind(bgSecondary[true]);

    --ion-color-md-primary-contrast: v-bind(colorSecondary[true]);
    --ion-color-primary-contrast: v-bind(colorSecondary[true]);

    --ion-text-color: v-bind(colorSecondary[true]);
    --ion-text-md-color: v-bind(colorSecondary[true]);

    --ion-background-md-color: v-bind(bgSecondary[true]);
    --ion-background-color: v-bind(bgSecondary[true]);
  }
}

ion {
  &-toolbar {
    --ion-color-md-primary: v-bind(bgPrimary[false]);
    --ion-color-primary: v-bind(bgPrimary[false]);

    --ion-color-md-primary-contrast: v-bind(colorPrimary[false]);
    --ion-color-primary-contrast: v-bind(colorPrimary[false]);

    --ion-text-color: v-bind(colorPrimary[false]);
    --ion-text-md-color: v-bind(colorPrimary[false]);

    --ion-background-md-color: v-bind(bgPrimary[false]);
    --ion-background-color: v-bind(bgPrimary[false]);
  }

  &-content {
    --ion-color-md-primary: v-bind(bgSecondary[false]);
    --ion-color-primary: v-bind(bgSecondary[false]);

    --ion-color-md-primary-contrast: v-bind(colorSecondary[false]);
    --ion-color-primary-contrast: v-bind(colorSecondary[false]);

    --ion-text-color: v-bind(colorSecondary[false]);
    --ion-text-md-color: v-bind(colorSecondary[false]);

    --ion-background-md-color: v-bind(bgSecondary[false]);
    --ion-background-color: v-bind(bgSecondary[false]);
  }
}
</style>
