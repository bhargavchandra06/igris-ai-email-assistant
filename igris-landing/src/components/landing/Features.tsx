"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Sparkles,
  Reply,
  SpellCheck,
  Palette,
  FileText,
  Type,
} from "lucide-react";
import { useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";


const items: {
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
}[] = [
  {
    icon: Sparkles,
    title: "Generate Emails",
    desc: "Turn one line into a polished, on-brand email in seconds.",
    color: "from-[#4F46E5] to-[#8B5CF6]",
  },
  {
    icon: Reply,
    title: "Reply Instantly",
    desc: "Contextual replies that sound like you — never templated.",
    color: "from-[#06B6D4] to-[#4F46E5]",
  },
  {
    icon: SpellCheck,
    title: "Grammar Fix",
    desc: "Silent copy‑editor that polishes every draft as you type.",
    color: "from-[#8B5CF6] to-[#EC4899]",
  },
  {
    icon: Palette,
    title: "Tone Changer",
    desc: "Formal, friendly, assertive, apologetic — one tap to switch.",
    color: "from-[#F59E0B] to-[#EF4444]",
  },
  {
    icon: FileText,
    title: "Email Summarizer",
    desc: "Long thread? Get the gist in three crisp bullet points.",
    color: "from-[#10B981] to-[#06B6D4]",
  },
  {
    icon: Type,
    title: "Subject Generator",
    desc: "Subject lines that actually get opened — data‑backed suggestions.",
    color: "from-[#8B5CF6] to-[#06B6D4]",
  },
];

function Card({
  icon: Icon,
  title,
  desc,
  color,
  index,
}: (typeof items)[number] & { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 150, damping: 15 });
  const ry = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 150, damping: 15 });

  function onMove(e: React.MouseEvent) {
    if (isMobile) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }


  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: index * 0.06 }}
      style={isMobile ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className="group relative"
    >

      <div className="glass relative overflow-hidden rounded-2xl p-6 transition-transform duration-300 group-hover:-translate-y-1">
        {/* hover glow */}
        <div
          className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${color} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-30`}
        />
        <div className="relative">
          <div
            className={`inline-grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${color} shadow-lg`}
          >
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Icon className="h-5 w-5 text-white" />
            </motion.div>
          </div>
          <h3 className="mt-5 text-lg font-semibold tracking-tight text-white">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-white/60">{desc}</p>
        </div>

        {/* corner shine */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
      </div>
    </motion.div>
  );
}

export function Features() {
  return (
    <section id="features" className="relative py-20 sm:py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass inline-flex rounded-full px-3 py-1 text-xs text-white/70"
          >
            Features
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
          >
            Everything you need to{" "}
            <span className="text-gradient">move faster in Gmail.</span>
          </motion.h2>
          <p className="mt-4 text-sm text-white/60 sm:text-base">
            Six focused superpowers, one calm interface. IGRIS lives quietly
            inside your compose window until you need it.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">

          {items.map((it, i) => (
            <Card key={it.title} {...it} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
