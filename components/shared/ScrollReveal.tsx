"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number; // ms delay
  duration?: number; // ms duration
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number; // px to travel
  scale?: number; // initial scale (e.g. 0.96 for cards)
  once?: boolean;
  className?: string;
  threshold?: number;
}

export function ScrollReveal({
  children,
  delay = 0,
  duration = 750,
  direction = "up",
  distance = 28,
  scale = 1,
  once = false,
  className = "",
  threshold = 0.08,
  style,
  ...props
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect user's accessibility reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(el);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: "60px 0px -40px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold]);

  const getTransform = () => {
    if (isVisible) return "translate3d(0, 0, 0) scale(1)";
    let x = 0;
    let y = 0;
    if (direction === "up") y = distance;
    if (direction === "down") y = -distance;
    if (direction === "left") x = distance;
    if (direction === "right") x = -distance;
    return `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  };

  return (
    <div
      ref={ref}
      className={cn(
        "will-change-[transform,opacity] transition-all motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:transition-none",
        className
      )}
      style={{
        ...style,
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export default ScrollReveal;
