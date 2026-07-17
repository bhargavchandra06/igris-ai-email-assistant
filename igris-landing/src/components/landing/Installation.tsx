"use client";
import { motion } from "framer-motion";
import {
  Download,
  Chrome,
  ToggleRight,
  FolderOpen,
  Package,
  Mail,
} from "lucide-react";

const steps = [
  {
    n: "01",
    icon: Download,
    title: "Download IGRIS",
    desc: "Click the Download IGRIS button on this site and unzip the file locally.",
  },
  {
    n: "02",
    icon: Chrome,
    title: "Open chrome://extensions",
    desc: "Paste the URL into your address bar to open Chrome's extension panel.",
  },
  {
    n: "03",
    icon: ToggleRight,
    title: "Enable Developer Mode",
    desc: "Flip the toggle in the top-right corner of the extensions page.",
  },
  {
    n: "04",
    icon: Package,
    title: "Click Load Unpacked",
    desc: "A file picker opens — this is where the magic happens.",
  },
  {
    n: "05",
    icon: FolderOpen,
    title: "Select Extension Folder",
    desc: "Choose the unzipped IGRIS folder and confirm.",
  },
  {
    n: "06",
    icon: Mail,
    title: "Open Gmail",
    desc: "Refresh Gmail — IGRIS appears in your compose window.",
  },
];

export function Installation() {
  return (
    <section id="install" className="relative py-20 sm:py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="glass inline-flex rounded-full px-3 py-1 text-xs text-white/70">
            Installation
          </div>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Up and running in{" "}
            <span className="text-gradient">under 60 seconds.</span>
          </h2>
          <p className="mt-4 text-sm text-white/60 sm:text-base">
            Six calm steps. No accounts to create, no wizards to sit through.
          </p>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="relative mt-12 md:hidden">
          <div className="absolute left-[27px] top-2 bottom-2 w-px bg-gradient-to-b from-[#4F46E5]/60 via-[#8B5CF6]/40 to-[#06B6D4]/60" />
          <div className="space-y-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className="relative flex gap-4"
              >
                <div className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#4F46E5]/40 to-[#06B6D4]/40 ring-1 ring-white/10 backdrop-blur-xl">
                  <s.icon className="h-5 w-5 text-white" />
                </div>
                <div className="glass min-w-0 flex-1 rounded-2xl p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
                      Step {s.n}
                    </span>
                  </div>
                  <h3 className="mt-1 text-base font-semibold text-white">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tablet+: grid */}
        <div className="relative mt-16 hidden grid-cols-2 gap-5 md:grid lg:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group relative"
            >
              <div className="glass relative overflow-hidden rounded-2xl p-6 transition-transform duration-300 group-hover:-translate-y-1">
                <div className="flex items-start justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[#4F46E5]/30 to-[#06B6D4]/30 ring-1 ring-white/10">
                    <s.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-4xl font-black tracking-tighter text-white/10">
                    {s.n}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {s.desc}
                </p>

                {/* animated bottom line */}
                <motion.div
                  aria-hidden
                  className="absolute inset-x-6 bottom-4 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(139,92,246,0.6), rgba(6,182,212,0.6), transparent)",
                  }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 + i * 0.07 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
