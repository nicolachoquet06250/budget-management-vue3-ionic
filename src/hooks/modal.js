import { computed, reactive } from 'vue';
import { PLUS } from './montant-list';

const updateSoldModal = reactive({
    opened: false,
    sold: 0,
    status: PLUS,
    description: '',
    id: null
});

const setOpen = v => {
    updateSoldModal.opened = v;
};

const setSold = v => {
    updateSoldModal.sold = v;
};

const setStatus = v => {
    updateSoldModal.status = v;
};

const setDescription = v => {
    updateSoldModal.description = v;
};

const setId = v => {
    updateSoldModal.id = v;
};

export const useModal = () => ({
    ...Object.keys(updateSoldModal).reduce((r, c) => ({...r, [c]: computed(() => updateSoldModal[c])}), {}),
    
    setOpen,
    setSold,
    setStatus,
    setDescription,
    setId,

    openModal(id, sold, status, description) {
        setSold(sold);
        setStatus(status);
        setId(id);
        setDescription(description);
        setOpen(true);
    },

    closeModal() {
        setOpen(false);
    }
});