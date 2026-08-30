'use client';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function BalanceChart({ timeseries, actualHistoryOverlay = [], viewMode = 'simulated' }) {
  const labels = timeseries.map((d) => d.date);
  
  // Data dataset selection based on active view mode
  const datasetData = viewMode === 'simulated'
    ? timeseries.map((d) => d.balance)
    : timeseries.map((d) => d.unitsUsedThisMonth ?? 0);

  const datasets = [
    {
      label: viewMode === 'simulated' ? 'Engine Rebuilt Balance (BDT)' : 'Daily Telemetry Consumption (kWh)',
      data: datasetData,
      borderColor: '#facc15',
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 320);
        gradient.addColorStop(0, 'rgba(250, 204, 21, 0.35)');
        gradient.addColorStop(1, 'rgba(250, 204, 21, 0.0)');
        return gradient;
      },
      fill: true,
      pointRadius: timeseries.map((d) => (d.rechargeAmount > 0 ? 5 : 0)),
      pointBackgroundColor: '#ffffff',
      pointBorderColor: '#facc15',
      tension: 0.35,
      borderWidth: 2.5,
    },
  ];

  if (actualHistoryOverlay.length > 0 && viewMode === 'simulated') {
    const overlayMap = new Map(actualHistoryOverlay.map((item) => [item.date, item.meterBalance]));
    const actualData = labels.map((d) => overlayMap.get(d) ?? null);

    datasets.push({
      label: 'Actual Meter Reading (Overlay)',
      data: actualData,
      borderColor: '#ffffff',
      backgroundColor: 'transparent',
      borderDash: [5, 5],
      pointRadius: 4,
      pointBackgroundColor: '#ffffff',
      tension: 0.3,
      borderWidth: 2,
    });
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: actualHistoryOverlay.length > 0 || viewMode === 'telemetry',
        labels: { color: '#a1a1aa', font: { family: 'monospace', size: 12 } },
      },
      tooltip: {
        backgroundColor: 'rgba(5, 5, 5, 0.95)',
        borderColor: 'rgba(250, 204, 21, 0.4)',
        borderWidth: 1.5,
        titleFont: { family: 'monospace', size: 12 },
        bodyFont: { family: 'monospace', size: 12 },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { color: '#71717a', font: { family: 'monospace', size: 11 }, maxTicksLimit: 10 },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { color: '#71717a', font: { family: 'monospace', size: 11 } },
      },
    },
  };

  return <Line data={{ labels, datasets }} options={options} />;
}