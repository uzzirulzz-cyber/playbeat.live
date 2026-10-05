import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { PageModel } from "../types";
import { useStore } from "../context/StoreContext";

export const PageManagement: React.FC = () => {
  const { showToast } = useStore();
  const [pages, setPages] = useState<PageModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPage, setNewPage] = useState({ title: "", slug: "", seoTitle: "", seoDescription: "" });

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    setLoading(true);
    try {
      const data = await api.getPages();
      setPages(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPage.title) return;
    try {
      await api.createPage(newPage.title, newPage.slug);
      showToast(`Page "${newPage.title}" created in drafts.`);
      setIsModalOpen(false);
      setNewPage({ title: "", slug: "", seoTitle: "", seoDescription: "" });
      loadPages();
    } catch (e: any) {
      showToast(e.message || "Failed to create page");
    }
  };

  const handleTogglePublish = async (p: PageModel) => {
    try {
      if (p.status === "draft") {
        await api.publishPage(p.id);
        showToast(`Page "${p.title}" published live!`);
      } else {
        await api.savePageDraft(p.id, { status: "draft" as any });
        showToast(`Page "${p.title}" set to draft.`);
      }
      loadPages();
    } catch (e: any) {
      showToast(e.message || "Failed to toggle status");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Delete page "${title}"?`)) {
      try {
        await api.deletePage(id);
        showToast("Page deleted");
        loadPages();
      } catch (e: any) {
        showToast(e.message || "Failed to delete page");
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <h4 className="fw-bold text-dark mb-1">Storefront Page Management</h4>
          <p className="text-muted small mb-0">Manage core system pages, visual layout sections, and SEO search meta tags.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-dark btn-sm rounded-3 px-3 py-2 fw-bold d-flex align-items-center gap-1.5 shadow-sm"
        >
          <i className="bi bi-file-earmark-plus"></i> Create Custom Page
        </button>
      </div>

      {/* Pages Table */}
      <div className="card border rounded-3 bg-white shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-sm">
            <thead className="table-light text-muted small text-uppercase">
              <tr>
                <th>Page Title</th>
                <th>Slug Route</th>
                <th>SEO Meta Title</th>
                <th>Status</th>
                <th>Version</th>
                <th>Last Published</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    <span className="spinner-border spinner-border-sm text-primary"></span>
                  </td>
                </tr>
              ) : (
                pages.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="fw-bold text-dark text-xs">{p.title}</div>
                      <span className="text-muted text-[11px]">{p.sections?.length || 0} section(s)</span>
                    </td>
                    <td>
                      <code className="text-dark bg-light px-2 py-0.5 rounded text-xs border font-mono">
                        /{p.slug}
                      </code>
                    </td>
                    <td className="text-xs text-muted text-truncate" style={{ maxWidth: "200px" }}>
                      {p.seoTitle || "—"}
                    </td>
                    <td>
                      <button
                        onClick={() => handleTogglePublish(p)}
                        className={`badge rounded-pill border-0 cursor-pointer ${
                          p.status === "published"
                            ? "bg-success-subtle text-success"
                            : "bg-secondary-subtle text-secondary"
                        }`}
                      >
                        {p.status}
                      </button>
                    </td>
                    <td className="text-xs font-mono">v{p.version || 1}</td>
                    <td className="text-xs text-muted">
                      {p.lastPublished ? new Date(p.lastPublished).toLocaleDateString() : "Never"}
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <a
                          href={`#/${p.slug === "home" ? "" : p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-secondary p-1"
                          title="Preview Live"
                        >
                          <i className="bi bi-box-arrow-up-right"></i>
                        </a>
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          disabled={p.slug === "home" || p.slug === "shop"}
                          className="btn btn-outline-danger p-1"
                          title="Delete"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Page */}
      {isModalOpen && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom py-3 px-4">
                <h5 className="modal-title fw-bold text-dark fs-6">Create New Page</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>

              <form onSubmit={handleCreatePage}>
                <div className="modal-body p-4 space-y-3">
                  <div>
                    <label className="form-label small fw-semibold text-secondary">Page Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Terms of Service, Changelog, FAQ"
                      className="form-control form-control-sm"
                      value={newPage.title}
                      onChange={(e) =>
                        setNewPage({
                          ...newPage,
                          title: e.target.value,
                          slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="form-label small fw-semibold text-secondary">URL Route Slug</label>
                    <input
                      type="text"
                      className="form-control form-control-sm font-mono"
                      value={newPage.slug}
                      onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                      placeholder="e.g. terms-of-service"
                    />
                  </div>
                </div>

                <div className="modal-footer border-top py-2.5 px-4 bg-light">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm px-4 fw-bold">
                    Create Page
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
