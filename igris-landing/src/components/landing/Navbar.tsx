"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { Download } from "lucide-react";

export function Navbar() {
  const { scrollY } = useScroll();
  const bg = useTransform(
    scrollY,
    [0, 120],
    ["rgba(5,8,22,0)", "rgba(5,8,22,0.6)"],
  );
  const border = useTransform(
    scrollY,
    [0, 120],
    ["rgba(255,255,255,0)", "rgba(255,255,255,0.08)"],
  );

  return (
    <motion.header
      style={{ backgroundColor: bg, borderColor: border }}
      className="fixed top-0 z-50 w-full border-b backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="group flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/10 bg-white/10">
            <img
              src="/igris.png"
              alt="IGRIS"
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            IGRIS
          </span>
        </a>

        <a
          href="/download/igris-extension.zip"
          download
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-5 py-2.5 text-sm font-semibold text-white"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-[#4F46E5] via-[#8B5CF6] to-[#06B6D4]" />
          <span
            aria-hidden
            className="absolute inset-0 rounded-full opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-70"
            style={{ background: "linear-gradient(90deg,#4F46E5,#06B6D4)" }}
          />
          <span className="relative flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download IGRIS
          </span>
        </a>
      </div>
    </motion.header>
  );
}
