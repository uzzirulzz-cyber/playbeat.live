import React from "react";
import { Play, ArrowRight } from "lucide-react";
import { DEMOS, GR, TECH, getStoredServices } from "../data/servicesData";
import { MockPreview } from "../components/MockPreview";

export const DemosGalleryPage: React.FC = () => {
  const services = getStoredServices();

  return (
    <div className="pt-28 pb-24 space-y-12 wrap">
      <div>
        <h1 className="h-lg text-white">
          See it. Test it. <span className="gt-energy">Then build it.</span>
        </h1>
        <p className="lead mt-3 max-w-2xl">
          {DEMOS.length} working live simulations across websites, SaaS, mobile applications, ecommerce shops, AI workspaces, dashboards, and brand identity systems. Open any demo and test the interactions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DEMOS.map(([name, slug], idx) => {
          const s = services.find((x) => x.slug === slug);
          if (!s) return null;
          const group = GR[s.g] || GR.web;

          return (
            <div
              key={idx}
              className="glow-card overflow-hidden flex flex-col group"
              style={{ "--c1": group.c1, "--c2": group.c2 } as React.CSSProperties}
            >
              {/* Preview Box */}
              <div
                className="h-56 bg-slate-900/60 p-4 flex items-center justify-center relative overflow-hidden cursor-pointer"
                onClick={() => (window.location.hash = `#/demo/${s.slug}`)}
              >
                <MockPreview
                  type={s.m}
                  className="scale-95 group-hover:scale-100 transition-transform"
                  c1={group.c1}
                  c2={group.c2}
                />

                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <a
                    href={`#/demo/${s.slug}`}
                    className="px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-lg"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-900" /> Test Demo
                  </a>
                  <a
                    href={`#/services/${s.slug}`}
                    className="px-4 py-2 rounded-xl bg-white/20 text-white font-bold text-xs border border-white/30 backdrop-blur-md"
                  >
                    Explore Service
                  </a>
                </div>
              </div>

              {/* Title & Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    <a href={`#/demo/${s.slug}`}>{name}</a>
                  </h3>
                  <span className="text-xs text-slate-400 mt-1 block">
                    {group.name} • {TECH[s.c] || "Full-stack React"}
                  </span>
                </div>

                <div className="pt-4 flex items-center justify-between text-xs font-semibold text-slate-400 border-t border-white/5 mt-4">
                  <span className="text-cyan-400">{group.name} Baseline</span>
                  <a
                    href={`#/demo/${s.slug}`}
                    className="text-white hover:text-cyan-300 flex items-center gap-1"
                  >
                    Launch <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
