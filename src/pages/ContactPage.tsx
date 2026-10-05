import React from "react";
import { ContactSection } from "../components/ContactSection";
import { MessageCircle, ShieldCheck, ArrowRight, Laptop, Cpu, Globe2 } from "lucide-react";

export const ContactPage: React.FC = () => {
  return (
    <div className="bg-slate-950 text-white min-vh-100">
      {/* Top Hero Banner */}
      <section className="py-5 pt-lg-6 text-center position-relative overflow-hidden" style={{ background: "linear-gradient(180deg, #050816 0%, #081426 100%)" }}>
        <div
          className="position-absolute top-0 start-50 translate-middle-x rounded-circle pointer-events-none opacity-25"
          style={{
            width: "600px",
            height: "400px",
            background: "radial-gradient(circle, #38BDF8 0%, #7C3AED 50%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />

        <div className="container-xl position-relative z-1 pt-3">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs fw-bold text-uppercase tracking-wider mb-3">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Global Engineering Consultations</span>
          </div>

          <h1 className="fw-extrabold text-white mb-3" style={{ fontSize: "clamp(32px, 4vw, 56px)", letterSpacing: "-0.03em" }}>
            GET IN TOUCH WITH <span className="text-gt-primary">PLAYBEAT DIGITAL.</span>
          </h1>

          <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed mb-4">
            Whether you need a full SaaS platform, AI agent pipeline, custom mobile app, or rapid software deployment, our lead engineers are ready to review your requirements.
          </p>

          <div className="d-flex flex-wrap justify-content-center gap-3">
            <a
              href="https://wa.me/923199980011"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success rounded-pill px-4 py-2 text-xs fw-bold d-inline-flex align-items-center gap-2 shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Direct WhatsApp Hotline (+92 319 9980011)</span>
            </a>
            <a
              href="#/build"
              className="btn btn-outline-light rounded-pill px-4 py-2 text-xs fw-semibold d-inline-flex align-items-center gap-2"
            >
              <Laptop className="w-4 h-4" />
              <span>Launch 6-Step Project Estimator</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Contact Section with Embedded Admin Entry Seal */}
      <ContactSection isStandalonePage={true} />

      {/* Trust & Guarantee Strip */}
      <section className="py-4 border-top border-bottom border-white/10 bg-slate-900/60">
        <div className="container-xl">
          <div className="row g-4 text-center text-sm-start">
            <div className="col-12 col-md-4 d-flex align-items-center gap-3 justify-content-center justify-content-md-start">
              <div className="p-2.5 rounded-3 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="fw-bold text-white text-xs uppercase tracking-wider">Mutual NDA Protection</div>
                <div className="text-slate-400 text-xs">Full proprietary IP confidentiality guaranteed.</div>
              </div>
            </div>

            <div className="col-12 col-md-4 d-flex align-items-center gap-3 justify-content-center justify-content-md-start">
              <div className="p-2.5 rounded-3 bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="fw-bold text-white text-xs uppercase tracking-wider">Lead Architect Review</div>
                <div className="text-slate-400 text-xs">Direct technical feasibility analysis in &lt; 24h.</div>
              </div>
            </div>

            <div className="col-12 col-md-4 d-flex align-items-center gap-3 justify-content-center justify-content-md-start">
              <div className="p-2.5 rounded-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <div className="fw-bold text-white text-xs uppercase tracking-wider">Working Demo Before Commit</div>
                <div className="text-slate-400 text-xs">Test live interactive prototypes in advance.</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
