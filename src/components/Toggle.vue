<template>
    <div :class="{
        'toggle': true, 
        'toggle-md': true, 
        [`toggle-${props.color}`]: true, 
        [`toggle-md-${props.color}`]: true, 
        'hydrated': true, 
        'ion-color': true, 'ion-color-success': true, 'md': true, 'in-item': true, 'toggle-checked': true, 'interactive': true, 'hydrated': true,
        'toggle-checked': props.modelValue,
        'toggle-disabled': props.disabled
    }">
        <input type="hidden" :value="value">

        <ion-gesture tabindex="-1" class="hydrated" @click="handleChange">
            <div class="toggle-icon">
                <div class="toggle-inner"></div>
            </div>
            
            <div class="toggle-cover"></div>
        </ion-gesture>
    </div>
</template>

<script setup>
    import { defineProps, defineEmits, getCurrentInstance } from 'vue';

    const { emit } = getCurrentInstance();

    const props = defineProps({ 
        modelValue: Boolean,

        color: {
            type: String,
            default: 'success',
            validator (val) {
                return [
                    'primary', 'secondary', 
                    'tertiary', 'success', 
                    'warning', 'danger', 
                    'light', 'dark'
                ].includes(val)
            }
        },

        disabled: {
            type: Boolean,
            default: false
        },

        value: {
            type: String,
            default: 'on'
        }
    });

    defineEmits(['update:modelValue']);

    const handleChange = () => {
        emit('update:modelValue', !props.modelValue);
    }
</script>
