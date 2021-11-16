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

        <template v-if="montants.length > 0">
          <ion-row v-for="(montant, id) in montants" :key="montant">
            <div :style="{
              color: (montant.status ? 'green' : 'red'),
              display: 'flex', 
              'flex-direction': 'column', 
              'align-items': 'center', 
              'justify-content': 'center', 
              flex: 1, 
              width: 'auto'
            }" >
              {{ montant.sold }} €
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
              <ion-button color="medium" size="small" @click="openModal(id, montant.sold, montant.status)">
                <ion-icon src="https://unpkg.com/ionicons@5.5.2/dist/svg/pencil-outline.svg" 
                          style="color: black;"></ion-icon>
              </ion-button>

              <ion-button color="medium" size="small" @click="delMontant(id)">
                <ion-icon src="https://unpkg.com/ionicons@5.5.2/dist/svg/trash-outline.svg" 
                          style="color: black;"></ion-icon>
              </ion-button>
            </div>
          </ion-row>

          <ion-row style="height: 60px; font-size: 30px;">
            <ion-col style="display: flex; justify-content: center; align-items: center;">
              Total
            </ion-col>
            
            <ion-col style="display: flex; justify-content: center; align-items: center;">
              <strong :style="{color: (total < 0 ? 'red' : 'green')}"> {{ Math.abs(total) }} € </strong>
            </ion-col>
          </ion-row>
        </template>

        <template v-else>
          <ion-row>
            <ion-col>
              <strong> Aucun solde saisis ce mois-ci ! </strong>
            </ion-col>
          </ion-row>
        </template>
      </ion-grid>
    </ion-content>

    <ion-footer>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-item>
              <ion-label position="floating" 
                          :color="isDark ? 'light' : 'dark'"> Montant </ion-label>
              <ion-input inputmode="numeric" :value="montant" @input="montant = $event.target.value ? parseInt($event.target.value) : ''"></ion-input>
            </ion-item>
          </ion-col>

          <ion-col>
            <IonToggle style="display: none;"></IonToggle>

            <Toggle v-model="toggleStatus" value="+" />
          </ion-col>

          <ion-col>
            <ion-button @click="addMontantLocal">
              <ion-icon src="https://unpkg.com/ionicons@5.5.2/dist/svg/add-circle-outline.svg"></ion-icon>
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-footer>
  </ion-app>
</template>

<script setup>
// @ is an alias to /src
import { ref } from 'vue';
import { IonToggle, IonItem, IonInput, IonLabel } from '@ionic/vue';
import Toggle from '@/components/Toggle.vue';
import { useTheme, useModal, useMontants, useToast } from '@/hooks';

const { bgPrimary, colorPrimary, bgSecondary, colorSecondary } = useTheme();
const { openModal } = useModal();
const { montantsList: montants, montantsHeader: header, total, delMontant, addMontant, actualizeMontants } = useMontants();
const { openToast } = useToast();

actualizeMontants();

const pageTitle = 'Mon budget';

const toggleStatus = ref(true);
const montant = ref('');

const addMontantLocal = () => {
  if (!montant.value || montant.value === 0) {
    openToast('Vous devez remplir un montant');
    return;
  }

  addMontant(montant.value, toggleStatus.value);

  montant.value = '';
  toggleStatus.value = true;
};
</script>

<style>
  .toggle {
    --ion-item-md-border-color-rgb:242,84,84; 
    --ion-background-md-color: #f04141;
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
