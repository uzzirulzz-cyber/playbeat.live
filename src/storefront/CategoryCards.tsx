import React from "react";
import { GR } from "../data/servicesData";
import { ArrowRight, Globe, Layers, Smartphone, Sparkles, ShoppingBag, CreditCard, HeartPulse, GraduationCap, Truck, Palette, Building2, Frame } from "lucide-react";

interface CategoryCardsProps {
  categories?: any[];
}

export const CategoryCards: React.FC<CategoryCardsProps> = () => {
  const iconComponents: Record<string, React.ReactNode> = {
    web: <Globe className="w-6 h-6" />,
    saas: <Layers className="w-6 h-6" />,
    mob: <Smartphone className="w-6 h-6" />,
    ai: <Sparkles className="w-6 h-6" />,
    eco: <ShoppingBag className="w-6 h-6" />,
    fin: <CreditCard className="w-6 h-6" />,
    hlth: <HeartPulse className="w-6 h-6" />,
    edu: <GraduationCap className="w-6 h-6" />,
    log: <Truck className="w-6 h-6" />,
    brand: <Palette className="w-6 h-6" />,
    ent: <Building2 className="w-6 h-6" />,
    ux: <Frame className="w-6 h-6" />,
  };

  const domainList = Object.entries(GR).map(([key, group]) => ({
    key,
    ...group,
  }));

  return (
    <section className="py-5 position-relative overflow-hidden" style={{ backgroundColor: "#081226", color: "#F8FAFC" }}>
      {/* Background Accent Grid */}
      <div
        className="position-absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="container-xl position-relative z-1">
        {/* Section Header */}
        <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
          <div>
            <span className="badge rounded-pill px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs fw-bold text-uppercase tracking-wider mb-2">
              Capabilities & Domains
            </span>
            <h2 className="fw-extrabold text-white mb-1" style={{ fontSize: "clamp(26px, 3.2vw, 42px)", letterSpacing: "-0.03em" }}>
              Explore Solution Categories
            </h2>
            <p className="text-slate-400 small mb-0 max-w-xl">
              From flagship SaaS web apps and autonomous AI tools to high-throughput ecommerce and brand identities — each engineered with production craft.
            </p>
          </div>
          <a
            href="#/services"
            className="btn btn-sm px-3.5 py-2 rounded-3 text-xs fw-bold text-white d-inline-flex align-items-center gap-2 border border-white/20 hover:border-cyan-400 transition-all"
            style={{ background: "rgba(255, 255, 255, 0.06)", backdropFilter: "blur(10px)" }}
          >
            <span>View All 50+ Services</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </a>
        </div>

        {/* 12 Distinctive Category Cards */}
        <div className="row g-3">
          {domainList.map((item) => (
            <div key={item.key} className="col-12 col-sm-6 col-lg-4 col-xl-3">
              <a
                href={`#/services?g=${item.key}`}
                className="card h-100 rounded-4 p-4 text-decoration-none transition-all group position-relative overflow-hidden"
                style={{
                  background: "rgba(255, 255, 255, 0.035)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(18px)",
                  boxShadow: "0 15px 35px -10px rgba(0, 0, 0, 0.5)",
                }}
              >
                {/* Subtle colored corner glow on hover */}
                <div
                  className="position-absolute top-0 end-0 rounded-circle pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity"
                  style={{
                    width: "120px",
                    height: "120px",
                    background: `radial-gradient(circle, ${item.c1} 0%, transparent 70%)`,
                    filter: "blur(25px)",
                  }}
                />

                {/* Top: Icon + Count */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div
                    className="p-3 rounded-3 d-inline-flex align-items-center justify-content-center text-white transition-transform group-hover:scale-110 shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, ${item.c1} 0%, ${item.c2} 100%)`,
                      boxShadow: `0 8px 20px -4px ${item.c1}88`,
                    }}
                  >
                    {iconComponents[item.key] || <Layers className="w-6 h-6" />}
                  </div>

                  <span className="badge rounded-pill text-[10px] fw-bold px-2.5 py-1 text-slate-300 border border-white/10" style={{ background: "rgba(255,255,255,0.06)" }}>
                    Explore →
                  </span>
                </div>

                {/* Title & Description */}
                <div className="space-y-1">
                  <h5 className="fw-bold text-white text-base mb-1 group-hover:text-cyan-300 transition-colors d-flex align-items-center gap-1.5">
                    <span>{item.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </h5>
                  <p className="text-slate-400 text-xs mb-0 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Color Accent Line */}
                <div
                  className="position-absolute bottom-0 start-0 w-100"
                  style={{
                    height: "2px",
                    background: `linear-gradient(90deg, ${item.c1}, ${item.c2})`,
                    opacity: 0.35,
                  }}
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
