import React, { useState } from "react";
import {
  Clock,
  Code,
  Check,
  ChevronDown,
  Play,
  ArrowRight,
  MessageCircle,
  Monitor,
  Laptop,
  Maximize2,
  Sparkles,
} from "lucide-react";
import {
  GR,
  FEAT,
  TECH,
  FAQ,
  formatCurrency,
  getServiceDesc,
  getStoredServices,
  Service,
} from "../data/servicesData";
import { MockPreview } from "../components/MockPreview";
import { getDemoSrcDoc } from "../data/mockTemplates";

interface ServiceDetailPageProps {
  slug: string;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ slug }) => {
  const [currency, setCurrency] = useState<"USD" | "PKR">("USD");
  const services = getStoredServices();
  const service = services.find((s) => s.slug === slug) || services[0];
  const group = GR[service.g] || GR.web;
  const features = FEAT[service.c] || [];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const packages = [
    {
      name: "Starter",
      multiplier: 1,
      priceUSD: service.pUSD,
      pricePKR: service.p,
      scope: "Core build, clean handover & essential revision rounds",
      revisions: "2 rounds",
      support: "14 days post-launch warranty",
      popular: false,
    },
    {
      name: "Professional",
      multiplier: 1.8,
      priceUSD: Math.round(service.pUSD * 1.8),
      pricePKR: Math.round(service.p * 1.8),
      scope: "Core platform with full third-party integrations & admin console",
      revisions: "4 rounds",
      support: "60 days priority support",
      popular: true,
    },
    {
      name: "Enterprise",
      multiplier: 3,
      priceUSD: Math.round(service.pUSD * 3),
      pricePKR: Math.round(service.p * 3),
      scope: "Full-scale custom architecture, dedicated lead engineer, SLA",
      revisions: "Unlimited milestone rounds",
      support: "99.9% uptime SLA & dedicated Slack",
      popular: false,
    },
  ];

  const related = services
    .filter((s) => s.g === service.g && s.slug !== service.slug)
    .slice(0, 4);

  const waMessage = `Hello PlayBeat Digital,\nI am interested in ${service.t} (${formatCurrency(service.p, service.pUSD, currency)}).\nI tested the interactive live demo and would like to start this project.`;

  return (
    <div className="pt-24 pb-24 space-y-14 position-relative overflow-hidden" style={{ backgroundColor: "#050816", color: "#F8FAFC", minHeight: "100vh" }}>
      {/* Background Lighting */}
      <div
        className="position-absolute rounded-circle pointer-events-none opacity-20"
        style={{
          top: "10%",
          left: "20%",
          width: "600px",
          height: "600px",
          background: `radial-gradient(circle, ${group.c1} 0%, ${group.c2} 50%, transparent 70%)`,
          filter: "blur(90px)",
        }}
      />

      <div className="container-xl position-relative z-1">
        {/* Breadcrumb & Currency Switcher Bar */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div className="d-flex align-items-center gap-2 text-xs text-slate-400">
            <a href="#/services" className="text-slate-400 text-decoration-none hover:text-white">Services</a>
            <span>/</span>
            <a href={`#/services?g=${service.g}`} className="text-cyan-400 text-decoration-none font-semibold">{group.name}</a>
            <span>/</span>
            <span className="text-white text-truncate max-w-xs">{service.t}</span>
          </div>

          <div className="d-flex align-items-center gap-2 bg-white/5 border border-white/10 rounded-pill p-1 shadow-sm">
            <span className="text-xs text-slate-400 ps-2.5 font-medium">Currency:</span>
            <button
              onClick={() => setCurrency("USD")}
              className={`btn btn-xs rounded-pill px-3 py-1 text-xs fw-bold transition-all ${
                currency === "USD" ? "bg-primary text-white shadow-sm" : "text-slate-300 hover:text-white"
              }`}
            >
              $ USD
            </button>
            <button
              onClick={() => setCurrency("PKR")}
              className={`btn btn-xs rounded-pill px-3 py-1 text-xs fw-bold transition-all ${
                currency === "PKR" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-300 hover:text-white"
              }`}
            >
              Rs PKR
            </button>
          </div>
        </div>

        {/* Hero Section Banner */}
        <div
          className="rounded-4 p-4 p-lg-5 relative overflow-hidden position-relative border border-white/10 shadow-2xl mb-5"
          style={{
            background: "linear-gradient(135deg, rgba(13, 21, 42, 0.9) 0%, rgba(8, 14, 32, 0.95) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-7 space-y-4">
              <span
                className="badge rounded-pill text-xs fw-bold px-3 py-1 text-white shadow-sm"
                style={{
                  background: `linear-gradient(135deg, ${group.c1}, ${group.c2})`,
                }}
              >
                {group.name}
              </span>

              <h1 className="fw-extrabold text-white tracking-tight" style={{ fontSize: "clamp(30px, 3.8vw, 50px)", lineHeight: "1.08" }}>
                {service.t}
              </h1>

              <p className="text-slate-300 text-base leading-relaxed max-w-xl">
                {getServiceDesc(service)}
              </p>

              {/* Quick Metrics */}
              <div className="row g-3 pt-2">
                <div className="col-6 col-sm-4">
                  <small className="text-slate-400 text-xs font-semibold d-block">Starting from</small>
                  <span className="fs-4 fw-extrabold text-white">
                    {formatCurrency(service.p, service.pUSD, currency)}
                  </span>
                </div>
                <div className="col-6 col-sm-4">
                  <small className="text-slate-400 text-xs font-semibold d-block">Delivery Speed</small>
                  <span className="fs-5 fw-bold text-white d-flex align-items-center gap-1.5 mt-0.5">
                    <Clock className="w-4 h-4 text-cyan-400" /> {service.dl}
                  </span>
                </div>
                <div className="col-12 col-sm-4">
                  <small className="text-slate-400 text-xs font-semibold d-block">Tech Stack</small>
                  <span className="small text-slate-200 font-medium d-block mt-0.5">
                    {TECH[service.c] || "React, Node.js, Cloud"}
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="d-flex flex-wrap gap-3 pt-3">
                <a
                  href={`#/demo/${service.slug}`}
                  className="btn btn-primary rounded-pill px-4 py-2.5 text-white fw-bold text-xs d-inline-flex align-items-center gap-2 shadow-lg border-0"
                  style={{ background: "linear-gradient(110deg, #3B82F6 0%, #7C3AED 50%, #22D3EE 100%)" }}
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Launch Live Interactive Demo</span>
                </a>
                <a
                  href={`#/build?s=${service.slug}`}
                  className="btn btn-outline-light rounded-pill px-4 py-2.5 text-white fw-bold text-xs d-inline-flex align-items-center gap-2"
                >
                  <span>Configure in Estimator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href={`https://wa.me/923199980011?text=${encodeURIComponent(waMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-success rounded-pill px-4 py-2.5 fw-bold text-xs d-inline-flex align-items-center gap-2 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Quote</span>
                </a>
              </div>
            </div>

            <div className="col-12 col-lg-5 text-center">
              <div className="p-4 rounded-4 bg-white/5 border border-white/10 d-inline-flex align-items-center justify-content-center shadow-lg transition-transform hover:scale-105">
                <MockPreview
                  type={service.m}
                  c1={group.c1}
                  c2={group.c2}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Embedded Interactive Live Sandbox Preview */}
        <div className="mb-5">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
            <div>
              <span className="badge rounded-pill bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold text-uppercase tracking-wider">
                Full-Featured Working Sandbox
              </span>
              <h4 className="fw-bold text-white mb-0 mt-1">Live Prototype Sandbox</h4>
            </div>
            <a
              href={`#/demo/${service.slug}`}
              className="btn btn-sm btn-outline-light rounded-pill px-3 py-1.5 text-xs fw-semibold d-inline-flex align-items-center gap-1.5"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Open in Fullscreen Device Player</span>
            </a>
          </div>

          <div
            className="rounded-4 overflow-hidden border border-white/15 shadow-2xl"
            style={{ height: "520px", background: "#FFFFFF" }}
          >
            <div className="px-3 py-2 bg-dark border-bottom border-white/10 d-flex align-items-center justify-content-between text-white">
              <div className="d-flex align-items-center gap-1.5">
                <span className="rounded-circle bg-danger opacity-75 d-inline-block" style={{ width: 8, height: 8 }} />
                <span className="rounded-circle bg-warning opacity-75 d-inline-block" style={{ width: 8, height: 8 }} />
                <span className="rounded-circle bg-success opacity-75 d-inline-block" style={{ width: 8, height: 8 }} />
              </div>
              <span className="text-[11px] font-mono text-white-50">https://sandbox.playbeat.cloud/{service.slug}</span>
              <span className="badge rounded-pill bg-success-subtle text-success text-[9px]">● LIVE DEMO</span>
            </div>
            <iframe
              title={service.t}
              srcDoc={getDemoSrcDoc(service)}
              className="w-100 h-100 border-0"
              style={{ height: "calc(100% - 36px)" }}
            />
          </div>
        </div>

        {/* Package Tiers Comparison */}
        <div className="mb-5">
          <div className="text-center max-w-xl mx-auto mb-4">
            <h4 className="fw-bold text-white mb-1">Package Tiers & Deliverables</h4>
            <p className="text-slate-400 small mb-0">Select your scope of engagement. Fast-track expedited sprints are available.</p>
          </div>

          <div className="row g-4 align-items-stretch">
            {packages.map((pkg) => {
              const formattedPrice = formatCurrency(pkg.pricePKR, pkg.priceUSD, currency);
              return (
                <div key={pkg.name} className="col-12 col-md-4">
                  <div
                    className={`card h-100 rounded-4 p-4 d-flex flex-column justify-content-between transition-all ${
                      pkg.popular
                        ? "border-2 border-primary bg-slate-900/90 shadow-xl"
                        : "border border-white/10 bg-slate-950/70"
                    }`}
                  >
                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <h5 className="fw-bold text-white mb-0">{pkg.name}</h5>
                        {pkg.popular && (
                          <span className="badge rounded-pill bg-primary text-white text-[10px] fw-bold">
                            RECOMMENDED
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-xs mb-3">{pkg.scope}</p>
                      <div className="h3 fw-extrabold text-white mb-3">
                        {formattedPrice}
                      </div>

                      <ul className="list-unstyled space-y-2 text-xs text-slate-300 mb-4">
                        <li className="d-flex align-items-center gap-2">
                          <Check className="w-4 h-4 text-cyan-400" /> {pkg.revisions}
                        </li>
                        <li className="d-flex align-items-center gap-2">
                          <Check className="w-4 h-4 text-cyan-400" /> {pkg.support}
                        </li>
                        <li className="d-flex align-items-center gap-2">
                          <Check className="w-4 h-4 text-cyan-400" /> Full production source code
                        </li>
                        <li className="d-flex align-items-center gap-2">
                          <Check className="w-4 h-4 text-cyan-400" /> 100% intellectual property ownership
                        </li>
                      </ul>
                    </div>

                    <a
                      href={`#/build?s=${service.slug}&p=${pkg.multiplier}`}
                      className={`btn btn-sm rounded-pill py-2 fw-bold text-xs w-100 text-decoration-none ${
                        pkg.popular ? "btn-primary shadow-sm" : "btn-outline-light"
                      }`}
                    >
                      Choose {pkg.name}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Related Services */}
        {related.length > 0 && (
          <div>
            <h5 className="fw-bold text-white mb-3">More in {group.name}</h5>
            <div className="row g-3">
              {related.map((rel) => (
                <div key={rel.slug} className="col-12 col-sm-6 col-lg-3">
                  <a
                    href={`#/services/${rel.slug}`}
                    className="card h-100 p-3 rounded-4 bg-white/5 border border-white/10 text-decoration-none group hover:bg-white/10 transition-all"
                  >
                    <div className="fw-bold text-white text-xs group-hover:text-cyan-300 transition-colors mb-1">
                      {rel.t}
                    </div>
                    <div className="text-[11px] text-slate-400 mb-2">{rel.dl}</div>
                    <div className="fw-extrabold text-cyan-400 text-xs mt-auto">
                      {formatCurrency(rel.p, rel.pUSD, currency)}
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
