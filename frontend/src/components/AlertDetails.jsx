import React from 'react';
import { ArrowLeft, AlertTriangle, Activity, Wrench, Thermometer } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';

const RootCauseItem = ({ icon: Icon, title, impact }) => (
  <div className="flex items-center justify-between p-3 bg-[#140800] rounded border border-gray-800 mb-2">
    <div className="flex items-center space-x-3">
      <div className={`p-2 rounded ${impact > 70 ? 'bg-[#ef4444]/20' : 'bg-[#f97316]/20'}`}>
        <Icon className={`w-4 h-4 ${impact > 70 ? 'text-[#ef4444]' : 'text-[#f97316]'}`} />
      </div>
      <span className="text-sm font-semibold">{title}</span>
    </div>
    <div className="text-right">
      <span className={`text-xs font-bold ${impact > 70 ? 'text-[#ef4444]' : 'text-[#f97316]'}`}>{impact}% Impact</span>
      <div className="w-24 h-1 bg-gray-800 rounded mt-1 overflow-hidden">
        <div className={`h-full ${impact > 70 ? 'bg-[#ef4444]' : 'bg-[#f97316]'}`} style={{ width: `${impact}%` }}></div>
      </div>
    </div>
  </div>
);

const AlertDetails = ({ onBack }) => {

  const errorData = {
    labels: Array.from({length: 24}, (_, i) => `${i}:00`),
    datasets: [{
      label: 'Error Trend (24h)',
      data: Array.from({length: 24}, (_, i) => i < 18 ? 0.04 + Math.random()*0.02 : 0.05 + Math.pow(i-17, 2)*0.005),
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 0
    }]
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-4 mb-6 cursor-pointer text-[#9CA3AF] hover:text-white transition" onClick={onBack}>
        <ArrowLeft className="w-5 h-5" />
        <span className="font-semibold">Back to Dashboard</span>
      </div>

      <div className="bg-[#ef4444]/10 border border-[#ef4444] rounded-xl p-6 flex items-start space-x-4">
        <div className="p-3 bg-[#ef4444] rounded-full pulse-red">
          <AlertTriangle className="text-white w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#ef4444] uppercase tracking-wide mb-1">Critical: Lining Degradation Detected</h2>
          <p className="text-[#9CA3AF] text-sm">Gradual drift identified by LSTM-AE autoencoder over the last 6 hours. Furnace wall integrity is compromised.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#281105] p-6 rounded-xl border border-gray-800 glass-card">
          <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">Root Cause Analysis (SHAP)</h3>
          <div className="space-y-2">
            <RootCauseItem icon={Thermometer} title="High Temperature Excursions" impact={82} />
            <RootCauseItem icon={Activity} title="Excessive Vibration (Turbulence)" impact={45} />
            <RootCauseItem icon={Wrench} title="Power Surges" impact={28} />
          </div>

          <div className="mt-8">
            <h4 className="text-sm font-semibold text-[#f97316] mb-3">Recommended Actions</h4>
            <ul className="space-y-2 text-sm text-[#9CA3AF]">
              <li className="flex items-center"><div className="w-1.5 h-1.5 bg-[#f97316] rounded-full mr-2"></div> Reduce setpoint temperature to 1380°C</li>
              <li className="flex items-center"><div className="w-1.5 h-1.5 bg-[#f97316] rounded-full mr-2"></div> Adjust pour speed to minimize turbulence</li>
              <li className="flex items-center"><div className="w-1.5 h-1.5 bg-[#f97316] rounded-full mr-2"></div> Schedule refractory maintenance within 48h</li>
            </ul>
          </div>
        </div>

        <div className="bg-[#281105] p-6 rounded-xl border border-gray-800 glass-card">
           <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">Extended Error Trend</h3>
           <div className="h-64">
              <Line 
                data={errorData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: '#1E3448' } }
                  }
                }} 
              />
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AlertDetails;
