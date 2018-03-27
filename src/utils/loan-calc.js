
const TRANSFER_FEE = 139;
const GOVERNMENT_FEE = 139;

export default (config, landPrice, housePrice, savings, solicitorFees, landDepositPercent, houseDepositPercent, userStampDuty = null) => {    
    const { LVR_RANGES, PRICE_RANGES, LMI_RANGES } = config;
    // Find property and LMI_RANGES range
    let lmiBracket;
    let found = false;
    const propertyPrice = parseInt(landPrice) + parseInt(housePrice);    
    const stampDuty =  (userStampDuty !== null) ? parseInt(userStampDuty) : Math.round((((parseInt(landPrice) - 300001) * 4.5)/100)  + 8990);
    const additionalFees = parseInt(stampDuty) + TRANSFER_FEE + GOVERNMENT_FEE + parseInt(solicitorFees);
    
    for (let i = 0; i < PRICE_RANGES.length; i++) {
        const [min, max] = PRICE_RANGES[i];
        
        if (propertyPrice >= min && propertyPrice <= max) {        
            lmiBracket = LMI_RANGES[i];
            found = true;
            break;
        }
    }

    if (!found) throw new RangeError('Invalid range');

    lmiBracket = lmiBracket || [];
    const depositAmount = parseInt(savings) - additionalFees;
    const depositPercent = Math.round((depositAmount / propertyPrice) * 100);    
    const loanRatio = Math.round((1 - (depositAmount / propertyPrice)) * 100); // equivalent of loan amount / gross property

    let lmiPercent;
    for (let j = 0; j < LVR_RANGES.length; j++) {
        const [min, max] = LVR_RANGES[j];
        if (loanRatio >= min && loanRatio <= max) {
            lmiPercent = lmiBracket[j];          
            break;
        }
    }
    
    lmiPercent = lmiPercent || 0;    
    const loanAmount = (propertyPrice - depositAmount);
    const lmiAmount = Math.round(loanAmount * (lmiPercent / 100));
    const loanWithLmi = loanAmount + lmiAmount;
    // const lvrPercent = Math.round((1 - (depositAmount / loanWithLmi)) * 100);
    const lvrPercent = Math.round((loanWithLmi / propertyPrice) * 100);

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
        loanWithLmi,
        lvrPercent,
        stampDuty,
        upfrontLandDepositAmount: (parseInt(landDepositPercent) / 100) * parseInt(landPrice),
        upfrontHouseDepositAmount: (parseInt(houseDepositPercent) / 100) * parseInt(housePrice)
    };
};
