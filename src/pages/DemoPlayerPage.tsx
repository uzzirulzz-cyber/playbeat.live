import React, { useState } from "react";
import {
  Monitor,
  Laptop,
  Tablet,
  Smartphone,
  Maximize2,
  Minimize2,
  ArrowLeft,
} from "lucide-react";
import { GR, getStoredServices } from "../data/servicesData";
import { getDemoSrcDoc } from "../data/mockTemplates";

interface DemoPlayerPageProps {
  slug: string;
}

type DeviceMode = "Desktop" | "Laptop" | "Tablet" | "Mobile";

export const DemoPlayerPage: React.FC<DemoPlayerPageProps> = ({ slug }) => {
  const [device, setDevice] = useState<DeviceMode>("Desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const services = getStoredServices();
  const service = services.find((s) => s.slug === slug) || services[0];
  const group = GR[service.g] || GR.web;

  const deviceSizes: Record<DeviceMode, { width: string; height: string }> = {
    Desktop: { width: "100%", height: "760px" },
    Laptop: { width: "1024px", height: "680px" },
    Tablet: { width: "768px", height: "820px" },
    Mobile: { width: "390px", height: "780px" },
  };

  return (
    <div className={`pt-24 pb-20 wrap space-y-6 ${isFullscreen ? "!p-0 !max-w-none" : ""}`}>
      {/* Top Header Controls */}
      {!isFullscreen && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <a
              href={`#/services/${service.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to {service.t}
            </a>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              {service.t}{" "}
              <span
                className="gt"
                style={{
                  backgroundImage: `linear-gradient(110deg, ${group.c1}, ${group.c2})`,
                }}
              >
                Interactive Simulation
              </span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Device Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
              <button
                onClick={() => setDevice("Desktop")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  device === "Desktop"
                    ? "bg-white/15 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" /> Desktop
              </button>
              <button
                onClick={() => setDevice("Laptop")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  device === "Laptop"
                    ? "bg-white/15 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Laptop className="w-3.5 h-3.5" /> Laptop
              </button>
              <button
                onClick={() => setDevice("Tablet")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  device === "Tablet"
                    ? "bg-white/15 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Tablet className="w-3.5 h-3.5" /> Tablet
              </button>
              <button
                onClick={() => setDevice("Mobile")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  device === "Mobile"
                    ? "bg-white/15 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Mobile
              </button>
              <button
                onClick={() => setIsFullscreen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-slate-400 hover:text-white transition-colors"
                title="Fullscreen"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quote Action */}
            <a
              href={`#/build?s=${service.slug}`}
              className="h-10 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-lg hover:brightness-110"
            >
              Request Quote
            </a>
          </div>
        </div>
      )}

      {/* Frame Container */}
      <div
        className={`mx-auto transition-all duration-300 ${
          isFullscreen
            ? "fixed inset-0 z-50 bg-black flex flex-col"
            : "flex justify-center"
        }`}
      >
        <div
          className={`border border-white/15 bg-slate-950 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
            isFullscreen
              ? "w-full h-full rounded-none border-0"
              : device === "Mobile"
              ? "rounded-[48px] border-[10px] border-slate-800"
              : device === "Tablet"
              ? "rounded-[32px] border-[12px] border-slate-800"
              : "rounded-2xl w-full"
          }`}
          style={!isFullscreen ? deviceSizes[device] : undefined}
        >
          {/* Chrome Bar */}
          <div className="h-10 px-4 bg-slate-900 border-b border-white/10 flex items-center justify-between text-xs text-slate-400 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>

            <div className="px-4 py-1 rounded bg-black/40 text-[11px] font-mono text-slate-400 truncate max-w-sm">
              https://demo.playbeat.digital/{service.slug}
            </div>

            <div>
              {isFullscreen && (
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1"
                >
                  <Minimize2 className="w-3 h-3" /> Exit Fullscreen
                </button>
              )}
            </div>
          </div>

          {/* Iframe Viewport */}
          <div className="flex-1 bg-white relative">
            <iframe
              srcDoc={getDemoSrcDoc(service)}
              title={`${service.t} Live Player`}
              className="w-full h-full border-0"
            />
          </div>
        </div>
      </div>

      {!isFullscreen && (
        <p className="text-center text-xs text-slate-500 max-w-xl mx-auto pt-4">
          Demo simulations are illustrative prototypes developed by PlayBeat Digital. Real client deployments are customized end-to-end to specific business data and requirements.
        </p>
      )}
    </div>
  );
};
