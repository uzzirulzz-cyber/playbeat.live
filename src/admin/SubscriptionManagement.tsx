import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { Subscription } from "../types";
import { useStore } from "../context/StoreContext";

export const SubscriptionManagement: React.FC = () => {
  const { showToast } = useStore();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [metrics, setMetrics] = useState({
    mrr: 0,
    arr: 0,
    activeSubscribers: 0,
    churnRate: 0,
    totalCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    setLoading(true);
    try {
      const data = await api.getSubscriptions();
      setSubscriptions(data.subscriptions);
      setMetrics(data.metrics);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: string) => {
    try {
      await api.updateSubscriptionAction(id, action);
      showToast(`Subscription ${action}ed successfully`);
      loadSubscriptions();
    } catch (e: any) {
      showToast(e.message || "Failed to update subscription");
    }
  };

  const filtered = subscriptions.filter(
    (s) => filterStatus === "all" || s.status === filterStatus
  );

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <h4 className="fw-bold text-dark mb-1">Recurring SaaS Subscriptions</h4>
          <p className="text-muted small mb-0">Monitor recurring revenue, member renewals, and lifecycle actions.</p>
        </div>
      </div>

      {/* Metrics Cards: MRR, ARR, Active Subscribers, Churn */}
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border rounded-3 p-3 bg-white shadow-sm">
            <span className="text-xs fw-bold text-muted uppercase">Monthly Recurring (MRR)</span>
            <div className="fs-3 fw-extrabold text-primary mt-1">${metrics.mrr.toLocaleString()}</div>
            <small className="text-muted text-[11px]">Normalized monthly subscription run-rate</small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border rounded-3 p-3 bg-white shadow-sm">
            <span className="text-xs fw-bold text-muted uppercase">Annual Recurring (ARR)</span>
            <div className="fs-3 fw-extrabold text-success mt-1">${metrics.arr.toLocaleString()}</div>
            <small className="text-muted text-[11px]">Annualized cloud passes</small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border rounded-3 p-3 bg-white shadow-sm">
            <span className="text-xs fw-bold text-muted uppercase">Active Subscribers</span>
            <div className="fs-3 fw-extrabold text-dark mt-1">{metrics.activeSubscribers}</div>
            <small className="text-muted text-[11px]">Out of {metrics.totalCount} lifetime accounts</small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border rounded-3 p-3 bg-white shadow-sm">
            <span className="text-xs fw-bold text-muted uppercase">Monthly Churn Rate</span>
            <div className="fs-3 fw-extrabold text-danger mt-1">{metrics.churnRate}%</div>
            <small className="text-muted text-[11px]">Well below 5% enterprise benchmark</small>
          </div>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="card border rounded-3 bg-white shadow-sm overflow-hidden">
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
          <h6 className="fw-bold text-dark mb-0">Subscriber Accounts</h6>
          <select
            className="form-select form-select-sm"
            style={{ width: "160px" }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All States</option>
            <option value="Active">Active</option>
            <option value="Trial">Trial</option>
            <option value="Paused">Paused</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-sm">
            <thead className="table-light text-muted small text-uppercase">
              <tr>
                <th>Subscription ID</th>
                <th>Subscriber</th>
                <th>SaaS Plan</th>
                <th>Billing Term</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Next Renewal</th>
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
                    No active subscriptions match filter.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id}>
                    <td className="fw-bold font-mono text-dark">{s.subscriptionNumber}</td>
                    <td>
                      <div className="fw-semibold text-xs text-dark">{s.customerName}</div>
                      <div className="text-muted text-[11px]">{s.customerEmail}</div>
                    </td>
                    <td className="text-xs fw-semibold text-dark">{s.productName}</td>
                    <td className="text-xs text-muted">{s.planPeriod}</td>
                    <td className="fw-bold text-dark text-xs">${s.amount}/mo</td>
                    <td>
                      <span
                        className={`badge rounded-pill text-[10px] ${
                          s.status === "Active"
                            ? "bg-success-subtle text-success"
                            : s.status === "Paused"
                            ? "bg-warning-subtle text-warning"
                            : "bg-danger-subtle text-danger"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="text-xs text-muted">
                      {new Date(s.nextBillingDate).toLocaleDateString()}
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        {s.status === "Active" ? (
                          <button
                            onClick={() => handleAction(s.id, "pause")}
                            className="btn btn-outline-warning btn-sm py-1 px-2 text-xs"
                          >
                            Pause
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAction(s.id, "resume")}
                            className="btn btn-outline-success btn-sm py-1 px-2 text-xs"
                          >
                            Resume
                          </button>
                        )}
                        <button
                          onClick={() => handleAction(s.id, "renew")}
                          className="btn btn-outline-primary btn-sm py-1 px-2 text-xs"
                        >
                          Renew
                        </button>
                        <button
                          onClick={() => handleAction(s.id, "cancel")}
                          className="btn btn-outline-danger btn-sm py-1 px-2 text-xs"
                        >
                          Cancel
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
    </div>
  );
};
