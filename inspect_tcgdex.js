const TCGdex = require('@tcgdex/sdk').default;
const tcgdex = new TCGdex('pt');

(async () => {
    try {
        console.log("Fetching SERIES list...");
        const seriesList = await tcgdex.serie.list();
        const lastSerie = seriesList[seriesList.length - 1]; // Most recent series?
        // const specificSerie = await tcgdex.serie.get('sv'); // Scarlet & Violet

        console.log("Series List Item Keys:", Object.keys(lastSerie));
        console.log("Last Series ID:", lastSerie.id);
        console.log("Last Series Name:", lastSerie.name);

        console.log("Fetching details for Series:", lastSerie.id);
        const serieDetails = await tcgdex.serie.get(lastSerie.id);
        console.log("Serie Details Keys:", Object.keys(serieDetails));

        if (serieDetails.sets && serieDetails.sets.length > 0) {
            const firstSetInSerie = serieDetails.sets[0];
            console.log("Set in Serie Keys:", Object.keys(firstSetInSerie));
            console.log("Set in Serie Logo:", firstSetInSerie.logo);
        }
        console.log("Fetching sets in PT...");
        const sets = await tcgdex.set.list();
        const lastSet = sets[sets.length - 1];
        console.log("List Item Keys:", Object.keys(lastSet));
        console.log("Last Set ID:", lastSet.id);
        console.log("Last Set Logo (prop):", lastSet.logo);
        // lastSet from .list() seems to NOT have series info directly?

        console.log("Fetching details for set:", lastSet.id);
        const setDetails = await tcgdex.set.get(lastSet.id);

        if (setDetails.cards && setDetails.cards.length > 0) {
            const firstCard = setDetails.cards[0];
            console.log("First Card Keys:", Object.keys(firstCard));
            console.log("First Card Name:", firstCard.name);
            console.log("First Card Image:", firstCard.image);
            console.log("First Card ID:", firstCard.id);
            console.log("First Card LocalID:", firstCard.localId);
            console.log("Image URL:", firstCard.image);
        } else {
            console.log("No cards found in set.");
        }

    } catch (e) {
        console.error("Error:", e);
    }
})();
