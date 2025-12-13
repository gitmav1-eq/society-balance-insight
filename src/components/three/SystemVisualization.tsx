import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const mouseState = { x: 0, y: 0, targetX: 0, targetY: 0, velocity: 0 };

// Frame limiter to reduce CPU usage
function useFrameLimited(callback: (state: { clock: THREE.Clock }) => void, fps = 24) {
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
      // Subtle pulse based on mouse velocity
      const scale = 1 + mouseState.velocity * 0.1;
      meshRef.current.scale.setScalar(scale);
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
      // Speed up rotation slightly based on mouse movement
      const speedMultiplier = 1 + mouseState.velocity * 0.5;
      groupRef.current.rotation.z = state.clock.elapsedTime * speed * 0.3 * speedMultiplier;
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

// Interactive particles that follow cursor with delay
function InteractiveParticles({ count = 60, theme }: { count?: number; theme: string }) {
  const pointsRef = useRef<THREE.Points>(null);
  const originalPositions = useRef<Float32Array | null>(null);
  const velocities = useRef<Float32Array | null>(null);
  
  const color = useMemo(() => {
    switch (theme) {
      case "ambient": return "#22d3ee";
      case "light": return "#64748b";
      default: return "#60a5fa";
    }
  }, [theme]);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Spread particles in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 3;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      vel[i * 3] = 0;
      vel[i * 3 + 1] = 0;
      vel[i * 3 + 2] = 0;
    }
    originalPositions.current = pos.slice();
    velocities.current = vel;
    return pos;
  }, [count]);

  useFrameLimited((state) => {
    if (!pointsRef.current || !originalPositions.current || !velocities.current) return;
    
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const origPos = originalPositions.current;
    const vel = velocities.current;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Calculate attraction toward cursor position (mapped to 3D space)
      const cursorX = mouseState.x * 4;
      const cursorY = mouseState.y * 4;
      
      // Distance-based attraction (closer particles react more)
      const dx = cursorX - posArray[i3];
      const dy = cursorY - posArray[i3 + 1];
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Gentle attraction when cursor is near
      const attractionStrength = Math.max(0, 1 - dist / 5) * 0.02 * mouseState.velocity;
      
      // Spring back to original position
      const springX = (origPos[i3] - posArray[i3]) * 0.02;
      const springY = (origPos[i3 + 1] - posArray[i3 + 1]) * 0.02;
      const springZ = (origPos[i3 + 2] - posArray[i3 + 2]) * 0.02;
      
      // Update velocities with damping
      vel[i3] = vel[i3] * 0.95 + dx * attractionStrength + springX;
      vel[i3 + 1] = vel[i3 + 1] * 0.95 + dy * attractionStrength + springY;
      vel[i3 + 2] = vel[i3 + 2] * 0.95 + springZ;
      
      // Apply velocities
      posArray[i3] += vel[i3];
      posArray[i3 + 1] += vel[i3 + 1];
      posArray[i3 + 2] += vel[i3 + 2];
      
      // Gentle ambient drift
      posArray[i3 + 2] += Math.sin(state.clock.elapsedTime * 0.2 + i) * 0.001;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial 
        color={color} 
        size={0.04} 
        transparent 
        opacity={0.5} 
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Cursor trail particles
function CursorTrail({ theme }: { theme: string }) {
  const pointsRef = useRef<THREE.Points>(null);
  const trailLength = 20;
  const positions = useMemo(() => new Float32Array(trailLength * 3), []);
  const sizes = useMemo(() => {
    const s = new Float32Array(trailLength);
    for (let i = 0; i < trailLength; i++) {
      s[i] = (1 - i / trailLength) * 0.08;
    }
    return s;
  }, []);
  
  const color = useMemo(() => {
    switch (theme) {
      case "ambient": return "#f0abfc";
      case "light": return "#a855f7";
      default: return "#a78bfa";
    }
  }, [theme]);

  useFrameLimited(() => {
    if (!pointsRef.current) return;
    
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    // Shift all positions back
    for (let i = trailLength - 1; i > 0; i--) {
      posArray[i * 3] = posArray[(i - 1) * 3];
      posArray[i * 3 + 1] = posArray[(i - 1) * 3 + 1];
      posArray[i * 3 + 2] = posArray[(i - 1) * 3 + 2];
    }
    
    // Set first position to cursor
    posArray[0] = mouseState.x * 5;
    posArray[1] = mouseState.y * 5;
    posArray[2] = 2;
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={trailLength} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={trailLength} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial 
        color={color} 
        size={0.06} 
        transparent 
        opacity={0.4} 
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function StarField({ count = 100 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return pos;
  }, [count]);

  // Stars twinkle subtly
  useFrameLimited((state) => {
    if (!pointsRef.current) return;
    const material = pointsRef.current.material as THREE.PointsMaterial;
    material.opacity = 0.2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
  });

  return (
    <points ref={pointsRef}>
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
    mouseState.x += (mouseState.targetX - mouseState.x) * 0.05;
    mouseState.y += (mouseState.targetY - mouseState.y) * 0.05;
    
    // Calculate velocity for reactive effects
    const velX = mouseState.targetX - mouseState.x;
    const velY = mouseState.targetY - mouseState.y;
    mouseState.velocity = mouseState.velocity * 0.9 + Math.sqrt(velX * velX + velY * velY) * 0.1;
    
    if (groupRef.current) {
      groupRef.current.rotation.x = mouseState.y * 0.15;
      groupRef.current.rotation.y = mouseState.x * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <CentralSphere theme={theme} />
      <OrbitRing radius={1.8} speed={0.04} theme={theme} opacity={0.15} />
      <OrbitRing radius={2.6} speed={-0.025} theme={theme} opacity={0.1} />
      <OrbitRing radius={3.5} speed={0.015} theme={theme} opacity={0.08} />
      <InteractiveParticles theme={theme} />
      <CursorTrail theme={theme} />
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
    
    let lastX = 0;
    let lastY = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseState.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseState.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
      
      // Track velocity
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
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

// Invalidate at 24fps for smoother interaction
function FrameInvalidator() {
  const { invalidate } = useThree();
  
  useEffect(() => {
    let animationId: number;
    let lastTime = 0;
    const interval = 1000 / 24;
    
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
