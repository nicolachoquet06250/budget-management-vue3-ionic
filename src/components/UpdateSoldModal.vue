<template>
    <ion-modal :style="modalStyle()" >
        <ion-header>
            <ion-toolbar :style="modalToolbarTheme()">
                <ion-title> Modifier un montant </ion-title>

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
                            
                            <ion-input inputmode="numeric" :value="montant" 
                                       @input="montant = $event.target.value ? parseInt($event.target.value) : ''"></ion-input>
                        </ion-item>

                        <ion-item>
                            <ion-label> {{ toggleStatus ? 'Positif' : 'Négatif' }} </ion-label>

                            <IonToggle style="display: none;"></IonToggle>

                            <Toggle v-model="toggleStatus" value="+" />
                        </ion-item>

                        <ion-item>
                            <ion-label position="floating"
                                       :color="isDark ? 'light' : 'dark'">Description</ion-label>

                            <ion-textarea :auto-grow="true" inputmode="text" :autofocus="true" ref="textarea"
                                          :value="description" 
                                          @input="description = $event.target.value ? $event.target.value : ''"></ion-textarea>
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
import Toggle from '@/components/Toggle.vue';
import { ref, watch } from 'vue';
import { useModal, useMontants, useToast, useTheme, useDark, useDataBase, SOLDS_MODEL } from '@/hooks';

const { bgPrimary, colorPrimary, colorSecondary } = useTheme();
const { updateMontant } = useMontants();
const { openToast } = useToast();
const { opened, id, status, sold, description: desc, closeModal } = useModal();
const { isDark } = useDark();
const { get, getDB } = useDataBase('solds');

getDB(SOLDS_MODEL);

const textarea = ref(null);
const sended = ref(false);

const toggleStatus = ref(status.value);
const montant = ref(sold.value);
const description = ref(desc.value);

watch(opened, () => {
    description.value = desc.value;
    toggleStatus.value = status.value;
    montant.value = sold.value;

    if (opened.value) {
        sended.value = false;

        if (description.value) {
            textarea.value.parentElement.parentElement.parentElement.classList.add('item-input-has-value');
        } else {
            textarea.value.parentElement.parentElement.parentElement.classList.remove('item-input-has-value');
        }
    }
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

const modalToolbarTheme = () => ({
  '--ion-toolbar-md-background-color': bgPrimary[isDark.value],
  '--ion-toolbar-background-color': bgPrimary[isDark.value],
  '--ion-toolbar-text-md-color': colorPrimary[isDark.value],
  '--ion-toolbar-text-color': colorPrimary[isDark.value]
});

const modalStyle = () => ({
  '--height': '100%', 
  display: (!opened.value ? 'none' : 'block')
});

const sendSold = async () => {
  if (!montant.value || montant.value === 0) {
    openToast('Vous devez remplir un montant');
    return;
  }

  const [{ folded }] = await get({ id: id.value });

  if (!sended.value) {
    updateMontant(id.value, montant.value, toggleStatus.value, description.value, folded);
    sended.value = true;
    closeModal();
  }
};
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