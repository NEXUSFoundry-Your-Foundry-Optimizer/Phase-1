import React from 'react';
import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';

const TwinVisualization = ({ temp, anomaly }) => {
  return (
    <div className="bg-[#281105] rounded-xl border border-gray-800 p-6 flex flex-col items-center justify-center relative overflow-hidden h-full min-h-[400px]">
      <h3 className="absolute top-6 left-6 text-sm font-bold text-[#9CA3AF] uppercase tracking-widest">Live Furnace View</h3>
      
      <div className="relative w-64 h-64 mt-8">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-8 border-gray-800 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>
        
        {/* Anomaly Glow */}
        {anomaly && (
          <div className="absolute inset-2 rounded-full border-4 border-[#ef4444] pulse-red opacity-80"></div>
        )}

        {/* Core Heat */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute inset-6 rounded-full bg-gradient-to-br from-[#f97316] to-[#ef4444] shadow-[0_0_50px_rgba(239,68,68,0.6)] flex items-center justify-center overflow-hidden h-full w-full`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_30%,#00000044_100%)]"></div>
          <div className="heat-shimmer absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <Flame className="text-white/60 w-16 h-16 relative z-10" />
        </motion.div>

        {/* Temp Label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-white text-2xl font-black drop-shadow-lg [text-shadow:_0_2px_10px_rgb(0_0_0_/_40%)]">
            {temp}°C
          </span>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 w-full">
        <div className="bg-[#140800] p-3 rounded-lg border border-gray-800 text-center">
          <span className="block text-[#9CA3AF] text-[10px] uppercase font-bold mb-1">Zone 1 Status</span>
          <span className="text-[#ef4444] font-black text-lg">CRITICAL</span>
        </div>
        <div className="bg-[#140800] p-3 rounded-lg border border-gray-800 text-center">
          <span className="block text-[#9CA3AF] text-[10px] uppercase font-bold mb-1">Zone 2 Status</span>
          <span className="text-[#f97316] font-black text-lg">WARNING</span>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#f97316] opacity-5 rounded-full blur-3xl"></div>
    </div>
  );
};

export default TwinVisualization;
