import { computed, ref, reactive } from 'vue';
import { PLUS } from './montant-list';

const isCreateSoldModalOpen = ref(false);

const updateSoldModal = reactive({
    opened: false,
    sold: 0,
    status: PLUS,
    id: null
});

export const useCreateSoldModal = () => {
    return {
        isOpen: computed(() => isCreateSoldModalOpen.value),
        
        setOpen(v) {
            isCreateSoldModalOpen.value = v;
        }
    }
}

export const useUpdateSoldModal = () => {
    return {
        isOpen: computed(() => updateSoldModal.opened),
        sold: computed(() => updateSoldModal.sold),
        status: computed(() => updateSoldModal.status),
        id: computed(() => updateSoldModal.id),
        
        setOpen(v) {
            updateSoldModal.opened = v;
        },

        setSold(sold) {
            updateSoldModal.sold = sold;
        },

        setStatus(status) {
            updateSoldModal.status = status;
        },

        setId(id) {
            updateSoldModal.id = id;
        }
    };
};