import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { Coupon } from "../types";
import { useStore } from "../context/StoreContext";

export const CouponManagement: React.FC = () => {
  const { showToast } = useStore();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: "",
    discountType: "percentage",
    discountValue: 20,
    minOrder: 50,
    maxDiscount: 100,
    usageLimit: 200,
    expirationDate: "2028-12-31",
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const data = await api.getCoupons();
      setCoupons(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.discountValue) {
      showToast("Coupon code and value are required");
      return;
    }
    try {
      await api.createCoupon(newCoupon);
      showToast(`Coupon ${newCoupon.code.toUpperCase()} created!`);
      setIsModalOpen(false);
      loadCoupons();
    } catch (e: any) {
      showToast(e.message || "Failed to create coupon");
    }
  };

  const handleDeleteCoupon = async (id: string, code: string) => {
    if (confirm(`Delete coupon "${code}"?`)) {
      try {
        await api.deleteCoupon(id);
        showToast("Coupon deleted");
        loadCoupons();
      } catch (e: any) {
        showToast(e.message || "Failed to delete coupon");
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <h4 className="fw-bold text-dark mb-1">Coupon & Promo Code Management</h4>
          <p className="text-muted small mb-0">Create fixed, percentage, and minimum-spend discount promotions.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-dark btn-sm rounded-3 px-3 py-2 fw-bold d-flex align-items-center gap-1.5 shadow-sm"
        >
          <i className="bi bi-plus-lg"></i> Create Coupon
        </button>
      </div>

      {/* Coupons Table */}
      <div className="card border rounded-3 bg-white shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-sm">
            <thead className="table-light text-muted small text-uppercase">
              <tr>
                <th>Coupon Code</th>
                <th>Discount</th>
                <th>Type</th>
                <th>Min Order</th>
                <th>Usage Limit</th>
                <th>Redeemed</th>
                <th>Expires</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-4">
                    <span className="spinner-border spinner-border-sm text-primary"></span>
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-muted small">
                    No active coupons found.
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <code className="text-primary fw-bold bg-primary-subtle px-2 py-1 rounded text-xs">
                        {c.code}
                      </code>
                    </td>
                    <td className="fw-bold text-dark">
                      {c.discountType === "percentage" ? `${c.discountValue}% OFF` : `$${c.discountValue} OFF`}
                    </td>
                    <td className="text-capitalize text-muted text-xs">{c.discountType}</td>
                    <td className="text-xs">${c.minOrder}</td>
                    <td className="text-xs">{c.usageLimit}</td>
                    <td className="text-xs font-semibold text-success">{c.usedCount}</td>
                    <td className="text-xs text-muted">{c.expirationDate}</td>
                    <td>
                      <span className="badge rounded-pill bg-success-subtle text-success text-[10px]">
                        {c.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        onClick={() => handleDeleteCoupon(c.id, c.code)}
                        className="btn btn-outline-danger btn-sm p-1 rounded-2"
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Coupon */}
      {isModalOpen && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom py-3 px-4">
                <h5 className="modal-title fw-bold text-dark fs-6">Create New Coupon</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>

              <form onSubmit={handleCreateCoupon}>
                <div className="modal-body p-4 space-y-3">
                  <div>
                    <label className="form-label small fw-semibold text-secondary">Coupon Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. FLASH50"
                      className="form-control form-control-sm font-mono uppercase"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                    />
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-secondary">Discount Type</label>
                      <select
                        className="form-select form-select-sm"
                        value={newCoupon.discountType}
                        onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value as any })}
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Dollar ($)</option>
                      </select>
                    </div>

                    <div className="col-6">
                      <label className="form-label small fw-semibold text-secondary">Discount Amount *</label>
                      <input
                        type="number"
                        required
                        className="form-control form-control-sm"
                        value={newCoupon.discountValue ?? ""}
                        onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-secondary">Minimum Order Amount ($)</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={newCoupon.minOrder ?? 0}
                        onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: Number(e.target.value) })}
                      />
                    </div>

                    <div className="col-6">
                      <label className="form-label small fw-semibold text-secondary">Usage Limit</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={newCoupon.usageLimit ?? 100}
                        onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label small fw-semibold text-secondary">Expiration Date</label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={newCoupon.expirationDate}
                      onChange={(e) => setNewCoupon({ ...newCoupon, expirationDate: e.target.value })}
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
                    Create Coupon
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
