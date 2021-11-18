import { ref, computed } from 'vue';
import { useMutationObserver } from '@vueuse/core';

const el = ref(document.querySelector("html"));
const isDark = ref(document.querySelector("html").classList.contains("dark"));

useMutationObserver(el,
    mutations => {
        if (!mutations[0]) return;

        isDark.value = document.querySelector("html").classList.contains("dark");
    }, { attributes: true }
);

export const useDark = () => ({
    isDark: computed(() => isDark.value)
});