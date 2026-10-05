import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { Category } from "../types";
import { useStore } from "../context/StoreContext";

export const CategoryManagement: React.FC = () => {
  const { showToast } = useStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingCategory({
      name: "",
      slug: "",
      description: "",
      icon: "bi-folder",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory({ ...c });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name) return;

    try {
      if (editingCategory.id) {
        await api.updateCategory(editingCategory.id, editingCategory);
        showToast("Category updated");
      } else {
        await api.createCategory(editingCategory);
        showToast("Category created");
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (e: any) {
      showToast(e.message || "Failed to save category");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete category "${name}"?`)) {
      try {
        await api.deleteCategory(id);
        showToast("Category deleted");
        loadCategories();
      } catch (e: any) {
        showToast(e.message || "Failed to delete category");
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <h4 className="fw-bold text-dark mb-1">Categories Directory</h4>
          <p className="text-muted small mb-0">Organize digital marketplace items, subscription groups, and software domains.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn btn-dark btn-sm rounded-3 px-3 py-2 fw-bold d-flex align-items-center gap-1.5 shadow-sm"
        >
          <i className="bi bi-plus-lg"></i> Add Category
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="row g-3">
        {loading ? (
          <div className="col-12 text-center py-5">
            <span className="spinner-border spinner-border-sm text-primary"></span>
          </div>
        ) : (
          categories.map((c) => (
            <div key={c.id} className="col-12 col-md-6 col-xl-4">
              <div className="card border rounded-3 p-3 bg-white shadow-sm h-100 d-flex flex-column justify-content-between">
                <div className="d-flex items-start gap-3">
                  <img
                    src={c.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=200&q=80"}
                    alt={c.name}
                    className="rounded-3 border object-cover shrink-0"
                    style={{ width: "64px", height: "64px" }}
                  />
                  <div className="overflow-hidden">
                    <h6 className="fw-bold text-dark mb-1 text-truncate">{c.name}</h6>
                    <code className="text-muted text-[11px] d-block font-mono mb-1">/{c.slug}</code>
                    <p className="text-muted small mb-0 text-truncate-2" style={{ fontSize: "11.5px" }}>
                      {c.description}
                    </p>
                  </div>
                </div>

                <div className="d-flex items-center justify-content-between pt-3 mt-3 border-top">
                  <span className="badge bg-light text-secondary border text-[11px]">
                    {c.count || 0} Products
                  </span>
                  <div className="btn-group btn-group-sm">
                    <button
                      onClick={() => handleOpenEdit(c)}
                      className="btn btn-outline-secondary p-1"
                      title="Edit"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(c.id, c.name)}
                      className="btn btn-outline-danger p-1"
                      title="Delete"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && editingCategory && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom py-3 px-4">
                <h5 className="modal-title fw-bold text-dark fs-6">
                  {editingCategory.id ? "Edit Category" : "Add New Category"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>

              <form onSubmit={handleSave}>
                <div className="modal-body p-4 space-y-3">
                  <div>
                    <label className="form-label small fw-semibold text-secondary">Category Name *</label>
                    <input
                      type="text"
                      required
                      className="form-control form-control-sm"
                      value={editingCategory.name || ""}
                      onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                      placeholder="e.g. AI Tools"
                    />
                  </div>

                  <div>
                    <label className="form-label small fw-semibold text-secondary">Slug Identifier</label>
                    <input
                      type="text"
                      className="form-control form-control-sm font-mono"
                      value={editingCategory.slug || ""}
                      onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                      placeholder="e.g. ai-tools"
                    />
                  </div>

                  <div>
                    <label className="form-label small fw-semibold text-secondary">Description</label>
                    <textarea
                      rows={2}
                      className="form-control form-control-sm"
                      value={editingCategory.description || ""}
                      onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label small fw-semibold text-secondary">Cover Image URL</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={editingCategory.image || ""}
                      onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
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
                    Save Category
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
