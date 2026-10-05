import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { useStore } from "../context/StoreContext";

export const SEOManagement: React.FC = () => {
  const { showToast } = useStore();
  const [seo, setSeo] = useState<any>({
    metaTitle: "",
    metaDescription: "",
    canonicalUrl: "",
    robots: "index, follow",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSEO();
  }, []);

  const loadSEO = async () => {
    setLoading(true);
    try {
      const data = await api.getSEO();
      if (data) setSeo(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSEO(seo);
      showToast("Global SEO & Robot parameters updated!");
    } catch (e: any) {
      showToast(e.message || "Failed to save SEO");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="fw-bold text-dark mb-1">Search Engine Optimization & Sitemap</h4>
        <p className="text-muted small mb-0">Canonical URLs, OpenGraph indexing metadata, and structured search markup.</p>
      </div>

      <div className="card border rounded-3 p-4 bg-white shadow-sm max-w-2xl">
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="form-label small fw-semibold text-secondary">Global Meta Title</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={seo.metaTitle || ""}
              onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label small fw-semibold text-secondary">Meta Search Description</label>
            <textarea
              rows={3}
              className="form-control form-control-sm text-xs"
              value={seo.metaDescription || ""}
              onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label small fw-semibold text-secondary">Canonical Storefront URL</label>
            <input
              type="text"
              className="form-control form-control-sm font-mono text-xs"
              value={seo.canonicalUrl || ""}
              onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label small fw-semibold text-secondary">Robots Indexing Directives</label>
            <input
              type="text"
              className="form-control form-control-sm font-mono text-xs"
              value={seo.robots || "index, follow"}
              onChange={(e) => setSeo({ ...seo, robots: e.target.value })}
            />
          </div>

          <div className="pt-2">
            <button type="submit" disabled={saving} className="btn btn-primary btn-sm px-4 fw-bold">
              Save SEO Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
