import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="pt-20 pb-28 border-t border-white/10 text-slate-400 text-sm">
      <div className="wrap">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <a href="#/" className="flex items-center gap-2.5 font-extrabold text-lg text-white">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-400 flex items-center justify-center">
                <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[7px] border-l-white ml-0.5" />
              </div>
              <span>
                PlayBeat <span className="text-slate-400 font-semibold">Digital</span>
              </span>
            </a>
            <p className="max-w-md text-slate-400 leading-relaxed">
              Websites, mobile apps, SaaS platforms, and brand systems with working live demos you can test before committing to development.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="#/links"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-cyan-300 hover:bg-white/10 transition-colors"
              >
                Social Links & Bio Hub →
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Build
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#/services?g=web" className="hover:text-white transition-colors">
                  Websites & Portals
                </a>
              </li>
              <li>
                <a href="#/services?g=saas" className="hover:text-white transition-colors">
                  SaaS & Web Apps
                </a>
              </li>
              <li>
                <a href="#/services?g=mob" className="hover:text-white transition-colors">
                  Mobile Applications
                </a>
              </li>
              <li>
                <a href="#/services?g=eco" className="hover:text-white transition-colors">
                  Ecommerce & Stores
                </a>
              </li>
              <li>
                <a href="#/services?g=ai" className="hover:text-white transition-colors">
                  AI Workspaces & Agents
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#/demos" className="hover:text-white transition-colors">
                  Live Interactive Demos
                </a>
              </li>
              <li>
                <a href="#/process" className="hover:text-white transition-colors">
                  How We Work
                </a>
              </li>
              <li>
                <a href="#/pricing" className="hover:text-white transition-colors">
                  Pricing Plans
                </a>
              </li>
              <li>
                <a href="#/build" className="text-purple-300 hover:text-white transition-colors font-medium">
                  Project Cost Builder
                </a>
              </li>
              <li>
                <a href="#/contact" className="hover:text-white transition-colors text-xs text-slate-400">
                  Contact Studio
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Connect
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#/company" className="hover:text-white transition-colors">
                  About PlayBeat
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/923199980011"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline"
                >
                  WhatsApp: +92 319 9980011
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/playbeat_digital/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram @playbeat_digital
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@playbeatdigital"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  TikTok @playbeatdigital
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/p/Playbeat-Digital-61595130020427/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Facebook Page
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between text-xs text-slate-500">
          <p className="max-w-2xl text-center md:text-left">
            Demo interfaces are illustrative examples created by PlayBeat Digital to demonstrate design and development capabilities. Final client projects are customized to their requirements.
          </p>
          <span className="shrink-0">© {new Date().getFullYear()} PlayBeat Digital (Private) Limited</span>
        </div>
      </div>
    </footer>
  );
};
