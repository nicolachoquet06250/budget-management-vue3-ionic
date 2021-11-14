import { ref, computed } from 'vue';

export const PLUS = true;
export const MOINS = false;

const montantsList = ref([
    {
      sold: 2500,
      status: PLUS
    },
    {
      sold: 730,
      status: MOINS 
    }
]);

const montantsHeader = ref([
    [
      'Montant',
      '( en € )'
    ],
    'Actions' 
]);

export const useMontants = () => {
    return {
        montantsHeader: computed(() => montantsHeader.value),
        montantsList: computed(() => montantsList.value),

        addMontant(sold, status) {
            montantsList.value = [...montantsList.value, { sold, status }]
        },
        delMontant(id) {
            montantsList.value = [
                ...montantsList.value
                    .map((_, i) => i)
                    .reduce((r, c) => c === id ? r : [...r, montantsList.value[c]], [])
            ]
        },
        updateMontant(id, sold, status) {
            montantsList.value = [
                ...montantsList.value
                    .map((_, i) => i)
                    .reduce((r, c) => c === id ? r : [...r, { sold, status }], [])
            ]
        }
    };
};