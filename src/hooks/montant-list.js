import { ref, computed } from 'vue';
import { useStorage, useDataBase, SOLDS_MODEL } from './external-device-storage';

export const PLUS = true;
export const MOINS = false;

const soldsMonth = useStorage('solds-month');
const { getDB, line, empty, get, remove, metadata } = useDataBase('solds');

/*
[
    {
      sold: 2500,
      status: PLUS
    },
    {
      sold: 730,
      status: MOINS 
    }
]
*/

const montantsMonth = ref(null);
const montantsList = ref([]);

const montantsHeader = ref([ 'Montant', 'Actions' ]);

const getSoldsMonth = async () => (await metadata('solds-month') === null) 
    ? new Date().getMonth() 
        : parseInt(await metadata('solds-month'));

(async () => {
    await getDB(SOLDS_MODEL);

    if (montantsMonth.value === null) {
        montantsMonth.value = await getSoldsMonth();
    }

    if (montantsList.value.length === 0) {
        montantsList.value = (await empty()) 
            ? [] 
                : [
                    ...(await get())
                        .map(s => {
                            if ('folded' in s) return s;
                            return { ...s, folded: false };
                        }
                    )
                ];
    }
})();

const actualizeMontants = async () => {
    if (new Date().getMonth() !== await getSoldsMonth()) {
        const { total: lastMonthFinalSold } = montantsList.value.reduce((r, c) => {
            if (r.cmp === 0) {
                return { 
                    cmp: (r.cmp + 1), 
                    total: c.sold 
                };
            }
            
            return { 
                cmp: (r.cmp + 1), 
                total: (c.status ? r.total + c.sold : r.total - c.sold)
            };
        }, {cmp: 0, total: 0});
        
        await line([{
            sold: (lastMonthFinalSold < 0 ? Math.abs(lastMonthFinalSold) : lastMonthFinalSold), 
            status: lastMonthFinalSold > 0,
            description: 'Solde restant du mois précédent'
        }]);

        montantsList.value = await get();
        montantsMonth.value = new Date().getMonth();
    }
        
    await metadata('solds-month', montantsMonth.value);
};

const addMontant = async (sold, status, description) => {
    if (await soldsMonth.exist()) {
        await soldsMonth.set(new Date().getMonth())
    }

    await actualizeMontants();

    const lastLine = montantsList.value[montantsList.value.length - 1];

    const id = (lastLine?.id ?? -1) + 1;

    const newObject = { id, sold, status, description, folded: false };

    montantsList.value = [
        ...montantsList.value, 
        newObject
    ];
    await line(newObject);
};

const delMontant = async id => {
    montantsList.value = [
        ...montantsList.value
            .reduce((r, c) => c.id === id ? r : [...r, c], [])
    ];

    await remove({ id });
};

const updateMontant = async (id, sold, status, description, folded) => {
    montantsList.value = [
        ...montantsList.value
            .map((_, i) => i)
            .reduce((r, c) => c === id ? [...r, { id, sold, status, description, folded }] : [...r, montantsList.value[c]], [])
    ];

    await line({ id, sold, status, description, folded });
};

export const useMontants = () => ({
    montantsHeader: computed(() => montantsHeader.value),
    montantsList: computed(() => montantsList.value),
    total: computed(() => montantsList.value.reduce((r, c) => {
        if (r.cmp === 0) {
            return { 
                cmp: (r.cmp + 1), 
                total: c.sold 
            };
        }
        
        return { 
            cmp: (r.cmp + 1), 
            total: (c.status ? r.total + c.sold : r.total - c.sold)
        };
    }, {cmp: 0, total: 0}).total),

    addMontant,
    delMontant,
    updateMontant,
    actualizeMontants
});