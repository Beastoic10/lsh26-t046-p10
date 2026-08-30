'use client';
import { useState, useRef, useEffect } from 'react';

export default function GlassDatePicker({ value, onChange, minDate = '2026-08-31' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const presets = [
    { label: '+15 Days', date: '2026-09-15' },
    { label: 'End of Sept', date: '2026-09-30' },
    { label: '+60 Days', date: '2026-10-30' },
    { label: 'End of Year', date: '2026-12-31' },
  ];

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-black/60 backdrop-blur-xl border border-white/10 hover:border-yellow-400/60 text-white font-mono text-xs rounded-xl px-3 py-2.5 transition-all duration-200"
      >
        <span className="flex items-center gap-2">
          <span className="text-yellow-400">📅</span>
          <span>{value}</span>
        </span>
        <span className="text-zinc-500 text-[10px]">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-black/95 backdrop-blur-3xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] rounded-2xl p-3 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="text-xs font-mono text-yellow-400 uppercase tracking-wider font-bold">Target Horizon</span>
            <span className="text-[10px] font-mono text-zinc-500">Preset Dates</span>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono">
            {presets.map((p) => (
              <button
                key={p.date}
                type="button"
                onClick={() => {
                  onChange(p.date);
                  setIsOpen(false);
                }}
                className={`text-xs py-2 px-2.5 rounded-xl border text-left transition-all ${
                  value === p.date
                    ? 'bg-yellow-400 border-yellow-400 text-black font-extrabold shadow-[0_0_15px_rgba(250,204,21,0.4)]'
                    : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-zinc-800">
            <label className="block text-[10px] font-mono text-zinc-400 mb-1 font-semibold">Custom Date</label>
            <input
              type="date"
              value={value}
              min={minDate}
              onChange={(e) => {
                onChange(e.target.value);
                setIsOpen(false);
              }}
              className="w-full bg-black/80 border border-white/10 text-zinc-100 text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-yellow-400 [color-scheme:dark]"
            />
          </div>
        </div>
      )}
    </div>
  );
}