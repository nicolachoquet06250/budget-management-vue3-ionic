import { computed, ref } from 'vue';

const storage = ref(
    Object.keys(localStorage).reduce(
        (r, k) => ({
            ...r, 
            [k]: {
                value: localStorage.getItem(k),
                handleChange: []
            }
        }), {}
    )
);

const initStorageItem = key => {
    if (!storage.value[key]) {
        storage.value[key] = {
            value: null,
            handleChange: []
        }
    }
};

const setData = (key, value) => {
    initStorageItem(key);

    const oldValue = storage.value[key].value;

    storage.value[key].value = value;

    storage.value[key].handleChange.map(callback => callback(oldValue, value));

    localStorage.setItem(key, value);
};

const setHandleChange = (key, cb) => {
    initStorageItem(key);

    storage.value[key].handleChange.push(cb);
};

const remove = key => {
    const oldValue = storage.value[key].value;

    delete storage.value[key];

    storage.value[key].handleChange.map(callback => callback(oldValue, undefined));

    localStorage.removeItem(key);
};

/**
 * 
 * @param {String} key 
 * @param {any} defaultValue 
 * @param {{ onChange }} options 
 * @returns 
 */
export const useLocalStorage = (key, options) => {
    if (options) {
        if (options.onChange) {
            setHandleChange(key, options.onChange);
        }

        if (options.default && !storage.value[key]) {
            let { default: defaultValue } = options;
            setData(key, defaultValue);
        }
    }

    return {
        data: computed(() => storage.value[key] ? storage.value[key].value : null),

        setData(value) {
            setData(key, value);
        },

        onChange(cb) {
            setHandleChange(key, cb);
        },

        remove() {
            remove(key)
        }
    }
};

export const defaultTestValue = 'toto';