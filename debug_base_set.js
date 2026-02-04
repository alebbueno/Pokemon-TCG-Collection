const TCGdex = require('@tcgdex/sdk').default;
const tcgdex = new TCGdex('pt');

(async () => {
    try {
        console.log("Searching for 'Base' set...");
        // Check Series first
        const series = await tcgdex.serie.list();
        console.log("Series found:", series.map(s => s.id).join(', '));

        // Find series that might contain Base
        const baseSeries = series.find(s => s.name.includes('Base') || s.id === 'base');
        if (baseSeries) {
            console.log("Base Series:", baseSeries);
            const seriesDetails = await tcgdex.serie.get(baseSeries.id);
            console.log("Series Sets:", seriesDetails.sets.map(s => `${s.id} (${s.name})`));
        }

        // Try getting set 'base1' directly
        try {
            console.log("Fetching base1 with PT");
            const directBase = await tcgdex.set.get('base1');
            console.log("Direct 'base1' fetch:", directBase ? directBase.name : "Not found");
            if (directBase) {
                console.log("Logo:", directBase.logo);
                console.log("Cards length:", directBase.cards ? directBase.cards.length : 0);
            }

            // Try fetching cards separately
            // SDK might use internal fetch, let's try assuming internal structure if possible or use the fetch method
            // Actually, let's try a direct fetch using the underlying method if exposed, or just guessing
            // The SDK has `fetch` method? The previous error `Property 'getSetDetails' does not exist` implied I was using `fetch` inside the class which is fine, but maybe 'cards' is not a valid endpoint for `fetch` public method?
            // Let's try to simulate what I did in the app: tcgdex.fetch('cards', { set: setId })

            try {
                const cards = await tcgdex.fetch('cards', { set: 'base1' });
                console.log("Fetched cards directly length:", cards.length);
            } catch (e) { console.log("Direct fetch 'cards' failed:", e.message); }

        } catch (e) { console.log("'base1' fetch failed", e); }

        // Test English
        try {
            console.log("Fetching base1 with EN");
            const tcgdexEn = new TCGdex('en');
            const baseEn = await tcgdexEn.set.get('base1');
            console.log("EN Base1 Cards length:", baseEn.cards ? baseEn.cards.length : 0);
            console.log("EN Base1 Logo:", baseEn.logo);
        } catch (e) { console.log("EN fetch failed", e); }


        if (baseSet) {
            console.log("Found Base Set:", baseSet);
            console.log("Fetching details for:", baseSet.id);

            const setDetails = await tcgdex.set.get(baseSet.id);
            console.log("Set Details (partial):", {
                id: setDetails.id,
                name: setDetails.name,
                logo: setDetails.logo,
                cardCount: setDetails.cardCount,
                serie: setDetails.serie
            });

            console.log("Card count in details:", setDetails.cards ? setDetails.cards.length : 0);
            if (setDetails.cards && setDetails.cards.length > 0) {
                console.log("First card sample:", setDetails.cards[0]);
            }

            // Check Series details for logo construction
            if (setDetails.serie) {
                const serie = await tcgdex.serie.get(setDetails.serie.id);
                console.log("Series ID:", serie.id);
                console.log("Constructed Logo URL:", `https://assets.tcgdex.net/pt/${serie.id}/${baseSet.id}/logo.png`);
            }

        } else {
            console.log("Base set not found in list.");
        }

    } catch (e) {
        console.error("Error:", e);
    }
})();
