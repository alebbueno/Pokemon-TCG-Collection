const TCGdex = require('@tcgdex/sdk').default;
const tcgdex = new TCGdex('pt');

(async () => {
    try {
        console.log("Fetching Series list...");
        const seriesList = await tcgdex.serie.list();

        // We want to check the last few series and their sets, matching the screenshot
        // Screenshot shows sets from 2025/2024.

        // Let's filter/find series that might contain these sets.
        // Actually, my code iterates ALL series. Let's just grab the last 3 series.
        const recentSeries = seriesList.slice(-3);

        for (const serieItem of recentSeries) {
            console.log(`\n--- SERIES: ${serieItem.name} (${serieItem.id}) ---`);
            const serieDetails = await tcgdex.serie.get(serieItem.id);

            if (serieDetails.sets) {
                for (const set of serieDetails.sets) {
                    const logoUrl = set.logo || `https://assets.tcgdex.net/pt/${serieItem.id}/${set.id}/logo.png`;
                    console.log(`   Set: ${set.name} (ID: ${set.id})`);
                    console.log(`   Constructed Logo: ${logoUrl}`);

                    // We can verify if this works by printing it, but real validation is via curl/browser.
                    // Let's print the IDs clearly to manually check.
                }
            }
        }

    } catch (e) {
        console.error("Error:", e);
    }
})();
