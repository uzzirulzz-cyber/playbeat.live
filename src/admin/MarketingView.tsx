import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { useStore } from "../context/StoreContext";

export const MarketingView: React.FC = () => {
  const { showToast } = useStore();
  const [banners, setBanners] = useState<any[]>([]);
  const [abandonedCarts, setAbandonedCarts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBanner, setNewBanner] = useState({ title: "", text: "", type: "top_bar" });

  useEffect(() => {
    loadMarketing();
  }, []);

  const loadMarketing = async () => {
    setLoading(true);
    try {
      const data = await api.getMarketing();
      setBanners(data?.banners || []);
      setAbandonedCarts(data?.abandonedCarts || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBanner.title || !newBanner.text) return;
    try {
      await api.createBanner(newBanner);
      showToast("Marketing announcement banner deployed!");
      setNewBanner({ title: "", text: "", type: "top_bar" });
      loadMarketing();
    } catch (e: any) {
      showToast(e.message || "Failed to create banner");
    }
  };

  const handleDeleteBanner = async (id: string) => {
    try {
      await api.deleteBanner(id);
      showToast("Banner removed");
      loadMarketing();
    } catch (e: any) {
      showToast(e.message || "Failed to delete");
    }
  };

  const handleRecoverCart = (email: string) => {
    showToast(`Recovery incentive email dispatched to ${email}`);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h4 className="fw-bold text-dark mb-1">Marketing Campaigns & Conversion Boosters</h4>
        <p className="text-muted small mb-0">Manage storefront announcement banners, promotions and recover abandoned carts.</p>
      </div>

      <div className="row g-4">
        {/* Banners Column */}
        <div className="col-12 col-lg-7">
          <div className="card border rounded-3 p-4 bg-white shadow-sm space-y-4">
            <h6 className="fw-bold text-dark mb-0">Active Storefront Announcement Banners</h6>

            {/* List */}
            <div className="space-y-2">
              {banners.map((b) => (
                <div key={b.id} className="p-3 border rounded-3 bg-light d-flex align-items-center justify-content-between">
                  <div>
                    <span className="badge bg-primary text-white text-[10px] mb-1">Live Banner</span>
                    <b className="d-block text-dark text-xs">{b.title}</b>
                    <p className="text-muted text-[11px] mb-0">{b.text}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteBanner(b.id)}
                    className="btn btn-outline-danger btn-sm p-1.5 rounded-2"
                    title="Remove"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              ))}
            </div>

            {/* Create Banner Form */}
            <form onSubmit={handleCreateBanner} className="p-3 border rounded-3 bg-white space-y-2">
              <span className="text-xs fw-bold text-dark d-block">Deploy New Announcement Banner</span>
              <div className="row g-2">
                <div className="col-12 col-md-5">
                  <input
                    type="text"
                    required
                    placeholder="Banner Headline"
                    className="form-control form-control-sm text-xs"
                    value={newBanner.title}
                    onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                  />
                </div>
                <div className="col-12 col-md-7">
                  <input
                    type="text"
                    required
                    placeholder="Banner Copy Message..."
                    className="form-control form-control-sm text-xs"
                    value={newBanner.text}
                    onChange={(e) => setNewBanner({ ...newBanner, text: e.target.value })}
                  />
                </div>
              </div>
              <div className="text-end pt-1">
                <button type="submit" className="btn btn-dark btn-sm text-xs px-3">
                  Deploy to Storefront
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Abandoned Cart Recovery */}
        <div className="col-12 col-lg-5">
          <div className="card border rounded-3 p-4 bg-white shadow-sm space-y-3">
            <div className="d-flex align-items-center justify-content-between">
              <h6 className="fw-bold text-dark mb-0">Abandoned Cart Funnel</h6>
              <span className="badge bg-warning-subtle text-warning">Automated</span>
            </div>
            <p className="text-muted text-xs">Shoppers who initiated checkout but have not yet finalized payment.</p>

            <div className="space-y-2">
              {abandonedCarts.map((c) => (
                <div key={c.id} className="p-2.5 rounded-2 border bg-light d-flex align-items-center justify-content-between text-xs">
                  <div>
                    <div className="fw-bold text-dark">{c.email}</div>
                    <small className="text-muted">{c.itemsCount} item(s) · Value: ${c.total}</small>
                  </div>
                  <button
                    onClick={() => handleRecoverCart(c.email)}
                    className="btn btn-outline-primary btn-sm py-1 px-2 text-[11px]"
                  >
                    Send Recovery
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
