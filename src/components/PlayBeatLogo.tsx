import React from "react";
import { useStore } from "../context/StoreContext";

export interface PlayBeatLogoProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  lightMode?: boolean;
  customText?: string;
  customTagline?: string;
  customImage?: string;
  showLiveBadge?: boolean;
  liveBadgeText?: string;
  liveBadgeColor?: "green" | "cyan" | "orange" | "purple";
  showEqualizer?: boolean;
  onClick?: () => void;
}

export const PlayBeatLogo: React.FC<PlayBeatLogoProps> = ({
  className = "",
  size = "md",
  showTagline,
  lightMode,
  customText,
  customTagline,
  customImage,
  showLiveBadge,
  liveBadgeText,
  liveBadgeColor,
  showEqualizer,
  onClick,
}) => {
  // Gracefully read theme from StoreContext if available
  let themeSettings: any = null;
  try {
    const store = useStore();
    themeSettings = store.theme;
  } catch {
    // If rendered outside StoreProvider (e.g. testing)
    themeSettings = null;
  }

  // Resolve configuration: props take precedence over theme settings
  const resolvedText = customText ?? themeSettings?.logoText ?? "PlayBeat Digital";
  const resolvedTagline = customTagline ?? themeSettings?.logoTagline ?? "DIGITAL";
  const resolvedImage = customImage ?? themeSettings?.logoImage;
  const resolvedShowTagline = showTagline ?? true;
  const resolvedShowLiveBadge = showLiveBadge ?? themeSettings?.logoShowLiveBadge ?? true;
  const resolvedLiveBadgeText = liveBadgeText ?? themeSettings?.logoLiveBadgeText ?? "LIVE";
  const resolvedLiveBadgeColor = liveBadgeColor ?? themeSettings?.logoLiveBadgeColor ?? "cyan";
  const resolvedShowEqualizer = showEqualizer ?? themeSettings?.logoShowEqualizer ?? true;
  const isLight = lightMode ?? false;

  // Custom Image Mode (if user uploaded a custom logo image URL)
  if (resolvedImage && resolvedImage.trim() !== "") {
    const imgHeights = {
      xs: "20px",
      sm: "26px",
      md: "36px",
      lg: "46px",
      xl: "60px",
    };
    return (
      <div
        className={`d-inline-flex align-items-center gap-2 cursor-pointer ${className}`}
        onClick={onClick}
      >
        <img
          src={resolvedImage}
          alt={resolvedText}
          style={{ height: imgHeights[size], width: "auto", objectFit: "contain" }}
          className="rounded-1"
        />
        {resolvedText && (
          <span className={`fw-extrabold tracking-tight ${isLight ? "text-dark" : "text-white"}`}>
            {resolvedText}
          </span>
        )}
        {resolvedShowLiveBadge && (
          <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-1.5 py-0.5 text-[9px] fw-bold d-inline-flex align-items-center gap-1">
            <span className="d-inline-block rounded-circle bg-success" style={{ width: 5, height: 5 }}></span>
            {resolvedLiveBadgeText}
          </span>
        )}
      </div>
    );
  }

  // Dimensions based on size
  const dimensions = {
    xs: {
      icon: 22,
      fontSize: "14px",
      tagSize: "7px",
      tagMargin: "1px",
      tracking: "0.22em",
      eqHeight: 10,
      badgeTextSize: "8px",
      badgePadding: "1px 5px",
    },
    sm: {
      icon: 28,
      fontSize: "16px",
      tagSize: "8px",
      tagMargin: "1px",
      tracking: "0.26em",
      eqHeight: 12,
      badgeTextSize: "9px",
      badgePadding: "2px 6px",
    },
    md: {
      icon: 36,
      fontSize: "20px",
      tagSize: "9.5px",
      tagMargin: "2px",
      tracking: "0.32em",
      eqHeight: 15,
      badgeTextSize: "9.5px",
      badgePadding: "2px 7px",
    },
    lg: {
      icon: 48,
      fontSize: "28px",
      tagSize: "12px",
      tagMargin: "3px",
      tracking: "0.38em",
      eqHeight: 18,
      badgeTextSize: "11px",
      badgePadding: "3px 9px",
    },
    xl: {
      icon: 64,
      fontSize: "40px",
      tagSize: "15px",
      tagMargin: "4px",
      tracking: "0.42em",
      eqHeight: 22,
      badgeTextSize: "13px",
      badgePadding: "4px 11px",
    },
  }[size];

  // Text breakdown: detect "PlayBeat" or split generic name
  const isDefaultPlayBeat = !resolvedText || resolvedText.toLowerCase().includes("playbeat");
  const words = resolvedText ? resolvedText.split(" ") : ["PlayBeat", "Digital"];

  // Badge Color Styles
  const badgeThemes: Record<string, { bg: string; text: string; border: string; dot: string; dotGlow: string }> = {
    cyan: {
      bg: "rgba(6, 182, 212, 0.12)",
      text: "#06b6d4",
      border: "rgba(6, 182, 212, 0.35)",
      dot: "#06b6d4",
      dotGlow: "rgba(6, 182, 212, 0.6)",
    },
    green: {
      bg: "rgba(16, 185, 129, 0.12)",
      text: "#10b981",
      border: "rgba(16, 185, 129, 0.35)",
      dot: "#10b981",
      dotGlow: "rgba(16, 185, 129, 0.6)",
    },
    orange: {
      bg: "rgba(249, 115, 22, 0.12)",
      text: "#f97316",
      border: "rgba(249, 115, 22, 0.35)",
      dot: "#f97316",
      dotGlow: "rgba(249, 115, 22, 0.6)",
    },
    purple: {
      bg: "rgba(168, 85, 247, 0.12)",
      text: "#a855f7",
      border: "rgba(168, 85, 247, 0.35)",
      dot: "#a855f7",
      dotGlow: "rgba(168, 85, 247, 0.6)",
    },
  };

  const selectedBadgeTheme = badgeThemes[String(resolvedLiveBadgeColor)] || badgeThemes.cyan;

  return (
    <div
      className={`d-inline-flex align-items-center gap-2.5 user-select-none ${className}`}
      onClick={onClick}
      style={{ lineHeight: 1 }}
      title={`${resolvedText} · LIVE Platform`}
    >
      {/* 1. Official Multi-Color Gradient Play Loop Mark with Pulse Depth */}
      <div className="position-relative shrink-0 d-inline-flex align-items-center justify-content-center">
        <svg
          width={dimensions.icon}
          height={dimensions.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 hover:scale-105"
          style={{ filter: "drop-shadow(0 4px 14px rgba(56, 189, 248, 0.28))" }}
        >
          <defs>
            {/* Outer Triangle Ribbon Gradients matching exact PlayBeat brand */}
            <linearGradient id={`pbLeftBar_${size}`} x1="15" y1="12" x2="30" y2="88" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00C8FF" />
              <stop offset="35%" stopColor="#2563EB" />
              <stop offset="70%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#C026D3" />
            </linearGradient>

            <linearGradient id={`pbBottomBar_${size}`} x1="20" y1="85" x2="88" y2="52" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C026D3" />
              <stop offset="40%" stopColor="#E11D48" />
              <stop offset="75%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>

            <linearGradient id={`pbTopRight_${size}`} x1="88" y1="50" x2="20" y2="15" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="25%" stopColor="#F97316" />
              <stop offset="65%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#00D2FF" />
            </linearGradient>

            <radialGradient id={`pbCenterGlow_${size}`} cx="42" cy="50" r="30" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#081026" />
              <stop offset="100%" stopColor="#030712" />
            </radialGradient>
          </defs>

          {/* Outer Rounded Play Triangle Base */}
          <path
            d="M24 13.5C18.5 10.3 12 14.3 12 20.7V79.3C12 85.7 18.5 89.7 24 86.5L78.6 57.2C84.4 54.1 84.4 45.9 78.6 42.8L24 13.5Z"
            fill={`url(#pbLeftBar_${size})`}
          />

          {/* Bottom-to-Right Orange/Pink Wedge */}
          <path
            d="M22 85.5C36 78 62 64 80 54.5C84 52.2 84 47.8 80 45.5L46 63L20 84C20.6 84.6 21.3 85.1 22 85.5Z"
            fill={`url(#pbBottomBar_${size})`}
          />

          {/* Top-Right Yellow/Orange Flare */}
          <path
            d="M48 37L79 53C82 51.5 82 48.5 79 47L26 14.5C24 13.3 22 13 20 14L48 37Z"
            fill={`url(#pbTopRight_${size})`}
          />

          {/* Inner Dark Cutout Triangle (Creating the hollow Play Loop effect) */}
          <path
            d="M32 35C30.3 34 28 35.2 28 37.2V62.8C28 64.8 30.3 66 32 65L53.8 52.2C55.4 51.2 55.4 48.8 53.8 47.8L32 35Z"
            fill={`url(#pbCenterGlow_${size})`}
          />
        </svg>

        {/* Dynamic LIVE Audio Visualizer Beat Effect around Play Triangle */}
        {resolvedShowEqualizer && (
          <div
            className="position-absolute d-flex align-items-end justify-content-center gap-[2px] pointer-events-none"
            style={{
              bottom: "-4px",
              right: "-5px",
              height: `${dimensions.eqHeight}px`,
              padding: "2px 4px",
              background: "rgba(15, 23, 42, 0.85)",
              borderRadius: "4px",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              backdropFilter: "blur(4px)",
            }}
            title="Live Audio Beat Activity"
          >
            <span
              className="d-inline-block rounded-pill"
              style={{
                width: "2px",
                height: "60%",
                background: "#38bdf8",
                animation: "playbeatEqualizer 0.8s ease-in-out infinite alternate",
              }}
            />
            <span
              className="d-inline-block rounded-pill"
              style={{
                width: "2px",
                height: "100%",
                background: "#a855f7",
                animation: "playbeatEqualizer 0.6s ease-in-out 0.2s infinite alternate",
              }}
            />
            <span
              className="d-inline-block rounded-pill"
              style={{
                width: "2px",
                height: "45%",
                background: "#f97316",
                animation: "playbeatEqualizer 0.9s ease-in-out 0.4s infinite alternate",
              }}
            />
          </div>
        )}
      </div>

      {/* 2. Wordmark Section */}
      <div className="d-flex flex-column justify-content-center text-start">
        <div className="d-flex align-items-center gap-2">
          {isDefaultPlayBeat ? (
            <div
              className="fw-bold tracking-tight d-flex align-items-center"
              style={{
                fontSize: dimensions.fontSize,
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 1,
              }}
            >
              {/* "Play" in glowing cyan-blue gradient */}
              <span
                style={{
                  background: "linear-gradient(180deg, #38BDF8 0%, #60A5FA 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "#38BDF8",
                }}
              >
                Play
              </span>

              {/* "Beat" in energetic coral-orange gradient */}
              <span
                style={{
                  background: "linear-gradient(180deg, #FB923C 0%, #F97316 55%, #EF4444 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "#F97316",
                  marginLeft: "0.5px",
                }}
              >
                Beat
              </span>
            </div>
          ) : (
            <div
              className="fw-extrabold tracking-tight"
              style={{
                fontSize: dimensions.fontSize,
                fontWeight: 800,
                color: isLight ? "#0F172A" : "#FFFFFF",
              }}
            >
              {words[0]}
              {words.length > 1 && (
                <span className="text-primary ms-1">{words.slice(1).join(" ")}</span>
              )}
            </div>
          )}

          {/* 3. Dynamic LIVE Pulsing Badge */}
          {resolvedShowLiveBadge && (
            <div
              className="d-inline-flex align-items-center gap-1 rounded-pill fw-bold"
              style={{
                backgroundColor: selectedBadgeTheme.bg,
                color: selectedBadgeTheme.text,
                border: `1px solid ${selectedBadgeTheme.border}`,
                fontSize: dimensions.badgeTextSize,
                padding: dimensions.badgePadding,
                letterSpacing: "0.08em",
                lineHeight: 1.1,
                boxShadow: `0 0 10px ${selectedBadgeTheme.dotGlow}`,
              }}
            >
              {/* Pulsing indicator dot */}
              <span className="position-relative d-inline-flex" style={{ width: 6, height: 6 }}>
                <span
                  className="position-absolute top-0 start-0 w-100 h-100 rounded-circle opacity-75"
                  style={{
                    backgroundColor: selectedBadgeTheme.dot,
                    animation: "playbeatPing 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
                  }}
                />
                <span
                  className="position-relative d-inline-block rounded-circle"
                  style={{
                    width: 6,
                    height: 6,
                    backgroundColor: selectedBadgeTheme.dot,
                  }}
                />
              </span>
              <span>{resolvedLiveBadgeText}</span>
            </div>
          )}
        </div>

        {/* 4. D I G I T A L / Tagline wide-tracked subtext */}
        {resolvedShowTagline && (
          <span
            className="text-uppercase fw-bold"
            style={{
              fontSize: dimensions.tagSize,
              letterSpacing: dimensions.tracking,
              color: isLight ? "#475569" : "#94A3B8",
              marginTop: dimensions.tagMargin,
              lineHeight: 1,
              paddingLeft: "1px",
            }}
          >
            {resolvedTagline}
          </span>
        )}
      </div>

      {/* Global Embedded Styles for Animations */}
      <style>{`
        @keyframes playbeatPing {
          75%, 100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        @keyframes playbeatEqualizer {
          0% { height: 25%; }
          50% { height: 95%; }
          100% { height: 40%; }
        }
      `}</style>
    </div>
  );
};
