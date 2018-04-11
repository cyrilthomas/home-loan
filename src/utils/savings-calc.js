
const TRANSFER_FEE = 139;
const GOVERNMENT_FEE = 139;

export default (config, landPrice, housePrice, loanAmount, solicitorFees, landDepositPercent, houseDepositPercent, userStampDuty = null) => {    
    const { LVR_RANGES, PRICE_RANGES, LMI_RANGES } = config;
    console.log('Entered loan', loanAmount);
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
            console.log('lmiBracket', lmiBracket);
            break;
        }
    }

    if (!found) throw new RangeError('Invalid range');

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

    console.log('loanRatio', loanRatio);
    let lmiPercent;
    for (let j = 0; j < LVR_RANGES.length; j++) {
        const [min, max] = LVR_RANGES[j];
        if (loanRatio >= min && loanRatio <= max) {
            lmiPercent = lmiBracket[j];
            console.log('lmiPercent', lmiPercent);
            break;
        }
    }
    
    lmiPercent = lmiPercent || 0;    
    
    const upfrontDeposits = (
        upfrontLandBookingAmount +
        upfrontLandDepositAmount +
        upfrontHouseDepositAmount
    );
    
    console.log('loanAmount', loanAmount);
    const lmiAmount = Math.round(loanAmount * (lmiPercent / 100));
    // const finalDepositAmount = depositAmount - lmiAmount;
    const loanWithLmi = loanAmount + lmiAmount; // actual loan 
    // const lvrPercent = Math.round((1 - (depositAmount / loanWithLmi)) * 100);
    const lvrPercent = ((loanWithLmi / propertyPrice) * 100).toPrecision(4);
    
    if (lvrPercent > 95) throw new RangeError('LVR too high');

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
