<template>
    <button @click="toggleDark" color="white">
        <slot name="start"></slot>

        <ion-icon :name="darkModeIcon" :style="buttonTheme"></ion-icon>
        
        <slot name="end"></slot>
    </button>
</template>

<script setup>
import { reactive, computed, watch, getCurrentInstance, defineEmits } from 'vue';
import { useDark, useToggle } from '@vueuse/core';

defineEmits([ 'darkChange' ]);

const { emit } = getCurrentInstance();
const isDark = useDark();
const toggleDark = useToggle(isDark);

const buttonTheme = reactive({
    color: 'var(--color, black)'
});

const darkModeIcon = computed(() => isDark.value ? 'moon' : 'sunny');

watch(isDark, () => {
    emit('darkChange', {
        detail: {
            isDark: isDark.value
        }
    })
});
</script>

<style lang="scss">
    button {
        scale: 1.5;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        background: none;
        margin-right: var(--margin-right, 0);
        margin-left: var(--margin-left, 0);
        color: var(--color, black);

        ion-icon {
            margin-right: var(--margin-right, 0);
            margin-left: var(--margin-left, 0);
        }
    }
</style>