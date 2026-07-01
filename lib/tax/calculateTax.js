export function calculateTax(chargeableIncome, bands) {
  let tax = 0;
  const breakdown = [];

  for (const band of bands) {
    if (chargeableIncome <= band.min_income) break;

    const upper = band.max_income ?? Infinity;
    const taxableInBand = Math.min(chargeableIncome, upper) - band.min_income;

    if (taxableInBand > 0) {
      const bandTax = taxableInBand * band.tax_rate;
      tax += bandTax;
      breakdown.push({
        range: `₦${band.min_income.toLocaleString()} - ${
          band.max_income ? "₦" + band.max_income.toLocaleString() : "above"
        }`,
        rate: band.tax_rate,
        taxableAmount: taxableInBand,
        taxCharged: bandTax,
      });
    }
  }

  return {
    annualTax: Math.round(tax * 100) / 100,
    monthlyTax: Math.round((tax / 12) * 100) / 100,
    breakdown,
  };
}

export function calculateDeductions({ pension = 0, nhf = 0, lifeAssurance = 0 }) {
  return pension + nhf + lifeAssurance;
}
