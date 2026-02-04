const TCGdex = require('@tcgdex/sdk').default;
const tcgdex = new TCGdex('pt');

(async () => {
    try {
        console.log("Fetching Series list...");
        const seriesList = await tcgdex.serie.list();

        // Check "Scarlet & Violet" (sv) series which spans 2023-2026
        const svSeries = seriesList.find(s => s.id === 'sv');
        if (svSeries) {
            console.log(`\n--- SERIES: ${svSeries.name} ---`);
            // Check first set 'sv01'
            const setId = 'sv01';
            console.log("Fetching details for:", setId);
            const setDetails = await tcgdex.set.get(setId);
            console.log("Set Release Date:", setDetails.releaseDate);
        }

    } catch (e) {
        console.error("Error:", e);
    }
})();
