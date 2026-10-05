import React from "react";
import { ArrowRight, Play, Sparkles, ShieldCheck, Zap, Layers, Activity } from "lucide-react";

export const StorefrontHero: React.FC = () => {
  return (
    <section className="position-relative overflow-hidden pt-5 pb-5 pb-lg-6" style={{ backgroundColor: "#050816", color: "#F8FAFC" }}>
      {/* Layered Lighting & Glow Blobs */}
      <div
        className="position-absolute rounded-circle pointer-events-none"
        style={{
          top: "-10%",
          left: "-5%",
          width: "550px",
          height: "550px",
          background: "radial-gradient(circle, rgba(34, 211, 238, 0.18) 0%, rgba(34, 211, 238, 0) 70%)",
          filter: "blur(70px)",
        }}
      />
      <div
        className="position-absolute rounded-circle pointer-events-none"
        style={{
          top: "20%",
          right: "0%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(124, 58, 237, 0.20) 0%, rgba(124, 58, 237, 0) 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="position-absolute rounded-circle pointer-events-none"
        style={{
          bottom: "-5%",
          left: "30%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(255, 122, 24, 0.14) 0%, rgba(255, 122, 24, 0) 70%)",
          filter: "blur(75px)",
        }}
      />

      <div className="container-xl position-relative z-1 pt-3 pb-4">
        <div className="row align-items-center g-5">
          {/* LEFT: Headline, Copy, CTAs, Trust Points */}
          <div className="col-12 col-lg-6 space-y-4 text-center text-lg-start">
            {/* Pill Badges */}
            <div className="d-inline-flex flex-wrap align-items-center gap-2">
              <span className="badge rounded-pill px-3 py-1.5 border border-cyan-400/30 text-cyan-300 text-xs fw-bold d-inline-flex align-items-center gap-1.5 shadow-sm" style={{ background: "rgba(34, 211, 238, 0.08)", backdropFilter: "blur(10px)" }}>
                <span className="d-inline-block rounded-circle bg-cyan-400" style={{ width: 6, height: 6, boxShadow: "0 0 8px #22d3ee" }}></span>
                150+ Digital Experiences Built
              </span>
              <span className="badge rounded-pill px-3 py-1.5 border border-white/10 text-white-50 text-xs fw-semibold d-none d-sm-inline-flex" style={{ background: "rgba(255, 255, 255, 0.04)" }}>
                Web • Mobile • SaaS • AI • Brand
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="fw-extrabold tracking-tight text-white mb-3" style={{ fontSize: "clamp(38px, 5.2vw, 68px)", lineHeight: "1.02", letterSpacing: "-0.035em" }}>
              BUILD DIGITAL{" "}
              <span className="text-gt-primary d-inline-block">
                [EXPERIENCES]
              </span>{" "}
              PEOPLE REMEMBER.
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl mx-auto mx-lg-0" style={{ fontSize: "clamp(15px, 1.2vw, 17px)", lineHeight: "1.7", color: "#cbd5e1" }}>
              Premium websites, apps, SaaS platforms, ecommerce systems and enterprise software — designed to perform and built to scale. Test working live demos before starting your project.
            </p>

            {/* Action Buttons */}
            <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3 pt-2">
              <a
                href="#/services"
                className="btn btn-lg rounded-3 px-4 py-2.5 text-white fw-bold shadow-lg d-inline-flex align-items-center gap-2 transition-all hover:scale-105 active:scale-95 border-0"
                style={{
                  background: "linear-gradient(110deg, #3B82F6 0%, #7C3AED 55%, #22D3EE 100%)",
                  boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.45)",
                  fontSize: "15px",
                }}
              >
                <span>Explore Solutions & Prices</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#/demos"
                className="btn btn-lg rounded-3 px-4 py-2.5 text-white fw-semibold d-inline-flex align-items-center gap-2 transition-all hover:bg-white/10"
                style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(14px)",
                  fontSize: "15px",
                }}
              >
                <div className="rounded-circle bg-cyan-500/20 p-1 d-inline-flex align-items-center justify-content-center">
                  <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                </div>
                <span>View Live Demos</span>
              </a>
            </div>

            {/* Customer Trust Band */}
            <div className="pt-4 border-top border-white/10 d-flex flex-wrap justify-content-center justify-content-lg-start gap-4 text-xs font-medium text-slate-400">
              <span className="d-flex align-items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" /> Custom Development
              </span>
              <span className="d-flex align-items-center gap-1.5">
                <Zap className="w-4 h-4 text-warning" /> Responsive Design
              </span>
              <span className="d-flex align-items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-400" /> Scalable Systems
              </span>
              <span className="d-flex align-items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" /> Dedicated SLA Support
              </span>
            </div>
          </div>

          {/* RIGHT: Layered Floating Product Windows Composition */}
          <div className="col-12 col-lg-6 position-relative" style={{ minHeight: "480px" }}>
            {/* Visual glow underneath */}
            <div
              className="position-absolute top-50 start-50 translate-middle rounded-circle pointer-events-none opacity-40"
              style={{
                width: "420px",
                height: "420px",
                background: "radial-gradient(circle, #7c3aed 0%, #22d3ee 50%, transparent 70%)",
                filter: "blur(60px)",
              }}
            />

            {/* 1. Large SaaS Dashboard Window (Base Layer) */}
            <div
              className="position-relative rounded-4 overflow-hidden border border-white/15 shadow-2xl animate-float-1"
              style={{
                background: "rgba(11, 20, 42, 0.88)",
                backdropFilter: "blur(24px)",
                boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.85), 0 0 35px -5px rgba(56, 189, 248, 0.2)",
                maxWidth: "500px",
                margin: "0 auto",
              }}
            >
              {/* Window Chrome Bar */}
              <div className="px-3 py-2 bg-white/5 border-bottom border-white/10 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-1.5">
                  <span className="rounded-circle bg-danger opacity-75 d-inline-block" style={{ width: 8, height: 8 }} />
                  <span className="rounded-circle bg-warning opacity-75 d-inline-block" style={{ width: 8, height: 8 }} />
                  <span className="rounded-circle bg-success opacity-75 d-inline-block" style={{ width: 8, height: 8 }} />
                </div>
                <span className="text-[11px] text-white-50 font-mono">console.playbeat.cloud/metrics</span>
                <span className="badge rounded-pill bg-success-subtle text-success text-[9px] px-2 py-0.5">
                  ● LIVE UPTIME
                </span>
              </div>

              {/* Dashboard Content */}
              <div className="p-4 space-y-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-xs text-slate-400 text-uppercase tracking-wider font-semibold">Total Platform Volume</span>
                    <div className="h3 fw-bold text-white mb-0 mt-0.5">$128,450.00</div>
                  </div>
                  <div className="badge rounded-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 text-xs fw-bold">
                    +24.6% MRR Surge
                  </div>
                </div>

                {/* Micro Chart Bars */}
                <div className="p-3 rounded-3 bg-white/5 border border-white/10">
                  <div className="d-flex align-items-center justify-content-between text-[11px] text-slate-400 mb-2 font-mono">
                    <span>Q3 Active Conversions</span>
                    <span className="text-cyan-400">99.4% Peak</span>
                  </div>
                  <div className="d-flex align-items-end gap-1.5" style={{ height: "42px" }}>
                    {[35, 48, 62, 54, 78, 65, 92, 85, 95, 100].map((h, i) => (
                      <div
                        key={i}
                        className="flex-grow-1 rounded-top transition-all"
                        style={{
                          height: `${h}%`,
                          background: i >= 7 ? "linear-gradient(180deg, #38BDF8 0%, #7C3AED 100%)" : "rgba(255,255,255,0.18)",
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between pt-1 text-xs text-slate-400">
                  <span>Active Subscriptions: <b className="text-white">1,420+</b></span>
                  <span>Avg Latency: <b className="text-cyan-400">18ms</b></span>
                </div>
              </div>
            </div>

            {/* 2. Partially Overlapping Mobile App Frame (Foreground Left/Bottom) */}
            <div
              className="position-absolute rounded-4 overflow-hidden border border-white/20 shadow-2xl animate-float-2 d-none d-sm-block"
              style={{
                bottom: "-25px",
                left: "-15px",
                width: "220px",
                background: "rgba(15, 23, 42, 0.95)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 20px 45px rgba(0, 0, 0, 0.8), 0 0 25px rgba(168, 85, 247, 0.3)",
                zIndex: 2,
              }}
            >
              <div className="p-3 space-y-2">
                <div className="d-flex align-items-center justify-content-between text-[11px] text-white-50">
                  <span>Pulse Mobile</span>
                  <span className="text-cyan-400 font-bold">5G</span>
                </div>
                <div className="rounded-3 p-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-sm">
                  <div className="text-[10px] opacity-75">Treasury Card</div>
                  <div className="fw-bold text-sm">$48,290.50</div>
                  <div className="text-[9px] opacity-60 font-mono mt-1">•••• 8924</div>
                </div>
                <div className="d-flex gap-1.5 pt-1">
                  <button className="btn btn-xs flex-grow-1 py-1 rounded-2 text-[10px] fw-bold bg-white/10 text-white border-0">
                    Transfer
                  </button>
                  <button className="btn btn-xs flex-grow-1 py-1 rounded-2 text-[10px] fw-bold bg-cyan-500 text-dark border-0">
                    Deposit
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Floating Ecommerce Product Card (Right Bottom) */}
            <div
              className="position-absolute rounded-3 overflow-hidden border border-white/20 shadow-xl animate-float-mini"
              style={{
                bottom: "20px",
                right: "-20px",
                width: "230px",
                background: "rgba(8, 18, 38, 0.92)",
                backdropFilter: "blur(18px)",
                boxShadow: "0 15px 40px rgba(0, 0, 0, 0.75), 0 0 20px rgba(255, 122, 24, 0.25)",
                zIndex: 3,
              }}
            >
              <div className="p-3">
                <div className="d-flex align-items-center justify-content-between mb-1.5">
                  <span className="badge bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[9px] font-bold">
                    PRO RELEASE
                  </span>
                  <span className="text-warning text-xs">★ 4.98</span>
                </div>
                <div className="fw-bold text-white text-xs text-truncate">AI Agent Studio v4.2</div>
                <div className="d-flex align-items-center justify-content-between mt-2 pt-1 border-top border-white/10">
                  <span className="fw-extrabold text-cyan-300 text-sm">$1,200</span>
                  <a href="#/services/ai-dashboard-design" className="btn btn-xs px-2 py-0.5 rounded bg-primary text-white text-[10px] fw-bold text-decoration-none">
                    Preview Demo
                  </a>
                </div>
              </div>
            </div>

            {/* 4. Mini Top Floating Pill */}
            <div
              className="position-absolute rounded-pill px-3 py-1.5 border border-white/15 bg-white/10 backdrop-blur-md shadow-lg d-none d-md-flex align-items-center gap-2 text-xs font-semibold text-white animate-float-mini"
              style={{
                top: "-15px",
                right: "30px",
                zIndex: 4,
              }}
            >
              <span className="rounded-circle bg-emerald-400 d-inline-block" style={{ width: 6, height: 6 }} />
              <span>Turnkey IP Handover · 100% Owned</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
