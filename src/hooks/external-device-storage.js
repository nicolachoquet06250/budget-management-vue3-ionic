import { ref } from 'vue';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { Drivers, Storage as IonicStorage } from '@ionic/storage';
import IonicSecureStorageDriver from '@ionic-enterprise/secure-storage/driver';
// import { SQLite } from '@ionic-enterprise/secure-storage';

export const useDeviceSecretStorage = async path => {
    const { writeFile, deleteFile, readFile, checkPermissions, requestPermissions } = Filesystem;
    const { Documents } = Directory;
    const { UTF8 } = Encoding;

    if ((await checkPermissions()).publicStorage !== "granted") {
        await requestPermissions();
    }

    return {
        async write(data) {
            await writeFile({ path, data, directory: Documents, encoding: UTF8 });
        },

        async delete() {
            await deleteFile({ path, directory: Documents });
        },

        read: async () => await readFile({ path, directory: Documents, encoding: UTF8 }),
    };
};

export const useFilePath = async path => {
    const { writeFile, deleteFile, readFile, checkPermissions, requestPermissions } = Filesystem;

    console.log(`file://${path}`);

    if ((await checkPermissions()).publicStorage !== "granted") {
        await requestPermissions();
    }

    return {
        read: async () => await readFile({ path: `file://${path}` }),
        
        async write(data) {
            await writeFile({ path: `file://${path}`, data })
        },
    
        async delete() {
            await deleteFile({ path: `file://${path}` })
        }
    }
};

export const useStorage = key => {
    const { get, set, remove } = Storage;

    return {
       /**
        * @param {Promise<String|Object|Array>} value 
        */
        async set(value) {
            if (typeof value === "object") {
                value = JSON.stringify(value);
            }

            await set({ key, value });
        },

        /**
         * @returns {Promise<Boolean>}
         */
        exist: async () => (await get({ key })).value !== null,

        /**
         * @returns {Promise<String|Object|Array>}
         */
        async get() {
            let { value } = await get({ key });

            if (value !== null && (value.substr(0, 1) === '{' || value.substr(0, 1) === '[')) {
                value = JSON.parse(value);
            }

            return value;
        },

        async remove() {
            await remove({ key });
        }
    };
};

export const useDataBase = name => {
    const database = ref(null);
    const fields = ref({});

    const getFieldIdReducer = name => 
        (r, c) => (c === name && r.find === false) || r.find === true 
                ? { cmp: r.cmp, find: true } 
                    : { cmp: r.cmp + 1, find: false };

    return {
        async createDb(_fields) {
            console.log(name, _fields);
            fields.value = _fields;
            
            database.value = new IonicStorage({
                name,
                version: 1,
                storeName: name,
                driverOrder: [
                    Drivers.IndexedDB,
                    Drivers.LocalStorage,
                    Drivers.SecureStorage,
                ]
            });

            await database.value.defineDriver(IonicSecureStorageDriver);

            await database.value.create();

            console.log(database.value);

            database.value.set('fields', Object.keys(_fields));
            database.value.set('types', Object.keys(_fields).map(k => _fields[k]));
        },

        async line(values) {
            const _fields = Object.keys(fields.value);

            try {
                let oldValues = await database.value.get('values');

                if (!oldValues) {
                    oldValues = [];
                }

                const newValuesArray = _fields.map(k => {
                    if (values[k] !== null && values[k] !== undefined) return values[k];
                    throw new Error(`Le champ ${k} n'est pas renseigné !`);
                });

                const { cmp: fieldId } = _fields.reduce(
                    getFieldIdReducer('id'), 
                    { cmp: 0, find: false }
                );

                const { updated, values: mergedValues } = oldValues.reduce((r, c) => {
                    if (c[fieldId] !== newValuesArray[fieldId]) {
                        return { ...r, values: [...r.values, c] };
                    }
 
                    return { updated: true, values: [...r.values, newValuesArray] };
                }, { values: [], updated: false });

                if (!updated) {
                    mergedValues.push(newValuesArray);
                }

                database.value.set('values', mergedValues);
            } catch (e) {
                console.error(e);
            }
        },

        async get(where) {
            const _fields = Object.keys(fields.value);
            const values = await database.value.get('values');

            const { cmp: fieldId } = _fields.reduce(
                getFieldIdReducer('id'), 
                { cmp: 0, find: false }
            );
            
            let result = [];
            if ('id' in where) {
                result = values.reduce((r, value) => {
                    if (value[fieldId] === where.id) {
                        return [...r, value];
                    }
                    return r;
                }, []);
                console.log(result);
            }
        }
    };
};