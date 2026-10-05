import React, { useState } from "react";
import { MessageCircle, Mail, MapPin, Clock, Send, CheckCircle2, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { AdminSecuritySeal } from "./AdminSecuritySeal";
import { api } from "../services/api";

interface ContactSectionProps {
  id?: string;
  className?: string;
  isStandalonePage?: boolean;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  id = "contact",
  className = "",
  isStandalonePage = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    serviceType: "saas",
    budget: "$3,000 – $7,000 (PKR 850k – 2M)",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.submitContact(formData);
    } catch (err) {
      // Fallback gracefully
    }

    try {
      const inquiries = JSON.parse(localStorage.getItem("pb_inquiries") || "[]");
      inquiries.unshift({
        ...formData,
        id: "inq_" + Date.now(),
        date: new Date().toISOString(),
      });
      localStorage.setItem("pb_inquiries", JSON.stringify(inquiries));
    } catch (err) {
      // ignore local storage errors
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  const whatsappDirectUrl = `https://wa.me/923199980011?text=${encodeURIComponent(
    `Hello PlayBeat Digital! I would like to inquire about a ${formData.serviceType} project. My name is ${formData.name || "Client"}.`
  )}`;

  return (
    <section
      id={id}
      className={`py-5 py-lg-6 position-relative text-white overflow-hidden ${className}`}
      style={{
        background: "linear-gradient(180deg, #050816 0%, #081426 50%, #050816 100%)",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      {/* Background Lighting Elements */}
      <div
        className="position-absolute top-0 start-0 rounded-circle pointer-events-none opacity-20"
        style={{
          width: "450px",
          height: "450px",
          background: "radial-gradient(circle, #22D3EE 0%, #3B82F6 50%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />
      <div
        className="position-absolute bottom-0 end-0 rounded-circle pointer-events-none opacity-20"
        style={{
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, #7C3AED 0%, #EC4899 50%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <div className="container-xl position-relative z-1">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-5">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs fw-bold text-uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Direct Client Desk & Consultation</span>
          </div>

          <h2
            className="fw-extrabold text-white mb-3"
            style={{ fontSize: "clamp(28px, 3.5vw, 46px)", letterSpacing: "-0.03em" }}
          >
            LET’S DISCUSS YOUR <span className="text-gt-primary">NEXT PRODUCT.</span>
          </h2>

          <p className="text-slate-300 text-base leading-relaxed">
            Connect directly with our lead software architects. Clear milestones, transparent flat-rate pricing, and working interactive demos before committing.
          </p>
        </div>

        <div className="row g-4 lg:g-5 align-items-stretch">
          {/* Left Column: Direct Agency Contact & Hidden Admin Entry Image */}
          <div className="col-12 col-lg-5 d-flex flex-column justify-content-between space-y-4">
            <div className="space-y-3">
              {/* WhatsApp Fast-Lane Card */}
              <div
                className="p-4 rounded-3 border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-md transition-all hover:border-emerald-400/60"
                style={{
                  background: "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 8, 22, 0.6) 100%)",
                }}
              >
                <div className="d-flex align-items-start gap-3">
                  <div className="p-2.5 rounded-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="text-xs fw-bold text-emerald-400 text-uppercase tracking-wider">
                        Fast-Track WhatsApp
                      </span>
                      <span className="badge rounded-pill bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5">
                        Avg &lt; 15 mins
                      </span>
                    </div>
                    <div className="fs-5 fw-extrabold text-white font-mono mb-1">
                      +92 319 9980011
                    </div>
                    <p className="text-slate-300 text-xs mb-3">
                      Direct consultation with our engineering lead. Send specs, audio notes, or wireframes.
                    </p>
                    <a
                      href="https://wa.me/923199980011?text=Hello%20PlayBeat%20Digital!%20I%20would%20like%20to%20discuss%20a%20project%20inquiry."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-success rounded-pill px-3 py-1.5 text-xs fw-bold d-inline-flex align-items-center gap-2 shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Start WhatsApp Chat</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Email & Inquiries Card */}
              <div
                className="p-4 rounded-3 border border-white/10 bg-slate-900/40 backdrop-blur-md transition-all hover:border-cyan-500/40"
              >
                <div className="d-flex align-items-start gap-3">
                  <div className="p-2.5 rounded-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="flex-grow-1">
                    <span className="text-xs fw-bold text-cyan-400 text-uppercase tracking-wider d-block mb-1">
                      Enterprise Solutions & Tenders
                    </span>
                    <div className="fs-6 fw-bold text-white font-mono mb-1">
                      admin@playbeat.live
                    </div>
                    <p className="text-slate-400 text-xs mb-0">
                      Formal RFPs, NDAs, architectural scopes, and corporate enterprise agreements.
                    </p>
                  </div>
                </div>
              </div>

              {/* Studio Hubs & Global Hours */}
              <div className="p-4 rounded-3 border border-white/10 bg-slate-900/40 backdrop-blur-md">
                <div className="d-flex align-items-start gap-3">
                  <div className="p-2.5 rounded-2 bg-purple-500/20 text-purple-400 border border-purple-500/30 shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex-grow-1">
                    <span className="text-xs fw-bold text-purple-400 text-uppercase tracking-wider d-block mb-1">
                      HQ & Engineering Studio
                    </span>
                    <div className="text-sm fw-bold text-white mb-1">
                      PlayBeat Digital Software Labs
                    </div>
                    <p className="text-slate-400 text-xs mb-2">
                      Commercial Broadway, Phase 8 Bahria Town, Rawalpindi / Islamabad.
                    </p>
                    <div className="d-flex align-items-center gap-2 text-[11px] text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Remote dispatch for UK, UAE & US client timezones.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Certified System Image: The hidden entry for Administrator Login */}
            <div className="pt-2">
              <AdminSecuritySeal size="md" variant="card" />
            </div>
          </div>

          {/* Right Column: Direct Consultation Form */}
          <div className="col-12 col-lg-7">
            <div
              className="p-4 p-md-5 rounded-4 border border-white/15 position-relative overflow-hidden h-100 d-flex flex-column justify-content-between"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              }}
            >
              {submitted ? (
                <div className="text-center py-5 my-auto">
                  <div className="w-16 h-16 rounded-circle bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 d-flex align-items-center justify-content-center mx-auto mb-3 shadow-lg">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="fw-extrabold text-white mb-2">Inquiry Successfully Transmitted!</h4>
                  <p className="text-slate-300 text-sm max-w-md mx-auto mb-4 leading-relaxed">
                    Thank you, <strong>{formData.name || "Client"}</strong>. An engineering director has received your project parameters and will respond within 2-4 hours.
                  </p>
                  <div className="d-flex flex-wrap justify-content-center gap-3">
                    <a
                      href={whatsappDirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-success rounded-pill px-4 py-2 text-xs fw-bold d-inline-flex align-items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Follow up instantly on WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: "",
                          email: "",
                          whatsapp: "",
                          serviceType: "saas",
                          budget: "$3,000 – $7,000 (PKR 850k – 2M)",
                          message: "",
                        });
                      }}
                      className="btn btn-outline-light rounded-pill px-4 py-2 text-xs fw-semibold"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="d-flex align-items-center justify-content-between border-bottom border-white/10 pb-3 mb-3">
                    <div>
                      <h4 className="fw-bold text-white mb-0">Project Consultation Form</h4>
                      <p className="text-slate-400 text-xs mb-0">
                        Fill out brief specs for an instant architectural feasibility review.
                      </p>
                    </div>
                    <span className="badge rounded-pill bg-primary/20 text-primary border border-primary/30 text-xs px-2.5 py-1">
                      Direct Studio Queue
                    </span>
                  </div>

                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label text-xs fw-semibold text-slate-300 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="form-control bg-slate-900/80 border-white/15 text-white placeholder-slate-500 rounded-3 text-sm py-2.5 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                        placeholder="e.g. Alexander Vance"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label text-xs fw-semibold text-slate-300 mb-1">
                        Work / Personal Email *
                      </label>
                      <input
                        type="email"
                        required
                        className="form-control bg-slate-900/80 border-white/15 text-white placeholder-slate-500 rounded-3 text-sm py-2.5 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                        placeholder="alexander@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label text-xs fw-semibold text-slate-300 mb-1">
                        WhatsApp / Phone (Optional for instant chat)
                      </label>
                      <input
                        type="tel"
                        className="form-control bg-slate-900/80 border-white/15 text-white placeholder-slate-500 rounded-3 text-sm py-2.5 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                        placeholder="+92 3XX XXXXXXX or international"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label text-xs fw-semibold text-slate-300 mb-1">
                        Project / Solution Type
                      </label>
                      <select
                        className="form-select bg-slate-900/80 border-white/15 text-white rounded-3 text-sm py-2.5 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                        value={formData.serviceType}
                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      >
                        <option value="saas">SaaS Platform & Cloud App</option>
                        <option value="ai">AI Agent Studio / LLM Automation</option>
                        <option value="mobile">iOS & Android Mobile App</option>
                        <option value="web">Web Application & High-Performance Portal</option>
                        <option value="ecommerce">Ecommerce & Multi-Vendor Store</option>
                        <option value="fintech">Fintech & Blockchain Ledger</option>
                        <option value="branding">Brand Identity & Design System</option>
                        <option value="custom">Custom Enterprise Architecture</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="form-label text-xs fw-semibold text-slate-300 mb-1">
                      Estimated Investment Budget
                    </label>
                    <select
                      className="form-select bg-slate-900/80 border-white/15 text-white rounded-3 text-sm py-2.5 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    >
                      <option value="$1,000 – $3,000 (PKR 280k – 850k)">
                        Starter MVP: $1,000 – $3,000 (PKR 280k – 850k)
                      </option>
                      <option value="$3,000 – $7,000 (PKR 850k – 2M)">
                        Growth Platform: $3,000 – $7,000 (PKR 850k – 2M)
                      </option>
                      <option value="$7,000 – $15,000 (PKR 2M – 4.2M)">
                        Scale / Comprehensive: $7,000 – $15,000 (PKR 2M – 4.2M)
                      </option>
                      <option value="$15,000+ (PKR 4.2M+)">
                        Enterprise Custom Ecosystem: $15,000+ (PKR 4.2M+)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label text-xs fw-semibold text-slate-300 mb-1">
                      Project Requirements & Target Goals *
                    </label>
                    <textarea
                      required
                      rows={3}
                      className="form-control bg-slate-900/80 border-white/15 text-white placeholder-slate-500 rounded-3 text-sm p-3 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                      placeholder="Outline your target features, timeline, integrations, or specific problem you need solved..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <div className="pt-2 d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn rounded-pill px-5 py-2.5 text-white fw-bold text-xs d-inline-flex align-items-center justify-content-center gap-2 shadow-lg hover:scale-105 transition-all w-100 w-sm-auto"
                      style={{
                        background: "linear-gradient(110deg, #3B82F6 0%, #7C3AED 50%, #22D3EE 100%)",
                        boxShadow: "0 8px 25px -4px rgba(59, 130, 246, 0.5)",
                      }}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status"></span>
                          <span>Dispatching Scope...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Dispatch Project Inquiry</span>
                        </>
                      )}
                    </button>

                    <div className="text-[11px] text-slate-400 d-flex align-items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Guaranteed NDA & 100% IP Handover</span>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
