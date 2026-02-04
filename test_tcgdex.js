const TCGdex = require('@tcgdex/sdk').default;
const tcgdex = new TCGdex('en');

(async () => {
    try {
        console.log("SDK Instance:", !!tcgdex);
        console.log("Fetching specific set swsh3...");
        const set = await tcgdex.set.get('swsh3');
        console.log("Set swsh3 found:", !!set);
        if (set) {
            console.log("Set Name:", set.name);
        }

        console.log("Fetching all sets...");
        const sets = await tcgdex.set.list();
        console.log("Sets count:", sets.length);
    } catch (e) {
        console.error("Error:", e);
    }
})();
