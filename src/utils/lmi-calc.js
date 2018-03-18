
const TRANSFER_FEE = 139;
const GOVERNMENT_FEE = 139;

export default (config, propertyPrice, savings, stampDuty = 30000) => {    
    const { LVR_RANGES, PRICE_RANGES, LMI_RANGES } = config;
    // Find property and LMI_RANGES range
    let lmiBracket;
    for (let i = 0; i < PRICE_RANGES.length; i++) {
        const [min, max] = PRICE_RANGES[i];
        if (propertyPrice >= min && propertyPrice <= max) {        
            lmiBracket = LMI_RANGES[i];
            // console.log('Property Range: ', `${min} - ${max}`);
            break;
        }
    }

    lmiBracket = lmiBracket || [];
    const depositAmount = (savings - stampDuty - TRANSFER_FEE - GOVERNMENT_FEE);
    const depositPercent = Math.round((depositAmount / propertyPrice) * 100);
    const loanRatio = Math.round((1 - (depositAmount / propertyPrice)) * 100);    
    
    let lmiPercent;
    for (let j = 0; j < LVR_RANGES.length; j++) {
        const [min, max] = LVR_RANGES[j];
        if (loanRatio >= min && loanRatio <= max) {
            lmiPercent = lmiBracket[j];          
            break;
        }
    }
    
    lmiPercent = lmiPercent || 0;
    const lmiAmount = (propertyPrice * (lmiPercent / 100));    
    const loanAmount = (propertyPrice - depositAmount + lmiAmount);
    const lvrPercent = Math.round((1 - (depositAmount / loanAmount)) * 100);

    return {
        transferFee: TRANSFER_FEE,
        governmentFee: GOVERNMENT_FEE,
        depositAmount,
        propertyPrice,
        depositPercent,
        loanRatio, 
        lmiPercent,
        lmiAmount,
        loanAmount,
        lvrPercent
    };
};
