import { ref } from 'vue';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Storage as CapacitorStorage } from '@capacitor/storage';
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
    const { get, set, remove } = CapacitorStorage;

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

    const match = (str, regex) => {
        let m;
        let cmp = 0;
      
        while ((m = regex.exec(str)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
      
            // The result can be accessed through the `m`-variable.
            m.forEach(() => {
                // console.log(`Found match, group ${groupIndex}: ${match}`);
              cmp++;
            });
        }
        
        return cmp > 0;
    };

    const getFieldIdReducer = name => 
        (r, c) => (c === name && r.find === false) || r.find === true 
                ? { cmp: r.cmp, find: true } 
                    : { cmp: r.cmp + 1, find: false };

    const fieldIdReducerBaseObject = { cmp: 0, find: false };

    const getFieldId = field => Object.keys(fields.value).reduce(
        getFieldIdReducer(field), 
        { ...fieldIdReducerBaseObject }
    ).cmp;

    const idAlradyExist = (array, id) => array.reduce((r, c) => c.id === id ? true : r, false);

    return {
        async getDB(_fields) {
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

            database.value.set('fields', Object.keys(_fields));
            database.value.set('types', Object.keys(_fields).map(k => _fields[k]));
        },

        async line(values) {
            const _fields = Object.keys(fields.value);
            let oldValues = [];

            try {
                oldValues = await database.value.get('values') ?? [];
            } catch (e) {
                console.error(e);
            } finally {
                const newValuesArray = _fields.map(k => {
                    if (values[k] !== null && values[k] !== undefined) return values[k];
                    throw new Error(`Le champ ${k} n'est pas renseigné !`);
                });

                const { cmp: fieldId } = _fields.reduce(
                    getFieldIdReducer('id'), 
                    { cmp: 0, find: false }
                );

                const { updated, values: mergedValues } = oldValues.reduce(
                    (r, c) => 
                        c[fieldId] !== newValuesArray[fieldId] 
                            ? { ...r, values: [...r.values, c] } 
                                : { updated: true, values: [...r.values, newValuesArray] }, 
                    { values: [], updated: false }
                );

                if (!updated) {
                    mergedValues.push(newValuesArray);
                }

                database.value.set('values', mergedValues);
            }
        },

        async empty() {
            return (await database.value.get('values')) === null;
        },

        async get(where = {}) {
            const _fields = Object.keys(fields.value);
            const values = await database.value.get('values');

            const getValueReducer = (k, where, fieldId) => 
                (r, value) => 
                    Object.keys(where) === 0 || (where[k] instanceof RegExp && match(String(value[fieldId]), where[k])) || value[fieldId] === where[k] 
                        ? [...r, value] 
                            : r;

            return (
                await Object.keys(where).reduce(async (r, k) => {
                        return values.reduce(
                            getValueReducer(k, where, getFieldId(k)), 
                            [...(await r)]
                        )
                    }, (Object.keys(where).length === 0 ? values : []))
                ).map(r => {
                    return r.reduce((r, c) => 
                        ({
                            cmp: r.cmp + 1, 
                            obj: { 
                                ...r.obj, 
                                [_fields[r.cmp]]: c 
                            }
                        }), 
                        { cmp: 0, obj: {} }
                    ).obj
                }).reduce((r, c) => 
                        idAlradyExist(r, c.id) 
                            ? r : [...r, c], []);
        },

        async remove(where = {}) {
            const _fields = Object.keys(fields.value);
            const values = await database.value.get('values');

            const getValueReducer = (k, where, fieldId) => 
                (r, value) => 
                    Object.keys(where) === 0 || (where[k] instanceof RegExp && match(String(value[fieldId]), where[k])) || value[fieldId] === where[k] 
                        ? r 
                            : [...r, value];

            const newValues = ((await (Object.keys(where)).reduce(async (r, k) => {
                return values.reduce(
                    getValueReducer(k, where, getFieldId(k)), 
                    [...(await r)]
                )
            }, (Object.keys(where).length === 0 ? values : [])))).map(r => 
                    r.reduce((r, c) => 
                        ({
                            cmp: r.cmp + 1, 
                            obj: { 
                                ...r.obj, 
                                [_fields[r.cmp]]: c 
                            }
                        }), 
                        { cmp: 0, obj: {} }
                    ).obj).reduce((r, c) => 
                        idAlradyExist(r, c.id) 
                            ? r : [...r, c], []);
            
            await database.value.set('values', newValues.map(v => Object.keys(v).map(k => v[k])));

            return newValues;
        },

        async metadata(key, value = null) {
            if (['values', 'fields', 'types'].indexOf(key) !== -1) {
                throw new Error(`La clé ${key} est interdite car c'est un mot clé`);
            }

            if (value === null) {
                let v;
                try {
                    v = await database.value.get(key);
                } catch (e) {
                    v = null;
                }
                return v;
            }
            await database.value.set(key, value);
            return value;
        },

        startBy(str) {
            return new RegExp(`^${str}`, 'g');
        },

        greaterThan(num) {
            const exploded = String(num).split('');
            const regex = exploded.map((n, i) => `[${i === exploded.length - 1 ? n + 1 : n}-9]`).join('');
            return new RegExp(`^${regex}+$`, 'gm');
        },

        numberBetween(min, max) {
            return new RegExp(`^([${min + 1}-${max - 2}]|${max - 1})$`, 'gm');
        },

        numberBetweenIncluded(min, max) {
            return new RegExp(`^([${min}-${max - 1}]|${max})$`, 'gm');
        }
    };
};

export const SOLDS_MODEL = {
    id: 'number',
    sold: 'number',
    status: 'boolean',
    description: 'string',
    folded: 'boolean'
};