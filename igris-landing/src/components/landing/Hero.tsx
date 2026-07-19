"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Download, Wand2, Play, ShieldCheck, Lock, Code2, Zap, UserX } from "lucide-react";
import { useEffect, useState } from "react";

const steps = [
  {
    label: "Prompt",
    body: "Need leave tomorrow",
    kind: "prompt" as const,
  },
  {
    label: "Thinking",
    kind: "thinking" as const,
  },
  {
    label: "Generated",
    subject: "Leave Request for Tomorrow",
    body:
      "Hi Sarah,\n\nI hope you're doing well. I'd like to request a day of leave tomorrow for a personal matter. I've cleared my priorities and briefed the team, so nothing should be blocked in my absence.\n\nThank you for understanding.\n\nBest,\nAlex",
    kind: "email" as const,
  },
  {
    label: "Inserted",
    kind: "inserted" as const,
  },
];

function ComposeMock() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const durations = [2200, 1800, 3800, 1400];
    const t = setTimeout(() => setI((v) => (v + 1) % steps.length), durations[i]);
    return () => clearTimeout(t);
  }, [i]);

  const step = steps[i];

  return (
    <div className="glass-strong glow-ring relative w-full max-w-[520px] overflow-hidden rounded-2xl">
      {/* header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-white/60">
          <div className="h-4 w-4 rounded bg-gradient-to-br from-red-500 to-yellow-400" />
          New Message
        </div>
        <div className="w-10" />
      </div>

      <div className="space-y-3 px-5 py-4 text-sm">
        <div className="flex items-center gap-2 border-b border-white/5 pb-2">
          <span className="text-white/40">To</span>
          <span className="text-white/80">sarah@company.com</span>
        </div>
        <div className="flex items-center gap-2 border-b border-white/5 pb-2">
          <span className="text-white/40">Subject</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={step.kind === "email" ? "s-full" : "s-empty"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-white/90"
            >
              {step.kind === "email" || step.kind === "inserted"
                ? "Leave Request for Tomorrow"
                : ""}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="min-h-[190px] whitespace-pre-line text-white/85">
          <AnimatePresence mode="wait">
            {step.kind === "prompt" && (
              <motion.div
                key="p"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3"
              >
                <div className="mt-1 grid h-7 w-7 place-items-center rounded-lg bg-white/10 text-white/80">
                  <Wand2 className="h-3.5 w-3.5" />
                </div>
                <div className="rounded-xl bg-white/5 px-3 py-2 text-white/80">
                  {step.body}
                  <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-white/70 align-middle" />
                </div>
              </motion.div>
            )}

            {step.kind === "thinking" && (
              <motion.div
                key="t"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#06B6D4]">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((k) => (
                    <motion.span
                      key={k}
                      className="h-2 w-2 rounded-full bg-white/70"
                      animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                      transition={{
                        duration: 0.9,
                        repeat: Infinity,
                        delay: k * 0.12,
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs text-white/50">IGRIS is drafting…</span>
              </motion.div>
            )}

            {(step.kind === "email" || step.kind === "inserted") && (
              <motion.div
                key="e"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[13px] leading-relaxed text-white/85"
              >
                {steps[2].body}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          <motion.button
            whileTap={{ scale: 0.96 }}
            className="relative inline-flex items-center gap-2 overflow-hidden rounded-full px-4 py-2 text-xs font-medium text-white"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#4F46E5] to-[#06B6D4]" />
            <span className="relative flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              {step.kind === "inserted" ? "Inserted ✓" : "Generate with IGRIS"}
            </span>
          </motion.button>
          <button className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-white/70">
            <Send className="h-3.5 w-3.5" /> Send
          </button>
        </div>
      </div>

      {/* moving beam */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-2xl"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0 60%, rgba(139,92,246,0.4) 70%, rgba(6,182,212,0.4) 80%, transparent 90%)",
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          padding: 1,
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative pb-16 pt-28 sm:pb-24 sm:pt-32 md:pt-40 md:pb-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 md:gap-16 lg:grid-cols-[1.05fr_1fr]">
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] text-white/80 sm:text-xs"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Now live for Gmail on Chrome
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-5 text-[2.5rem] font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Write better emails{" "}
            <span className="text-gradient">with AI.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg lg:mx-0"
          >
            Generate professional emails, reply instantly, improve drafts, fix
            grammar, summarize conversations, and craft perfect subject lines —
            directly inside Gmail.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            <a
              id="download"
              href="/download/igris-extension.zip"
              download
              className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-4 text-sm font-semibold text-white sm:w-auto sm:py-3"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#06B6D4]" />
              <span className="absolute inset-0 rounded-full opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-70"
                style={{ background: "linear-gradient(90deg,#4F46E5,#06B6D4)" }}
              />
              <span className="relative flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download IGRIS
              </span>
            </a>
            <a
              href="https://youtu.be/TdSvI6ZfRUI?si=45K7Z2oKfObiq0SQ"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-4 text-sm font-semibold text-white/90 backdrop-blur transition-colors hover:border-white/30 hover:bg-white/[0.06] sm:w-auto sm:py-3"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-[#4F46E5] to-[#06B6D4]">
                <Play className="h-3 w-3 fill-white text-white" />
              </span>
              Watch Demo Video
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.ul
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            aria-label="Product highlights"
            className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-white/60 sm:text-xs lg:justify-start"
          >
            {[
              { icon: Code2, label: "Open Source" },
              { icon: ShieldCheck, label: "Privacy First" },
              { icon: Zap, label: "AI‑powered" },
              { icon: Lock, label: "Secure" },
              { icon: UserX, label: "No Account" },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 text-white/70" aria-hidden />
                <span>{label}</span>
              </li>
            ))}
          </motion.ul>


          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 grid grid-cols-3 items-center gap-3 text-[11px] text-white/40 sm:flex sm:gap-6 sm:text-xs"
          >
            <div className="text-center sm:text-left">
              <div className="text-xl font-semibold text-white sm:text-2xl">10x</div>
              faster replies
            </div>
            <div className="hidden h-8 w-px bg-white/10 sm:block" />
            <div className="text-center sm:text-left">
              <div className="text-xl font-semibold text-white sm:text-2xl">0</div>
              emails stored
            </div>
            <div className="hidden h-8 w-px bg-white/10 sm:block" />
            <div className="text-center sm:text-left">
              <div className="text-xl font-semibold text-white sm:text-2xl">1‑click</div>
              install
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative flex items-center justify-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-full max-w-[520px]"
          >
            <ComposeMock />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
