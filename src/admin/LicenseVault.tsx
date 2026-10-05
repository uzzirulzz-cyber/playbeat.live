import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { License, Product } from "../types";
import { useStore } from "../context/StoreContext";

export const LicenseVault: React.FC = () => {
  const { showToast } = useStore();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});

  // Generate Keys Modal
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [targetProductId, setTargetProductId] = useState("");
  const [generateCount, setGenerateCount] = useState(5);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [lics, prods] = await Promise.all([api.getLicenses(), api.getProducts()]);
      setLicenses(lics);
      setProducts(prods);
      if (prods.length > 0 && !targetProductId) {
        setTargetProductId(prods[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleReveal = (id: string) => {
    setRevealedKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("License key copied to clipboard!");
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.updateLicenseStatus(id, newStatus);
      showToast(`License status set to ${newStatus}`);
      loadData();
    } catch (e: any) {
      showToast(e.message || "Failed to update license status");
    }
  };

  const handleGenerateKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProductId) return;

    try {
      const res = await api.generateLicenses(targetProductId, generateCount);
      showToast(`Generated ${res.count} license keys successfully!`);
      setIsGenerateModalOpen(false);
      loadData();
    } catch (e: any) {
      showToast(e.message || "Failed to generate keys");
    }
  };

  const filtered = licenses.filter((l) => {
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    const matchProduct = productFilter === "all" || l.productId === productFilter;
    const matchSearch =
      !search ||
      l.licenseKey.toLowerCase().includes(search.toLowerCase()) ||
      l.productName.toLowerCase().includes(search.toLowerCase()) ||
      l.customerEmail?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchProduct && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <h4 className="fw-bold text-dark mb-1">Digital License Key Vault</h4>
          <p className="text-muted small mb-0">Cryptographically provisioned keys for digital software, AI tools, and enterprise licenses.</p>
        </div>

        <button
          onClick={() => setIsGenerateModalOpen(true)}
          className="btn btn-dark btn-sm rounded-3 px-3 py-2 fw-bold d-flex align-items-center gap-1.5 shadow-sm"
        >
          <i className="bi bi-key-fill text-warning"></i> Generate Keys
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card border rounded-3 p-3 bg-white shadow-sm">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-5">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white text-muted border-end-0">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                placeholder="Search key, product or customer email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-control border-start-0"
              />
            </div>
          </div>

          <div className="col-6 col-md-3">
            <select
              className="form-select form-select-sm"
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
            >
              <option value="all">All Software Products</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-6 col-md-2">
            <select
              className="form-select form-select-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Assigned">Assigned</option>
              <option value="Used">Used</option>
              <option value="Expired">Expired</option>
              <option value="Revoked">Revoked</option>
            </select>
          </div>

          <div className="col-12 col-md-2 text-md-end text-muted small">
            {filtered.length} key(s)
          </div>
        </div>
      </div>

      {/* Licenses Table */}
      <div className="card border rounded-3 bg-white shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-sm">
            <thead className="table-light text-muted small text-uppercase">
              <tr>
                <th>License Key</th>
                <th>Product</th>
                <th>Assigned Customer</th>
                <th>Order Ref</th>
                <th>Status</th>
                <th>Expiration</th>
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
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-muted small">
                    No license keys found. Use "Generate Keys" to provision new ones.
                  </td>
                </tr>
              ) : (
                filtered.map((lic) => {
                  const isRevealed = revealedKeys[lic.id];
                  const displayKey = isRevealed
                    ? lic.licenseKey
                    : `${lic.licenseKey.slice(0, 7)}••••-••••-${lic.licenseKey.slice(-4)}`;

                  return (
                    <tr key={lic.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <code className="text-dark fw-bold bg-light px-2 py-1 rounded text-xs border">
                            {displayKey}
                          </code>
                          <button
                            onClick={() => toggleReveal(lic.id)}
                            className="btn btn-sm btn-link p-0 text-muted"
                            title={isRevealed ? "Mask" : "Reveal"}
                          >
                            <i className={`bi ${isRevealed ? "bi-eye-slash" : "bi-eye"}`}></i>
                          </button>
                          <button
                            onClick={() => copyToClipboard(lic.licenseKey)}
                            className="btn btn-sm btn-link p-0 text-muted"
                            title="Copy Key"
                          >
                            <i className="bi bi-copy"></i>
                          </button>
                        </div>
                      </td>
                      <td className="fw-semibold text-xs text-dark">{lic.productName}</td>
                      <td>
                        {lic.customerEmail ? (
                          <span className="text-xs text-dark">{lic.customerEmail}</span>
                        ) : (
                          <span className="text-muted text-[11px]">Unassigned</span>
                        )}
                      </td>
                      <td className="text-xs font-mono text-muted">{lic.orderId || "—"}</td>
                      <td>
                        <span
                          className={`badge rounded-pill text-[10px] ${
                            lic.status === "Available"
                              ? "bg-success-subtle text-success"
                              : lic.status === "Assigned"
                              ? "bg-primary-subtle text-primary"
                              : lic.status === "Revoked"
                              ? "bg-danger-subtle text-danger"
                              : "bg-secondary-subtle text-secondary"
                          }`}
                        >
                          {lic.status}
                        </span>
                      </td>
                      <td className="text-xs text-muted">
                        {new Date(lic.expirationDate).toLocaleDateString()}
                      </td>
                      <td className="text-end">
                        <select
                          className="form-select form-select-sm py-0 text-[11px]"
                          style={{ width: "110px", display: "inline-block" }}
                          value={lic.status}
                          onChange={(e) => handleStatusChange(lic.id, e.target.value)}
                        >
                          <option value="Available">Available</option>
                          <option value="Assigned">Assigned</option>
                          <option value="Used">Used</option>
                          <option value="Expired">Expired</option>
                          <option value="Revoked">Revoked</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Generate Keys */}
      {isGenerateModalOpen && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom py-3 px-4">
                <h5 className="modal-title fw-bold text-dark fs-6">Generate Digital License Keys</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsGenerateModalOpen(false)}
                ></button>
              </div>

              <form onSubmit={handleGenerateKeys}>
                <div className="modal-body p-4 space-y-3">
                  <div>
                    <label className="form-label small fw-semibold text-secondary">Target Product</label>
                    <select
                      className="form-select form-select-sm"
                      value={targetProductId}
                      onChange={(e) => setTargetProductId(e.target.value)}
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.sku})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label small fw-semibold text-secondary">Quantity of Keys to Generate</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      className="form-control form-control-sm"
                      value={generateCount}
                      onChange={(e) => setGenerateCount(Number(e.target.value))}
                    />
                    <small className="text-muted text-[11px]">Keys are signed with post-quantum prefixes.</small>
                  </div>
                </div>

                <div className="modal-footer border-top py-2.5 px-4 bg-light">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setIsGenerateModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm px-4 fw-bold">
                    Generate Batch
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
