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

  const powerTrendData = {
    labels: chartData.labels,
    datasets: [{
      label: 'Power kW',
      data: chartData.power || Array(chartData.labels.length).fill(850),
      borderColor: '#f59e0b',
      tension: 0.3,
      pointRadius: 0,
      fill: false
    }]
  };

  const vibTrendData = {
    labels: chartData.labels,
    datasets: [{
      label: 'Vibration g',
      data: chartData.vibration || Array(chartData.labels.length).fill(0.03),
      borderColor: '#00AFA3',
      tension: 0.3,
      pointRadius: 0,
      fill: false
    }]
  };

  const statusColor = errorScore > threshold ? '#ef4444' : (errorScore > 0.4 ? '#f59e0b' : '#22c55e');

  return (
    <div className="space-y-6">
      <div className="bg-[#281105] rounded-xl border border-gray-800 p-6 flex flex-col justify-between glass-card">
        <div>
          <h3 className="text-lg font-bold border-b border-gray-700/50 pb-2 mb-4 flex items-center">
            <BrainCircuit className="text-[#f97316] mr-2 w-5 h-5" />
            Adaptive Diagnostic Intelligence
          </h3>
          <div className="flex items-center space-x-3 mb-6">
            <div className={`p-2 rounded-full ${parseFloat(errorScore) > threshold ? 'bg-[#ef4444]/10' : 'bg-[#22c55e]/10'}`}>
              <AlertCircle className={`${parseFloat(errorScore) > threshold ? 'text-[#ef4444]' : 'text-[#22c55e]'} w-6 h-6`} />
            </div>
            <div>
              <p className="text-white font-semibold">
                {parseFloat(errorScore) > threshold ? 'Anomaly Detected' : (parseFloat(errorScore) > 0.4 ? 'Operating Warning' : 'Safe Operation')}
              </p>
              <p className="text-[#9CA3AF] text-xs">LSTM-AE Reconstruction Metric • Threshold: {threshold}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#9CA3AF]">Confidence Boundary</span>
                <span className="font-mono text-white">{threshold}</span>
              </div>
              <div className="w-full bg-[#140800] rounded-full h-1.5 border border-gray-800">
                <div className="bg-orange-500/50 h-1.5 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: statusColor }} className="font-semibold uppercase tracking-widest text-[10px]">Current Health Metric</span>
                <span className="font-mono font-bold" style={{ color: statusColor }}>{errorScore}</span>
              </div>
              <div className="w-full bg-[#140800] rounded-full h-2 relative border border-gray-800 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((parseFloat(errorScore)/(threshold * 2)) * 100, 100)}%` }}
                  className="h-full rounded-full absolute top-0 left-0 z-10 transition-colors duration-500"
                  style={{ backgroundColor: statusColor, boxShadow: `0 0 15px ${statusColor}66` }}
                ></motion.div>
                <div className="absolute top-0 h-full w-0.5 bg-white z-20" style={{ left: '50%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#281105] rounded-xl border border-gray-800 p-4 h-56">
          <h3 className="text-[10px] font-bold text-[#9CA3AF] mb-4 uppercase tracking-widest">Reconstruction Error</h3>
          <div className="h-40"><Line options={chartOptions} data={errorData} /></div>
        </div>
        <div className="bg-[#281105] rounded-xl border border-gray-800 p-4 h-56">
          <h3 className="text-[10px] font-bold text-[#9CA3AF] mb-4 uppercase tracking-widest">Melt Temperature (°C)</h3>
          <div className="h-40"><Line options={chartOptions} data={tempTrendData} /></div>
        </div>
        <div className="bg-[#281105] rounded-xl border border-gray-800 p-4 h-56">
          <h3 className="text-[10px] font-bold text-[#9CA3AF] mb-4 uppercase tracking-widest">Induction Power (kW)</h3>
          <div className="h-40"><Line options={chartOptions} data={powerTrendData} /></div>
        </div>
        <div className="bg-[#281105] rounded-xl border border-gray-800 p-4 h-56">
          <h3 className="text-[10px] font-bold text-[#9CA3AF] mb-4 uppercase tracking-widest">Sensor Vibration (g)</h3>
          <div className="h-40"><Line options={chartOptions} data={vibTrendData} /></div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
