
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

    if (!found) throw new RangeError('Invalid range');

    lmiBracket = lmiBracket || [];
    const propertyDeposit = (
        upfrontLandBookingAmount +
        upfrontLandDepositAmount +
        upfrontHouseDepositAmount
    );
    
    let upfrontDeposits = (
        upfrontLandBookingAmount +
        upfrontLandDepositAmount +
        upfrontHouseDepositAmount
    );
    
    if (!savings) throw new RangeError('Invalid range');

    let lmiPercent;
    let depositPercent;
    let loanRatio;
    let loanAmount;
    let lmiAmount;
    let finalDepositAmount;
    let loanWithLmi;
    let lvrPercent;
    let finalLoanAmount;
    let leftoverSavings = 0;
    let upfrontDepositCalculation = [[null, null, upfrontDeposits]];
    let first = true;

    while (true) {
        const depositAmount = parseInt(savings) - additionalFees;
        depositPercent = Math.round((upfrontDeposits / propertyPrice) * 100);    
        loanRatio = ((1 - (upfrontDeposits / propertyPrice)) * 100).toPrecision(4); // equivalent of loan amount / gross property
    
        for (let j = 0; j < LVR_RANGES.length; j++) {
            const [min, max] = LVR_RANGES[j];
            if (loanRatio >= min && loanRatio <= max) {
                lmiPercent = lmiBracket[j];          
                break;
            }
        }
        
        lmiPercent = lmiPercent || 0;    

        loanAmount = (propertyPrice - upfrontDeposits);
        lmiAmount = Math.round(loanAmount * (lmiPercent / 100));
        finalDepositAmount = depositAmount - lmiAmount;
        loanWithLmi = loanAmount - lmiAmount; // loan amount after upfront lmi payment
        lvrPercent = ((loanWithLmi / propertyPrice) * 100).toPrecision(4);
        finalLoanAmount = loanAmount - lmiAmount;
        leftoverSavings = (
            parseInt(savings) -
            additionalFees -
            lmiAmount -
            upfrontDeposits
        );
        console.log('Left over', leftoverSavings);        
        if (first && leftoverSavings < 0) {            
            throw new Error(`Insufficient funds need ${leftoverSavings}`);
        }
        first = false;        
        if (leftoverSavings <= 0) break;
        upfrontDepositCalculation.push([loanRatio, lmiAmount, leftoverSavings]);
        upfrontDeposits += leftoverSavings;
    }

    return {
        transferFee: TRANSFER_FEE,
        governmentFee: GOVERNMENT_FEE,
        depositAmount: finalDepositAmount,
        propertyPrice,
        depositPercent,
        loanRatio, 
        lmiPercent,
        lmiAmount,
        loanAmount,
        loanWithLmi: finalLoanAmount,
        lvrPercent,
        stampDuty,
        upfrontLandBookingAmount,
        upfrontLandDepositAmount,
        upfrontHouseDepositAmount,
        upfrontDeposits,
        upfrontDepositCalculation,
        leftoverSavings
    };
};
