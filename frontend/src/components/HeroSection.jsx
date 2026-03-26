import React from 'react';
import { Thermometer, Zap, Activity, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const MetricCard = ({ icon: Icon, label, value, unit, trend, color, glowClass }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-[#281105] p-5 rounded-xl border border-gray-800 shadow-lg ${glowClass} relative overflow-hidden`}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-[#9CA3AF] text-xs uppercase tracking-wider font-semibold">{label}</p>
        <h2 className="text-3xl font-bold text-white mt-1">
          {value}<span className="text-lg text-[#9CA3AF] ml-1">{unit}</span>
        </h2>
      </div>
      <div className={`p-3 rounded-lg bg-opacity-10 ${color.bg}`}>
        <Icon className={`w-6 h-6 ${color.text}`} />
      </div>
    </div>
    <p className={`text-xs mt-3 font-semibold ${trend.color}`}>
      {trend.label}
    </p>
  </motion.div>
);

const HeroSection = ({ metrics }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold">Furnace 3 - Gray Iron FG250</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">LSTM-AE Continuous Monitoring | Model v1.0</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#9CA3AF] uppercase tracking-widest font-bold">System Load</p>
          <div className="flex items-center space-x-2 mt-1">
            <div className="w-32 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-[#f97316] w-[78%]"></div>
            </div>
            <span className="text-[#f97316] text-xs font-bold">78%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          icon={Thermometer}
          label="Melt Temp"
          value={metrics.temp}
          unit="°C"
          trend={{ label: `+${metrics.temp - 1420}°C over normal`, color: 'text-[#ef4444]' }}
          color={{ text: 'text-[#ef4444]', bg: 'bg-[#ef4444]' }}
          glowClass="border-[#ef4444]/50 glow-red"
        />
        <MetricCard 
          icon={Zap}
          label="Power Consumption"
          value={metrics.power}
          unit="kW"
          trend={{ label: 'Elevated usage', color: 'text-[#f97316]' }}
          color={{ text: 'text-[#f97316]', bg: 'bg-[#f97316]' }}
          glowClass="border-[#f97316]/50 glow-orange"
        />
        <MetricCard 
          icon={Activity}
          label="Vibration"
          value={metrics.vibration.toFixed(3)}
          unit="g"
          trend={{ label: 'High Turbulence', color: 'text-[#f97316]' }}
          color={{ text: 'text-[#f97316]', bg: 'bg-[#f97316]' }}
          glowClass="border-gray-800"
        />
        <MetricCard 
          icon={ShieldAlert}
          label="Lining Health"
          value={metrics.lining}
          unit="%"
          trend={{ label: 'Critical (Below 65%)', color: 'text-[#ef4444]' }}
          color={{ text: 'text-[#ef4444]', bg: 'bg-[#ef4444]' }}
          glowClass="border-[#ef4444]/50 glow-red"
        />
      </div>
    </div>
  );
};

export default HeroSection;
