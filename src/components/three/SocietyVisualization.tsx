import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function SocietySphere({ theme, intensity = 0.5 }: { theme: string; intensity?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const nodesRef = useRef<THREE.Points>(null);
  
  // Create node positions on sphere surface
  const nodePositions = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      const phi = Math.acos(-1 + (2 * i) / 200);
      const theta = Math.sqrt(200 * Math.PI) * phi;
      const radius = 2;
      positions[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
      positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1;
    }
    if (nodesRef.current) {
      nodesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      nodesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1;
    }
  });

  const colors = useMemo(() => {
    switch (theme) {
      case "cyber":
        return { sphere: "#00ffff", nodes: "#ff00ff", glow: "#00ffff" };
      case "light":
        return { sphere: "#374151", nodes: "#6366f1", glow: "#374151" };
      default:
        return { sphere: "#3b82f6", nodes: "#60a5fa", glow: "#3b82f6" };
    }
  }, [theme]);

  return (
    <group>
      {/* Main sphere wireframe */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color={colors.sphere}
          wireframe
          transparent
          opacity={0.15 + intensity * 0.1}
        />
      </mesh>
      
      {/* Inner glow sphere */}
      <mesh>
        <sphereGeometry args={[1.9, 16, 16]} />
        <meshBasicMaterial
          color={colors.glow}
          transparent
          opacity={0.03 + intensity * 0.02}
        />
      </mesh>

      {/* Node points */}
      <Points ref={nodesRef} positions={nodePositions} stride={3}>
        <PointMaterial
          transparent
          color={colors.nodes}
          size={0.04 + intensity * 0.02}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
}

function ParticleRing({ theme }: { theme: string }) {
  const ref = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const positions = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      const angle = (i / 500) * Math.PI * 2;
      const radius = 3 + Math.random() * 0.5;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  const color = theme === "cyber" ? "#00ffff" : theme === "light" ? "#9ca3af" : "#60a5fa";

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color={color}
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  );
}

interface SocietyVisualizationProps {
  theme: string;
  intensity?: number;
  className?: string;
}

const SocietyVisualization = ({ theme, intensity = 0.5, className = "" }: SocietyVisualizationProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <SocietySphere theme={theme} intensity={intensity} />
        <ParticleRing theme={theme} />
      </Canvas>
    </div>
  );
};

export default SocietyVisualization;
