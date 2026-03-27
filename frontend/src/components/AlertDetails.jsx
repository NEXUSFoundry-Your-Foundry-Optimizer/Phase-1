import React, { useState, useEffect } from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AlertDetails = ({ onBack }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/alerts')
      .then(res => res.json())
      .then(data => {
        setLogs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load logs:", err);
        setLoading(false);
      });
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-4 mb-6 cursor-pointer text-[#9CA3AF] hover:text-white transition" onClick={onBack}>
        <ArrowLeft className="w-5 h-5" />
        <span className="font-semibold">Back to Melting Twin</span>
      </div>

      <div className="bg-[#140800] border border-gray-800 rounded-xl p-6 glass-card">
        <h2 className="text-2xl font-black text-white mb-6 flex items-center">
          <AlertCircle className="text-[#f97316] mr-3" />
          Historical Alert Log
        </h2>

        {loading ? (
          <p className="text-gray-500 p-4">Loading persistent logs...</p>
        ) : logs.length === 0 ? (
          <p className="text-gray-500 p-4">No anomalies logged yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="text-xs text-gray-500 uppercase bg-[#0a0400] border-b border-gray-800">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Error Score</th>
                  <th className="px-4 py-3">Temp (°C)</th>
                  <th className="px-4 py-3">Power (kW)</th>
                  <th className="px-4 py-3">Vib (g)</th>
                  <th className="px-4 py-3">Lining</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr key={i} className="border-b border-gray-800 hover:bg-[#1f0d05] transition">
                    <td className="px-4 py-3 font-mono text-xs">{log.timestamp || 'Live Stream Row'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${log.status === 'anomaly' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'}`}>
                        {log.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-white">{(parseFloat(log.error) || 0).toFixed(4)}</td>
                    <td className="px-4 py-3">{log.melt_temp?.toFixed(1) || '--'}</td>
                    <td className="px-4 py-3">{log.power_kw?.toFixed(1) || '--'}</td>
                    <td className="px-4 py-3">{log.vibration_g?.toFixed(3) || '--'}</td>
                    <td className="px-4 py-3">{log.lining_health ? (log.lining_health * 100).toFixed(1) + '%' : '--'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AlertDetails;
