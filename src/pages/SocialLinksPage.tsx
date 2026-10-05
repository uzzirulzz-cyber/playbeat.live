import React, { useState } from "react";
import { ArrowLeft, Check, Copy } from "lucide-react";

export const SocialLinksPage: React.FC = () => {
  const [copied, setCopied] = useState(false);

  // Equalizer bars computation matching the user's template
  const n = 34;
  const stops = [
    [86, 205, 243], // cyan
    [123, 92, 240], // violet
    [246, 132, 76], // orange
  ];

  const mix = (t: number) => {
    const a = t < 0.5 ? stops[0] : stops[1];
    const b = t < 0.5 ? stops[1] : stops[2];
    const k = t < 0.5 ? t * 2 : (t - 0.5) * 2;
    const r = Math.round(a[0] + (b[0] - a[0]) * k);
    const g = Math.round(a[1] + (b[1] - a[1]) * k);
    const bl = Math.round(a[2] + (b[2] - a[2]) * k);
    return `rgb(${r}, ${g}, ${bl})`;
  };

  const bars = Array.from({ length: n }).map((_, i) => {
    const t = i / (n - 1);
    const env = 0.35 + 0.65 * Math.sin(Math.PI * t);
    const wob = 0.55 + 0.45 * Math.abs(Math.sin(i * 1.7));
    const hi = Math.max(0.18, env * wob);
    const color = mix(t);
    const h = (hi * 0.45).toFixed(2);
    const h2 = hi.toFixed(2);
    const duration = (0.7 + ((i * 37) % 60) / 100).toFixed(2) + "s";
    const delay = (-((i * 53) % 100) / 100).toFixed(2) + "s";
    return { color, h, h2, duration, delay };
  });

  const handleCopy = () => {
    const num = "03199980011";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(num).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#010a1f] text-[#eaf2ff] font-['Lexend',sans-serif] flex flex-col items-center justify-center p-4 sm:p-8 pt-24">
      {/* Back to main agency website */}
      <div className="w-full max-w-[27rem] mb-4 flex items-center justify-between">
        <a
          href="#/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-full border border-white/10 bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Full Agency Website
        </a>
        <a
          href="#/build"
          className="text-xs font-semibold text-cyan-400 hover:underline"
        >
          Project Builder →
        </a>
      </div>

      <main className="w-full max-w-[27rem] flex flex-col items-center">
        {/* PlayBeat Digital Brand Mark */}
        <div className="mb-2 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#56cdf3] via-[#7b5cf0] to-[#f6844c] flex items-center justify-center shadow-xl shadow-cyan-500/20">
            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[14px] border-l-white ml-1" />
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-bold tracking-tight text-white">PlayBeat Digital</h2>
            <p className="text-xs text-slate-400">Websites, Apps & SaaS with Live Demos</p>
          </div>
        </div>

        {/* Animated Audio Equalizer */}
        <div className="flex items-end justify-center gap-1 h-11 w-full my-3 mb-8" aria-hidden="true">
          {bars.map((bar, idx) => (
            <i
              key={idx}
              className="w-1 rounded-sm animate-beat"
              style={
                {
                  height: "100%",
                  background: bar.color,
                  "--h": bar.h,
                  "--h2": bar.h2,
                  "--d": bar.duration,
                  "--delay": bar.delay,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* Social Link Hub List */}
        <ul className="w-full space-y-3.5 list-none p-0 m-0">
          {/* WhatsApp Primary */}
          <li>
            <a
              className="grid grid-cols-[2.75rem_1fr_auto] items-center gap-3.5 p-3 rounded-full bg-[#25d366] hover:bg-[#3be07a] text-[#04210f] transition-all hover:scale-[1.01] active:scale-[0.985] shadow-lg shadow-emerald-500/20"
              href="https://wa.me/923199980011"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="w-11 h-11 rounded-full grid place-items-center bg-black/15 text-[#04210f]">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 1 1-4.3 15.2l-.3-.2-2.9.8.8-2.8-.2-.3A8.2 8.2 0 0 1 12 3.8Zm-3.3 4c-.2 0-.5 0-.7.3-.3.3-1 1-1 2.3s1 2.7 1.2 2.9c.1.2 2 3.2 5 4.4 2.4 1 2.9.8 3.4.7.5 0 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.6-.4l-2-.9c-.3-.1-.5-.2-.7.1l-.9 1.1c-.2.2-.3.2-.6.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.9-2.2c-.2-.5-.4-.5-.6-.5h-.1Z" />
                </svg>
              </span>
              <span className="text-left">
                <span className="block font-bold text-base leading-tight">Chat on WhatsApp</span>
                <span className="block text-xs font-semibold opacity-85">0319 9980011</span>
              </span>
              <span className="w-7 h-7 grid place-items-center text-[#04210f] pr-1">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 10 12">
                  <path d="M0 0l10 6-10 6z" />
                </svg>
              </span>
            </a>
          </li>

          {/* Instagram */}
          <li>
            <a
              className="grid grid-cols-[2.75rem_1fr_auto] items-center gap-3.5 p-3 rounded-full border border-[#1b2c52] bg-[#0a1836] hover:bg-[#0e2046] hover:border-[#f6844c] text-[#eaf2ff] transition-all hover:scale-[1.01] active:scale-[0.985]"
              href="https://www.instagram.com/playbeat_digital/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="w-11 h-11 rounded-full grid place-items-center bg-[#f6844c]/15 text-[#f6844c]">
                <svg className="w-5.5 h-5.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5.5" />
                  <circle cx="12" cy="12" r="4.2" />
                  <circle cx="17.3" cy="6.7" r=".6" fill="currentColor" />
                </svg>
              </span>
              <span className="text-left">
                <span className="block font-semibold text-base leading-tight">Instagram</span>
                <span className="block text-xs text-[#93a6c9]">@playbeat_digital</span>
              </span>
              <span className="w-7 h-7 grid place-items-center text-[#93a6c9] pr-1">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 10 12">
                  <path d="M0 0l10 6-10 6z" />
                </svg>
              </span>
            </a>
          </li>

          {/* TikTok */}
          <li>
            <a
              className="grid grid-cols-[2.75rem_1fr_auto] items-center gap-3.5 p-3 rounded-full border border-[#1b2c52] bg-[#0a1836] hover:bg-[#0e2046] hover:border-[#a48cff] text-[#eaf2ff] transition-all hover:scale-[1.01] active:scale-[0.985]"
              href="https://www.tiktok.com/@playbeatdigital"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="w-11 h-11 rounded-full grid place-items-center bg-[#a48cff]/15 text-[#a48cff]">
                <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M14.2 2h3.1c.3 2.3 1.7 3.9 3.9 4.2v3.2a7.4 7.4 0 0 1-3.9-1.2v6.9a6.2 6.2 0 1 1-6.2-6.2c.3 0 .7 0 1 .1v3.3a3 3 0 1 0 2.1 2.9V2Z" />
                </svg>
              </span>
              <span className="text-left">
                <span className="block font-semibold text-base leading-tight">TikTok</span>
                <span className="block text-xs text-[#93a6c9]">@playbeatdigital</span>
              </span>
              <span className="w-7 h-7 grid place-items-center text-[#93a6c9] pr-1">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 10 12">
                  <path d="M0 0l10 6-10 6z" />
                </svg>
              </span>
            </a>
          </li>

          {/* Facebook */}
          <li>
            <a
              className="grid grid-cols-[2.75rem_1fr_auto] items-center gap-3.5 p-3 rounded-full border border-[#1b2c52] bg-[#0a1836] hover:bg-[#0e2046] hover:border-[#56cdf3] text-[#eaf2ff] transition-all hover:scale-[1.01] active:scale-[0.985]"
              href="https://www.facebook.com/p/Playbeat-Digital-61595130020427/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="w-11 h-11 rounded-full grid place-items-center bg-[#56cdf3]/15 text-[#56cdf3]">
                <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M13.6 22v-8.2h2.8l.4-3.3h-3.2V8.4c0-.9.3-1.6 1.6-1.6h1.8V3.9c-.3 0-1.4-.1-2.6-.1-2.6 0-4.3 1.6-4.3 4.4v2.3H7.2v3.3h2.9V22h3.5Z" />
                </svg>
              </span>
              <span className="text-left">
                <span className="block font-semibold text-base leading-tight">Facebook</span>
                <span className="block text-xs text-[#93a6c9]">Playbeat Digital</span>
              </span>
              <span className="w-7 h-7 grid place-items-center text-[#93a6c9] pr-1">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 10 12">
                  <path d="M0 0l10 6-10 6z" />
                </svg>
              </span>
            </a>
          </li>
        </ul>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          type="button"
          className="mt-4 text-xs text-[#93a6c9] hover:text-white px-4 py-2 rounded-full border border-white/10 hover:border-white/20 transition-all flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied 0319 9980011
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" /> Copy WhatsApp number
            </>
          )}
        </button>

        <footer className="mt-16 text-[#93a6c9] text-xs">
          © {new Date().getFullYear()} PlayBeat Digital
        </footer>
      </main>
    </div>
  );
};
