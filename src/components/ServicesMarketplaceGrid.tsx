import React, { useState } from "react";
import { getStoredServices, GR, formatCurrency, Service } from "../data/servicesData";
import { MockPreview } from "./MockPreview";
import { Play, ArrowRight, Search, Clock, Check, Star, Filter, DollarSign, Sparkles } from "lucide-react";

interface ServicesMarketplaceGridProps {
  initialGroup?: string;
  initialQuery?: string;
  limit?: number;
  showFilters?: boolean;
  sectionTitle?: string;
  sectionSubtitle?: string;
}

export const ServicesMarketplaceGrid: React.FC<ServicesMarketplaceGridProps> = ({
  initialGroup = "all",
  initialQuery = "",
  limit,
  showFilters = true,
  sectionTitle = "Popular Services & Digital Products",
  sectionSubtitle = "Browse real design & engineering work with transparent fixed pricing and working live demos.",
}) => {
  const [selectedGroup, setSelectedGroup] = useState(initialGroup);
  const [currency, setCurrency] = useState<"USD" | "PKR">("USD");
  const [search, setSearch] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<"popular" | "price-low" | "price-high" | "turnaround">("popular");
  const [previewingService, setPreviewingService] = useState<Service | null>(null);

  const allServices = getStoredServices();

  // Filter logic
  let filtered = allServices.filter((s) => {
    if (selectedGroup !== "all" && s.g !== selectedGroup && s.c !== selectedGroup) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = s.t.toLowerCase().includes(q);
      const matchCat = (s.c || "").toLowerCase().includes(q);
      const matchTag = s.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchCat && !matchTag) return false;
    }
    return true;
  });

  // Sorting
  if (sortBy === "popular") {
    filtered.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
  } else if (sortBy === "price-low") {
    filtered.sort((a, b) => a.pUSD - b.pUSD);
  } else if (sortBy === "price-high") {
    filtered.sort((a, b) => b.pUSD - a.pUSD);
  } else if (sortBy === "turnaround") {
    filtered.sort((a, b) => (a.dl.includes("72h") ? -1 : 1));
  }

  const displayed = limit ? filtered.slice(0, limit) : filtered;

  const categoriesList = [
    { id: "all", label: "All Services" },
    { id: "web", label: "Websites" },
    { id: "saas", label: "SaaS & Web Apps" },
    { id: "mob", label: "Mobile Apps" },
    { id: "ai", label: "AI & Agents" },
    { id: "eco", label: "Ecommerce" },
    { id: "fin", label: "Fintech" },
    { id: "ux", label: "UI/UX & Prototyping" },
    { id: "brand", label: "Branding & Logo" },
    { id: "ill", label: "Illustration" },
  ];

  return (
    <section className="py-5 position-relative" style={{ backgroundColor: "#050816", color: "#F8FAFC" }}>
      <div className="container-xl position-relative z-1">
        {/* Section Header */}
        <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
          <div>
            <div className="d-inline-flex align-items-center gap-2 mb-2">
              <span className="badge rounded-pill px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-cyan-300 text-xs fw-bold text-uppercase tracking-wider">
                ⚡ Fixed Scope · Transparent Pricing
              </span>
              <span className="text-slate-400 text-xs d-none d-sm-inline">
                {allServices.length}+ Productized Services Available
              </span>
            </div>
            <h2 className="fw-extrabold text-white mb-1" style={{ fontSize: "clamp(26px, 3.4vw, 44px)", letterSpacing: "-0.03em" }}>
              {sectionTitle}
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl mb-0">
              {sectionSubtitle}
            </p>
          </div>

          {/* Currency Toggle */}
          <div className="d-flex align-items-center gap-2 bg-white/5 border border-white/10 rounded-pill p-1 shadow-sm">
            <span className="text-xs text-slate-400 ps-2 fw-medium">Currency:</span>
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

        {/* Filter Controls Bar */}
        {showFilters && (
          <div className="space-y-3 mb-4">
            {/* Category Chips Bar */}
            <div className="d-flex align-items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categoriesList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedGroup(cat.id)}
                  className={`btn btn-sm rounded-pill text-xs fw-semibold px-3 py-1.5 shrink-0 transition-all ${
                    selectedGroup === cat.id
                      ? "btn-light text-dark fw-bold shadow-sm"
                      : "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search and Sort Controls */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-1">
              <div className="position-relative flex-grow-1 max-w-md">
                <Search className="position-absolute top-50 start-3 translate-middle-y w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search design, SaaS, mobile, AI, Shopify..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-control form-control-sm rounded-pill ps-5 bg-white/5 border-white/10 text-white placeholder-slate-500 text-xs py-2"
                />
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className="text-xs text-slate-400 d-none d-sm-inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="form-select form-select-sm rounded-pill bg-dark border-white/10 text-slate-200 text-xs py-1.5"
                  style={{ width: "auto" }}
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="turnaround">Fastest Delivery</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Product Cards Grid (Matching Dribbble Marketplace format) */}
        <div className="row g-4">
          {displayed.length === 0 ? (
            <div className="col-12 py-5 text-center text-slate-400">
              <Filter className="w-8 h-8 mx-auto mb-2 text-slate-500" />
              <p>No services matched your filter criteria.</p>
              <button onClick={() => { setSelectedGroup("all"); setSearch(""); }} className="btn btn-outline-cyan btn-sm rounded-pill">
                Reset Filters
              </button>
            </div>
          ) : (
            displayed.map((svc) => {
              const groupMeta = GR[svc.g] || GR.web;
              const formattedPrice = formatCurrency(svc.p, svc.pUSD, currency);

              return (
                <div key={svc.slug} className="col-12 col-md-6 col-lg-4 col-xl-3">
                  <div
                    className="card h-100 rounded-4 overflow-hidden text-decoration-none group position-relative transition-all d-flex flex-column"
                    style={{
                      background: "rgba(11, 20, 42, 0.70)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      backdropFilter: "blur(18px)",
                      boxShadow: "0 15px 35px -10px rgba(0, 0, 0, 0.6)",
                    }}
                  >
                    {/* Top: Large Colorful Live Preview */}
                    <div
                      className="position-relative overflow-hidden bg-black/40 d-flex align-items-center justify-content-center p-3"
                      style={{ height: "190px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      {/* Background Gradient Mesh */}
                      <div
                        className="position-absolute inset-0 pointer-events-none opacity-25 group-hover:opacity-40 transition-opacity"
                        style={{
                          background: `radial-gradient(circle at 50% 50%, ${groupMeta.c1} 0%, ${groupMeta.c2} 50%, transparent 80%)`,
                        }}
                      />

                      {/* Mockup Preview scaled smoothly */}
                      <div className="transition-transform duration-500 group-hover:scale-105">
                        <MockPreview type={svc.m} c1={groupMeta.c1} c2={groupMeta.c2} />
                      </div>

                      {/* Top Badges Overlay */}
                      <div className="position-absolute top-2.5 start-2.5 end-2.5 d-flex align-items-center justify-content-between pointer-events-none">
                        <span
                          className="badge rounded-pill text-[9px] fw-bold px-2 py-0.5 text-white shadow-sm"
                          style={{
                            background: `linear-gradient(135deg, ${groupMeta.c1}, ${groupMeta.c2})`,
                          }}
                        >
                          {groupMeta.name}
                        </span>

                        {svc.badge ? (
                          <span className="badge rounded-pill bg-white text-dark text-[9px] fw-bold shadow-sm">
                            {svc.badge}
                          </span>
                        ) : (
                          <span className="badge rounded-pill bg-dark/75 border border-white/10 text-white-50 text-[9px]">
                            PRO
                          </span>
                        )}
                      </div>

                      {/* Interactive Quick-Preview Button Overlay */}
                      <div className="position-absolute inset-0 d-flex align-items-center justify-content-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-xs">
                        <a
                          href={`#/demo/${svc.slug}`}
                          className="btn btn-sm px-3.5 py-1.5 rounded-pill bg-white text-dark fw-bold text-xs d-inline-flex align-items-center gap-1.5 shadow-lg transform hover:scale-105 active:scale-95 transition-all text-decoration-none"
                        >
                          <Play className="w-3 h-3 text-cyan-600 fill-cyan-600" />
                          <span>Interactive Live Demo</span>
                        </a>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-3.5 d-flex flex-column flex-grow-1 justify-content-between">
                      <div>
                        {/* Author / Agency info & Delivery */}
                        <div className="d-flex align-items-center justify-content-between mb-1 text-[11px] text-slate-400">
                          <span className="fw-semibold text-slate-300 d-inline-flex align-items-center gap-1">
                            {svc.agency || "PlayBeat Studio"}
                            <span className="rounded-circle bg-cyan-400 d-inline-block" style={{ width: 4, height: 4 }}></span>
                          </span>
                          <span className="d-inline-flex align-items-center gap-1 text-slate-400">
                            <Clock className="w-3 h-3 text-cyan-400" /> {svc.dl}
                          </span>
                        </div>

                        {/* Service Title */}
                        <h6 className="fw-bold text-white text-sm mb-1 group-hover:text-cyan-300 transition-colors line-clamp-1">
                          {svc.t}
                        </h6>

                        {/* 2-line Description */}
                        <p className="text-slate-400 text-xs mb-2.5 line-clamp-2 leading-snug">
                          {svc.t.includes("Development")
                            ? "Complete production-ready build with custom UI/UX, responsive breakpoints and API integration."
                            : svc.t.includes("Design")
                            ? "Screen-by-screen interface design, design tokens, and clickable prototype ready for handoff."
                            : "Bespoke digital deliverables engineered to perform and scale with direct revision rounds."}
                        </p>

                        {/* Feature Tags */}
                        <div className="d-flex flex-wrap gap-1 mb-3">
                          {svc.tags?.map((tag, tIdx) => (
                            <span key={tIdx} className="badge bg-white/5 border border-white/10 text-slate-300 text-[10px] fw-normal py-0.5 px-1.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Pricing & Actions */}
                      <div className="pt-2 border-top border-white/10 d-flex align-items-center justify-content-between mt-auto">
                        <div>
                          <span className="text-[10px] text-slate-400 d-block font-medium">Starting from</span>
                          <div className="fw-extrabold text-white fs-6">
                            {formattedPrice}
                          </div>
                        </div>

                        <div className="d-flex align-items-center gap-1.5">
                          <a
                            href={`#/services/${svc.slug}`}
                            className="btn btn-sm btn-outline-light rounded-pill px-3 py-1 text-xs fw-bold text-decoration-none hover:bg-white hover:text-dark transition-all"
                          >
                            Details →
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* View All CTAs Footer */}
        {limit && displayed.length < allServices.length && (
          <div className="text-center pt-5">
            <a
              href="#/services"
              className="btn btn-lg rounded-pill px-5 py-2.5 text-white fw-bold shadow-lg d-inline-flex align-items-center gap-2 border-0"
              style={{
                background: "linear-gradient(110deg, #3B82F6 0%, #7C3AED 50%, #22D3EE 100%)",
                boxShadow: "0 10px 30px -5px rgba(59, 130, 246, 0.4)",
              }}
            >
              <span>Explore All {allServices.length}+ Services With Pricing</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
};
