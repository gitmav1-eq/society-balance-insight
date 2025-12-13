import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const mouseState = { x: 0, y: 0, targetX: 0, targetY: 0 };

// Frame limiter to reduce CPU usage - only render at 20fps instead of 60fps
function useFrameLimited(callback: (state: { clock: THREE.Clock }) => void, fps = 20) {
  const lastTime = useRef(0);
  const interval = 1000 / fps;
  
  useFrame((state) => {
    const now = state.clock.elapsedTime * 1000;
    if (now - lastTime.current >= interval) {
      lastTime.current = now;
      callback(state);
    }
  });
}

function ParallaxCamera() {
  const { camera } = useThree();
  const scrollProgress = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const updateScrollProgress = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.current = docHeight > 0 ? window.scrollY / docHeight : 0;
      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(updateScrollProgress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateScrollProgress();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrameLimited((state) => {
    const progress = scrollProgress.current;
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

  useFrameLimited((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.8, 24, 24]} />
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

  useFrameLimited((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * speed * 0.3;
    }
  });

  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 32; i++) {
      const angle = (i / 32) * Math.PI * 2;
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
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function StarField({ count = 80 }: { count?: number }) {
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

  useFrameLimited(() => {
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
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => { 
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseState.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseState.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Only render when visible in viewport
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);
  
  if (!mounted) return null;

  return (
    <div ref={containerRef} className={`w-full h-full ${className}`}>
      {isVisible && (
        <Canvas 
          camera={{ position: [0, 0, 8], fov: 45 }} 
          gl={{ antialias: false, alpha: true, powerPreference: "low-power" }} 
          style={{ background: "transparent" }} 
          dpr={1}
          frameloop="demand"
        >
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={0.3} />
          <ParallaxCamera />
          <OrbitSystem theme={theme} />
          <FrameInvalidator />
        </Canvas>
      )}
    </div>
  );
};

// Invalidate at 20fps instead of 60fps
function FrameInvalidator() {
  const { invalidate } = useThree();
  
  useEffect(() => {
    let animationId: number;
    let lastTime = 0;
    const interval = 1000 / 20; // 20fps
    
    const animate = (time: number) => {
      if (time - lastTime >= interval) {
        lastTime = time;
        invalidate();
      }
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [invalidate]);
  
  return null;
}

export default SystemVisualization;
