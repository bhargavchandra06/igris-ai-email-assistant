"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "Does it store my emails?",
    a: "Never. IGRIS processes text only when you invoke it, and nothing is persisted on our side. Your inbox stays on your device.",
  },
  {
    q: "Does it require Gmail login?",
    a: "No separate login. IGRIS runs inside your existing Gmail session — install the extension and it's ready.",
  },
  {
    q: "Do I need an API key?",
    a: "No. IGRIS includes the AI layer, so you don't need to configure or bring your own API key. Just install the extension and start writing smarter emails.",
  },
  {
    q: "Does it work on Chrome?",
    a: "Yes — Chrome and every Chromium browser (Arc, Edge, Brave, Vivaldi). Firefox and Safari are on the roadmap.",
  },
  {
    q: "Is it free?",
    a: "IGRIS is free to use. The AI features are built into the extension — no separate AI provider account or API key required.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-20 sm:py-24 md:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="glass inline-flex rounded-full px-3 py-1 text-xs text-white/70">
            FAQ
          </div>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Questions,{" "}
            <span className="text-gradient">answered honestly.</span>
          </h2>
        </div>

        <div className="mt-10 space-y-3 sm:mt-14">

          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={f.q}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass overflow-hidden rounded-2xl"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  className="flex min-h-[64px] w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                >
                  <span className="min-w-0 text-base font-medium text-white md:text-lg">
                    {f.q}
                  </span>
                  <motion.span
                    aria-hidden
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/5 text-white/80"
                  >
                    <Plus className="h-4 w-4" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-5 pb-6 text-sm leading-relaxed text-white/65 sm:px-6">
                        {f.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
