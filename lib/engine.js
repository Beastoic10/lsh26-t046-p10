export const TARIFF = [
  { lower: 0, upper: 75, rate: 4.63 },
  { lower: 75, upper: 200, rate: 5.26 },
  { lower: 200, upper: 300, rate: 5.63 },
  { lower: 300, upper: 400, rate: 5.83 },
  { lower: 400, upper: 600, rate: 9.30 },
  { lower: 600, upper: Infinity, rate: 10.70 },
];

export const DEMAND_CHARGE = 42;
export const METER_RENT = 40;
export const FIXED_MONTHLY_CHARGE = DEMAND_CHARGE + METER_RENT; // 82 BDT
export const VAT_RATE = 0.05;
export const DISCONNECTION_THRESHOLD = -300;

export function tieredEnergyCost(unitsAlreadyUsedThisMonth, unitsToday, tariff = TARIFF) {
  if (unitsToday <= 0) return 0;
  let cost = 0;
  const start = unitsAlreadyUsedThisMonth;
  const end = unitsAlreadyUsedThisMonth + unitsToday;

  for (const slab of tariff) {
    if (end <= slab.lower || start >= slab.upper) continue;
    const overlapStart = Math.max(start, slab.lower);
    const overlapEnd = Math.min(end, slab.upper);
    const unitsInSlab = overlapEnd - overlapStart;
    if (unitsInSlab > 0) {
      cost += unitsInSlab * slab.rate;
    }
  }
  return Number(cost.toFixed(4));
}

export function simulate(dailyUnitsArray, rechargesArray, openingBalance = 0) {
  const rechargeMap = new Map();
  (rechargesArray || []).forEach((r) => {
    const key = typeof r.recharge_date === 'string' ? r.recharge_date.split('T')[0] : r.date;
    rechargeMap.set(key, Number(r.amount));
  });

  let balance = openingBalance;
  let currentMonth = null;
  let unitsUsedThisMonth = 0;
  let hasRechargedThisMonth = false;

  return dailyUnitsArray.map((item) => {
    const dateStr = typeof item.reading_date === 'string' ? item.reading_date.split('T')[0] : item.date;
    const unitsToday = Number(item.units || item.unitsToday || 0);
    const monthKey = dateStr.substring(0, 7);

    // Slab counter resets strictly on calendar month boundary (1st of month)
    if (monthKey !== currentMonth) {
      currentMonth = monthKey;
      unitsUsedThisMonth = 0;
      hasRechargedThisMonth = false;
    }

    const rechargeAmount = rechargeMap.get(dateStr) || 0;
    let fixedCharge = 0;

    // Fixed charges applied ONLY on the month's first recharge
    if (rechargeAmount > 0) {
      balance += rechargeAmount;
      if (!hasRechargedThisMonth) {
        fixedCharge = FIXED_MONTHLY_CHARGE;
        hasRechargedThisMonth = true;
      }
    }

    const energyCost = tieredEnergyCost(unitsUsedThisMonth, unitsToday);
    const vat = Number((energyCost * VAT_RATE).toFixed(4));
    const totalDeductions = energyCost + vat + fixedCharge;

    balance = Number((balance - totalDeductions).toFixed(4));
    unitsUsedThisMonth += unitsToday;

    return {
      date: dateStr,
      unitsToday,
      energyCost,
      vat,
      fixedCharge,
      rechargeAmount,
      balance,
      unitsUsedThisMonth,
    };
  });
}

// Bonus 1: Check proximity to next slab boundary (~10%)
export function checkSlabProximity(unitsUsedThisMonth) {
  for (let i = 0; i < TARIFF.length - 1; i++) {
    const currentSlab = TARIFF[i];
    const nextSlab = TARIFF[i + 1];
    const threshold = currentSlab.upper * 0.9;

    if (unitsUsedThisMonth >= threshold && unitsUsedThisMonth < currentSlab.upper) {
      return {
        nearBoundary: true,
        currentSlabUpper: currentSlab.upper,
        unitsRemaining: Number((currentSlab.upper - unitsUsedThisMonth).toFixed(2)),
        nextRate: nextSlab.rate,
      };
    }
  }
  return { nearBoundary: false };
}

// Bonus 3: Breakdown calculations for a specific calendar month
export function getMonthBreakdown(timeseries, yearMonthStr) {
  const monthData = timeseries.filter((d) => d.date.startsWith(yearMonthStr));
  const energy = monthData.reduce((acc, curr) => acc + curr.energyCost, 0);
  const vat = monthData.reduce((acc, curr) => acc + curr.vat, 0);
  const fixed = monthData.reduce((acc, curr) => acc + curr.fixedCharge, 0);
  const demandCharge = fixed > 0 ? DEMAND_CHARGE : 0;
  const meterRent = fixed > 0 ? METER_RENT : 0;

  return {
    month: yearMonthStr,
    energyCost: Number(energy.toFixed(2)),
    demandCharge,
    meterRent,
    vat: Number(vat.toFixed(2)),
    totalCost: Number((energy + vat + fixed).toFixed(2)),
  };
}

// Verification assertions
(function runSanityChecks() {
  const check1 = tieredEnergyCost(70, 20); // 5 @ 4.63 + 15 @ 5.26 = 102.05
  console.assert(Math.abs(check1 - 102.05) < 0.001, `Check 1 Failed: ${check1}`);
  const check2 = tieredEnergyCost(0, 50); // 50 @ 4.63 = 231.5
  console.assert(Math.abs(check2 - 231.5) < 0.001, `Check 2 Failed: ${check2}`);
})();