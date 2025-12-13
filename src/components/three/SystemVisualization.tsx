import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const mouseState = { x: 0, y: 0, targetX: 0, targetY: 0 };

function ParallaxCamera() {
  const { camera } = useThree();
  const scrollProgress = useRef({ value: 0 });

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        scrollProgress.current.value = self.progress;
      },
    });

    return () => trigger.kill();
  }, []);

  useFrame(() => {
    const progress = scrollProgress.current.value;
    camera.position.z = 8 + progress * 2;
    camera.position.y = progress * 1.5 - 0.5;
    camera.position.x = Math.sin(progress * Math.PI) * 1;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function CentralSphere({ theme }: { theme: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const color = useMemo(() => {
    switch (theme) {
      case "ambient": return "#0ea5e9";
      case "light": return "#3b82f6";
      default: return "#60a5fa";
    }
  }, [theme]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial 
        color={color} 
        transparent 
        opacity={0.3} 
        wireframe 
      />
    </mesh>
  );
}

function OrbitRing({ radius, speed, theme, opacity = 0.1 }: { radius: number; speed: number; theme: string; opacity?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const color = useMemo(() => {
    switch (theme) {
      case "ambient": return "#22d3ee";
      case "light": return "#94a3b8";
      default: return "#64748b";
    }
  }, [theme]);

  useFrame((state) => {
    if (groupRef.current) {
      // Much slower rotation
      groupRef.current.rotation.z = state.clock.elapsedTime * speed * 0.3;
    }
  });

  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
    }
    return pts;
  }, [radius]);

  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <group ref={groupRef}>
      <line>
        <bufferGeometry attach="geometry" {...lineGeometry} />
        <lineBasicMaterial color={color} transparent opacity={opacity} />
      </line>
      <mesh position={[radius, 0, 0]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function StarField({ count = 150 }: { count?: number }) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25;
    }
    return pos;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.015} transparent opacity={0.25} sizeAttenuation />
    </points>
  );
}

function OrbitSystem({ theme }: { theme: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    mouseState.x += (mouseState.targetX - mouseState.x) * 0.03;
    mouseState.y += (mouseState.targetY - mouseState.y) * 0.03;
    
    if (groupRef.current) {
      groupRef.current.rotation.x = mouseState.y * 0.1;
      groupRef.current.rotation.y = mouseState.x * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <CentralSphere theme={theme} />
      <OrbitRing radius={1.8} speed={0.04} theme={theme} opacity={0.15} />
      <OrbitRing radius={2.6} speed={-0.025} theme={theme} opacity={0.1} />
      <OrbitRing radius={3.5} speed={0.015} theme={theme} opacity={0.08} />
      <StarField />
    </group>
  );
}

const SystemVisualization = ({ theme, className = "" }: { theme: string; className?: string }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => { 
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseState.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseState.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  
  if (!mounted) return null;

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 45 }} 
        gl={{ antialias: true, alpha: true }} 
        style={{ background: "transparent" }} 
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={0.3} />
        <ParallaxCamera />
        <OrbitSystem theme={theme} />
      </Canvas>
    </div>
  );
};

export default SystemVisualization;
