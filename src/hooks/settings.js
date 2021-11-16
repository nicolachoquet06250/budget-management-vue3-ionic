import { reactive, computed } from "vue";
import { useMontants, PLUS } from './montant-list';

const { addMontant } = useMontants();

const TRUE = 'true';
const FALSE = 'false';

const settings = reactive({
    salaireCreated: (localStorage.getItem('salaireCreated') === null ? FALSE : (localStorage.getItem('salaireCreated') === 'true')),
    salaire: (localStorage.getItem('salaire') === null ? 0 : parseInt(localStorage.getItem('salaire'))),
    salaireDayNumber: (localStorage.getItem('salaireDayNumber') === null ? 1 : parseInt(localStorage.getItem('salaireDayNumber')))
});

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
        Object.keys(settings).map(k => localStorage.setItem(k, settings[k]))
    },

    createSalaire() {
        const { setSalaireCreated } = methods;

        if (new Date().getDate() <= settings.salaireDayNumber && settings.salaireCreated) {
            setSalaireCreated(FALSE);
            localStorage.setItem('salaireCreated', FALSE);
        }

        if (new Date().getDate() >= settings.salaireDayNumber && !settings.salaireCreated) {
            addMontant(settings.salaire, PLUS);

            setSalaireCreated(TRUE);
            localStorage.setItem('salaireCreated', TRUE);
        }
    }
});