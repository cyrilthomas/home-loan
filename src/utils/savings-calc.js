const TRANSFER_FEE = 139;
const GOVERNMENT_FEE = 139;

export default (config, landPrice, housePrice, loanAmount, solicitorFees, landDepositPercent, houseDepositPercent, userStampDuty = null) => {    
    const { LVR_RANGES, PRICE_RANGES, LMI_RANGES } = config;
    // Find property and LMI_RANGES range
    let lmiBracket;
    let found = false;
    const propertyPrice = parseInt(landPrice) + parseInt(housePrice);    
    const stampDuty =  (userStampDuty !== null) ? parseInt(userStampDuty) : Math.round((((parseInt(landPrice) - 300001) * 4.5)/100)  + 8990);
    const additionalFees = parseInt(stampDuty) + TRANSFER_FEE + GOVERNMENT_FEE + parseInt(solicitorFees);
        
    const upfrontLandBookingAmount = (0.25 / 100) * parseInt(landPrice);
    const upfrontLandDepositAmount = ((parseInt(landDepositPercent) - 0.25) / 100) * parseInt(landPrice);
    const upfrontHouseDepositAmount = (parseInt(houseDepositPercent) / 100) * parseInt(housePrice);
    
    for (let i = 0; i < PRICE_RANGES.length; i++) {
        const [min, max] = PRICE_RANGES[i];
        
        if (propertyPrice >= min && propertyPrice <= max) {        
            lmiBracket = LMI_RANGES[i];
            found = true;
            break;
        }
    }

    if (!found) throw new Error('Invalid range');

    lmiBracket = lmiBracket || [];
    const propertyDeposit = (
        upfrontLandBookingAmount +
        upfrontLandDepositAmount +
        upfrontHouseDepositAmount
    );

    loanAmount = parseInt(loanAmount);
    const depositAmount = propertyPrice - loanAmount;
    const depositPercent = Math.round((depositAmount / propertyPrice) * 100);    
    const loanRatio = ((loanAmount / propertyPrice) * 100).toPrecision(4);

    let lmiPercent;
    let lmiPosition;
    for (let j = 0; j < LVR_RANGES.length; j++) {
        const [min, max] = LVR_RANGES[j];
        if (loanRatio >= min && loanRatio <= max) {
            lmiPosition = j;
            lmiPercent = lmiBracket[j];
            break;
        }
    }
    
    lmiPercent = lmiPercent || 0;    
    
    const upfrontDeposits = (
        upfrontLandBookingAmount +
        upfrontLandDepositAmount +
        upfrontHouseDepositAmount
    );
    
    const lmiAmount = Math.round(loanAmount * (lmiPercent / 100));
    // const finalDepositAmount = depositAmount - lmiAmount;
    const loanWithLmi = loanAmount + lmiAmount; // actual loan 
    // const lvrPercent = Math.round((1 - (depositAmount / loanWithLmi)) * 100);
    const lvrPercent = ((loanWithLmi / propertyPrice) * 100).toPrecision(4);
    
    if (lvrPercent > 95) throw new Error('LVR is greater than 95%');
    if (!loanWithLmi) throw new Error('Please check your preferences');

    const savings = (
        depositAmount +
        additionalFees
    );
    const additionalCapital = depositAmount - upfrontDeposits;

    return {
        transferFee: TRANSFER_FEE,
        governmentFee: GOVERNMENT_FEE,
        depositAmount,
        propertyPrice,
        depositPercent,
        loanRatio, 
        lmiPercent,
        lmiPosition,
        lmiAmount,
        loanAmount,
        loanWithLmi,
        lvrPercent,
        stampDuty,
        upfrontLandBookingAmount,
        upfrontLandDepositAmount,
        upfrontHouseDepositAmount,
        upfrontDeposits,
        savings,
        additionalCapital
    };
};

/*eslint radix: ["error", "as-needed"]*/