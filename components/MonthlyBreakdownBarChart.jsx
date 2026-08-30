'use client';
import { useState } from 'react';
import { getMonthBreakdown } from '@/lib/engine';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function MonthlyBreakdownBarChart({ timeseries }) {
  const availableMonths = Array.from(new Set(timeseries.map((d) => d.date.substring(0, 7))));
  const [selectedMonth, setSelectedMonth] = useState(availableMonths[availableMonths.length - 1] || '2026-08');

  const breakdown = getMonthBreakdown(timeseries, selectedMonth);

  const data = {
    labels: ['Energy', 'Demand', 'Rent', 'VAT'],
    datasets: [
      {
        label: 'Cost (BDT)',
        data: [breakdown.energyCost, breakdown.demandCharge, breakdown.meterRent, breakdown.vat],
        backgroundColor: ['#38bdf8', '#a855f7', '#ec4899', '#f59e0b'],
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { family: 'monospace', size: 10 } } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.03)' }, ticks: { color: '#64748b', font: { family: 'monospace', size: 9 } } },
    },
  };

  return (
    <div className="bg-slate-900/35 backdrop-blur-2xl border border-slate-700/40 shadow-lg rounded-xl p-3 flex flex-col justify-between min-h-0 h-full">
      <div className="flex items-center justify-between mb-1 flex-none">
        <div>
        
          <p className="text-xs font-semibold text-slate-200">Single Month Structure</p>
        </div>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-slate-950 border border-slate-700 text-slate-300 rounded px-2 py-0.5 text-[10px] font-mono focus:outline-none"
        >
          {availableMonths.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-h-0 w-full relative my-1">
        <Bar data={data} options={options} />
      </div>

      <div className="flex justify-between items-center text-[11px] font-mono pt-1.5 border-t border-slate-800/80 text-slate-400 flex-none">
        <span>Month Total:</span>
        <span className="text-slate-200 font-bold">{breakdown.totalCost.toFixed(2)} BDT</span>
      </div>
    </div>
  );
}