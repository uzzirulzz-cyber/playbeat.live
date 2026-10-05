import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { Product, Category } from "../types";
import { useStore } from "../context/StoreContext";

export const ProductManagement: React.FC = () => {
  const { showToast } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([api.getProducts(), api.getCategories()]);
      setProducts(prods);
      setCategories(cats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingProduct({
      name: "",
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      category: categories[0]?.slug || "ai-tools",
      price: 99,
      comparePrice: 149,
      description: "",
      shortDescription: "",
      productType: "digital",
      pricingInterval: "one-time",
      status: "published",
      tags: ["New"],
      features: ["Instant digital license key", "Commercial perpetual license"],
      images: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"],
      downloadUrl: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct({ ...p });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || editingProduct.price === undefined) {
      showToast("Please enter product name and valid price.");
      return;
    }

    try {
      if (editingProduct.id) {
        await api.updateProduct(editingProduct.id, editingProduct);
        showToast(`Product "${editingProduct.name}" updated`);
      } else {
        await api.createProduct(editingProduct);
        showToast(`Product "${editingProduct.name}" created`);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || "Failed to save product");
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const res = await api.toggleProductStatus(id);
      showToast(`Product status updated to ${res.status}`);
      loadData();
    } catch (e: any) {
      showToast(e.message || "Failed to update status");
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await api.duplicateProduct(id);
      showToast("Product duplicated successfully");
      loadData();
    } catch (e: any) {
      showToast(e.message || "Failed to duplicate");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete product "${name}"?`)) {
      try {
        await api.deleteProduct(id);
        showToast("Product deleted");
        loadData();
      } catch (e: any) {
        showToast(e.message || "Failed to delete");
      }
    }
  };

  const filtered = products.filter((p) => {
    const matchCat = selectedCategory === "all" || p.category === selectedCategory;
    const matchType = selectedType === "all" || p.productType === selectedType;
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchType && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <h4 className="fw-bold text-dark mb-1">Product Catalog Management</h4>
          <p className="text-muted small mb-0">Create, publish, edit software licenses, subscriptions and digital assets.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn btn-dark btn-sm rounded-3 px-3 py-2 fw-bold d-flex align-items-center gap-1.5 shadow-sm"
        >
          <i className="bi bi-plus-lg"></i> Add Product
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="card border rounded-3 p-3 bg-white shadow-sm">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-5">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white text-muted border-end-0">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                placeholder="Search by name, SKU or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-control border-start-0"
              />
            </div>
          </div>

          <div className="col-6 col-md-3">
            <select
              className="form-select form-select-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-6 col-md-2">
            <select
              className="form-select form-select-sm"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="digital">Digital Product</option>
              <option value="subscription">Subscription</option>
              <option value="software">Software</option>
              <option value="service">Service</option>
            </select>
          </div>

          <div className="col-12 col-md-2 text-md-end text-muted small">
            {filtered.length} products
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card border rounded-3 bg-white shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-sm">
            <thead className="table-light text-muted small text-uppercase">
              <tr>
                <th style={{ width: "60px" }}>Image</th>
                <th>Product Name / SKU</th>
                <th>Category</th>
                <th>Type</th>
                <th>Price</th>
                <th>Status</th>
                <th>Licenses</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    <span className="spinner-border spinner-border-sm text-primary"></span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-muted small">
                    No products found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <img
                        src={p.images?.[0] || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80"}
                        alt={p.name}
                        className="rounded-2 border"
                        style={{ width: "42px", height: "42px", objectFit: "cover" }}
                      />
                    </td>
                    <td>
                      <div className="fw-bold text-dark text-xs">{p.name}</div>
                      <div className="text-muted text-[11px] font-mono">{p.sku}</div>
                    </td>
                    <td>
                      <span className="badge bg-light text-secondary border text-[11px]">
                        {categories.find((c) => c.slug === p.category)?.name || p.category}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-info-subtle text-info border border-info-subtle text-[10px] text-capitalize">
                        {p.productType}
                      </span>
                    </td>
                    <td>
                      <span className="fw-bold text-dark text-xs">${p.price}</span>
                      {p.comparePrice && (
                        <span className="text-muted text-decoration-line-through ms-1 text-[11px]">
                          ${p.comparePrice}
                        </span>
                      )}
                      <div className="text-muted text-[10px]">{p.pricingInterval}</div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleStatus(p.id)}
                        className={`badge rounded-pill border-0 cursor-pointer ${
                          p.status === "published"
                            ? "bg-success-subtle text-success"
                            : "bg-secondary-subtle text-secondary"
                        }`}
                        title="Click to toggle publish status"
                      >
                        {p.status}
                      </button>
                    </td>
                    <td>
                      <span className="small text-muted font-mono">
                        {p.productType === "digital" ? `${p.licenseAvailableCount || 0} avail` : "Recurring"}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="btn btn-outline-secondary p-1"
                          title="Edit"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          onClick={() => handleDuplicate(p.id)}
                          className="btn btn-outline-secondary p-1"
                          title="Duplicate"
                        >
                          <i className="bi bi-copy"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
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

      {/* Modal: Create / Edit Product */}
      {isModalOpen && editingProduct && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom py-3 px-4">
                <h5 className="modal-title fw-bold text-dark fs-6">
                  {editingProduct.id ? "Edit Product Specifications" : "Create New Product"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>

              <form onSubmit={handleSaveProduct}>
                <div className="modal-body p-4 space-y-3">
                  <div className="row g-3">
                    <div className="col-12 col-md-8">
                      <label className="form-label small fw-semibold text-secondary">Product Title *</label>
                      <input
                        type="text"
                        required
                        className="form-control form-control-sm"
                        value={editingProduct.name || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        placeholder="e.g. NeuroSaaS Autonomous Agent Studio"
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold text-secondary">SKU Code</label>
                      <input
                        type="text"
                        className="form-control form-control-sm font-mono"
                        value={editingProduct.sku || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                      />
                    </div>

                    <div className="col-6 col-md-3">
                      <label className="form-label small fw-semibold text-secondary">Price ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        className="form-control form-control-sm"
                        value={editingProduct.price ?? ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      />
                    </div>

                    <div className="col-6 col-md-3">
                      <label className="form-label small fw-semibold text-secondary">Compare Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control form-control-sm"
                        value={editingProduct.comparePrice ?? ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, comparePrice: Number(e.target.value) })}
                      />
                    </div>

                    <div className="col-6 col-md-3">
                      <label className="form-label small fw-semibold text-secondary">Category</label>
                      <select
                        className="form-select form-select-sm"
                        value={editingProduct.category || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-6 col-md-3">
                      <label className="form-label small fw-semibold text-secondary">Product Type</label>
                      <select
                        className="form-select form-select-sm"
                        value={editingProduct.productType || "digital"}
                        onChange={(e) => setEditingProduct({ ...editingProduct, productType: e.target.value as any })}
                      >
                        <option value="digital">Digital License</option>
                        <option value="subscription">Recurring Subscription</option>
                        <option value="software">Software Executable</option>
                        <option value="service">Bespoke Service</option>
                      </select>
                    </div>

                    <div className="col-6 col-md-4">
                      <label className="form-label small fw-semibold text-secondary">Pricing Interval</label>
                      <select
                        className="form-select form-select-sm"
                        value={editingProduct.pricingInterval || "one-time"}
                        onChange={(e) => setEditingProduct({ ...editingProduct, pricingInterval: e.target.value as any })}
                      >
                        <option value="one-time">One Time</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>

                    <div className="col-6 col-md-4">
                      <label className="form-label small fw-semibold text-secondary">Publish Status</label>
                      <select
                        className="form-select form-select-sm"
                        value={editingProduct.status || "published"}
                        onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value as any })}
                      >
                        <option value="published">Published (Live on Storefront)</option>
                        <option value="draft">Draft (Hidden)</option>
                      </select>
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold text-secondary">Product Badge (Optional)</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={editingProduct.badge || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                        placeholder="e.g. Best Seller, New, Hot"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold text-secondary">Primary Image URL</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={editingProduct.images?.[0] || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold text-secondary">Short Summary Description</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={editingProduct.shortDescription || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold text-secondary">Full Comprehensive Description</label>
                      <textarea
                        rows={3}
                        className="form-control form-control-sm text-xs"
                        value={editingProduct.description || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold text-secondary">Download Package Link</label>
                      <input
                        type="text"
                        className="form-control form-control-sm font-mono text-xs"
                        value={editingProduct.downloadUrl || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, downloadUrl: e.target.value })}
                        placeholder="https://downloads.playbeat.digital/packages/file.zip"
                      />
                    </div>
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
                    Save Product
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
