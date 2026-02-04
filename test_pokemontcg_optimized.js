const https = require('https');

const API_KEY = process.env.POKEMON_TCG_KEY || '259d3834-80b2-486b-8ccc-e6f349031943';
const url = `https://api.pokemontcg.io/v2/sets?orderBy=-releaseDate&page=1&pageSize=5&select=id,name,series,releaseDate,images,printedTotal`;

console.log("Testing URL:", url);

const options = {
    headers: {
        'X-Api-Key': API_KEY
    }
};

https.get(url, options, (res) => {
    console.log('StatusCode:', res.statusCode);

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Response Body Length:', data.length);
        if (res.statusCode === 200) {
            try {
                const json = JSON.parse(data);
                console.log('Sets found:', json.data.length);
                console.log('First set:', json.data[0].name);
            } catch (e) {
                console.error("JSON Parse Error");
            }
        } else {
            console.log("Error Body:", data);
        }
    });

}).on('error', (e) => {
    console.error("Network Error:", e);
});
