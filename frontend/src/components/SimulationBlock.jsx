import React from 'react';
import { FlaskConical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SimulationBlock = ({ inputs, setInputs, isSimulating, simResult, handleSimulate, setSimResult }) => {

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
    setSimResult(null);
  };

  return (
    <div className="bg-[#140800] rounded-lg p-5 border border-gray-800 shadow-inner">
      <h4 className="text-sm font-semibold text-[#f97316] mb-4 flex items-center">
        <FlaskConical className="mr-2 w-4 h-4" />
        Manual Simulation — What-If Engine
      </h4>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="flex justify-between text-[10px] uppercase text-[#9CA3AF] mb-1 font-bold tracking-wider">
            <span>Temperature</span>
            <span className="text-white">{inputs.temp}°C</span>
          </label>
          <input type="range" name="temp" min="1350" max="1500" value={inputs.temp} onChange={handleInputChange} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#f97316]" />
        </div>
        <div>
          <label className="flex justify-between text-[10px] uppercase text-[#9CA3AF] mb-1 font-bold tracking-wider">
            <span>Power</span>
            <span className="text-white">{inputs.power} kW</span>
          </label>
          <input type="range" name="power" min="500" max="1200" step="10" value={inputs.power} onChange={handleInputChange} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#f97316]" />
        </div>
        <div>
          <label className="flex justify-between text-[10px] uppercase text-[#9CA3AF] mb-1 font-bold tracking-wider">
            <span>Vibration</span>
            <span className="text-white">{inputs.vibration.toFixed(3)} g</span>
          </label>
          <input type="range" name="vibration" min="0.01" max="0.1" step="0.001" value={inputs.vibration} onChange={handleInputChange} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#f97316]" />
        </div>
        <div>
          <label className="flex justify-between text-[10px] uppercase text-[#9CA3AF] mb-1 font-bold tracking-wider">
            <span>Lining Health</span>
            <span className="text-white">{inputs.lining}%</span>
          </label>
          <input type="range" name="lining" min="10" max="100" value={inputs.lining} onChange={handleInputChange} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#ef4444]" />
        </div>
      </div>

      <button 
        onClick={handleSimulate}
        disabled={isSimulating}
        className={`w-full font-bold py-3 px-4 rounded transition flex justify-center items-center ${
          isSimulating ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-[#f97316] hover:bg-[#f59e0b] text-[#140800]'
        }`}
      >
        {isSimulating ? 'Running LSTM Engine...' : 'Run Simulation'}
      </button>

      <AnimatePresence>
        {simResult && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 pt-4 border-t border-gray-800"
          >
            <h5 className="text-xs font-bold text-[#9CA3AF] mb-3 uppercase tracking-widest text-center">Simulation Result</h5>
            <div className="flex justify-between items-center bg-[#281105] p-4 rounded-xl border border-gray-800">
              <div className="text-center w-1/3 border-r border-gray-800">
                <span className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Current Error</span>
                <span className="text-[#ef4444] font-mono text-lg line-through">0.1847</span>
              </div>
              
              <div className="text-center w-1/3 px-2">
                <span className="block text-[10px] text-white uppercase font-bold mb-1 border border-white/10 rounded-full inline-block px-2 bg-white/5">Threshold: {simResult.threshold}</span>
              </div>

              <div className="text-center w-1/3 border-l border-gray-800">
                <span className="block text-[10px] text-[#f97316] uppercase font-bold mb-1">Simulated Error</span>
                <span className={`font-mono font-black text-2xl ${simResult.status === 'anomaly' ? 'text-[#ef4444]' : 'text-[#f97316]'}`}>
                  {simResult.afterError}
                </span>
                <span className={`block text-[10px] uppercase font-bold mt-1 ${simResult.status === 'anomaly' ? 'text-[#ef4444]' : 'text-green-500'}`}>
                  {simResult.status === 'anomaly' ? '🔴 HIGH RISK' : '🟢 SAFE'}
                </span>
              </div>
            </div>
            <p className="text-[10px] text-[#9CA3AF] mt-3 italic text-center">
              {simResult.status === 'anomaly' ? 'Simulated parameters result in anomaly. Adjust inputs to find safe operating window.' : 'Optimal setup detected. Changes are safe to apply.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SimulationBlock;
