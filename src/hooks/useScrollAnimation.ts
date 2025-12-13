import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface UseScrollAnimationOptions {
  threshold?: number;
  duration?: number;
  y?: number;
  stagger?: number;
  delay?: number;
}

export function useScrollAnimation<T extends HTMLElement>(
  options: UseScrollAnimationOptions = {}
) {
  const ref = useRef<T>(null);
  const { threshold = 0.2, duration = 0.8, y = 40, stagger = 0.1, delay = 0 } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const children = element.querySelectorAll(".scroll-animate");
    const targets = children.length > 0 ? children : [element];

    gsap.set(targets, { opacity: 0, y });

    const animation = gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      delay,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: `top ${100 - threshold * 100}%`,
        toggleActions: "play none none none",
      },
    });

    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === element) t.kill();
      });
    };
  }, [threshold, duration, y, stagger, delay]);

  return ref;
}

export function useParallax<T extends HTMLElement>(speed: number = 0.5) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const animation = gsap.to(element, {
      yPercent: speed * 20,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      animation.kill();
    };
  }, [speed]);

  return ref;
}
