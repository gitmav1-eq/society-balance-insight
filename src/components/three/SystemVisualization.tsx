import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function SocietyNodes({ theme, count = 120 }: { theme: string; count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { positions, linePositions } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const connections: number[] = [];
    
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const radius = 2.2 + Math.random() * 0.3;
      
      positions[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
      positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (dist < 1.2 && Math.random() > 0.7) {
          connections.push(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2], positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
        }
      }
    }

    return { positions, linePositions: new Float32Array(connections) };
  }, [count]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.03;
      pointsRef.current.rotation.x = Math.sin(time * 0.02) * 0.1;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = time * 0.03;
      linesRef.current.rotation.x = Math.sin(time * 0.02) * 0.1;
    }
  });

  const colors = useMemo(() => {
    switch (theme) {
      case "cyber": return { nodes: "#00ffff", lines: "#ff00ff" };
      case "light": return { nodes: "#4b5563", lines: "#9ca3af" };
      default: return { nodes: "#60a5fa", lines: "#3b82f6" };
    }
  }, [theme]);

  return (
    <group>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={linePositions.length / 3} array={linePositions} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color={colors.lines} transparent opacity={0.15} />
      </lineSegments>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color={colors.nodes} size={0.04} transparent opacity={0.8} sizeAttenuation />
      </points>
    </group>
  );
}

const SystemVisualization = ({ theme, className = "" }: { theme: string; className?: string }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }} gl={{ antialias: true, alpha: true }} style={{ background: "transparent" }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.2} />
        <SocietyNodes theme={theme} />
      </Canvas>
    </div>
  );
};

export default SystemVisualization;
