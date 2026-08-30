'use client';
import { simulate } from '@/lib/engine';

export default function HabitComparison({ readings }) {
  const recent90Days = readings.slice(-90);

  let lowBalanceRecharges = [], currentBal = 0;
  recent90Days.forEach((r) => {
    const dStr = typeof r.reading_date === 'string' ? r.reading_date.split('T')[0] : r.date;
    if (currentBal < 200) {
      lowBalanceRecharges.push({ date: dStr, amount: 1000 });
      currentBal += 1000;
    }
    currentBal -= Number(r.units) * 5;
  });

  let monthlyRecharges = [];
  recent90Days.forEach((r) => {
    const dStr = typeof r.reading_date === 'string' ? r.reading_date.split('T')[0] : r.date;
    if (dStr.endsWith('-01')) {
      monthlyRecharges.push({ date: dStr, amount: 3000 });
    }
  });

  const simA = simulate(recent90Days, lowBalanceRecharges, 500);
  const simB = simulate(recent90Days, monthlyRecharges, 500);

  const costA = simA.reduce((a, c) => a + c.energyCost + c.vat + c.fixedCharge, 0);
  const costB = simB.reduce((a, c) => a + c.energyCost + c.vat + c.fixedCharge, 0);
  const diff = Math.abs(costA - costB);

  return (
    <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-3xl p-4 flex flex-col justify-between min-h-0 h-full">
      <div>
        <h3 className="text-xs uppercase tracking-widest text-yellow-400 font-mono font-bold mb-3">
          Habit Studio
        </h3>

        <div className="space-y-2.5 mb-2 font-mono">
          <div className="bg-black/60 p-3 rounded-2xl border border-white/10 flex justify-between items-center relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400"></div>
            <div>
              <span className="text-xs text-white font-bold block">Habit A: Frequent Tops</span>
              <span className="text-[11px] text-zinc-400">&lt; 200 BDT triggers 1k BDT</span>
            </div>
            <p className="text-sm font-bold text-yellow-400">{costA.toFixed(2)} BDT</p>
          </div>

          <div className="bg-black/60 p-3 rounded-2xl border border-white/10 flex justify-between items-center relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-400"></div>
            <div>
              <span className="text-xs text-zinc-200 font-bold block">Habit B: 1st of Month</span>
              <span className="text-[11px] text-zinc-400">Fixed 3k BDT deposit</span>
            </div>
            <p className="text-sm font-bold text-zinc-200">{costB.toFixed(2)} BDT</p>
          </div>
        </div>
      </div>

      <div className="bg-black/70 p-3 rounded-2xl border border-white/10 font-mono text-xs flex justify-between items-center text-zinc-300 flex-none">
        <span>Fixed Fee Variance:</span>
        <span className="text-yellow-400 font-bold text-sm">{diff.toFixed(2)} BDT</span>
      </div>
    </div>
  );
}