import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 py-12 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-[2fr_1fr]">
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/10 bg-white/10">
                <img
                  src="/igris.png"
                  alt="IGRIS"
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-lg font-bold text-white">IGRIS</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-white/50">
              AI Email Assistant — quietly built into Gmail, out of your way.
            </p>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Product
            </div>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#install" className="hover:text-white">Installation</a></li>
              <li><a href="#faq" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-center text-xs text-white/40 sm:mt-12 md:flex-row md:text-left">
          <div>© {new Date().getFullYear()} IGRIS. All rights reserved.</div>
          <div className="flex items-center gap-1.5">
            Made with <Heart className="h-3.5 w-3.5 fill-red-400 text-red-400" /> for people who write a lot of email.
          </div>
        </div>
      </div>
    </footer>
  );
}
