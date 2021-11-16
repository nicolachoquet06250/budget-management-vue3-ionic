import { ref, computed } from 'vue';

export const PLUS = true;
export const MOINS = false;

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

const montantsMonth = ref(localStorage.getItem('solds-month') === null ? new Date().getMonth() : parseInt(localStorage.getItem('solds-month')));
const montantsList = ref(localStorage.getItem('solds') === null ? [] : JSON.parse(localStorage.getItem('solds')));

const montantsHeader = ref([
    'Montant',
    'Actions' 
]);

const actualizeMontants = () => {
    if (new Date().getMonth() !== montantsMonth.value) {
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
        
        localStorage.setItem('solds', JSON.stringify([
            {
                sold: (lastMonthFinalSold < 0 ? Math.abs(lastMonthFinalSold) : lastMonthFinalSold), 
                status: lastMonthFinalSold > 0
            }
        ]));

        montantsList.value = JSON.parse(localStorage.getItem('solds'));
        montantsMonth.value = new Date().getMonth();
        localStorage.setItem('solds-month', montantsMonth.value);
    }
};
const addMontant = (sold, status) => {
    if (localStorage.getItem('solds-month') === null) {
        localStorage.setItem('solds-month', new Date().getMonth());
    }

    actualizeMontants();

    localStorage.setItem(
        'solds', 
        JSON.stringify(
            [
                ...montantsList.value, 
                { sold, status }
            ]
        )
    );
    montantsList.value = JSON.parse(localStorage.getItem('solds'));
};
const delMontant = id => {
    console.log(id);
    montantsList.value = [
        ...montantsList.value
            .map((_, i) => i)
            .reduce((r, c) => c === id ? r : [...r, montantsList.value[c]], [])
    ]
    localStorage.setItem('solds', JSON.stringify(montantsList.value));
};
const updateMontant = (id, sold, status) => {
    montantsList.value = [
        ...montantsList.value
        .map((_, i) => i)
        .reduce((r, c) => c === id ? [...r, { sold, status }] : [...r, montantsList.value[c]], [])
    ]
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