const request = require('request-promise');

const lvr = [
    80.02,
    81.02,
    82.02,
    83.02,
    84.02,
    85.02,
    86.02,
    87.02,
    88.02,
    89.02,
    90.02,
    91.02,
    92.02,
    93.02,
    94.02
];

const ranges = [
    300000,
    500000,
    750000,
    1000000
];


const main = async () => {
    const table = {};
    for (i = 0; i < ranges.length; i++) {
        const range = ranges[i];
        const rates = {};
        for (j = 0; j< lvr.length; j++) {
            const l = lvr[j];
            const s = range - Math.round(l / 100 * range - 100);
            const base = 'https://www.homehero.com.au/calc/costs?bank=WBC&state=NSW&propertyUse=LIVE_IN&propertyType=VACANT_LAND&firstHomeBuyer=true';
            const variable = `&propertyValue=${range}&deposit=${s}`;
            const uri = base + variable;

            const response = await request({ uri, json: true });
            const { lmiRate, lvrUsed } = response.data.lmiDetail
            console.log(range, lmiRate, lvrUsed);
            rates[lvrUsed] = lmiRate;
        }
        
        table[range] = rates;
    }

    console.log(table);
};

main();