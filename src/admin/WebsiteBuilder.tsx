import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { PageModel, PageSection } from "../types";
import { useStore } from "../context/StoreContext";

export const WebsiteBuilder: React.FC = () => {
  const { showToast } = useStore();
  const [pages, setPages] = useState<PageModel[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>("pg_home");
  const [sections, setSections] = useState<PageSection[]>([]);
  const [history, setHistory] = useState<PageSection[][]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      const pgs = await api.getPages();
      setPages(pgs);
      const home = pgs.find((p) => p.slug === "home") || pgs[0];
      if (home) {
        setSelectedPageId(home.id);
        setSections(home.sections || []);
        setHistory([home.sections || []]);
        setHistoryIdx(0);
        if (home.sections?.length) {
          setSelectedSectionId(home.sections[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectPage = (id: string) => {
    const page = pages.find((p) => p.id === id);
    if (page) {
      setSelectedPageId(page.id);
      setSections(page.sections || []);
      setHistory([page.sections || []]);
      setHistoryIdx(0);
      setSelectedSectionId(page.sections?.[0]?.id || null);
    }
  };

  const updateSections = (newSections: PageSection[]) => {
    setSections(newSections);
    const newHist = history.slice(0, historyIdx + 1);
    newHist.push(newSections);
    setHistory(newHist);
    setHistoryIdx(newHist.length - 1);
  };

  const handleUndo = () => {
    if (historyIdx > 0) {
      const prev = historyIdx - 1;
      setHistoryIdx(prev);
      setSections(history[prev]);
    }
  };

  const handleRedo = () => {
    if (historyIdx < history.length - 1) {
      const next = historyIdx + 1;
      setHistoryIdx(next);
      setSections(history[next]);
    }
  };

  // Add Element / Section
  const handleAddElement = (type: string, titleDefault?: string) => {
    const newSec: PageSection = {
      id: `sec_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      type,
      title: titleDefault || `New ${type.replace("_", " ").toUpperCase()}`,
      subtitle: "Customizable subtitle description",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.",
      settings: {
        bg: "#ffffff",
        textColor: "#111827",
        padding: "py-5",
        alignment: "text-center",
      },
    };

    updateSections([...sections, newSec]);
    setSelectedSectionId(newSec.id);
    showToast(`Added ${type} section to canvas`);
  };

  const handleDuplicateSection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const idx = sections.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const item = sections[idx];
    const clone: PageSection = {
      ...item,
      id: `sec_${Date.now()}_clone`,
      title: `${item.title || "Section"} (Copy)`,
    };
    const next = [...sections];
    next.splice(idx + 1, 0, clone);
    updateSections(next);
    setSelectedSectionId(clone.id);
  };

  const handleDeleteSection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = sections.filter((s) => s.id !== id);
    updateSections(next);
    if (selectedSectionId === id) {
      setSelectedSectionId(next[0]?.id || null);
    }
  };

  const handleMoveSection = (id: string, dir: -1 | 1, e: React.MouseEvent) => {
    e.stopPropagation();
    const idx = sections.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= sections.length) return;
    const next = [...sections];
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    updateSections(next);
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      await api.savePageDraft(selectedPageId, { sections });
      showToast("Draft saved successfully");
    } catch (e: any) {
      showToast(e.message || "Failed to save draft");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    try {
      await api.savePageDraft(selectedPageId, { sections });
      const res = await api.publishPage(selectedPageId);
      showToast(res.message || "Published live to storefront!");
    } catch (e: any) {
      showToast(e.message || "Failed to publish page");
    } finally {
      setSaving(false);
    }
  };

  const activeSection = sections.find((s) => s.id === selectedSectionId);

  const canvasWidth =
    deviceMode === "mobile" ? "390px" : deviceMode === "tablet" ? "768px" : "100%";

  return (
    <div className="d-flex flex-column" style={{ height: "calc(100vh - 100px)" }}>
      {/* Top Toolbar */}
      <div className="bg-white border rounded-3 p-2 mb-3 d-flex flex-wrap align-items-center justify-content-between gap-3 shadow-sm shrink-0">
        {/* Page Selector & Status */}
        <div className="d-flex align-items-center gap-2">
          <label className="small fw-bold text-secondary">Editing Page:</label>
          <select
            className="form-select form-select-sm fw-semibold rounded-2 text-dark"
            style={{ width: "190px" }}
            value={selectedPageId}
            onChange={(e) => handleSelectPage(e.target.value)}
          >
            {pages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.status})
              </option>
            ))}
          </select>
          <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill text-[10px]">
            Live Sync
          </span>
        </div>

        {/* Device Switcher */}
        <div className="btn-group btn-group-sm bg-light p-1 border rounded-3">
          <button
            onClick={() => setDeviceMode("desktop")}
            className={`btn btn-sm border-0 rounded-2 ${deviceMode === "desktop" ? "btn-dark text-white" : "text-muted"}`}
            title="Desktop 100%"
          >
            <i className="bi bi-display"></i>
          </button>
          <button
            onClick={() => setDeviceMode("tablet")}
            className={`btn btn-sm border-0 rounded-2 ${deviceMode === "tablet" ? "btn-dark text-white" : "text-muted"}`}
            title="Tablet 768px"
          >
            <i className="bi bi-tablet"></i>
          </button>
          <button
            onClick={() => setDeviceMode("mobile")}
            className={`btn btn-sm border-0 rounded-2 ${deviceMode === "mobile" ? "btn-dark text-white" : "text-muted"}`}
            title="Mobile 390px"
          >
            <i className="bi bi-phone"></i>
          </button>
        </div>

        {/* Action Buttons: Undo, Redo, Preview, Save, Publish */}
        <div className="d-flex align-items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={historyIdx <= 0}
            className="btn btn-outline-secondary btn-sm rounded-2 p-1.5"
            title="Undo"
          >
            <i className="bi bi-arrow-counterclockwise"></i>
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIdx >= history.length - 1}
            className="btn btn-outline-secondary btn-sm rounded-2 p-1.5"
            title="Redo"
          >
            <i className="bi bi-arrow-clockwise"></i>
          </button>

          <button
            onClick={() => setIsPreview(!isPreview)}
            className={`btn btn-sm rounded-3 px-3 fw-semibold ${isPreview ? "btn-info text-white" : "btn-outline-secondary"}`}
          >
            <i className={`bi ${isPreview ? "bi-eye-slash" : "bi-eye"} me-1`}></i>
            {isPreview ? "Exit Preview" : "Preview"}
          </button>

          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="btn btn-outline-dark btn-sm rounded-3 px-3 fw-semibold"
          >
            Save Draft
          </button>

          <button
            onClick={handlePublish}
            disabled={saving}
            className="btn btn-primary btn-sm rounded-3 px-3 fw-bold d-flex align-items-center gap-1.5 shadow-sm"
          >
            <i className="bi bi-cloud-arrow-up-fill"></i>
            <span>Publish Live</span>
          </button>
        </div>
      </div>

      {/* 3-Column Layout: Left Palette | Center Canvas | Right Inspector */}
      <div className="d-flex gap-3 flex-grow-1 overflow-hidden">
        {/* LEFT COLUMN: Elements & Templates Palette */}
        {!isPreview && (
          <div
            className="bg-white border rounded-3 p-3 d-flex flex-column shrink-0 overflow-y-auto"
            style={{ width: "250px", minWidth: "250px" }}
          >
            <div className="fw-bold text-dark small text-uppercase tracking-wider mb-2">
              Elements Palette
            </div>
            <p className="text-muted text-[11px] mb-3">Click or add sections directly into the live canvas.</p>

            <div className="d-grid gap-1.5">
              {[
                { type: "hero", label: "Hero Banner", icon: "bi-card-heading", color: "text-primary" },
                { type: "product_grid", label: "Product Grid", icon: "bi-grid-3x3-gap", color: "text-success" },
                { type: "category_grid", label: "Category Cards", icon: "bi-folder", color: "text-warning" },
                { type: "pricing_matrix", label: "Pricing Table", icon: "bi-tags", color: "text-info" },
                { type: "features", label: "Feature Columns", icon: "bi-check-all", color: "text-primary" },
                { type: "testimonials", label: "Testimonials", icon: "bi-chat-quote", color: "text-purple" },
                { type: "faq", label: "FAQ Accordion", icon: "bi-question-circle", color: "text-secondary" },
                { type: "cta", label: "Call to Action", icon: "bi-bullseye", color: "text-danger" },
                { type: "newsletter", label: "Newsletter Box", icon: "bi-envelope-paper", color: "text-success" },
                { type: "text", label: "Rich Text Block", icon: "bi-textarea-t", color: "text-dark" },
                { type: "card", label: "Showcase Card", icon: "bi-window", color: "text-info" },
                { type: "banner", label: "Alert / Banner", icon: "bi-megaphone", color: "text-warning" },
                { type: "custom_html", label: "Custom Embed", icon: "bi-code-slash", color: "text-secondary" },
              ].map((el) => (
                <button
                  key={el.type}
                  onClick={() => handleAddElement(el.type, el.label)}
                  className="btn btn-light btn-sm text-start d-flex align-items-center gap-2 p-2 border rounded-2 hover:bg-white hover:border-primary transition-all text-dark"
                >
                  <i className={`bi ${el.icon} ${el.color} fs-6`}></i>
                  <span className="small fw-semibold text-truncate">{el.label}</span>
                  <i className="bi bi-plus-lg ms-auto text-muted text-xs"></i>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CENTER COLUMN: Live Website Canvas */}
        <div className="flex-grow-1 bg-secondary-subtle rounded-3 p-3 overflow-auto d-flex justify-content-center">
          <div
            className="bg-white border rounded-3 shadow-sm d-flex flex-column transition-all duration-300 overflow-hidden"
            style={{
              width: canvasWidth,
              maxWidth: "100%",
              minHeight: "100%",
            }}
          >
            {sections.length === 0 ? (
              <div className="p-5 text-center my-auto text-muted">
                <i className="bi bi-layout-text-window-reverse fs-1 text-secondary opacity-50 d-block mb-3"></i>
                <h6 className="fw-bold text-dark">Canvas is currently empty</h6>
                <p className="small mb-3">Select elements from the left palette to construct your storefront layout.</p>
                <button
                  onClick={() => handleAddElement("hero", "Welcome to Storefront")}
                  className="btn btn-primary btn-sm rounded-pill px-3 fw-semibold"
                >
                  + Add Hero Section
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column divide-y">
                {sections.map((sec, idx) => {
                  const isSelected = selectedSectionId === sec.id && !isPreview;
                  return (
                    <div
                      key={sec.id}
                      onClick={() => !isPreview && setSelectedSectionId(sec.id)}
                      className={`position-relative p-4 transition-all ${
                        isSelected
                          ? "ring-2 ring-primary ring-inset bg-primary-subtle bg-opacity-10"
                          : "hover:bg-light hover:bg-opacity-50"
                      } ${sec.settings?.alignment || "text-center"}`}
                      style={{
                        backgroundColor: sec.settings?.bg || "#ffffff",
                        color: sec.settings?.textColor || "#111827",
                      }}
                    >
                      {/* Section Controls Toolbar */}
                      {isSelected && (
                        <div
                          className="position-absolute top-0 end-0 m-2 d-flex align-items-center gap-1 bg-dark text-white p-1 rounded-2 shadow-sm z-3"
                          style={{ fontSize: "11px" }}
                        >
                          <span className="px-1.5 text-warning fw-bold text-uppercase">{sec.type}</span>
                          <button
                            onClick={(e) => handleMoveSection(sec.id, -1, e)}
                            disabled={idx === 0}
                            className="btn btn-sm btn-dark p-1"
                            title="Move Up"
                          >
                            <i className="bi bi-chevron-up"></i>
                          </button>
                          <button
                            onClick={(e) => handleMoveSection(sec.id, 1, e)}
                            disabled={idx === sections.length - 1}
                            className="btn btn-sm btn-dark p-1"
                            title="Move Down"
                          >
                            <i className="bi bi-chevron-down"></i>
                          </button>
                          <button
                            onClick={(e) => handleDuplicateSection(sec.id, e)}
                            className="btn btn-sm btn-dark p-1"
                            title="Duplicate"
                          >
                            <i className="bi bi-copy"></i>
                          </button>
                          <button
                            onClick={(e) => handleDeleteSection(sec.id, e)}
                            className="btn btn-sm btn-danger p-1"
                            title="Delete"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      )}

                      {/* Render Visual Section Output */}
                      {sec.type === "hero" && (
                        <div className="py-4 px-2">
                          <span className="badge bg-primary-subtle text-primary border rounded-pill px-3 py-1 mb-2 text-xs">
                            FEATURED SUITE
                          </span>
                          <h2 className="fw-extrabold mb-2 display-6">{sec.title}</h2>
                          <p className="lead text-muted small mx-auto" style={{ maxWidth: "600px" }}>
                            {sec.subtitle}
                          </p>
                          <div className="d-flex justify-content-center gap-2 mt-3">
                            <button className="btn btn-primary btn-sm rounded-pill px-4 fw-semibold">
                              Explore Products
                            </button>
                            <button className="btn btn-outline-dark btn-sm rounded-pill px-4 fw-semibold">
                              Subscriptions
                            </button>
                          </div>
                        </div>
                      )}

                      {sec.type === "product_grid" && (
                        <div className="py-3">
                          <h4 className="fw-bold mb-1">{sec.title}</h4>
                          <p className="text-muted small mb-3">{sec.subtitle}</p>
                          <div className="row g-2 justify-content-center">
                            {[1, 2, 3].map((n) => (
                              <div key={n} className="col-4">
                                <div className="card p-2 border text-start shadow-none">
                                  <div className="bg-light rounded p-4 text-center text-muted mb-2">
                                    <i className="bi bi-box-seam fs-3"></i>
                                  </div>
                                  <div className="fw-bold text-xs">Software Suite #{n}</div>
                                  <div className="text-primary fw-bold text-xs">$149</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {sec.type === "category_grid" && (
                        <div className="py-3">
                          <h4 className="fw-bold mb-1">{sec.title}</h4>
                          <p className="text-muted small mb-3">{sec.subtitle}</p>
                          <div className="row g-2 justify-content-center">
                            {["AI Tools", "Software", "Licenses"].map((c, cIdx) => (
                              <div key={cIdx} className="col-4">
                                <div className="card p-3 border text-center shadow-none bg-light">
                                  <i className="bi bi-stars text-primary fs-4 mb-1"></i>
                                  <b className="text-xs">{c}</b>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {sec.type === "pricing_matrix" && (
                        <div className="py-3">
                          <h4 className="fw-bold mb-1">{sec.title}</h4>
                          <div className="row g-2 justify-content-center mt-2">
                            {["1 Month", "12 Months"].map((plan, pIdx) => (
                              <div key={pIdx} className="col-5">
                                <div className={`card p-3 border text-center ${pIdx === 1 ? "border-primary bg-primary-subtle bg-opacity-25" : ""}`}>
                                  <b className="text-xs">{plan} Pass</b>
                                  <div className="fs-5 fw-extrabold my-1">${pIdx === 1 ? "499" : "59"}</div>
                                  <button className="btn btn-dark btn-sm rounded-pill text-[10px] w-100">
                                    Select Plan
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {sec.type === "cta" && (
                        <div className="p-4 rounded-3 bg-dark text-white text-center">
                          <h4 className="fw-bold text-white mb-2">{sec.title}</h4>
                          <p className="small text-white-50 mb-3">{sec.subtitle}</p>
                          <button className="btn btn-light btn-sm rounded-pill px-4 fw-bold">
                            Join Now
                          </button>
                        </div>
                      )}

                      {!["hero", "product_grid", "category_grid", "pricing_matrix", "cta"].includes(sec.type) && (
                        <div className="py-3">
                          <h4 className="fw-bold">{sec.title}</h4>
                          <p className="text-muted small mb-1">{sec.subtitle}</p>
                          {sec.content && <p className="small text-secondary">{sec.content}</p>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Property Inspector */}
        {!isPreview && (
          <div
            className="bg-white border rounded-3 p-3 d-flex flex-column shrink-0 overflow-y-auto"
            style={{ width: "280px", minWidth: "280px" }}
          >
            <div className="fw-bold text-dark small text-uppercase tracking-wider mb-2">
              Property Inspector
            </div>

            {activeSection ? (
              <div className="space-y-3">
                <div className="p-2 bg-light rounded-2 mb-2">
                  <span className="text-muted text-[10px] uppercase font-bold">Element Type</span>
                  <div className="fw-bold text-primary text-xs">{activeSection.type}</div>
                </div>

                <div>
                  <label className="form-label text-xs fw-semibold text-secondary mb-1">Title</label>
                  <input
                    type="text"
                    className="form-control form-control-sm text-xs"
                    value={activeSection.title || ""}
                    onChange={(e) => {
                      const updated = sections.map((s) =>
                        s.id === activeSection.id ? { ...s, title: e.target.value } : s
                      );
                      updateSections(updated);
                    }}
                  />
                </div>

                <div>
                  <label className="form-label text-xs fw-semibold text-secondary mb-1">Subtitle</label>
                  <input
                    type="text"
                    className="form-control form-control-sm text-xs"
                    value={activeSection.subtitle || ""}
                    onChange={(e) => {
                      const updated = sections.map((s) =>
                        s.id === activeSection.id ? { ...s, subtitle: e.target.value } : s
                      );
                      updateSections(updated);
                    }}
                  />
                </div>

                <div>
                  <label className="form-label text-xs fw-semibold text-secondary mb-1">Content Body</label>
                  <textarea
                    rows={3}
                    className="form-control form-control-sm text-xs"
                    value={activeSection.content || ""}
                    onChange={(e) => {
                      const updated = sections.map((s) =>
                        s.id === activeSection.id ? { ...s, content: e.target.value } : s
                      );
                      updateSections(updated);
                    }}
                  />
                </div>

                <div>
                  <label className="form-label text-xs fw-semibold text-secondary mb-1">Background Color</label>
                  <div className="d-flex items-center gap-2">
                    <input
                      type="color"
                      className="form-control form-control-color border-0 p-0"
                      value={activeSection.settings?.bg || "#ffffff"}
                      onChange={(e) => {
                        const updated = sections.map((s) =>
                          s.id === activeSection.id
                            ? { ...s, settings: { ...(s.settings || {}), bg: e.target.value } }
                            : s
                        );
                        updateSections(updated);
                      }}
                    />
                    <span className="small text-muted font-mono">{activeSection.settings?.bg || "#ffffff"}</span>
                  </div>
                </div>

                <div>
                  <label className="form-label text-xs fw-semibold text-secondary mb-1">Text Alignment</label>
                  <div className="btn-group btn-group-sm w-100">
                    {["text-start", "text-center", "text-end"].map((align) => (
                      <button
                        key={align}
                        onClick={() => {
                          const updated = sections.map((s) =>
                            s.id === activeSection.id
                              ? { ...s, settings: { ...(s.settings || {}), alignment: align } }
                              : s
                          );
                          updateSections(updated);
                        }}
                        className={`btn btn-sm ${activeSection.settings?.alignment === align ? "btn-dark" : "btn-light border"}`}
                      >
                        {align === "text-start" ? "Left" : align === "text-center" ? "Center" : "Right"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-muted small text-center py-4">
                Click any section on the canvas to inspect and edit properties.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
