<template>
  <ion-app>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-menu-button menu="menu"></ion-menu-button>

        <ion-title> {{ pageTitle }} </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content padding="">
      <form>
        <ion-list>
          <ion-item>
              <ion-label position="floating" 
                         :color="isDark ? 'light' : 'dark'"> Salaire </ion-label>

              <ion-input inputmode="numeric" :value="salaire" @input="setSalaire($event.target.value ? parseInt($event.target.value) : 0)"></ion-input>
          </ion-item>

          <ion-item>
              <ion-label position="floating" 
                         :color="isDark ? 'light' : 'dark'"> Date d'arrivé du salaire </ion-label>

              <ion-input inputmode="numeric" :value="salaireDayNumber" @input="setSalaireDayNumber($event.target.value ? parseInt($event.target.value) : 1)"></ion-input>
          </ion-item>

          <ion-item>
              <ion-button :style="saveButtonTheme()" @click="saveSettings" size="small">
                  Sauvegarder
              </ion-button>
          </ion-item>
        </ion-list>
      </form>
    </ion-content>
  </ion-app>
</template>

<script setup>
  import { IonList, IonItem, IonLabel, IonInput, IonContent, IonApp, IonHeader, IonToolbar, IonTitle, IonMenuButton, IonButton } from '@ionic/vue';
  import { useTheme, useSettings, useDark } from '@/hooks';

  const { bgPrimary, colorPrimary, bgSecondary, colorSecondary } = useTheme();
  const { salaire, setSalaire, salaireDayNumber, setSalaireDayNumber, saveSettings } = useSettings();
  const { isDark } = useDark();

  const pageTitle = 'Paramètres';

  const darkModeButtonTheme = () => ({
    "--margin-right": "5px",
    "--margin-left": "10px",
    "--color": colorSecondary[isDark.value],
    '--ion-color-md-primary': isDark.value ? '#222428' : '#0000FF',
    '--ion-color-primary': isDark.value ? '#222428' : '#0000FF',
    '--ion-color-md-primary-contrast': 'white',
    '--ion-color-primary-contrast': 'white'
  });

  const saveButtonTheme = () => ({
    'margin-left': '30px',
    ...darkModeButtonTheme()
  });
</script>

<style lang="scss" scoped>
  ion-app {
    .item {
      padding-left: 0;
    }
  }
  .toolbar-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
  }

  ion-title {
    max-width: 100%;
  }
</style>

<style lang="scss" scoped>
  .dark {
    ion {
      &-toolbar {
        --ion-color-md-primary: v-bind(bgPrimary[true]);
        --ion-color-primary: v-bind(bgPrimary[true]);

        --ion-color-md-primary-contrast: v-bind(colorPrimary[true]);
        --ion-color-primary-contrast: v-bind(colorPrimary[true]);

        --ion-text-color: v-bind(colorPrimary[true]);
        --ion-text-md-color: v-bind(colorPrimary[true]);

        --ion-background-md-color: v-bind(bgPrimary[true]);
        --ion-background-color: v-bind(bgPrimary[true]);
      }
      
      &-content {
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
