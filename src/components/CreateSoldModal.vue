<template>
    <ion-modal :style="modalStyle()" >
        <ion-header>
            <ion-toolbar :style="modalToolbarTheme()">
                <ion-title> Ajouter un montant </ion-title>

                <ion-button :color="isDark ? 'dark' : 'light'" size="small" 
                            @click="closeModal" style="margin-right: 10px;">
                    <ion-icon
                        src="https://unpkg.com/ionicons@5.5.2/dist/svg/close-circle.svg"
                        size="medium"
                    ></ion-icon>
                </ion-button>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding" style="--padding-end: 15px; --padding-start: 15px;">
            <div style="padding-left: var(--padding-start); padding-right: var(--padding-end)">
                <form>
                    <ion-list>
                        <ion-item>
                        <ion-label position="floating" 
                                    :color="isDark ? 'light' : 'dark'"> Montant </ion-label>
                          <ion-input inputmode="numeric" :value="montant" @input="montant = $event.target.value ? parseInt($event.target.value) : ''"></ion-input>
                        </ion-item>

                        <ion-item>
                          <ion-label> {{ toggleStatus ? 'Positif' : 'Négatif' }} </ion-label>

                          <IonToggle style="display: none;"></IonToggle>

                          <Toggle v-model="toggleStatus" value="+" />
                        </ion-item>

                        <ion-item>
                          <ion-button :style="{
                              'margin-left': '20px',
                              ...darkModeButtonTheme()
                          }" @click="sendSold">
                              envoyer
                          </ion-button>
                        </ion-item>
                    </ion-list>
                </form>
            </div>
        </ion-content>
    </ion-modal>
</template>

<script setup>
import { ref, computed } from 'vue';
import { IonLabel, IonList, IonItem, IonButton, IonInput, IonToggle } from '@ionic/vue';
import Toggle from '@/components/Toggle.vue';
import { useTheme, useCreateSoldModal, useToast, useMontants } from "@/hooks";
import { useMutationObserver } from "@vueuse/core";

const { bgPrimary, colorPrimary, colorSecondary } = useTheme();
const $modal = useCreateSoldModal();
const { openToast } = useToast();
const { addMontant } = useMontants();

const el = ref(document.querySelector("html"));
const isDark = ref(document.querySelector("html").classList.contains("dark"));

const isOpen = computed(() => $modal.isOpen.value);

const toggleStatus = ref(true);
const montant = ref(0);

const darkModeButtonTheme = () => ({
  "--margin-right": "5px",
  "--margin-left": "10px",
  "--color": colorSecondary[isDark.value],
  '--ion-color-md-primary': isDark.value ? '#222428' : '#0000FF',
  '--ion-color-primary': isDark.value ? '#222428' : '#0000FF',
  '--ion-color-md-primary-contrast': 'white',
  '--ion-color-primary-contrast': 'white'
});

const modalToolbarTheme = () => ({
  '--ion-toolbar-md-background-color': bgPrimary[isDark.value],
  '--ion-toolbar-background-color': bgPrimary[isDark.value],
  '--ion-toolbar-text-md-color': colorPrimary[isDark.value],
  '--ion-toolbar-text-color': colorPrimary[isDark.value]
});

const modalStyle = () => ({
  '--height': '100%', 
  display: (!isOpen.value ? 'none' : 'block')
});

const closeModal = () => {
  $modal.setOpen(false);
};

const sendSold = () => {
  if (!montant.value || montant.value === 0) {
    openToast('Vous devez remplir un montant');
    return;
  }

  addMontant(montant.value, toggleStatus.value);

  montant.value = 0;
  toggleStatus.value = true;

  closeModal();
};

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

<style lang="scss" scoped>
.toggle {
  --ion-item-md-border-color-rgb:242,84,84; 
  --ion-background-md-color: #f04141;
}

ion-modal ion-content {
    height: var(--height, 0);
}
</style>