import React, { useState } from "react";
import { Search, Clock, ArrowRight, Play, Filter, Sparkles } from "lucide-react";
import {
  GR,
  FEAT,
  formatCurrency,
  getServiceDesc,
  getStoredServices,
  Service,
} from "../data/servicesData";
import { MockPreview } from "../components/MockPreview";

interface ServicesPageProps {
  initialGroup?: string;
  initialQuery?: string;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  initialGroup = "all",
  initialQuery = "",
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>(initialGroup);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [currency, setCurrency] = useState<"USD" | "PKR">("USD");
  const [sortBy, setSortBy] = useState<"popular" | "price-low" | "price-high" | "turnaround">("popular");

  const services = getStoredServices();

  let filtered = services.filter((s) => {
    const matchesGroup = selectedGroup === "all" || s.g === selectedGroup || s.c === selectedGroup;
    const matchesQuery =
      !searchQuery ||
      `${s.t} ${GR[s.g]?.name || ""} ${s.c} ${s.tags?.join(" ") || ""}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesGroup && matchesQuery;
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

  const activeGroupMeta = GR[selectedGroup];

  return (
    <div className="pt-24 pb-24 space-y-8 position-relative overflow-hidden" style={{ backgroundColor: "#050816", color: "#F8FAFC", minHeight: "100vh" }}>
      {/* Background Lighting */}
      <div
        className="position-absolute rounded-circle pointer-events-none"
        style={{
          top: "5%",
          right: "5%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(124, 58, 237, 0.16) 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />
      <div
        className="position-absolute rounded-circle pointer-events-none"
        style={{
          top: "30%",
          left: "-5%",
          width: "450px",
          height: "450px",
          background: "radial-gradient(circle, rgba(34, 211, 238, 0.14) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="container-xl position-relative z-1">
        {/* Page Header */}
        <div className="d-flex flex-wrap align-items-end justify-content-between gap-4 mb-4">
          <div>
            <div className="d-inline-flex align-items-center gap-2 mb-2">
              <span className="badge rounded-pill px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs fw-bold text-uppercase tracking-wider">
                Productized Digital Services
              </span>
              <span className="text-slate-400 text-xs">
                Showing {filtered.length} of {services.length} services
              </span>
            </div>

            <h1 className="fw-extrabold text-white mb-2" style={{ fontSize: "clamp(32px, 4vw, 56px)", letterSpacing: "-0.035em" }}>
              {selectedGroup === "all" ? (
                <>
                  Services Built To <span className="text-gt-primary">Deliver & Scale.</span>
                </>
              ) : (
                <span
                  style={{
                    background: `linear-gradient(110deg, ${activeGroupMeta?.c1}, ${activeGroupMeta?.c2})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {activeGroupMeta?.name} Services
                </span>
              )}
            </h1>

            <p className="text-slate-300 text-base max-w-2xl mb-0 leading-relaxed">
              {selectedGroup === "all"
                ? "Every service features an upfront fixed price, guaranteed turnaround SLA, and working live browser demos you can test before ordering."
                : activeGroupMeta?.description}
            </p>
          </div>

          {/* Currency Toggle */}
          <div className="d-flex align-items-center gap-2 bg-white/5 border border-white/10 rounded-pill p-1 shadow-sm">
            <span className="text-xs text-slate-400 ps-2.5 fw-medium">Currency:</span>
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

        {/* Category Filter Chips Bar */}
        <div className="d-flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-4">
          <button
            onClick={() => setSelectedGroup("all")}
            className={`btn btn-sm rounded-pill text-xs fw-bold px-3.5 py-2 shrink-0 transition-all ${
              selectedGroup === "all"
                ? "btn-light text-dark shadow-md"
                : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
            }`}
          >
            All Categories ({services.length})
          </button>

          {Object.entries(GR).map(([key, group]) => {
            const count = services.filter((s) => s.g === key || s.c === key).length;
            const isSelected = selectedGroup === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedGroup(key)}
                className={`btn btn-sm rounded-pill text-xs fw-semibold px-3.5 py-2 shrink-0 transition-all ${
                  isSelected
                    ? "text-white shadow-md font-bold"
                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                }`}
                style={
                  isSelected
                    ? {
                        background: `linear-gradient(110deg, ${group.c1}, ${group.c2})`,
                        border: "none",
                      }
                    : { border: "1px solid rgba(255,255,255,0.1)" }
                }
              >
                {group.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 p-3 rounded-4 bg-white/5 border border-white/10 backdrop-blur-md mb-4">
          <div className="position-relative flex-grow-1 max-w-md">
            <Search className="position-absolute top-50 start-3 translate-middle-y w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search services by keyword, tech, or deliverable..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control form-control-sm rounded-pill ps-5 bg-white/5 border-white/10 text-white placeholder-slate-500 text-xs py-2"
            />
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="text-xs text-slate-400">Sort by:</span>
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

        {/* Services Cards Grid */}
        <div className="row g-4">
          {filtered.length === 0 ? (
            <div className="col-12 py-5 text-center text-slate-400">
              <Filter className="w-8 h-8 mx-auto mb-2 text-slate-500" />
              <p>No services found matching your criteria.</p>
              <button
                onClick={() => {
                  setSelectedGroup("all");
                  setSearchQuery("");
                }}
                className="btn btn-outline-cyan btn-sm rounded-pill"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filtered.map((service) => {
              const groupMeta = GR[service.g] || GR.web;
              const formattedPrice = formatCurrency(service.p, service.pUSD, currency);

              return (
                <div key={service.slug} className="col-12 col-md-6 col-lg-4 col-xl-3">
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
                      <div
                        className="position-absolute inset-0 pointer-events-none opacity-25 group-hover:opacity-45 transition-opacity"
                        style={{
                          background: `radial-gradient(circle at 50% 50%, ${groupMeta.c1} 0%, ${groupMeta.c2} 50%, transparent 80%)`,
                        }}
                      />

                      <div className="transition-transform duration-500 group-hover:scale-105">
                        <MockPreview type={service.m} c1={groupMeta.c1} c2={groupMeta.c2} />
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

                        {service.badge ? (
                          <span className="badge rounded-pill bg-white text-dark text-[9px] fw-bold shadow-sm">
                            {service.badge}
                          </span>
                        ) : (
                          <span className="badge rounded-pill bg-dark/75 border border-white/10 text-white-50 text-[9px]">
                            PRO
                          </span>
                        )}
                      </div>

                      {/* Hover Live Demo Action */}
                      <div className="position-absolute inset-0 d-flex align-items-center justify-content-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-xs">
                        <a
                          href={`#/demo/${service.slug}`}
                          className="btn btn-sm px-3.5 py-1.5 rounded-pill bg-white text-dark fw-bold text-xs d-inline-flex align-items-center gap-1.5 shadow-lg transform hover:scale-105 active:scale-95 transition-all text-decoration-none"
                        >
                          <Play className="w-3 h-3 text-cyan-600 fill-cyan-600" />
                          <span>Interactive Live Demo</span>
                        </a>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-3.5 d-flex flex-column flex-grow-1 justify-content-between">
                      <div>
                        {/* Author info & Turnaround */}
                        <div className="d-flex align-items-center justify-content-between mb-1 text-[11px] text-slate-400">
                          <span className="fw-semibold text-slate-300">
                            {service.agency || "PlayBeat Studio"}
                          </span>
                          <span className="d-inline-flex align-items-center gap-1 text-slate-400">
                            <Clock className="w-3 h-3 text-cyan-400" /> {service.dl}
                          </span>
                        </div>

                        {/* Service Title */}
                        <h6 className="fw-bold text-white text-sm mb-1 group-hover:text-cyan-300 transition-colors line-clamp-1">
                          {service.t}
                        </h6>

                        {/* 2-line Description */}
                        <p className="text-slate-400 text-xs mb-2.5 line-clamp-2 leading-snug">
                          {getServiceDesc(service)}
                        </p>

                        {/* Feature Tags */}
                        <div className="d-flex flex-wrap gap-1 mb-3">
                          {(service.tags || FEAT[service.c]?.slice(0, 3) || []).map((tag, tIdx) => (
                            <span key={tIdx} className="badge bg-white/5 border border-white/10 text-slate-300 text-[10px] fw-normal py-0.5 px-1.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Pricing & CTAs */}
                      <div className="pt-2 border-top border-white/10 d-flex align-items-center justify-content-between mt-auto">
                        <div>
                          <span className="text-[10px] text-slate-400 d-block font-medium">Starting from</span>
                          <div className="fw-extrabold text-white fs-6">
                            {formattedPrice}
                          </div>
                        </div>

                        <div className="d-flex align-items-center gap-1.5">
                          <a
                            href={`#/services/${service.slug}`}
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
      </div>
    </div>
  );
};
