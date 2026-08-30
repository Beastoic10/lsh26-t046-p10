'use client';
import { useState } from 'react';
import BalanceChart from './BalanceChart';
import RechargeAdvisor from './RechargeAdvisor';
import HabitComparison from './HabitComparison';
import MonthlyBreakdownBarChart from './MonthlyBreakdownBarChart';
import RealMeterComparison from './RealMeterComparison';

export default function MainDashboardLayout({ timeseries, readings }) {
  const [actualOverlay, setActualOverlay] = useState([]);
  const [viewMode, setViewMode] = useState('simulated'); // 'simulated' | 'telemetry'

  return (
    <main className="h-screen w-screen bg-[#050505] relative text-zinc-100 font-sans p-3 antialiased flex flex-col gap-3 overflow-hidden selection:bg-yellow-400 selection:text-black">
      
      {/* High-Contrast Electric Ambient Orbs */}
      <div className="fixed top-[-15%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-yellow-400/10 blur-[180px] pointer-events-none"></div>
      <div className="fixed bottom-[-15%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-zinc-700/20 blur-[180px] pointer-events-none"></div>
      <div className="fixed top-[40%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-yellow-500/10 blur-[150px] pointer-events-none"></div>

      {/* Header */}
      <header className="flex-none flex items-center justify-between px-5 py-2.5 bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-yellow-400 text-black p-0.5 shadow-[0_0_20px_rgba(250,204,21,0.5)] flex items-center justify-center font-black">
            ⚡
          </div>
          <h1 className="text-base font-bold font-mono tracking-wider text-white flex items-center gap-2">
            meter.advisor
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 font-semibold">
              Yellow Glass
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-300 bg-black/60 border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,1)] animate-pulse"></span>
            <span className="text-zinc-400">Threshold:</span>
            <span className="text-yellow-400 font-bold">-300 BDT</span>
          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="flex-1 min-h-0 flex flex-col gap-3">
        
        {/* Top Horizon */}
        <div className="h-[60%] min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3">
          
          <div className="lg:col-span-8 bg-zinc-900/40 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-3xl p-4 flex flex-col min-h-0 relative overflow-hidden">
            <div className="flex justify-between items-center mb-3 flex-none">
              <div>
                <h2 className="text-xs uppercase tracking-widest text-yellow-400 font-mono font-bold">Statistic Trajectory</h2>
                <p className="text-sm font-bold text-white">
                  {viewMode === 'simulated' ? 'Simulated Engine Trajectory' : 'Live Telemetry Readings'}
                </p>
              </div>

              {/* Functional Pill Toggle */}
              <div className="bg-black/70 p-1 rounded-full border border-white/10 flex items-center text-xs font-mono">
                <button
                  onClick={() => setViewMode('simulated')}
                  className={`px-4 py-1.5 rounded-full transition-all ${
                    viewMode === 'simulated'
                      ? 'bg-yellow-400 text-black font-extrabold shadow-[0_0_20px_rgba(250,204,21,0.4)]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Simulated
                </button>
                <button
                  onClick={() => setViewMode('telemetry')}
                  className={`px-4 py-1.5 rounded-full transition-all ${
                    viewMode === 'telemetry'
                      ? 'bg-yellow-400 text-black font-extrabold shadow-[0_0_20px_rgba(250,204,21,0.4)]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Telemetry
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0 w-full relative">
              <BalanceChart 
                timeseries={timeseries} 
                actualHistoryOverlay={actualOverlay} 
                viewMode={viewMode} 
              />
            </div>
          </div>

          <div className="lg:col-span-4 min-h-0 h-full">
            <RechargeAdvisor timeseries={timeseries} readings={readings} />
          </div>

        </div>

        {/* Bottom Horizon */}
        <div className="h-[40%] min-h-0 grid grid-cols-1 md:grid-cols-3 gap-3">
          <MonthlyBreakdownBarChart timeseries={timeseries} />
          <RealMeterComparison onPasteHistory={(data) => setActualOverlay(data)} />
          <HabitComparison readings={readings} />
        </div>

      </div>
    </main>
  );
}