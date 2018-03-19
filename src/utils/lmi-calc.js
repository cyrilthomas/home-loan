
const TRANSFER_FEE = 0;
const GOVERNMENT_FEE = 0;

export default (config, propertyPrice, savings, stampDuty = 30000) => {    
    const { LVR_RANGES, PRICE_RANGES, LMI_RANGES } = config;
    // Find property and LMI_RANGES range
    let lmiBracket;
    let found = false;
    const grossPropertyPrice = parseInt(propertyPrice) + parseInt(stampDuty) + TRANSFER_FEE + GOVERNMENT_FEE;
    
    for (let i = 0; i < PRICE_RANGES.length; i++) {
        const [min, max] = PRICE_RANGES[i];
        
        if (grossPropertyPrice >= min && grossPropertyPrice <= max) {        
            lmiBracket = LMI_RANGES[i];
            found = true;
            break;
        }
    }

    if (!found) throw new RangeError('Invalid range');

    lmiBracket = lmiBracket || [];
    const depositAmount = parseInt(savings);
    const depositPercent = Math.round((depositAmount / grossPropertyPrice) * 100);    
    const loanRatio = Math.round((1 - (depositAmount / grossPropertyPrice)) * 100); // equivalent of loan amount / gross property

    let lmiPercent;
    for (let j = 0; j < LVR_RANGES.length; j++) {
        const [min, max] = LVR_RANGES[j];
        if (loanRatio >= min && loanRatio <= max) {
            lmiPercent = lmiBracket[j];          
            break;
        }
    }
    
    lmiPercent = lmiPercent || 0;    
    const loanAmount = (grossPropertyPrice - depositAmount);
    const lmiAmount = (loanAmount * (lmiPercent / 100));
    const loanWithLmi = loanAmount + lmiAmount;
    // const lvrPercent = Math.round((1 - (depositAmount / loanWithLmi)) * 100);
    const lvrPercent = Math.round((loanWithLmi / grossPropertyPrice) * 100);

    return {
        transferFee: TRANSFER_FEE,
        governmentFee: GOVERNMENT_FEE,
        depositAmount: savings,
        propertyPrice,
        depositPercent,
        loanRatio, 
        lmiPercent,
        lmiAmount,
        loanAmount,
        loanWithLmi,
        lvrPercent
    };
};
