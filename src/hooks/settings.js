import { reactive, computed } from "vue";
import { useMontants, PLUS } from './montant-list';
import { useStorage } from "./external-device-storage";

const { addMontant } = useMontants();
const storages = {
    salaireCreated: useStorage('salaireCreated'),
    salaire: useStorage('salaire'),
    salaireDayNumber: useStorage('salaireDayNumber')
};

const TRUE = 'true';
const FALSE = 'false';

const settings = reactive({
    salaireCreated: FALSE,
    salaire: 0,
    salaireDayNumber: 1
});

(async () => {
    settings.salaireCreated = await storages.salaireCreated.exist() ? ((await storages.salaireCreated.get()) === TRUE) : FALSE;
    settings.salaire = await storages.salaire.exist() ? parseInt(await storages.salaire.get()) : 0;
    settings.salaireDayNumber = await storages.salaireDayNumber.exist() ? parseInt(await storages.salaireDayNumber.get()) : 1;
})();

const props = Object.keys(settings).reduce((r, c) => ({...r, [c]: computed(() => settings[c])}), {});

const methods = Object.keys(settings).reduce((r, c) => ({
    ...r, 
    [`set${c.substr(0, 1).toUpperCase()}${c.substr(1, c.length)}`]: v => {
        settings[c] = v;
    }
}), {});

export const useSettings = () => ({
    ...props,

    ...methods,
    saveSettings() {
        Object.keys(settings).map(async k => await storages[k].set(settings[k]))
    },

    async createSalaire() {
        const { setSalaireCreated } = methods;

        if (new Date().getDate() <= settings.salaireDayNumber && settings.salaireCreated) {
            setSalaireCreated(FALSE);
            await storages.salaireCreated.set(FALSE);
        }

        if (new Date().getDate() >= settings.salaireDayNumber && !settings.salaireCreated) {
            addMontant(settings.salaire, PLUS);

            setSalaireCreated(TRUE);
            await storages.salaireCreated.set(TRUE);
        }
    }
});