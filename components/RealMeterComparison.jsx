'use client';
import { useState } from 'react';

export default function RealMeterComparison({ onPasteHistory }) {
  const [readingsList, setReadingsList] = useState([
    { date: '2026-08-01', meterBalance: 1550 },
    { date: '2026-08-15', meterBalance: 820 },
    { date: '2026-08-30', meterBalance: 120 },
  ]);

  const [inputDate, setInputDate] = useState('2026-08-30');
  const [inputBalance, setInputBalance] = useState('');
  const [showBulkPaste, setShowBulkPaste] = useState(false);
  const [rawText, setRawText] = useState('');

  const handleAddSingle = (e) => {
    e.preventDefault();
    if (!inputDate || inputBalance === '') return;

    const newEntry = { date: inputDate, meterBalance: Number(inputBalance) };
    const updated = [...readingsList.filter((r) => r.date !== inputDate), newEntry].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    setReadingsList(updated);
    onPasteHistory(updated);
    setInputBalance('');
  };

  const handleRemove = (dateToRemove) => {
    const updated = readingsList.filter((r) => r.date !== dateToRemove);
    setReadingsList(updated);
    onPasteHistory(updated);
  };

  const handleBulkParse = () => {
    const lines = rawText.split('\n');
    const parsed = [];

    lines.forEach((line) => {
      const parts = line.trim().split(/[\s,,\t]+/);
      if (parts.length >= 2) {
        const date = parts[0];
        const bal = parseFloat(parts[1]);
        if (date && !isNaN(bal)) {
          parsed.push({ date, meterBalance: bal });
        }
      }
    });

    if (parsed.length > 0) {
      setReadingsList(parsed);
      onPasteHistory(parsed);
      setShowBulkPaste(false);
    }
  };

  return (
    <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-3xl p-4 flex flex-col justify-between min-h-0 h-full">
      
      <div className="flex justify-between items-center mb-2 flex-none">
        <div>
          <h3 className="text-xs uppercase tracking-widest text-yellow-400 font-mono font-bold">Meter Overlay</h3>
          <p className="text-sm font-bold text-white">Real Reading Sync</p>
        </div>
        <button
          onClick={() => setShowBulkPaste(!showBulkPaste)}
          className="text-xs font-mono text-yellow-400 hover:text-yellow-300 underline font-semibold"
        >
          {showBulkPaste ? '← Form View' : 'Excel Paste'}
        </button>
      </div>

      {showBulkPaste ? (
        <div className="flex-1 min-h-0 flex flex-col gap-2 my-1">
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={`Paste Excel lines:\n2026-08-01 1550\n2026-08-15 820`}
            className="w-full flex-1 bg-black/60 border border-white/10 rounded-2xl p-3 text-xs font-mono text-zinc-200 focus:outline-none focus:border-yellow-400 resize-none"
          />
          <button
            onClick={handleBulkParse}
            className="w-full bg-yellow-400 text-black text-xs font-mono font-extrabold py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(250,204,21,0.3)] flex-none"
          >
            Apply Pasted Data
          </button>
        </div>
      ) : (
        <div className="flex-1 min-h-0 flex flex-col justify-between gap-2">
          
          <form onSubmit={handleAddSingle} className="grid grid-cols-12 gap-2 flex-none">
            <input
              type="date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="col-span-5 bg-black/60 border border-white/10 text-zinc-200 text-xs font-mono rounded-xl px-2.5 py-2 focus:outline-none focus:border-yellow-400 [color-scheme:dark]"
            />
            <input
              type="number"
              placeholder="Balance"
              value={inputBalance}
              onChange={(e) => setInputBalance(e.target.value)}
              className="col-span-4 bg-black/60 border border-white/10 text-zinc-200 text-xs font-mono rounded-xl px-2.5 py-2 focus:outline-none focus:border-yellow-400 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
            />
            <button
              type="submit"
              className="col-span-3 bg-yellow-400 text-black text-xs font-mono font-extrabold rounded-xl transition-all shadow-[0_0_15px_rgba(250,204,21,0.3)]"
            >
              + Add
            </button>
          </form>

          <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 my-1">
            {readingsList.length === 0 ? (
              <p className="text-xs font-mono text-zinc-500 text-center py-4">No overlay readings added.</p>
            ) : (
              readingsList.map((item) => (
                <div
                  key={item.date}
                  className="flex items-center justify-between bg-black/60 border border-white/5 rounded-xl px-3 py-2 text-xs font-mono"
                >
                  <span className="text-zinc-300">{item.date}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 font-bold">{item.meterBalance.toFixed(2)} BDT</span>
                    <button
                      onClick={() => handleRemove(item.date)}
                      className="text-zinc-500 hover:text-white font-bold px-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => onPasteHistory(readingsList)}
            className="w-full bg-zinc-800/80 hover:bg-zinc-700/80 text-white text-xs font-mono font-bold py-2.5 rounded-xl border border-white/10 transition-colors flex-none"
          >
            Render ({readingsList.length}) Readings
          </button>
        </div>
      )}

    </div>
  );
}