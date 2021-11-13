import { computed, ref } from 'vue';

const isOpen = ref(false);

export const useModal = () => {
    return {
        isOpen: computed(() => isOpen.value),
        
        setOpen(v) {
            isOpen.value = v;
        }
    }
}