'use client';
import { useState } from 'react';
import { tieredEnergyCost, FIXED_MONTHLY_CHARGE, VAT_RATE, TARIFF, checkSlabProximity, DISCONNECTION_THRESHOLD } from '@/lib/engine';
import GlassDatePicker from './GlassDatePicker';

export default function RechargeAdvisor({ timeseries, readings }) {
  const latestState = timeseries[timeseries.length - 1] || { balance: 0, date: '2026-08-30', unitsUsedThisMonth: 0 };
  const currentBalance = latestState.balance;
  const currentMonthUnits = latestState.unitsUsedThisMonth;
  const todayDateStr = latestState.date; 

  const avgDailyUnits = readings.reduce((acc, curr) => acc + Number(curr.units), 0) / readings.length;

  let simulatedBalance = currentBalance;
  let daysRemaining = 0;
  const limit = typeof DISCONNECTION_THRESHOLD !== 'undefined' ? DISCONNECTION_THRESHOLD : -300;

  while (simulatedBalance > limit && daysRemaining < 365) {
    simulatedBalance -= avgDailyUnits * TARIFF[0].rate * (1 + VAT_RATE);
    daysRemaining++;
  }
  
  const tomorrow = new Date(todayDateStr);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const runOutDate = new Date(tomorrow.getTime() + (daysRemaining - 1) * 86400000).toISOString().split('T')[0];

  const [targetDate, setTargetDate] = useState('2026-09-30');
  const startDate = new Date(tomorrow);
  const endDate = new Date(targetDate);
  const diffDays = Math.max(0, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1);

  const totalUnitsTarget = diffDays * avgDailyUnits;
  const baselineCost = totalUnitsTarget * TARIFF[0].rate;
  const actualTieredCost = tieredEnergyCost(currentMonthUnits, totalUnitsTarget);
  
  const higherSlabPremium = actualTieredCost - baselineCost;
  const monthBoundariesCrossed = Math.max(1, Math.ceil(diffDays / 30));
  const fixedCharges = monthBoundariesCrossed * FIXED_MONTHLY_CHARGE;
  const vat = actualTieredCost * VAT_RATE;

  const totalRequiredCost = actualTieredCost + fixedCharges + vat;
  const rechargeNeeded = Math.max(0, totalRequiredCost - currentBalance);
  const proximity = checkSlabProximity(currentMonthUnits);

  return (
    <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-3xl p-4 flex flex-col justify-between h-full">
      
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs uppercase tracking-widest text-yellow-400 font-mono font-bold">Telemetry Advisor</h3>
          <span className="text-xs font-mono bg-black/60 text-zinc-300 px-3 py-1 rounded-full border border-white/10">
            {todayDateStr}
          </span>
        </div>

        {/* High-Contrast Card Grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-black/60 p-3.5 rounded-2xl border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-400/10 rounded-full blur-xl"></div>
            <span className="text-xs uppercase font-mono text-zinc-400 block mb-1">Current Balance</span>
            <span className="text-2xl font-bold font-mono text-white">{currentBalance.toFixed(2)}</span>
            <span className="text-xs text-yellow-400 font-mono ml-1">BDT</span>
          </div>

          <div className="bg-black/60 p-3.5 rounded-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
            <span className="text-xs uppercase font-mono text-zinc-400 block mb-1">Slab Counter</span>
            <span className="text-2xl font-bold font-mono text-yellow-400">{currentMonthUnits.toFixed(1)}</span>
            <span className="text-xs text-zinc-400 font-mono ml-1">Units</span>
          </div>
        </div>

        {proximity.nearBoundary && (
          <div className="bg-yellow-400/10 border border-yellow-400/40 text-yellow-200 p-3 rounded-2xl text-xs font-mono mb-3 backdrop-blur-md">
            ⚠️ <strong>Slab Warning:</strong> {proximity.unitsRemaining} units left before slab jump ({proximity.nextRate} BDT/unit).
          </div>
        )}

        <div className="bg-zinc-800/40 border border-white/10 p-3 rounded-2xl text-xs font-mono mb-3 backdrop-blur-md">
          <span className="text-white font-bold block">Disconnection ({limit} BDT Threshold)</span>
          <span className="text-zinc-400">
            Reaches threshold on <strong className="text-yellow-400">{runOutDate}</strong> (~{daysRemaining} days remaining).
          </span>
        </div>

        <div className="mb-3">
          <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1.5 font-bold">
            Predictive Target Date
          </label>
          <GlassDatePicker value={targetDate} onChange={(newDate) => setTargetDate(newDate)} minDate="2026-08-31" />
        </div>

        {/* Financial Breakdown */}
        <div className="bg-black/70 p-3.5 rounded-2xl border border-white/10 font-mono text-xs space-y-2">
          <div className="flex justify-between text-zinc-400">
            <span>1. Baseline Energy</span>
            <span className="text-zinc-200">{baselineCost.toFixed(2)} BDT</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>2. Slab Premium</span>
            <span className="text-zinc-200">{higherSlabPremium.toFixed(2)} BDT</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>3. Fixed Charges</span>
            <span className="text-zinc-200">{fixedCharges.toFixed(2)} BDT</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>4. VAT (5%)</span>
            <span className="text-zinc-200">{vat.toFixed(2)} BDT</span>
          </div>
          <div className="pt-2 border-t border-zinc-800 flex justify-between font-bold text-sm text-yellow-400">
            <span>Required Top-up</span>
            <span>{rechargeNeeded.toFixed(2)} BDT</span>
          </div>
        </div>
      </div>

    </div>
  );
}