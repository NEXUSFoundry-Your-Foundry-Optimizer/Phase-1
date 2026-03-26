import React from 'react';
import { Database, Cpu, Cloud, Monitor, Settings, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const FlowBlock = ({ icon: Icon, label, description, delay }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="flex flex-col items-center space-y-2 bg-[#281105] p-4 rounded-lg border border-gray-800 w-32 md:w-40 text-center glass-card"
  >
    <div className="p-2 bg-[#f97316]/10 rounded-full">
      <Icon className="text-[#f97316] w-6 h-6" />
    </div>
    <p className="text-white text-[10px] md:text-xs font-bold uppercase tracking-widest">{label}</p>
    <p className="text-[#9CA3AF] text-[8px] md:text-[10px]">{description}</p>
  </motion.div>
);

const FlowArrow = ({ delay }) => (
  <motion.div 
    initial={{ scaleX: 0 }}
    animate={{ scaleX: 1 }}
    transition={{ delay, duration: 0.5 }}
    className="hidden md:block h-0.5 w-8 bg-gradient-to-r from-[#f97316] to-transparent origin-left"
  />
);

const ArchitectureFlow = () => {
  const steps = [
    { icon: Zap, label: 'Sensors', description: 'Temp, Power, Vibration' },
    { icon: Cloud, label: 'Data Stream', description: 'MQTT / Real-time Ingestion' },
    { icon: Database, label: 'Storage', description: 'Time-series (InfluxDB)' },
    { icon: Cpu, label: 'AI Models', description: 'LSTM-AE / TFT / XGBoost' },
    { icon: Settings, label: 'Twin Engine', description: 'Physics Simulation' },
    { icon: Monitor, label: 'Dashboard', description: 'Charts + Alerts' }
  ];

  return (
    <div className="bg-[#281105]/50 p-6 rounded-xl border border-gray-800">
      <h3 className="text-lg font-bold mb-6 flex items-center">
        <div className="w-1 h-6 bg-[#f97316] mr-3 rounded-full"></div>
        How the Melting Twin Works
      </h3>
      <div className="flex flex-wrap justify-center items-center gap-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.label}>
            <FlowBlock 
              icon={step.icon}
              label={step.label}
              description={step.description}
              delay={index * 0.15}
            />
            {index < steps.length - 1 && <FlowArrow delay={index * 0.15 + 0.1} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ArchitectureFlow;
