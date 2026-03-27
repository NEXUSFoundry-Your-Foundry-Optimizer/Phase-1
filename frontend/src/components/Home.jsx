import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layers, AlertTriangle, Clock, Hammer, ShieldCheck, Database, Cpu, Cloud, Monitor, Rocket } from 'lucide-react';

const ProblemCard = ({ icon: Icon, title, description }) => (
  <div className="bg-[#281105] p-6 rounded-xl border border-gray-800 glass-card">
    <div className="p-3 bg-red-500/10 rounded-lg inline-block mb-4">
      <Icon className="w-6 h-6 text-[#ef4444]" />
    </div>
    <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
    <p className="text-[#9CA3AF] text-sm">{description}</p>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-[#281105] p-5 rounded-xl border border-gray-800 glass-card hover:border-[#f97316]/50 transition duration-300">
    <div className="p-2 bg-[#f97316]/10 rounded-lg inline-block mb-3">
      <Icon className="w-5 h-5 text-[#f97316]" />
    </div>
    <h3 className="text-white font-bold mb-2">{title}</h3>
    <p className="text-[#9CA3AF] text-xs">{description}</p>
  </div>
);

const Home = () => {
  return (
    <div className="min-h-screen bg-[#140800] text-white selection:bg-[#f97316]/30">

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-[#f97316] opacity-10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/3 w-1/2 h-64 bg-[#f97316] opacity-10 blur-[100px] rounded-full pointer-events-none"></div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 bg-[#f97316] rounded-full animate-pulse"></span>
            <span className="text-xs font-semibold tracking-wider text-[#9CA3AF]">NEXUS-FOUNDRY PLATFORM</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6"><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f97316] to-[#ef4444]">Digital Twin</span><br />
            for Foundry Prediction
          </h1>

          <p className="text-[#9CA3AF] text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Real-time furnace monitoring • Anomaly detection • What-if simulation
          </p>

          <Link to="/dashboard" className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-[#f97316] to-[#007b73] hover:from-[#00c9bb] hover:to-[#f97316] text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-[#f97316]/25 transition duration-300 transform hover:-translate-y-1">
            <Rocket className="w-5 h-5" />
            <span>Launch Melting Twin Dashboard</span>
          </Link>
        </motion.div>
      </section>

      {/* 2. PROBLEM STATEMENT */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-gray-800">
        <div className="text-center mb-16">
          <p className="text-[#ef4444] text-sm font-bold tracking-widest uppercase mb-2">The Problem</p>
          <h2 className="text-3xl font-bold">The Cost of Blind Operations</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProblemCard
            icon={AlertTriangle}
            title="Unpredicted Downtime"
            description="Equipment failures occur without warning, halting production lines and causing massive revenue loss."
          />
          <ProblemCard
            icon={Clock}
            title="Late Defect Discovery"
            description="Defects are only found after cooling, when the metal is set and intervention is completely impossible."
          />
          <ProblemCard
            icon={Hammer}
            title="Reactive Management"
            description="Fixing failures after they happen rather than preventing them limits scaling and increases overhead."
          />
        </div>
      </section>

      {/* 3. SOLUTION OVERVIEW */}
      <section className="py-20 px-6 bg-[#161622] border-y border-gray-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-[#f97316] text-sm font-bold tracking-widest uppercase mb-2">The Solution</p>
            <h2 className="text-3xl font-bold mb-6">Multi-Modal Digital Twin Platform</h2>
            <p className="text-[#9CA3AF] mb-6 leading-relaxed">
              NEXUS-Foundry unifies equipment telemetry and process data to <strong>predict failures</strong> and visualize quality outcomes instantly.
            </p>
            <div className="bg-[#281105] border border-[#f97316]/30 p-6 rounded-xl relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#f97316] rounded-l-xl"></div>
              <h4 className="text-white font-bold flex items-center mb-2">
                <Cpu className="text-[#f97316] w-5 h-5 mr-2" />
                Cognitive Core
              </h4>
              <p className="text-sm text-[#9CA3AF]">
                A physics-aware AI assistant that simulates what-if scenarios with validated answers to provide prescriptive alerts, enabling operators to prevent downtime 8-24 hours in advance.
              </p>
            </div>
          </motion.div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#f97316]/20 to-[#f97316]/20 blur-3xl"></div>
            <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop" alt="Foundry Worker Dashboard" className="rounded-xl border border-gray-700 relative z-10 opacity-80" />
          </div>
        </div>
      </section>

      {/* 4. ARCHITECTURE FLOW */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#9CA3AF] text-sm font-bold tracking-widest uppercase mb-2">System Architecture</p>
          <h2 className="text-3xl font-bold">Data to Decisions Flow</h2>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-[#f97316] to-[#f97316] opacity-30 -z-10"></div>
          {[
            { icon: Database, title: 'Sensors', desc: 'Temp, Power' },
            { icon: Cloud, title: 'MQTT Broker', desc: 'Data Ingestion' },
            { icon: Cpu, title: 'AI Models', desc: 'LSTM-AE/PINN' },
            { icon: Layers, title: 'Digital Twins', desc: 'Melting Twin' },
            { icon: Monitor, title: 'Dashboard', desc: 'Visualization' },
          ].map((step, i) => (
            <div key={i} className="bg-[#281105] border border-gray-800 p-4 rounded-xl text-center w-full md:w-40 z-10 glass-card">
              <step.icon className="w-8 h-8 text-[#f97316] mx-auto mb-3" />
              <h4 className="font-bold text-sm mb-1">{step.title}</h4>
              <p className="text-[10px] text-[#9CA3AF]">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FEATURES */}
      <section className="py-20 px-6 bg-[#161622] border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">What Makes Us Unique</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard title="Cross-Stage Correlation" description="Connects furnace anomaly to pour defect prediction 6+ hours ahead." icon={Layers} />
            <FeatureCard title="Geometry-Aware Prediction" description="CAD shape embeddings for part-specific risk assessment." icon={ShieldCheck} />
            <FeatureCard title="Physics-Aware AI Assistant" description="RAG-powered LLM with Llama 3 answering what-if queries." icon={Cpu} />
            <FeatureCard title="Physics-Constrained Engine" description="PINN simulates thermal behavior with physics bounds." icon={Rocket} />
            <FeatureCard title="Explainable AI (SHAP)" description="'43% from temp, 24% from lining' analysis for operator trust." icon={Monitor} />
            <FeatureCard title="Continuous Learning" description="Retrains automatically with every 50 labels improving over time." icon={Database} />
          </div>
        </div>
      </section>

      {/* 6. TECH STACK & FOOTER */}
      <footer className="pt-20 pb-10 px-6 max-w-7xl mx-auto border-t border-gray-800 text-center">
        <div className="mb-12">
          <h4 className="text-sm font-bold text-[#9CA3AF] uppercase tracking-widest mb-6 border-b border-gray-800 pb-2 inline-block">Technology Stack</h4>
          <div className="flex flex-wrap justify-center gap-4 text-sm font-mono text-gray-400">
            {['React', 'Three.js', 'Tailwind CSS', 'FastAPI', 'Python', 'LSTM-AE', 'XGBoost', 'InfluxDB', 'Docker'].map(tech => (
              <span key={tech} className="bg-[#281105] px-3 py-1 rounded border border-gray-800">{tech}</span>
            ))}
          </div>
        </div>
        <p className="text-[#9CA3AF] text-sm">
          NEXUS-Foundry | AI-Powered Digital Twin Platform<br />
          © 2026 | Team NEXUS
        </p>
      </footer>

    </div>
  );
};

export default Home;
