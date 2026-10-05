import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { ThemeSettings } from "../types";
import { useStore } from "../context/StoreContext";
import { PlayBeatLogo } from "../components/PlayBeatLogo";

export const ThemeCustomizer: React.FC = () => {
  const { showToast, refreshTheme, setTheme } = useStore();
  const [draftTheme, setDraftTheme] = useState<ThemeSettings | null>(null);
  const [revisions, setRevisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingLogo, setUpdatingLogo] = useState(false);
  const [activeTab, setActiveTab] = useState<"logo" | "branding" | "header" | "footer" | "revisions">("logo");
  const [previewSize, setPreviewSize] = useState<"sm" | "md" | "lg" | "xl">("md");

  useEffect(() => {
    loadThemeData();
  }, []);

  const loadThemeData = async () => {
    setLoading(true);
    try {
      const [draft, live] = await Promise.all([api.getThemeDraft(), api.getTheme()]);
      setDraftTheme({
        ...draft,
        logoText: draft.logoText || "PlayBeat Digital",
        logoTagline: draft.logoTagline || "DIGITAL",
        logoShowLiveBadge: draft.logoShowLiveBadge !== false,
        logoLiveBadgeText: draft.logoLiveBadgeText || "LIVE",
        logoLiveBadgeColor: draft.logoLiveBadgeColor || "cyan",
        logoShowEqualizer: draft.logoShowEqualizer !== false,
      });
      // load revisions if available
      try {
        const revRes = await fetch("/api/theme/revisions").then((r) => r.json());
        if (Array.isArray(revRes)) setRevisions(revRes);
      } catch {}
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Instant Live Update of Logo
  const handleLiveUpdateLogo = async () => {
    if (!draftTheme) return;
    setUpdatingLogo(true);
    try {
      const res = await api.liveUpdateLogo({
        logoText: draftTheme.logoText,
        logoTagline: draftTheme.logoTagline,
        logoImage: draftTheme.logoImage,
        logoShowLiveBadge: draftTheme.logoShowLiveBadge,
        logoLiveBadgeText: draftTheme.logoLiveBadgeText,
        logoLiveBadgeColor: draftTheme.logoLiveBadgeColor,
        logoShowEqualizer: draftTheme.logoShowEqualizer,
      });
      // Broadcast live to StoreContext so storefront & admin immediately update
      setTheme(res.theme);
      setDraftTheme(res.theme);
      showToast(res.message || "PlayBeat Logo live-updated and broadcast to Storefront!");
    } catch (e: any) {
      showToast(e.message || "Failed to live update logo.");
    } finally {
      setUpdatingLogo(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!draftTheme) return;
    setSaving(true);
    try {
      await api.saveThemeDraft(draftTheme);
      showToast("Draft theme preferences saved.");
    } catch (e: any) {
      showToast(e.message || "Failed to save draft.");
    } finally {
      setSaving(false);
    }
  };

  const handlePublishLive = async () => {
    if (!draftTheme) return;
    setSaving(true);
    try {
      await api.saveThemeDraft(draftTheme);
      const res = await api.publishTheme();
      showToast(res.message || "Theme published to storefront!");
      await refreshTheme();
      loadThemeData();
    } catch (e: any) {
      showToast(e.message || "Failed to publish theme.");
    } finally {
      setSaving(false);
    }
  };

  const handleRollback = async (version: number) => {
    if (confirm(`Roll back storefront theme to version ${version}?`)) {
      try {
        const res = await api.rollbackTheme(version);
        showToast(res.message || `Theme rolled back to v${version}`);
        await refreshTheme();
        loadThemeData();
      } catch (e: any) {
        showToast(e.message || "Failed rollback.");
      }
    }
  };

  // Apply Quick Preset
  const applyPreset = (presetKey: string) => {
    if (!draftTheme) return;
    if (presetKey === "official") {
      setDraftTheme({
        ...draftTheme,
        logoText: "PlayBeat Digital",
        logoTagline: "DIGITAL",
        logoImage: "",
        logoShowLiveBadge: true,
        logoLiveBadgeText: "LIVE",
        logoLiveBadgeColor: "cyan",
        logoShowEqualizer: true,
      });
    } else if (presetKey === "emerald") {
      setDraftTheme({
        ...draftTheme,
        logoText: "PlayBeat Digital",
        logoTagline: "ENTERPRISE",
        logoImage: "",
        logoShowLiveBadge: true,
        logoLiveBadgeText: "ONLINE",
        logoLiveBadgeColor: "green",
        logoShowEqualizer: true,
      });
    } else if (presetKey === "sunset") {
      setDraftTheme({
        ...draftTheme,
        logoText: "PlayBeat Digital",
        logoTagline: "STUDIO",
        logoImage: "",
        logoShowLiveBadge: true,
        logoLiveBadgeText: "DEMO",
        logoLiveBadgeColor: "orange",
        logoShowEqualizer: true,
      });
    } else if (presetKey === "minimal") {
      setDraftTheme({
        ...draftTheme,
        logoText: "PlayBeat Digital",
        logoTagline: "DIGITAL",
        logoImage: "",
        logoShowLiveBadge: false,
        logoShowEqualizer: false,
      });
    }
  };

  if (loading || !draftTheme) {
    return (
      <div className="text-center p-5">
        <span className="spinner-border spinner-border-sm text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 bg-white p-3.5 rounded-3 border shadow-sm">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h4 className="fw-bold text-dark mb-0">Storefront Theme Customizer</h4>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-0.5 small fw-bold">
              LIVE Sync
            </span>
          </div>
          <p className="text-muted small mb-0">
            Current Live Version: <span className="badge bg-dark">v{draftTheme.version || 1}</span> · Last updated:{" "}
            <span className="font-mono">{new Date(draftTheme.lastUpdated).toLocaleDateString()}</span>
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          {activeTab === "logo" && (
            <button
              onClick={handleLiveUpdateLogo}
              disabled={updatingLogo}
              className="btn btn-info text-dark btn-sm px-3.5 rounded-3 fw-bold d-flex align-items-center gap-2 shadow-sm"
              title="Apply logo changes to storefront and admin immediately without needing a full publish"
            >
              <i className={`bi ${updatingLogo ? "bi-arrow-repeat spin" : "bi-broadcast-pin"}`}></i>
              <span>{updatingLogo ? "Broadcasting..." : "⚡ Live Update Logo"}</span>
            </button>
          )}

          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="btn btn-outline-secondary btn-sm px-3 rounded-3 fw-semibold"
          >
            Save Draft
          </button>
          <button
            onClick={handlePublishLive}
            disabled={saving}
            className="btn btn-primary btn-sm px-3.5 rounded-3 fw-bold d-flex align-items-center gap-1.5 shadow-sm"
          >
            <i className="bi bi-cloud-arrow-up-fill"></i>
            <span>Publish to Storefront</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-bottom bg-white rounded-3 p-1 px-3 border shadow-sm">
        <div className="d-flex flex-wrap gap-2">
          {[
            { id: "logo", label: "PlayBeat LIVE Logo", icon: "bi-broadcast-pin" },
            { id: "branding", label: "Branding & Colors", icon: "bi-palette" },
            { id: "header", label: "Header & Navigation", icon: "bi-layout-text-window" },
            { id: "footer", label: "Footer & Policies", icon: "bi-layout-text-window-reverse" },
            { id: "revisions", label: "Revision History", icon: "bi-clock-history" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`btn btn-sm border-0 border-bottom border-2 rounded-0 px-3 py-2.5 fw-semibold d-flex align-items-center gap-2 ${
                activeTab === tab.id
                  ? "border-primary text-primary fw-bold"
                  : "border-transparent text-secondary hover:text-dark"
              }`}
            >
              <i className={`bi ${tab.icon}`}></i>
              {tab.label}
              {tab.id === "logo" && (
                <span className="badge rounded-pill bg-info text-dark text-[9px] px-1.5">
                  LIVE
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="card border rounded-3 p-4 bg-white shadow-sm">
        {/* Tab 0: PlayBeat LIVE Logo Suite */}
        {activeTab === "logo" && (
          <div className="space-y-4">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 border-bottom pb-3">
              <div>
                <h5 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                  <span>PlayBeat Dynamic LIVE Logo Suite</span>
                  <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-2 py-0.5 small fw-semibold">
                    Real-Time Broadcast
                  </span>
                </h5>
                <p className="text-muted small mb-0">
                  Configure brand mark, animated audio beat visualizer, and pulsating LIVE status badge. Updates reflect instantaneously across Storefront and Admin.
                </p>
              </div>

              {/* Instant Action */}
              <button
                onClick={handleLiveUpdateLogo}
                disabled={updatingLogo}
                className="btn btn-primary btn-sm px-4 py-2 rounded-3 fw-bold d-flex align-items-center gap-2 shadow-sm"
              >
                <i className={`bi ${updatingLogo ? "bi-arrow-repeat spin" : "bi-lightning-charge-fill"}`}></i>
                <span>{updatingLogo ? "Broadcasting Live..." : "Live Update Logo Now"}</span>
              </button>
            </div>

            {/* LIVE PREVIEW CANVAS */}
            <div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-xs fw-bold text-uppercase tracking-wider text-muted">
                  Interactive Live Simulator
                </span>
                <div className="btn-group btn-group-sm">
                  {(["sm", "md", "lg", "xl"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setPreviewSize(s)}
                      className={`btn btn-xs px-2.5 py-1 text-xs fw-semibold ${
                        previewSize === s ? "btn-dark" : "btn-outline-secondary"
                      }`}
                    >
                      {s.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="row g-3">
                {/* Light Mode Preview */}
                <div className="col-12 col-lg-6">
                  <div className="p-4 rounded-3 border bg-light d-flex flex-column align-items-center justify-content-center text-center position-relative min-h-[140px]">
                    <span className="position-absolute top-2 start-3 badge bg-white border text-secondary text-[10px] fw-semibold">
                      Light Surface (Header & Admin)
                    </span>
                    <div className="py-3">
                      <PlayBeatLogo
                        size={previewSize}
                        customText={draftTheme.logoText}
                        customTagline={draftTheme.logoTagline}
                        customImage={draftTheme.logoImage}
                        showLiveBadge={draftTheme.logoShowLiveBadge}
                        liveBadgeText={draftTheme.logoLiveBadgeText}
                        liveBadgeColor={draftTheme.logoLiveBadgeColor}
                        showEqualizer={draftTheme.logoShowEqualizer}
                        lightMode={true}
                      />
                    </div>
                  </div>
                </div>

                {/* Dark Navy Mode Preview */}
                <div className="col-12 col-lg-6">
                  <div
                    className="p-4 rounded-3 border d-flex flex-column align-items-center justify-content-center text-center position-relative min-h-[140px]"
                    style={{ backgroundColor: "#060d1f", borderColor: "rgba(255,255,255,0.12)" }}
                  >
                    <span className="position-absolute top-2 start-3 badge bg-dark border border-secondary text-white-50 text-[10px] fw-semibold">
                      Dark Navy Surface (Storefront Footer & Hero)
                    </span>
                    <div className="py-3">
                      <PlayBeatLogo
                        size={previewSize}
                        customText={draftTheme.logoText}
                        customTagline={draftTheme.logoTagline}
                        customImage={draftTheme.logoImage}
                        showLiveBadge={draftTheme.logoShowLiveBadge}
                        liveBadgeText={draftTheme.logoLiveBadgeText}
                        liveBadgeColor={draftTheme.logoLiveBadgeColor}
                        showEqualizer={draftTheme.logoShowEqualizer}
                        lightMode={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="p-3 bg-light rounded-3 border">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                <span className="small fw-bold text-dark">Quick Brand Presets:</span>
                <span className="text-muted text-xs">Click to apply instantly to editor</span>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset("official")}
                  className="btn btn-outline-dark btn-sm rounded-pill px-3 py-1 text-xs fw-semibold d-inline-flex align-items-center gap-1.5"
                >
                  <span className="d-inline-block rounded-circle bg-info" style={{ width: 7, height: 7 }}></span>
                  Official PlayBeat Digital (Cyan LIVE)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("emerald")}
                  className="btn btn-outline-dark btn-sm rounded-pill px-3 py-1 text-xs fw-semibold d-inline-flex align-items-center gap-1.5"
                >
                  <span className="d-inline-block rounded-circle bg-success" style={{ width: 7, height: 7 }}></span>
                  Enterprise Online (Green ONLINE)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("sunset")}
                  className="btn btn-outline-dark btn-sm rounded-pill px-3 py-1 text-xs fw-semibold d-inline-flex align-items-center gap-1.5"
                >
                  <span className="d-inline-block rounded-circle bg-warning" style={{ width: 7, height: 7 }}></span>
                  Studio Sunset (Orange DEMO)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("minimal")}
                  className="btn btn-outline-dark btn-sm rounded-pill px-3 py-1 text-xs fw-semibold d-inline-flex align-items-center gap-1.5"
                >
                  <i className="bi bi-slash-circle text-muted"></i>
                  Minimal Clean (No Badge)
                </button>
              </div>
            </div>

            {/* LOGO CONTROLS FORM */}
            <div className="row g-4 pt-2">
              {/* Brand Text */}
              <div className="col-12 col-md-6">
                <label className="form-label small fw-bold text-dark mb-1">
                  Logo Brand Name
                </label>
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white text-muted">
                    <i className="bi bi-fonts"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    value={draftTheme.logoText}
                    onChange={(e) => setDraftTheme({ ...draftTheme, logoText: e.target.value })}
                    placeholder="PlayBeat Digital"
                  />
                </div>
                <div className="form-text text-xs">
                  Tip: Keep "PlayBeat" for the cyan + coral two-tone gradient effect.
                </div>
              </div>

              {/* Subtext Tagline */}
              <div className="col-12 col-md-6">
                <label className="form-label small fw-bold text-dark mb-1">
                  Tagline / Platform Subtitle
                </label>
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white text-muted">
                    <i className="bi bi-tag"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    value={draftTheme.logoTagline || "DIGITAL"}
                    onChange={(e) => setDraftTheme({ ...draftTheme, logoTagline: e.target.value })}
                    placeholder="DIGITAL"
                  />
                </div>
                <div className="form-text text-xs">
                  Wide-tracked uppercase subtext underneath the wordmark.
                </div>
              </div>

              {/* LIVE Badge Toggle & Badge Text */}
              <div className="col-12 col-md-6">
                <div className="p-3 border rounded-3 h-100 bg-white">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <label className="form-label small fw-bold text-dark mb-0 d-flex align-items-center gap-1.5">
                      <i className="bi bi-broadcast text-primary"></i>
                      <span>Show Pulsing LIVE Badge</span>
                    </label>
                    <div className="form-check form-switch mb-0">
                      <input
                        type="checkbox"
                        className="form-check-input cursor-pointer"
                        id="showLiveBadgeSwitch"
                        checked={draftTheme.logoShowLiveBadge !== false}
                        onChange={(e) =>
                          setDraftTheme({ ...draftTheme, logoShowLiveBadge: e.target.checked })
                        }
                      />
                    </div>
                  </div>

                  {draftTheme.logoShowLiveBadge !== false && (
                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="form-label text-xs fw-semibold text-secondary mb-1">
                          Badge Label Text
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={draftTheme.logoLiveBadgeText || "LIVE"}
                          onChange={(e) =>
                            setDraftTheme({ ...draftTheme, logoLiveBadgeText: e.target.value })
                          }
                          placeholder="LIVE"
                        />
                      </div>

                      <div>
                        <label className="form-label text-xs fw-semibold text-secondary mb-1">
                          Badge Glow Color Theme
                        </label>
                        <div className="d-flex gap-2">
                          {[
                            { id: "cyan", label: "Neon Cyan", color: "#06b6d4" },
                            { id: "green", label: "Emerald", color: "#10b981" },
                            { id: "orange", label: "Coral Sunset", color: "#f97316" },
                            { id: "purple", label: "Electric Violet", color: "#a855f7" },
                          ].map((col) => (
                            <button
                              key={col.id}
                              type="button"
                              onClick={() =>
                                setDraftTheme({ ...draftTheme, logoLiveBadgeColor: col.id as any })
                              }
                              className={`btn btn-sm px-2.5 py-1 text-xs fw-bold rounded-pill d-flex align-items-center gap-1.5 border transition-all ${
                                (draftTheme.logoLiveBadgeColor || "cyan") === col.id
                                  ? "border-dark shadow-sm ring-2 ring-offset-1 ring-dark"
                                  : "border-light-subtle bg-white text-secondary"
                              }`}
                            >
                              <span
                                className="d-inline-block rounded-circle"
                                style={{ width: 8, height: 8, backgroundColor: col.color }}
                              ></span>
                              {col.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Animated Equalizer Beat Switch */}
              <div className="col-12 col-md-6">
                <div className="p-3 border rounded-3 h-100 bg-white">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <label className="form-label small fw-bold text-dark mb-0 d-flex align-items-center gap-1.5">
                      <i className="bi bi-activity text-info"></i>
                      <span>Dynamic Audio Beat Equalizer</span>
                    </label>
                    <div className="form-check form-switch mb-0">
                      <input
                        type="checkbox"
                        className="form-check-input cursor-pointer"
                        id="showEqualizerSwitch"
                        checked={draftTheme.logoShowEqualizer !== false}
                        onChange={(e) =>
                          setDraftTheme({ ...draftTheme, logoShowEqualizer: e.target.checked })
                        }
                      />
                    </div>
                  </div>
                  <p className="text-muted text-xs mb-2">
                    Displays animated vertical audio frequency visualizer bars pulsing with rhythm beside the play loop triangle, visually expressing the "PlayBeat" brand essence.
                  </p>
                  <div className="p-2 rounded-2 bg-light border d-flex align-items-center justify-content-between text-xs text-secondary">
                    <span>Animation Mode: Continuous Rhythm Pulse</span>
                    <span className="badge bg-success-subtle text-success">Active</span>
                  </div>
                </div>
              </div>

              {/* Custom Image URL Option */}
              <div className="col-12">
                <div className="p-3 border rounded-3 bg-light">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <label className="form-label small fw-bold text-dark mb-0">
                      Optional Custom Image Override
                    </label>
                    {draftTheme.logoImage && (
                      <button
                        type="button"
                        onClick={() => setDraftTheme({ ...draftTheme, logoImage: "" })}
                        className="btn btn-link btn-sm text-danger text-decoration-none p-0 text-xs"
                      >
                        Reset to Official PlayBeat Vector Mark
                      </button>
                    )}
                  </div>
                  <p className="text-muted text-xs mb-2">
                    Leave blank to use the official PlayBeat multi-color ribbon play mark with SVG gradients and equalizer.
                  </p>
                  <input
                    type="url"
                    className="form-control form-control-sm"
                    value={draftTheme.logoImage || ""}
                    onChange={(e) => setDraftTheme({ ...draftTheme, logoImage: e.target.value })}
                    placeholder="https://example.com/logo.svg"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Floating Action Bar inside Tab */}
            <div className="p-3 bg-dark text-white rounded-3 d-flex flex-wrap align-items-center justify-content-between gap-3 shadow-md">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-broadcast fs-5 text-info"></i>
                <div>
                  <div className="fw-bold text-sm">Real-Time Storefront Synchronization</div>
                  <div className="text-white-50 text-xs">
                    Changes apply immediately to Storefront Header, Footer, and Admin Console.
                  </div>
                </div>
              </div>
              <button
                onClick={handleLiveUpdateLogo}
                disabled={updatingLogo}
                className="btn btn-info text-dark fw-bold px-4 py-2 rounded-3 d-flex align-items-center gap-2 shadow"
              >
                <i className={`bi ${updatingLogo ? "bi-arrow-repeat spin" : "bi-lightning-charge-fill"}`}></i>
                <span>{updatingLogo ? "Broadcasting..." : "⚡ Live Update Logo Now"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: Branding & Colors */}
        {activeTab === "branding" && (
          <div className="space-y-4">
            <h6 className="fw-bold text-dark mb-3">Brand Identity & Color Tokens</h6>

            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label small fw-semibold text-secondary">Storefront Logo Text</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={draftTheme.logoText}
                  onChange={(e) => setDraftTheme({ ...draftTheme, logoText: e.target.value })}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small fw-semibold text-secondary">Container Width</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={draftTheme.containerWidth}
                  onChange={(e) => setDraftTheme({ ...draftTheme, containerWidth: e.target.value })}
                  placeholder="1240px"
                />
              </div>

              <div className="col-6 col-md-3">
                <label className="form-label small fw-semibold text-secondary">Primary Accent Color</label>
                <div className="d-flex align-items-center gap-2">
                  <input
                    type="color"
                    className="form-control form-control-color border-0 p-0"
                    value={draftTheme.primaryColor}
                    onChange={(e) => setDraftTheme({ ...draftTheme, primaryColor: e.target.value })}
                  />
                  <span className="small text-muted font-mono">{draftTheme.primaryColor}</span>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <label className="form-label small fw-semibold text-secondary">Dark Surface Color</label>
                <div className="d-flex align-items-center gap-2">
                  <input
                    type="color"
                    className="form-control form-control-color border-0 p-0"
                    value={draftTheme.darkColor}
                    onChange={(e) => setDraftTheme({ ...draftTheme, darkColor: e.target.value })}
                  />
                  <span className="small text-muted font-mono">{draftTheme.darkColor}</span>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <label className="form-label small fw-semibold text-secondary">Light Surface Color</label>
                <div className="d-flex align-items-center gap-2">
                  <input
                    type="color"
                    className="form-control form-control-color border-0 p-0"
                    value={draftTheme.lightColor}
                    onChange={(e) => setDraftTheme({ ...draftTheme, lightColor: e.target.value })}
                  />
                  <span className="small text-muted font-mono">{draftTheme.lightColor}</span>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <label className="form-label small fw-semibold text-secondary">Border Radius</label>
                <select
                  className="form-select form-select-sm"
                  value={draftTheme.borderRadius}
                  onChange={(e) => setDraftTheme({ ...draftTheme, borderRadius: e.target.value })}
                >
                  <option value="4px">Sharp (4px)</option>
                  <option value="12px">Smooth (12px)</option>
                  <option value="20px">Rounded (20px)</option>
                  <option value="99px">Pill (99px)</option>
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small fw-semibold text-secondary">Typography Font Family</label>
                <select
                  className="form-select form-select-sm"
                  value={draftTheme.fontFamily}
                  onChange={(e) => setDraftTheme({ ...draftTheme, fontFamily: e.target.value })}
                >
                  <option value="Plus Jakarta Sans, sans-serif">Plus Jakarta Sans</option>
                  <option value="Inter, sans-serif">Inter</option>
                  <option value="system-ui, -apple-system, sans-serif">Modern System UI</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Header Settings */}
        {activeTab === "header" && (
          <div className="space-y-4">
            <h6 className="fw-bold text-dark mb-3">Storefront Header & Navigation</h6>

            <div className="form-check form-switch mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="showAnnounce"
                checked={draftTheme.header.showAnnouncement}
                onChange={(e) =>
                  setDraftTheme({
                    ...draftTheme,
                    header: { ...draftTheme.header, showAnnouncement: e.target.checked },
                  })
                }
              />
              <label className="form-check-label small fw-semibold" htmlFor="showAnnounce">
                Display Top Announcement Bar
              </label>
            </div>

            <div className="row g-3">
              <div className="col-12 col-md-8">
                <label className="form-label small fw-semibold text-secondary">Announcement Message</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={draftTheme.header.announcementBanner}
                  onChange={(e) =>
                    setDraftTheme({
                      ...draftTheme,
                      header: { ...draftTheme.header, announcementBanner: e.target.value },
                    })
                  }
                />
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label small fw-semibold text-secondary">Announcement Link</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={draftTheme.header.announcementLink}
                  onChange={(e) =>
                    setDraftTheme({
                      ...draftTheme,
                      header: { ...draftTheme.header, announcementLink: e.target.value },
                    })
                  }
                />
              </div>

              <div className="col-6 col-md-4">
                <label className="form-label small fw-semibold text-secondary">Header CTA Button Text</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={draftTheme.header.ctaButton.text}
                  onChange={(e) =>
                    setDraftTheme({
                      ...draftTheme,
                      header: {
                        ...draftTheme.header,
                        ctaButton: { ...draftTheme.header.ctaButton, text: e.target.value },
                      },
                    })
                  }
                />
              </div>

              <div className="col-6 col-md-4">
                <label className="form-label small fw-semibold text-secondary">Header CTA Link</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={draftTheme.header.ctaButton.link}
                  onChange={(e) =>
                    setDraftTheme({
                      ...draftTheme,
                      header: {
                        ...draftTheme.header,
                        ctaButton: { ...draftTheme.header.ctaButton, link: e.target.value },
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Footer Settings */}
        {activeTab === "footer" && (
          <div className="space-y-4">
            <h6 className="fw-bold text-dark mb-3">Storefront Footer Configuration</h6>

            <div className="row g-3">
              <div className="col-12">
                <label className="form-label small fw-semibold text-secondary">About Paragraph</label>
                <textarea
                  rows={2}
                  className="form-control form-control-sm"
                  value={draftTheme.footer.aboutText}
                  onChange={(e) =>
                    setDraftTheme({
                      ...draftTheme,
                      footer: { ...draftTheme.footer, aboutText: e.target.value },
                    })
                  }
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small fw-semibold text-secondary">Newsletter Heading</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={draftTheme.footer.newsletterTitle}
                  onChange={(e) =>
                    setDraftTheme({
                      ...draftTheme,
                      footer: { ...draftTheme.footer, newsletterTitle: e.target.value },
                    })
                  }
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small fw-semibold text-secondary">Copyright Notice</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={draftTheme.footer.copyright}
                  onChange={(e) =>
                    setDraftTheme({
                      ...draftTheme,
                      footer: { ...draftTheme.footer, copyright: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Revision History & Rollback */}
        {activeTab === "revisions" && (
          <div className="space-y-4">
            <h6 className="fw-bold text-dark mb-2">Theme Publishing Revisions & Rollback</h6>
            <p className="text-muted small">
              Every time you publish to the live storefront, an immutable revision snapshot is saved. You can roll back anytime.
            </p>

            <div className="table-responsive">
              <table className="table table-hover align-middle text-sm mb-0">
                <thead className="table-light text-muted small text-uppercase">
                  <tr>
                    <th>Version</th>
                    <th>Date Published</th>
                    <th>Published By</th>
                    <th>Primary Color</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {revisions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-muted small">
                        Version 1 is the currently active baseline.
                      </td>
                    </tr>
                  ) : (
                    revisions.map((rev, idx) => (
                      <tr key={idx}>
                        <td className="fw-bold">v{rev.version}</td>
                        <td className="small text-muted">{new Date(rev.date).toLocaleString()}</td>
                        <td className="small">{rev.user || "Admin Director"}</td>
                        <td>
                          <span
                            className="d-inline-block rounded-circle me-1 border"
                            style={{
                              width: "14px",
                              height: "14px",
                              backgroundColor: rev.theme.primaryColor,
                            }}
                          ></span>
                          <span className="font-mono text-xs">{rev.theme.primaryColor}</span>
                        </td>
                        <td className="text-end">
                          <button
                            onClick={() => handleRollback(rev.version)}
                            className="btn btn-outline-secondary btn-sm py-1 px-2.5 rounded-2 text-xs"
                          >
                            Rollback
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
