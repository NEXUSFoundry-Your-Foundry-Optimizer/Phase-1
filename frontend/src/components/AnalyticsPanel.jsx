import React from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Activity, BrainCircuit, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
);

const AnalyticsPanel = ({ errorScore, threshold, chartData }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#281105',
        titleColor: '#9CA3AF',
        bodyColor: '#fff',
        borderColor: '#333',
        borderWidth: 1,
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#9CA3AF', font: { size: 10 } } },
      y: { grid: { color: '#3f1f0d' }, ticks: { color: '#9CA3AF', font: { size: 10 } } }
    }
  };

  const errorData = {
    labels: chartData.labels,
    datasets: [{
      label: 'Reconstruction Error',
      data: chartData.error,
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 0
    }, {
      label: 'Threshold',
      data: Array(chartData.labels.length).fill(threshold),
      borderColor: '#f97316',
      borderDash: [5, 5],
      borderWidth: 2,
      pointRadius: 0,
      fill: false
    }]
  };

  const tempTrendData = {
    labels: chartData.labels,
    datasets: [{
      label: 'Melt Temp Trend',
      data: chartData.temp,
      borderColor: '#f97316',
      tension: 0.3,
      pointRadius: 0,
      fill: false
    }]
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#281105] rounded-xl border border-gray-800 p-6 flex flex-col justify-between glass-card">
        <div>
          <h3 className="text-lg font-bold border-b border-gray-700/50 pb-2 mb-4 flex items-center">
            <BrainCircuit className="text-[#f97316] mr-2 w-5 h-5" />
            Diagnostic Details
          </h3>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-[#ef4444]/10 rounded-full">
              <AlertCircle className="text-[#ef4444] w-6 h-6" />
            </div>
            <div>
              <p className="text-white font-semibold">Gradual Drift — Lining Degradation</p>
              <p className="text-[#9CA3AF] text-xs">Detected now • Confidence: 99.6%</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#9CA3AF]">Anomaly Threshold</span>
                <span className="font-mono text-white">{threshold}</span>
              </div>
              <div className="w-full bg-[#140800] rounded-full h-1.5 border border-gray-800">
                <div className="bg-gray-500 h-1.5 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#ef4444] font-semibold">Current Error Score</span>
                <span className="font-mono text-[#ef4444] font-bold">{errorScore} ({(parseFloat(errorScore)/threshold).toFixed(2)}x)</span>
              </div>
              <div className="w-full bg-[#140800] rounded-full h-1.5 relative border border-gray-800">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((parseFloat(errorScore)/0.2) * 100, 100)}%` }}
                  className="bg-[#ef4444] h-1.5 rounded-full absolute top-0 left-0 z-10 pulse-red shadow-[0_0_10px_#ef4444]"
                ></motion.div>
                <div className="absolute top-0 h-3 w-0.5 bg-white -mt-[3px] z-20" style={{ left: `${(threshold/0.2) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#281105] rounded-xl border border-gray-800 p-4 h-64">
          <h3 className="text-xs font-bold text-[#9CA3AF] mb-4 uppercase">LSTM-AE Reconstruction Error</h3>
          <Line options={chartOptions} data={errorData} />
        </div>
        <div className="bg-[#281105] rounded-xl border border-gray-800 p-4 h-64">
          <h3 className="text-xs font-bold text-[#9CA3AF] mb-4 uppercase">Temperature Trend (°C)</h3>
          <Line options={chartOptions} data={tempTrendData} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
