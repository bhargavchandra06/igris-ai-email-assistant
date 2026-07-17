"use client";
import { motion } from "framer-motion";
import { Download, ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="relative py-20 sm:py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="glass-strong glow-ring relative overflow-hidden rounded-3xl px-5 py-16 text-center sm:rounded-[32px] sm:px-8 sm:py-20 md:py-24"
        >

          {/* orbs */}
          <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#4F46E5] opacity-30 blur-[120px]" />
          <div className="absolute -bottom-40 right-10 h-[360px] w-[360px] rounded-full bg-[#06B6D4] opacity-25 blur-[120px]" />
          <div className="absolute -bottom-32 left-10 h-[320px] w-[320px] rounded-full bg-[#8B5CF6] opacity-25 blur-[120px]" />

          <div className="relative">
            <h2 className="mx-auto max-w-3xl text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-4xl md:text-6xl">
              Ready to write emails{" "}
              <span className="text-gradient">faster?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-white/60 sm:mt-5 sm:text-base">
              Install IGRIS once. Every email after that gets easier.
            </p>

            <motion.a
              href="/download/igris-extension.zip"
              download
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="group relative mt-8 inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full px-8 py-4 text-base font-semibold text-white sm:mt-10 sm:w-auto"
            >

              <span className="absolute inset-0 bg-gradient-to-r from-[#4F46E5] via-[#8B5CF6] to-[#06B6D4]" />
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full opacity-70 blur-2xl"
                style={{
                  background:
                    "linear-gradient(90deg,#4F46E5,#8B5CF6,#06B6D4)",
                }}
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <span className="relative flex items-center gap-3">
                <Download className="h-5 w-5" />
                Download IGRIS
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </motion.a>

            <p className="mt-5 text-xs text-white/40">
              Free · Open source · No account required
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
