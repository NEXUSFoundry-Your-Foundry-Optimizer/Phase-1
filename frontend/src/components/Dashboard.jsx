import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroSection from './HeroSection';
import ArchitectureFlow from './ArchitectureFlow';
import MeltingTwin3D from './MeltingTwin3D';
import AnalyticsPanel from './AnalyticsPanel';
import SimulationBlock from './SimulationBlock';

const Dashboard = ({ setActivePage, hasAnomaly, setHasAnomaly }) => {
  // Mock realtime data
  const [metrics, setMetrics] = useState({
    temp: 1479,
    power: 1023,
    vibration: 0.062,
    lining: 61
  });

  // Lifted Simulation State
  const [simInputs, setSimInputs] = useState({
    temp: 1400,
    power: 850,
    vibration: 0.030,
    lining: 75
  });
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState(null);

  const handleSimulate = async () => {
    setIsSimulating(true);
    setSimResult(null);
    try {
      const response = await fetch('http://localhost:8000/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(simInputs)
      });
      const data = await response.json();
      setSimResult({
        afterError: parseFloat(data.error.toFixed(4)),
        threshold: data.threshold,
        status: data.status
      });
      setHasAnomaly(data.status === 'anomaly');
    } catch (error) {
      console.error("Simulation API Error:", error);
      setTimeout(() => {
        const fakeError = simInputs.temp > 1430 || simInputs.lining < 65 ? 1.25 : 0.45;
        const fakeStatus = fakeError > 0.7796 ? "anomaly" : "normal";
        setSimResult({
          afterError: fakeError,
          threshold: 0.7796,
          status: fakeStatus
        });
        setHasAnomaly(fakeStatus === 'anomaly');
      }, 800);
    } finally {
      setIsSimulating(false);
    }
  };

  const chartData = {
    labels: Array.from({length: 24}, (_, i) => `${i}:00`),
    error: Array.from({length: 24}, (_, i) => i < 18 ? 0.03 + Math.random()*0.02 : 0.05 + Math.pow(i-17, 2)*0.004),
    temp: Array.from({length: 24}, (_, i) => i < 16 ? 1382 + Math.random()*5 : 1382 + Math.pow(i-15, 1.3)*8)
  };
  
  // Dynamic Chart Binding: 
  // Instantly reflect the slider value for Temperature in the chart
  chartData.temp[23] = simInputs.temp;
  // If simulation was run, map the actual response error, otherwise map a fast dynamic approximation
  chartData.error[23] = simResult ? simResult.afterError : (simInputs.temp > 1430 ? 0.15 + (simInputs.temp - 1430)*0.01 : 0.05);

  // Simulate real-time feeling
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        vibration: prev.vibration + (Math.random() > 0.5 ? 0.001 : -0.001)
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <HeroSection metrics={metrics} />
      
      <ArchitectureFlow />

      {hasAnomaly && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#ef4444]/10 border border-[#ef4444] rounded-xl p-4 flex justify-between items-center pulse-red"
        >
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-[#ef4444] rounded-full"></div>
            <span className="text-[#ef4444] font-bold uppercase tracking-widest text-sm">CRITICAL: Lining Degradation Detected</span>
          </div>
          <button 
            onClick={() => setActivePage('alert')}
            className="bg-[#ef4444] hover:bg-red-500 text-white font-bold py-2 px-6 rounded transition shadow-lg shadow-red-900/50"
          >
            View Full Analysis
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AnalyticsPanel 
            errorScore={chartData.error[23].toFixed(4)} 
            threshold={simResult ? simResult.threshold : 0.7796} 
            chartData={chartData} 
          />
          <SimulationBlock 
            inputs={simInputs} 
            setInputs={setSimInputs} 
            isSimulating={isSimulating}
            simResult={simResult}
            handleSimulate={handleSimulate}
            setSimResult={setSimResult}
          />
        </div>

        <div className="lg:col-span-1">
          <MeltingTwin3D temp={simInputs.temp} anomaly={simResult ? simResult.status === 'anomaly' : hasAnomaly} />
        </div>
      </div>

      {/* Disabled Future Modules */}
      <div className="mt-12 pt-8 border-t border-gray-800">
        <h3 className="text-xl font-bold mb-6 text-white/50">Upcoming AI Modules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "TFT Forecasting", desc: "48-hour temperature & wear prediction" },
            { title: "XGBoost Defect Engine", desc: "Binary defect classification prior to pour" },
            { title: "PINN Physics Solver", desc: "Thermodynamic constraints and flow simulation" },
            { title: "RAG AI Assistant", desc: "Llama 3 powered operations manual queries" }
          ].map((module, i) => (
            <div key={i} className="bg-[#281105]/40 p-5 rounded-xl border border-gray-800/50 backdrop-blur-sm relative group overflow-hidden cursor-not-allowed">
              <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                <span className="bg-gray-800 px-3 py-1 rounded text-xs font-bold shadow-lg flex items-center">
                  <span className="w-4 h-4 mr-2" dangerouslySetInnerHTML={{__html: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'}} /> Available in future version
                </span>
              </div>
              <h4 className="text-[#f59e0b] font-bold mb-2 blur-[1px] group-hover:blur-[2px] transition">{module.title}</h4>
              <p className="text-[#9CA3AF] text-xs blur-[1px] group-hover:blur-[2px] transition">{module.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
