# ⚡ meter.advisor

**meter.advisor** is a predictive energy telemetry dashboard designed to simulate, track, and optimize prepaid electricity consumption. Built with a high-contrast **Yellow Glassmorphism** UI, it empowers users to forecast their energy balance, calculate optimal recharge amounts based on slab tariffs, and compare different top-up habits to minimize fixed fees.

---

## ✨ Key Features

* **Predictive Recharge Advisor:** Calculates the exact top-up required for a target date by factoring in baseline energy consumption, slab premiums, monthly fixed charges, and VAT (5%).
* **Simulated vs. Telemetry Engine:** Toggle between simulated balance projection lines and live raw telemetry data points.
* **Real Meter Sync:** Overlay actual meter readings onto your simulated trajectory. Supports manual entry and bulk-pasting directly from Excel.
* **Habit Studio:** Compare the financial impact of different recharge behaviors (e.g., frequent small top-ups vs. fixed monthly deposits).
* **High-Contrast Yellow Glassmorphism UI:** Features deep obsidian backgrounds (`#050505`), neon yellow highlights, frosted glass borders, and ambient glass accents.
* **Slab Proximity Warnings:** Alerts users when they are close to crossing into a higher-priced electricity tariff slab.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router) / React
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Visualization:** [Chart.js](https://www.chartjs.org/) & `react-chartjs-2`
* **Data & Logic Engine:** JavaScript Custom Engine (`lib/engine.js`) for tariff calculation, VAT, and daily consumption algorithms.

---

## 📁 Project Structure

```text
├── components/
│   ├── MainDashboardLayout.jsx     # Primary layout wrapper, ambient lighting, and view toggles
│   ├── BalanceChart.jsx            # Chart.js component for simulated vs. telemetry visualization
│   ├── RechargeAdvisor.jsx         # Telemetry engine, cutoff calculation, and cost breakdown
│   ├── RealMeterComparison.jsx     # Real meter reading form & Excel bulk parser
│   ├── HabitComparison.jsx         # Top-up habit variance comparison cards
│   ├── GlassDatePicker.jsx         # Custom dark glass date selector
│   └── MonthlyBreakdownBarChart.jsx # Monthly consumption visualization
├── lib/
│   └── engine.js                   # Core calculation logic (slabs, tariffs, VAT, simulation engine)
├── app/
│   ├── layout.jsx                  # Next.js root layout
│   └── page.jsx                    # Dashboard application entry point
├── tailwind.config.js
└── package.json
