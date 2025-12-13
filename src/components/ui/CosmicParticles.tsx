import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  angle: number;
  active: boolean;
  trail: Array<{ x: number; y: number; opacity: number }>;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  speed: number;
}

interface CosmicParticlesProps {
  particleCount?: number;
  showShootingStars?: boolean;
  intensity?: "low" | "medium" | "high";
}

const CosmicParticles = ({ 
  particleCount = 40, 
  showShootingStars = false,
  intensity = "low" 
}: CosmicParticlesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });

  const opacityMultiplier = intensity === "low" ? 0.4 : intensity === "medium" ? 0.6 : 0.8;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.3,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.4 + 0.1,
      twinkleSpeed: Math.random() * 0.015 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    // Initialize shooting stars pool
    if (showShootingStars) {
      shootingStarsRef.current = Array.from({ length: 3 }, () => ({
        x: 0,
        y: 0,
        length: 0,
        speed: 0,
        opacity: 0,
        angle: 0,
        active: false,
        trail: [],
      }));
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    // Handle click to create ripple
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Create multiple ripples for a more cosmic effect
      for (let i = 0; i < 3; i++) {
        ripplesRef.current.push({
          x,
          y,
          radius: 0,
          maxRadius: 120 + i * 40,
          opacity: 0.4 - i * 0.1,
          speed: 3 + i * 0.5,
        });
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    
    // Listen for clicks on parent element since canvas has pointer-events: none
    const parent = canvas.parentElement;
    parent?.addEventListener("click", handleClick);

    let time = 0;
    let lastShootingStarTime = 0;

    const spawnShootingStar = () => {
      const inactiveStar = shootingStarsRef.current.find(s => !s.active);
      if (!inactiveStar) return;

      inactiveStar.x = Math.random() * canvas.width * 0.8;
      inactiveStar.y = Math.random() * canvas.height * 0.3;
      inactiveStar.length = Math.random() * 60 + 40;
      inactiveStar.speed = Math.random() * 4 + 3;
      inactiveStar.opacity = Math.random() * 0.4 + 0.2;
      inactiveStar.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
      inactiveStar.active = true;
      inactiveStar.trail = [];
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.016;

      // Get primary color from CSS variable and convert to proper format
      const computedStyle = getComputedStyle(document.documentElement);
      const primaryHsl = computedStyle.getPropertyValue("--primary").trim();
      
      // Helper function to create proper hsl color with alpha
      const hslColor = (alpha: number) => `hsl(${primaryHsl} / ${alpha})`;

      // Spawn shooting stars occasionally (every 8-15 seconds)
      if (showShootingStars && time - lastShootingStarTime > 8 + Math.random() * 7) {
        spawnShootingStar();
        lastShootingStarTime = time;
      }

      // Draw and update shooting stars
      shootingStarsRef.current.forEach((star) => {
        if (!star.active) return;

        // Update position
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;

        // Add to trail
        star.trail.unshift({ x: star.x, y: star.y, opacity: star.opacity });
        if (star.trail.length > 20) star.trail.pop();

        // Draw trail
        star.trail.forEach((point, i) => {
          const trailOpacity = point.opacity * (1 - i / star.trail.length) * opacityMultiplier;
          const trailSize = (1 - i / star.trail.length) * 2;
          
          ctx.beginPath();
          ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2);
          ctx.fillStyle = hslColor(trailOpacity);
          ctx.fill();
        });

        // Draw head glow
        const headGradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, 8
        );
        headGradient.addColorStop(0, hslColor(star.opacity * opacityMultiplier));
        headGradient.addColorStop(1, hslColor(0));
        ctx.beginPath();
        ctx.arc(star.x, star.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = headGradient;
        ctx.fill();

        // Deactivate if out of bounds
        if (star.x > canvas.width + 50 || star.y > canvas.height + 50) {
          star.active = false;
          star.trail = [];
        }
      });

      // Draw particles
      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Subtle mouse attraction
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 120 && distance > 0) {
          const force = (120 - distance) / 120 * 0.01;
          particle.x += dx * force;
          particle.y += dy * force;
        }

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Twinkle effect
        const twinkle = Math.sin(time * particle.twinkleSpeed * 60 + particle.twinkleOffset);
        const currentOpacity = particle.opacity * (0.5 + twinkle * 0.5) * opacityMultiplier;

        // Draw particle with subtle glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2.5
        );
        gradient.addColorStop(0, hslColor(currentOpacity));
        gradient.addColorStop(0.5, hslColor(currentOpacity * 0.2));
        gradient.addColorStop(1, hslColor(0));
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = hslColor(Math.min(currentOpacity + 0.1, 1));
        ctx.fill();
      });

      // Draw subtle connecting lines
      particlesRef.current.forEach((p1, i) => {
        particlesRef.current.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 80) {
            const opacity = (1 - distance / 80) * 0.08 * opacityMultiplier;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = hslColor(opacity);
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      // Draw and update ripples
      ripplesRef.current = ripplesRef.current.filter((ripple) => {
        ripple.radius += ripple.speed;
        const progress = ripple.radius / ripple.maxRadius;
        const currentOpacity = ripple.opacity * (1 - progress) * opacityMultiplier;

        if (currentOpacity <= 0.01) return false;

        // Draw ripple ring
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = hslColor(currentOpacity);
        ctx.lineWidth = 2 * (1 - progress);
        ctx.stroke();

        // Draw inner glow
        const glowGradient = ctx.createRadialGradient(
          ripple.x, ripple.y, ripple.radius * 0.8,
          ripple.x, ripple.y, ripple.radius
        );
        glowGradient.addColorStop(0, hslColor(0));
        glowGradient.addColorStop(0.5, hslColor(currentOpacity * 0.3));
        glowGradient.addColorStop(1, hslColor(0));
        
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        return true;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      parent?.removeEventListener("click", handleClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, showShootingStars, opacityMultiplier]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.5 }}
    />
  );
};

export default CosmicParticles;
