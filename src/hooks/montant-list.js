import { ref, computed } from 'vue';
import { useStorage } from './external-device-storage';

export const PLUS = true;
export const MOINS = false;

const soldsMonth = useStorage('solds-month');
const solds = useStorage('solds');

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

const montantsHeader = ref([
    'Montant',
    'Actions' 
]);

const getSoldsMonth = async () => (await soldsMonth.exist()) ? new Date().getMonth() : parseInt(await soldsMonth.get());

(async () => {
    if (montantsMonth.value === null) {
        montantsMonth.value = await getSoldsMonth();
    }

    if (montantsList.value.length === 0) {
        montantsList.value = !(await solds.exist()) 
            ? [] 
                : [
                    ...(await solds.get())
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
        
        await solds.set([{
            sold: (lastMonthFinalSold < 0 ? Math.abs(lastMonthFinalSold) : lastMonthFinalSold), 
            status: lastMonthFinalSold > 0,
            description: 'Solde restant du mois précédent'
        }]);

        montantsList.value = await solds.get();
        montantsMonth.value = new Date().getMonth();
        
        await soldsMonth.set(montantsMonth.value);
    }
};

const addMontant = async (sold, status, description) => {
    if (await soldsMonth.exist()) {
        await soldsMonth.set(new Date().getMonth())
    }

    await actualizeMontants();

    montantsList.value = [
        ...montantsList.value, 
        { sold, status, description, folded: false }
    ];
    
    await solds.set(montantsList.value);
};

const delMontant = async id => {
    montantsList.value = [
        ...montantsList.value
            .map((_, i) => i)
            .reduce((r, c) => c === id ? r : [...r, montantsList.value[c]], [])
    ];

    await solds.set(montantsList.value);
};

const updateMontant = async (id, sold, status, description, folded) => {
    montantsList.value = [
        ...montantsList.value
        .map((_, i) => i)
        .reduce((r, c) => c === id ? [...r, { sold, status, description, folded }] : [...r, montantsList.value[c]], [])
    ];

    await solds.set(montantsList.value);
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