import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroSection from './HeroSection';
import ArchitectureFlow from './ArchitectureFlow';
import MeltingTwin3D from './MeltingTwin3D';
import AnalyticsPanel from './AnalyticsPanel';
import SimulationBlock from './SimulationBlock';
import AlertDetails from './AlertDetails';

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
    vibration: 0.80,
    lining: 95
  });
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState(null);

  // Phase 4: Tab & Stream State
  const [activeTab, setActiveTab] = useState('manual');
  const [streamIndex, setStreamIndex] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamData, setStreamData] = useState(null);
  const [streamLoading, setStreamLoading] = useState(false);

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
        const fakeError = simInputs.temp > 1430 || simInputs.lining < 65 ? 1.50 : 0.45;
        const fakeStatus = fakeError > 1.0645 ? "anomaly" : "normal";
        setSimResult({
          afterError: fakeError,
          threshold: 1.0645,
          status: fakeStatus
        });
        setHasAnomaly(fakeStatus === 'anomaly');
      }, 800);
    } finally {
      setIsSimulating(false);
    }
  };

  // Phase 4: Streaming Logic
  useEffect(() => {
    let interval;
    if (isStreaming) {
      interval = setInterval(async () => {
        setStreamLoading(true);
        try {
          const response = await fetch(`http://localhost:8000/api/dataset/row/${streamIndex}`);
          const data = await response.json();
          setStreamData(data);
          setHasAnomaly(data.status === 'anomaly');
          setStreamIndex(prev => (prev + 1) % 1000); // Loop back or stop
        } catch (error) {
          console.error("Streaming Error:", error);
        } finally {
          setStreamLoading(false);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isStreaming, streamIndex, setHasAnomaly]);

  // Separate Telemetry Histories
  const [simHistory, setSimHistory] = useState({
    error: Array(24).fill(0.15),
    temp: Array(24).fill(1385),
    power: Array(24).fill(860),
    vibration: Array(24).fill(0.032),
    labels: Array.from({length: 24}, (_, i) => `${i}:00`)
  });

  const [streamHistory, setStreamHistory] = useState({
    error: Array(24).fill(0.15),
    temp: Array(24).fill(1385),
    power: Array(24).fill(860),
    vibration: Array(24).fill(0.032),
    labels: Array.from({length: 24}, (_, i) => `${i}:00`)
  });

  // Update stream history
  useEffect(() => {
    if (streamData) {
      setStreamHistory(prev => ({
        ...prev,
        error: [...prev.error.slice(1), streamData.error],
        temp: [...prev.temp.slice(1), streamData.row.melt_temp],
        power: [...prev.power.slice(1), streamData.row.power_kw || 850],
        vibration: [...prev.vibration.slice(1), streamData.row.vibration_g || 0.03]
      }));
    }
  }, [streamData]);

  // Update sim history
  useEffect(() => {
    if (simResult) {
      setSimHistory(prev => ({
        ...prev,
        error: [...prev.error.slice(1), simResult.afterError],
        temp: [...prev.temp.slice(1), simInputs.temp],
        power: [...prev.power.slice(1), simInputs.power],
        vibration: [...prev.vibration.slice(1), simInputs.vibration]
      }));
    }
  }, [simResult, simInputs]);

  const chartData = activeTab === 'manual' ? simHistory : streamHistory;

  // Simulate real-time feeling for header metrics only
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
      
      {/* Tab Switcher */}
      <div className="flex space-x-4 border-b border-gray-800 pb-px">
        <button 
          onClick={() => setActiveTab('manual')}
          className={`pb-4 px-2 text-sm font-bold transition-all ${activeTab === 'manual' ? 'text-[#f97316] border-b-2 border-[#f97316]' : 'text-gray-500 hover:text-white'}`}
        >
          MANUAL SIMULATION
        </button>
        <button 
          onClick={() => setActiveTab('stream')}
          className={`pb-4 px-2 text-sm font-bold transition-all ${activeTab === 'stream' ? 'text-[#f97316] border-b-2 border-[#f97316]' : 'text-gray-500 hover:text-white'}`}
        >
          LIVE DATASET STREAM
        </button>
        <button 
          onClick={() => setActiveTab('alert')}
          className={`pb-4 px-2 text-sm font-bold transition-all ${activeTab === 'alert' ? 'text-[#f97316] border-b-2 border-[#f97316]' : 'text-gray-500 hover:text-white'}`}
        >
          ALERT LOGS
        </button>
      </div>

      <ArchitectureFlow />

      {hasAnomaly && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#ef4444]/10 border border-[#ef4444] rounded-xl p-4 flex justify-between items-center pulse-red"
        >
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-[#ef4444] rounded-full"></div>
            <span className="text-[#ef4444] font-bold uppercase tracking-widest text-sm">
              {activeTab === 'stream' ? 'ALERT: RECONFIGURE TEMP IN MELTING TWIN' : 'CRITICAL: Lining Degradation Detected'}
            </span>
          </div>
          <button 
            onClick={() => setActiveTab('alert')}
            className="bg-[#ef4444] hover:bg-red-500 text-white font-bold py-2 px-6 rounded transition shadow-lg shadow-red-900/50"
          >
            {activeTab === 'stream' ? 'Review Log' : 'View Full Analysis'}
          </button>
        </motion.div>
      )}

      {activeTab === 'manual' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AnalyticsPanel 
              errorScore={chartData.error[23].toFixed(4)} 
              threshold={simResult ? simResult.threshold : 1.0645} 
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
      )}
      
      {activeTab === 'stream' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#281105] border border-gray-800 rounded-xl p-6 relative overflow-hidden">
               <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">Live Stream Controller</h3>
                    <p className="text-[#9CA3AF] text-xs mt-1">Reading combined_dataset_validation.csv @ 0.5Hz</p>
                  </div>
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => setIsStreaming(true)}
                      disabled={isStreaming}
                      className={`px-6 py-2 rounded font-bold transition ${isStreaming ? 'bg-gray-800 text-gray-500' : 'bg-[#f97316] hover:bg-orange-600 text-white shadow-lg'}`}
                    >
                      START STREAM
                    </button>
                    <button 
                      onClick={() => setIsStreaming(false)}
                      disabled={!isStreaming}
                      className={`px-6 py-2 rounded font-bold transition ${!isStreaming ? 'bg-gray-800 text-gray-500' : 'bg-red-600 hover:bg-red-700 text-white shadow-lg'}`}
                    >
                      STOP
                    </button>
                  </div>
               </div>

               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                  {[
                    { label: "Current Row", val: streamIndex, color: "text-[#f97316]" },
                    { label: "Melt Temp", val: streamData?.row?.melt_temp?.toFixed(1) || '--', unit: "°C" },
                    { label: "Power", val: streamData?.row?.power_kw?.toFixed(1) || '--', unit: "kW" },
                    { label: "Lining Health", val: streamData?.row?.lining_health ? (streamData.row.lining_health * 100).toFixed(1) : '--', unit: "%" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-black/20 p-4 rounded-lg border border-white/5">
                      <p className="text-gray-500 text-[10px] uppercase tracking-tighter mb-1">{stat.label}</p>
                      <p className={`text-xl font-bold ${stat.color || 'text-white'}`}>
                        {stat.val}<span className="text-xs font-normal ml-1 opacity-50">{stat.unit}</span>
                      </p>
                    </div>
                  ))}
               </div>

               <div className="mt-8 border-t border-white/5 pt-6 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></span>
                    <span className="text-xs font-mono text-gray-400 capitalize">{isStreaming ? 'Streaming System Online' : 'System Standby'}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 uppercase font-mono">Model Output</p>
                    <p className={`text-sm font-bold ${streamData?.status === 'anomaly' ? 'text-red-500' : 'text-green-500'}`}>
                      {streamData ? streamData.status.toUpperCase() : 'NO DATA'} {(streamData?.error || 0).toFixed(4)}
                    </p>
                  </div>
               </div>
            </div>

            <AnalyticsPanel 
              errorScore={streamData ? streamData.error.toFixed(4) : "0.0000"} 
              threshold={streamData ? streamData.threshold : 1.0645} 
              chartData={chartData} 
            />
          </div>

          <div className="lg:col-span-1">
            <MeltingTwin3D 
              temp={streamData?.row?.melt_temp || simInputs.temp} 
              anomaly={streamData ? streamData.status === 'anomaly' : hasAnomaly} 
            />
          </div>
        </div>
      )}

      {activeTab === 'alert' && (
        <AlertDetails onBack={() => setActiveTab('stream')} />
      )}

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
