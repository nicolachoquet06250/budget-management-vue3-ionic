<template>
  <ion-app>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-menu-button menu="menu"></ion-menu-button>

        <ion-title> {{ pageTitle }} </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content padding="" id="main">
      Le monde est ton huître.
      <p> 
        Si vous vous perdez, les documents <a href="https://ionicframework.com/docs"> </a> seront votre guide. 
      </p>
    </ion-content>
  </ion-app>
</template>

<script setup>
// @ is an alias to /src
import { useTheme } from '@/hooks';

const { bgPrimary, colorPrimary, bgSecondary, colorSecondary } = useTheme();

const pageTitle = 'Mon budget';

</script>

<style>
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

<style scoped>

  .dark ion-toolbar {
    --ion-color-md-primary: v-bind(bgPrimary[true]);
    --ion-color-primary: v-bind(bgPrimary[true]);

    --ion-color-md-primary-contrast: v-bind(colorPrimary[true]);
    --ion-color-primary-contrast: v-bind(colorPrimary[true]);

    --ion-text-color: v-bind(colorPrimary[true]);
    --ion-text-md-color: v-bind(colorPrimary[true]);

    --ion-background-md-color: v-bind(bgPrimary[true]);
    --ion-background-color: v-bind(bgPrimary[true]);
  }

  .dark ion-content {
    --ion-color-md-primary: v-bind(bgSecondary[true]);
    --ion-color-primary: v-bind(bgSecondary[true]);

    --ion-color-md-primary-contrast: v-bind(colorSecondary[true]);
    --ion-color-primary-contrast: v-bind(colorSecondary[true]);

    --ion-text-color: v-bind(colorSecondary[true]);
    --ion-text-md-color: v-bind(colorSecondary[true]);

    --ion-background-md-color: v-bind(bgSecondary[true]);
    --ion-background-color: v-bind(bgSecondary[true]);
  }

  ion-toolbar {
    --ion-color-md-primary: v-bind(bgPrimary[false]);
    --ion-color-primary: v-bind(bgPrimary[false]);

    --ion-color-md-primary-contrast: v-bind(colorPrimary[false]);
    --ion-color-primary-contrast: v-bind(colorPrimary[false]);

    --ion-text-color: v-bind(colorPrimary[false]);
    --ion-text-md-color: v-bind(colorPrimary[false]);

    --ion-background-md-color: v-bind(bgPrimary[false]);
    --ion-background-color: v-bind(bgPrimary[false]);
  }

  ion-content {
    --ion-color-md-primary: v-bind(bgSecondary[false]);
    --ion-color-primary: v-bind(bgSecondary[false]);

    --ion-color-md-primary-contrast: v-bind(colorSecondary[false]);
    --ion-color-primary-contrast: v-bind(colorSecondary[false]);

    --ion-text-color: v-bind(colorSecondary[false]);
    --ion-text-md-color: v-bind(colorSecondary[false]);

    --ion-background-md-color: v-bind(bgSecondary[false]);
    --ion-background-color: v-bind(bgSecondary[false]);
  }
</style>
