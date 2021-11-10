export const useStorage = dbName => {
    return {
        /**
         * @param {Array<{key: String, type: any, contraint?: RegExp}>} schema 
         * @returns 
         */
        schema(schema) {
            this._schema = schema;

            return this;
        },

        /**
         * @param {Array<{key: String, unique: Boolean, primary: Boolean}>} indexes 
         * @returns 
         */
        indexes(indexes) {
            this._indexes = this.indexes ? [...this.indexes, indexes] : indexes;

            return this;
        },

        create(options) {
            if (options.schema) {
                this.schema(options.schema);
            }
    
            if (options.indexes) {
                this.indexes(options.indexes);
            }
    
            var request = indexedDB.open(dbName, 2);
    
            request.onerror = event => {
                // Gestion des erreurs.
            };
    
            request.onupgradeneeded = event => {
                const db = event.target.result;
    
                // Créer un objet de stockage qui contient les informations de nos clients.
                // Nous allons utiliser "ssn" en tant que clé parce qu'il est garanti d'être
                // unique - du moins, c'est ce qu'on en disait au lancement.
                const primaryKey = this._indexes.reduce((r, c) =>  Object.keys(r).length === 0 && c.primary ? { keyPath: c.key } : r, {});

                const objectStore = db.createObjectStore(dbName, primaryKey);
    
                this._indexes.map(i => {
                    objectStore.createIndex(i.key, i.key, { unique: i.unique });
                });
                // Créer un index pour rechercher les clients par leur nom. Nous pourrions
                // avoir des doublons (homonymes), alors on n'utilise pas d'index unique.
                // objectStore.createIndex("name", "name", { unique: false });
    
                // Créer un index pour rechercher les clients par leur adresse courriel. Nous voulons nous
                // assurer que deux clients n'auront pas la même, donc nous utilisons un index unique.
                // objectStore.createIndex("email", "email", { unique: true });
    
                // Utiliser la transaction "oncomplete" pour être sûr que la création de l'objet de stockage
                // est terminée avant d'ajouter des données dedans.
                /*objectStore.transaction.oncomplete = () => {
                    // Stocker les valeurs dans le nouvel objet de stockage.
                    const customerObjectStore = db.transaction(dbName, "readwrite").objectStore(dbName);
    
                    for (var i in customerData) {
                        customerObjectStore.add(customerData[i]);
                    }
                }*/
            };
        }
    };
};