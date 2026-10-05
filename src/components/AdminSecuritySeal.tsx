import React, { useState } from "react";

interface AdminSecuritySealProps {
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
  className?: string;
  variant?: "floating" | "inline" | "card";
}

export const AdminSecuritySeal: React.FC<AdminSecuritySealProps> = ({
  size = "md",
  showDetails = true,
  className = "",
  variant = "card",
}) => {
  const [hovered, setHovered] = useState(false);

  const dimensions = {
    sm: { seal: 48, icon: 20 },
    md: { seal: 72, icon: 30 },
    lg: { seal: 96, icon: 42 },
  }[size];

  const handleAdminNavigate = (e: React.MouseEvent) => {
    // Navigates directly to the hidden administrator login
    window.location.hash = "#/admin";
  };

  const sealSvg = (
    <svg
      width={dimensions.seal}
      height={dimensions.seal}
      viewBox="0 0 100 100"
      className={`transition-all duration-300 ${hovered ? "scale-105 filter drop-shadow-[0_0_16px_rgba(34,211,238,0.6)]" : "drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]"}`}
      style={{ cursor: "pointer" }}
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="sealOuterRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="35%" stopColor="#3B82F6" />
          <stop offset="70%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#FF7A18" />
        </linearGradient>

        <linearGradient id="sealInnerCore" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#081426" />
          <stop offset="50%" stopColor="#050816" />
          <stop offset="100%" stopColor="#0b132b" />
        </linearGradient>

        <linearGradient id="shieldGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>

        <linearGradient id="goldAccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#FF7A18" />
        </linearGradient>

        <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Glowing Border Ring */}
      <circle
        cx="50"
        cy="50"
        r="47"
        fill="none"
        stroke="url(#sealOuterRim)"
        strokeWidth="2.5"
        strokeDasharray="4 2"
        className={hovered ? "animate-spin" : ""}
        style={{ transformOrigin: "center", animationDuration: "20s" }}
      />

      {/* Outer Metallic Bevel */}
      <circle
        cx="50"
        cy="50"
        r="44"
        fill="url(#sealInnerCore)"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="1.5"
      />

      {/* Decorative Starburst Notch Ring */}
      <circle
        cx="50"
        cy="50"
        r="39"
        fill="none"
        stroke="rgba(34, 211, 238, 0.25)"
        strokeWidth="1"
        strokeDasharray="1 3"
      />

      {/* Inner Central Shield */}
      <path
        d="M 50 20 
           C 60 20 71 23 74 27 
           C 74 44 68 62 50 78 
           C 32 62 26 44 26 27 
           C 29 23 40 20 50 20 Z"
        fill="url(#sealInnerCore)"
        stroke="url(#shieldGold)"
        strokeWidth="2"
      />

      {/* Shield Highlight Ridge */}
      <path
        d="M 50 22 
           C 57 22 66 25 68 28 
           C 68 42 63 57 50 71 
           L 50 22 Z"
        fill="rgba(56, 189, 248, 0.12)"
      />

      {/* Keyhole / Node Core */}
      <circle cx="50" cy="40" r="5" fill="url(#goldAccent)" />
      <polygon points="48,42 52,42 53,52 47,52" fill="url(#goldAccent)" />

      {/* Micro-stars on bottom shield */}
      <circle cx="43" cy="60" r="1.2" fill="#22D3EE" />
      <circle cx="50" cy="62" r="1.5" fill="#38BDF8" />
      <circle cx="57" cy="60" r="1.2" fill="#22D3EE" />

      {/* Top Banner Accent */}
      <path
        d="M 38 27 Q 50 24 62 27"
        fill="none"
        stroke="#FBBF24"
        strokeWidth="1"
      />

      {/* Verified Checkmark Micro-badge */}
      <g transform="translate(62, 58)">
        <circle cx="9" cy="9" r="8" fill="#050816" stroke="#22D3EE" strokeWidth="1.5" />
        <path
          d="M 5 9 L 8 12 L 13 6"
          fill="none"
          stroke="#22D3EE"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );

  if (variant === "inline") {
    return (
      <a
        href="#/admin"
        onClick={handleAdminNavigate}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`d-inline-flex align-items-center gap-3 text-decoration-none group ${className}`}
        title="PlayBeat Verified System Infrastructure — Click for Administrator Portal"
      >
        <div className="position-relative">
          {sealSvg}
          {hovered && (
            <span
              className="position-absolute translate-middle-x badge rounded-pill bg-dark text-cyan-300 border border-cyan-500/40 text-[10px] py-1 px-2 pointer-events-none"
              style={{ bottom: "-26px", left: "50%", whiteSpace: "nowrap", zIndex: 10 }}
            >
              Enterprise Admin Portal
            </span>
          )}
        </div>
        {showDetails && (
          <div className="text-start">
            <div className="d-flex align-items-center gap-1.5">
              <span className="text-xs fw-bold text-white tracking-wide">
                VERIFIED AGENCY SEAL
              </span>
              <span className="badge bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-[9px] px-1.5 py-0.5 rounded">
                256-BIT
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              PlayBeat Digital Certified Infrastructure
            </div>
          </div>
        )}
      </a>
    );
  }

  // Card Variant (fits into Contact Section / Trust blocks)
  return (
    <div
      onClick={handleAdminNavigate}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`rounded-2xl p-4 transition-all duration-300 position-relative overflow-hidden cursor-pointer ${
        hovered
          ? "border-cyan-400/50 bg-gradient-to-br from-cyan-950/40 via-slate-900/60 to-purple-950/40 shadow-[0_0_30px_rgba(34,211,238,0.25)]"
          : "border-white/10 bg-slate-900/40 hover:border-white/20"
      } border ${className}`}
      role="button"
      tabIndex={0}
      title="Click image to enter Admin console"
      aria-label="PlayBeat Digital Enterprise Node Security Seal"
    >
      {/* Background ambient glow */}
      <div
        className="position-absolute top-0 end-0 rounded-circle pointer-events-none opacity-20"
        style={{
          width: "120px",
          height: "120px",
          background: "radial-gradient(circle, #22D3EE 0%, #7C3AED 70%, transparent 100%)",
          filter: "blur(30px)",
        }}
      />

      <div className="d-flex align-items-center gap-3.5 position-relative z-1">
        {/* Embedded Seal Image */}
        <div className="shrink-0 position-relative">
          {sealSvg}
          <div
            className={`position-absolute inset-0 rounded-circle transition-opacity duration-300 pointer-events-none ${
              hovered ? "opacity-100 ring-2 ring-cyan-400/60" : "opacity-0"
            }`}
          />
        </div>

        {/* Informational Text */}
        <div className="flex-grow-1 min-w-0">
          <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
            <span className="text-xs fw-extrabold text-white tracking-wider uppercase font-mono">
              Certified System Seal
            </span>
            <span className="badge rounded-pill bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2 py-0.5 d-inline-flex align-items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-circle bg-emerald-400 animate-pulse"></span>
              ACTIVE
            </span>
          </div>

          <p className="text-slate-300 text-xs mb-1.5 leading-snug">
            SOC-2 Type II & ISO 27001 compliant cloud infrastructure. 100% intellectual property escrow on all bespoke deliveries.
          </p>

          <div className="d-flex align-items-center justify-content-between text-[11px] text-slate-400">
            <span className="font-mono text-cyan-400/90">ID: PBD-NODE-2026-X89</span>
            <span className="text-cyan-300/80 fw-medium d-inline-flex align-items-center gap-1 hover:text-cyan-200">
              <span>{hovered ? "Enter Admin Console →" : "System Verification"}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
