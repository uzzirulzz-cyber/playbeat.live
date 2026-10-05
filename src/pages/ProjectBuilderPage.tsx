import React, { useState, useEffect } from "react";
import { Check, ArrowRight, MessageCircle } from "lucide-react";
import {
  GR,
  PKG,
  ADD,
  TL,
  formatPKR,
  getStoredServices,
  Service,
} from "../data/servicesData";

interface ProjectBuilderPageProps {
  initialServiceSlug?: string;
  initialPackageMultiplier?: number;
}

export const ProjectBuilderPage: React.FC<ProjectBuilderPageProps> = ({
  initialServiceSlug,
  initialPackageMultiplier = 1,
}) => {
  const services = getStoredServices();

  const [selectedGroup, setSelectedGroup] = useState<string>("web");
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [selectedPackage, setSelectedPackage] = useState<number>(initialPackageMultiplier);
  const [selectedAddons, setSelectedAddons] = useState<number[]>([0]); // 0-cost included addons selected by default
  const [selectedTimeline, setSelectedTimeline] = useState<number>(1);
  const [currency, setCurrency] = useState<"USD" | "PKR">("USD");

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Initialize service slug
  useEffect(() => {
    if (initialServiceSlug) {
      const match = services.find((s) => s.slug === initialServiceSlug);
      if (match) {
        setSelectedGroup(match.g);
        setSelectedSlug(match.slug);
        return;
      }
    }
    const defaultSvc = services.find((s) => s.g === selectedGroup) || services[0];
    if (defaultSvc) {
      setSelectedSlug(defaultSvc.slug);
    }
  }, [initialServiceSlug, selectedGroup]);

  const activeService =
    services.find((s) => s.slug === selectedSlug) ||
    services.find((s) => s.g === selectedGroup) ||
    services[0];

  const groupServices = services.filter((s) => s.g === selectedGroup);

  // Calculate Price Range
  const basePrice = activeService ? activeService.p : 150000;
  const addonsTotal = selectedAddons.reduce((sum, cost) => sum + cost, 0);
  const rawSubtotal = (basePrice * selectedPackage + addonsTotal) * selectedTimeline;
  const minPrice = Math.round(rawSubtotal * 0.95);
  const maxPrice = Math.round(rawSubtotal * 1.15);

  const toggleAddon = (cost: number) => {
    if (cost === 0) return; // Always included
    setSelectedAddons((prev) =>
      prev.includes(cost) ? prev.filter((c) => c !== cost) : [...prev, cost]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (fullName.trim().length < 2) {
      setFormError("Please enter your full name.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (whatsapp.replace(/\D/g, "").length < 10) {
      setFormError("Please enter a valid WhatsApp phone number with at least 10 digits.");
      return;
    }

    try {
      const existing = JSON.parse(localStorage.getItem("pb_req") || "[]");
      const newReq = {
        id: Date.now().toString(),
        n: fullName.trim(),
        c: company.trim() || "Independent",
        e: email.trim(),
        w: whatsapp.trim(),
        d: description.trim(),
        s: activeService.t,
        est: `${formatPKR(minPrice)} – ${formatPKR(maxPrice)}`,
        date: new Date().toISOString(),
      };
      existing.unshift(newReq);
      localStorage.setItem("pb_req", JSON.stringify(existing));
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitted(true);
    }
  };

  const waEstimateMessage = `Hello PlayBeat Digital,\nI just calculated an estimate for ${activeService?.t || "my project"} (${formatPKR(minPrice)} – ${formatPKR(maxPrice)}).\nI would like to discuss next steps.`;

  return (
    <div className="pt-28 pb-24 wrap space-y-10">
      <div>
        <h1 className="h-lg text-white">
          Configure Your <span className="gt">Project</span>
        </h1>
        <p className="lead mt-2 max-w-2xl">
          Choose your scope, package tier and requirements to watch your estimated investment range calculate in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Form & Selection Options */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-10">
          {/* Step 1: Solution Group */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-extrabold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-400 text-slate-950 text-xs font-black grid place-items-center">
                1
              </span>
              What are you building?
            </legend>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Object.entries(GR).map(([key, grp]) => {
                const isSelected = selectedGroup === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSelectedGroup(key);
                      const firstInGrp = services.find((s) => s.g === key);
                      if (firstInGrp) setSelectedSlug(firstInGrp.slug);
                    }}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between min-h-[90px] transition-all ${
                      isSelected
                        ? "border-cyan-400 bg-cyan-500/10 shadow-lg text-white"
                        : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-xs font-bold block">{grp.name}</span>
                    <span className="text-[10px] text-slate-400">
                      {services.filter((s) => s.g === key).length} options
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Step 2: Specific Service */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-extrabold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-400 text-slate-950 text-xs font-black grid place-items-center">
                2
              </span>
              Which service?
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {groupServices.map((svc) => {
                const isSelected = selectedSlug === svc.slug;
                return (
                  <button
                    key={svc.slug}
                    type="button"
                    onClick={() => setSelectedSlug(svc.slug)}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? "border-purple-400 bg-purple-500/15 shadow-lg text-white"
                        : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    <b className="text-sm font-bold block">{svc.t}</b>
                    <small className="text-xs text-slate-400 mt-2 block">
                      From {formatPKR(svc.p)} • {svc.dl}
                    </small>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Step 3: Package Scope */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-extrabold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-400 text-slate-950 text-xs font-black grid place-items-center">
                3
              </span>
              Package Scope
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PKG.map(([name, desc, multiplier]) => {
                const isSelected = selectedPackage === multiplier;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSelectedPackage(multiplier)}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? "border-cyan-400 bg-cyan-500/15 text-white shadow-lg"
                        : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    <div>
                      <b className="text-sm font-bold block">{name}</b>
                      <small className="text-xs text-slate-400 mt-1 block leading-relaxed">
                        {desc}
                      </small>
                    </div>
                    <span className="text-[11px] font-bold text-cyan-300 mt-3">
                      {multiplier}x baseline
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Step 4: Add-ons */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-extrabold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-400 text-slate-950 text-xs font-black grid place-items-center">
                4
              </span>
              Add-ons & Architecture
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ADD.map(([title, desc, cost]) => {
                const isSelected = cost === 0 || selectedAddons.includes(cost);
                return (
                  <div
                    key={title}
                    onClick={() => toggleAddon(cost)}
                    className={`p-4 rounded-xl border cursor-pointer select-none flex items-start gap-3 transition-all ${
                      isSelected
                        ? "border-emerald-500/50 bg-emerald-500/10 text-white"
                        : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                        isSelected
                          ? "bg-emerald-500 border-emerald-400 text-slate-950"
                          : "border-white/20 bg-black/20"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <b className="text-sm font-bold block">{title}</b>
                      <small className="text-xs text-slate-400 mt-0.5 block">{desc}</small>
                      <span className="text-[11px] font-semibold text-emerald-400 mt-1.5 block">
                        {cost === 0 ? "Included with every build" : `+ ${formatPKR(cost)}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </fieldset>

          {/* Step 5: Timeline Speed */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-extrabold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-400 text-slate-950 text-xs font-black grid place-items-center">
                5
              </span>
              Timeline Delivery
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TL.map(([label, desc, multiplier]) => {
                const isSelected = selectedTimeline === multiplier;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setSelectedTimeline(multiplier)}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? "border-cyan-400 bg-cyan-500/15 text-white shadow-lg"
                        : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    <div>
                      <b className="text-sm font-bold block">{label}</b>
                      <small className="text-xs text-slate-400 mt-1 block leading-relaxed">
                        {desc}
                      </small>
                    </div>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Step 6: Contact & Proposal */}
          <fieldset id="contact-form" className="space-y-4 pt-4 border-t border-white/10">
            <legend className="text-lg font-extrabold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-400 text-slate-950 text-xs font-black grid place-items-center">
                6
              </span>
              Where should we send your formal proposal?
            </legend>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 space-y-2">
                <div className="font-extrabold text-base flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-400" /> Proposal Request Received
                </div>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  Thank you, {fullName}. Our engineering lead will review your specifications for {activeService.t} and contact you directly on WhatsApp ({whatsapp}) within one working day.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="space-y-1.5 text-xs font-bold text-slate-300">
                  Full Name *
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Asad Siddiqui"
                    className="w-full h-11 px-3.5 rounded-xl bg-white/5 border border-white/15 text-white outline-none focus:border-cyan-400 text-sm"
                  />
                </label>

                <label className="space-y-1.5 text-xs font-bold text-slate-300">
                  Company / Organization
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Apex Dynamics Ltd"
                    className="w-full h-11 px-3.5 rounded-xl bg-white/5 border border-white/15 text-white outline-none focus:border-cyan-400 text-sm"
                  />
                </label>

                <label className="space-y-1.5 text-xs font-bold text-slate-300">
                  Email Address *
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. asad@company.com"
                    className="w-full h-11 px-3.5 rounded-xl bg-white/5 border border-white/15 text-white outline-none focus:border-cyan-400 text-sm"
                  />
                </label>

                <label className="space-y-1.5 text-xs font-bold text-slate-300">
                  WhatsApp Number *
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="e.g. 0319 9980011"
                    className="w-full h-11 px-3.5 rounded-xl bg-white/5 border border-white/15 text-white outline-none focus:border-cyan-400 text-sm"
                  />
                </label>

                <label className="sm:col-span-2 space-y-1.5 text-xs font-bold text-slate-300">
                  Project Description or Notes
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us about your product goals, audience, or any specific integrations needed..."
                    className="w-full p-3.5 rounded-xl bg-white/5 border border-white/15 text-white outline-none focus:border-cyan-400 text-sm resize-none"
                  />
                </label>

                {formError && (
                  <div className="sm:col-span-2 text-xs font-bold text-red-400">
                    {formError}
                  </div>
                )}

                <div className="sm:col-span-2 pt-2">
                  <button
                    type="submit"
                    className="w-full h-13 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-400 text-white font-extrabold text-sm shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    Request Project Proposal <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </fieldset>
        </form>

        {/* Live Reactive Price Summary Panel */}
        <aside className="lg:col-span-4 sticky top-24 rounded-3xl p-7 bg-gradient-to-br from-blue-950 via-purple-950 to-indigo-950 border border-white/20 shadow-2xl text-white space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <small className="text-slate-400 text-xs font-semibold block uppercase tracking-wider">
                Estimated Investment
              </small>
              <div className="flex items-center gap-1 bg-white/10 rounded-full p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setCurrency("USD")}
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                    currency === "USD" ? "bg-primary text-white shadow-sm" : "text-slate-300 hover:text-white"
                  }`}
                >
                  $ USD
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency("PKR")}
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                    currency === "PKR" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-300 hover:text-white"
                  }`}
                >
                  Rs PKR
                </button>
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300 mt-1">
              {currency === "USD"
                ? `$${Math.round(minPrice / 280).toLocaleString()} – $${Math.round(maxPrice / 280).toLocaleString()}`
                : `${formatPKR(minPrice)} – ${formatPKR(maxPrice)}`}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Indicative scope calculation. Includes milestone delivery.
            </p>
          </div>

          <div className="divide-y divide-white/10 text-xs space-y-2.5">
            <div className="flex justify-between pt-2">
              <span className="text-slate-400">Selected Service</span>
              <b className="font-bold text-white text-right">{activeService.t}</b>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-400">Package Scope</span>
              <b className="font-bold text-white">
                {PKG.find((p) => p[2] === selectedPackage)?.[0] || "Standard"}
              </b>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-400">Add-ons Total</span>
              <b className="font-bold text-white">
                {currency === "USD" ? `$${Math.round(addonsTotal / 280).toLocaleString()}` : formatPKR(addonsTotal)}
              </b>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-400">Timeline Speed</span>
              <b className="font-bold text-white">
                {TL.find((t) => t[2] === selectedTimeline)?.[0] || "Standard"}
              </b>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-400">Estimated Turnaround</span>
              <b className="font-bold text-cyan-300">{activeService.dl}</b>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <a
              href="#contact-form"
              className="w-full h-12 rounded-xl bg-white text-slate-950 font-extrabold text-xs flex items-center justify-center hover:bg-slate-100 transition-colors shadow-lg"
            >
              Continue to Proposal Form
            </a>
            <a
              href={`https://wa.me/923199980011?text=${encodeURIComponent(waEstimateMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-500/30 transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Ask Questions on WhatsApp
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
};
