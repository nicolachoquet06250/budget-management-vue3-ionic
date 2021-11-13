<template>
  <ion-app>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-menu-button menu="menu"></ion-menu-button>

        <ion-title> {{ pageTitle }} </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content padding="" id="main">
      <ion-grid>
        <ion-row>
          <div v-for="item in header" :key="item" 
               style="display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1">
            <template v-if="typeof item === 'string'"> {{ item }} </template>

            <template v-else>
              <span v-for="subItem in item" :key="subItem">
                {{ subItem }} 
              </span>
            </template>
          </div>
        </ion-row>

        <ion-row v-for="montant in montants" :key="montant">
          <div :style="{
            color: (montant.status ? 'green' : 'red'),
            display: 'flex', 
            'flex-direction': 'column', 
            'align-items': 'center', 
            'justify-content': 'center', 
            flex: 1, 
            width: 'auto'
          }" >
            {{ montant.sold }}
          </div>

          <div :style="{
            display: 'flex', 
            'align-items': 'center', 
            'justify-content': 'space-around', 
            flex: 1, 
            width: '50%',
            'padding-top': '5px',
            'padding-bottom': '5px'
          }">
            <ion-button color="medium" size="small" @click="openModal">
              <ion-icon src="https://unpkg.com/ionicons@5.5.2/dist/svg/pencil-outline.svg" 
                        style="color: black;"></ion-icon>
            </ion-button>

            <ion-button color="medium" size="small">
              <ion-icon src="https://unpkg.com/ionicons@5.5.2/dist/svg/trash-outline.svg" 
                        style="color: black;"></ion-icon>
            </ion-button>
          </div>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-app>
</template>

<script setup>
// @ is an alias to /src
import { ref } from 'vue';
import { useTheme, useModal } from '@/hooks';

const { bgPrimary, colorPrimary, bgSecondary, colorSecondary } = useTheme();
const $modal = useModal();

const pageTitle = 'Mon budget';

const PLUS = true;
const MOINS = false;

const header = [
  [
    'Montant',
    '( en € )'
  ],
  'Actions' 
];

const montants = ref([
  {
    sold: 2500,
    status: PLUS
  },
  {
    sold: 730,
    status: MOINS 
  }
]);

const openModal = () => {
  $modal.setOpen(true);
}
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

  ion-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  } 
</style>

<style lang="scss" scoped>
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
