"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function BackgroundFX() {
  const isMobile = useIsMobile();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 20 });
  const sy = useSpring(my, { stiffness: 40, damping: 20 });
  const tx1 = useTransform(sx, (v) => v * 30);
  const ty1 = useTransform(sy, (v) => v * 30);
  const tx2 = useTransform(sx, (v) => v * -20);
  const ty2 = useTransform(sy, (v) => v * -20);

  useEffect(() => {
    if (isMobile) return;
    const handler = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mx, my, isMobile]);

  const particleCount = isMobile ? 10 : 24;


  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 700px at 15% -10%, rgba(79,70,229,0.35), transparent 60%), radial-gradient(900px 600px at 90% 10%, rgba(6,182,212,0.22), transparent 60%), radial-gradient(1000px 800px at 50% 110%, rgba(139,92,246,0.28), transparent 60%), #050816",
        }}
      />
      {/* grid */}
      <div className="absolute inset-0 bg-grid opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />

      {/* floating orbs */}
      <motion.div
        style={{ x: tx1, y: ty1 }}
        className="absolute -top-32 left-1/4 h-[280px] w-[280px] rounded-full sm:h-[420px] sm:w-[420px]"
      >
        <div className="h-full w-full rounded-full bg-[#4F46E5] opacity-30 blur-[100px] sm:blur-[120px]" />
      </motion.div>
      <motion.div
        style={{ x: tx2, y: ty2 }}
        className="absolute top-1/3 right-0 h-[260px] w-[260px] rounded-full sm:h-[380px] sm:w-[380px]"
      >
        <div className="h-full w-full rounded-full bg-[#06B6D4] opacity-25 blur-[100px] sm:blur-[120px]" />
      </motion.div>
      <motion.div
        style={{ x: tx1, y: ty2 }}
        className="absolute bottom-0 left-10 h-[240px] w-[240px] rounded-full sm:h-[360px] sm:w-[360px]"
      >
        <div className="h-full w-full rounded-full bg-[#8B5CF6] opacity-25 blur-[100px] sm:blur-[120px]" />
      </motion.div>

      {/* particles */}
      {Array.from({ length: particleCount }).map((_, i) => (

        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white/60"
          style={{
            left: `${(i * 53) % 100}%`,
            top: `${(i * 37) % 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.9, 0.2],
          }}
          transition={{
            duration: 4 + (i % 5),
            repeat: Infinity,
            delay: (i % 7) * 0.4,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* noise */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />
    </div>
  );
}
