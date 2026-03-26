import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const FurnaceAssembly = ({ anomaly }) => {
  const liningRef = useRef();
  const meltRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Pulse the red anomaly lining intensity between 1.0 and 3.5 ONLY IF ANOMALY
    if (liningRef.current) {
      if (anomaly) {
        liningRef.current.material.emissiveIntensity = 2.25 + Math.sin(time * 4) * 1.25;
        liningRef.current.material.opacity = 0.85;
      } else {
        liningRef.current.material.emissiveIntensity = 0.1;
        liningRef.current.material.opacity = 0.1;
      }
    }
    // Slowly rotate the molten iron core
    if (meltRef.current) {
      meltRef.current.rotation.y = time * 0.2;
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      {/* 1. Molten Iron Core (The Heat Source) */}
      <mesh ref={meltRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[1.1, 1.0, 2.0, 32]} />
        <meshStandardMaterial 
          color="#ff4500" 
          emissive="#ff6b00" 
          emissiveIntensity={2} 
          toneMapped={false} // Required for Bloom glow
        />
      </mesh>

      {/* 2. Degraded Refractory Lining (The Anomaly Alert) */}
      <mesh ref={liningRef} position={[0, 0.1, 0]}>
        <cylinderGeometry args={[1.3, 1.3, 2.2, 32]} />
        <meshStandardMaterial 
          color="#ef4444" 
          emissive="#dc2626" 
          transparent 
          opacity={0.85} 
          side={THREE.DoubleSide}
          toneMapped={false} 
        />
      </mesh>

      {/* 3. Copper Induction Coils (8 Stacked Rings) */}
      {[-0.8, -0.57, -0.34, -0.11, 0.11, 0.34, 0.57, 0.8].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.45, 0.08, 16, 64]} />
          <meshStandardMaterial color="#b87333" metalness={0.6} roughness={0.2} />
        </mesh>
      ))}

      {/* 4. Outer Transparent Industrial Shell (X-Ray view) */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[1.7, 1.7, 2.8, 32]} />
        <meshBasicMaterial color="#1E293B" transparent opacity={0.15} wireframe />
      </mesh>

      {/* 5. Top Lip / Pouring Ring */}
      <mesh position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.7, 0.1, 16, 64]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.4} />
      </mesh>
    </group>
  );
};

export default function MeltingTwin3D({ temp, anomaly }) {
  return (
    // The container holds the dark background and relative positioning for the UI
    <div className="w-full h-full min-h-[500px] bg-bgMain rounded-xl relative overflow-hidden border border-gray-800 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      
      {/* HTML UI Overlay - Placed absolutely over the 3D Canvas */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <p className="text-brandOrange font-mono text-xs tracking-widest mb-1 uppercase">Nexus-Foundry | Digital Twin</p>
        <div className="flex items-center space-x-2 mt-2">
          <div className={`w-2.5 h-2.5 rounded-full ${anomaly ? 'bg-red-500 animate-pulse shadow-[0_0_10px_#ef4444]' : 'bg-green-500'}`}></div>
          <h2 className={`${anomaly ? 'text-red-500' : 'text-green-500'} font-bold text-sm tracking-widest uppercase`}>
            {anomaly ? 'Furnace 3 : Critical Status' : 'Furnace 3 : Operational'}
          </h2>
        </div>
        <p className="text-white/40 text-[10px] mt-1 font-mono">CORE_TEMP: {temp}°C</p>
      </div>

      {/* The 3D Render Canvas */}
      <Canvas camera={{ position: [0, 3, 7], fov: 45 }}>
        <color attach="background" args={['#140800']} />
        
        {/* Lighting setup to highlight the copper and metal */}
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
        <pointLight position={[-5, 5, -5]} intensity={1} color="#b87333" />
        
        <FurnaceAssembly anomaly={anomaly} />

        {/* Camera Controls */}
        <OrbitControls 
          enableZoom={true} 
          autoRotate 
          autoRotateSpeed={0.8}
          maxPolarAngle={Math.PI / 2.1} // Prevent looking from underneath
          minPolarAngle={Math.PI / 6} 
        />

        {/* Post-processing: The Bloom effect makes toneMapped={false} materials glow */}
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={1} mipmapBlur intensity={2.0} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
