import React, { useState, useEffect } from "react";
import { useStore } from "../context/StoreContext";
import { api } from "../services/api";
import { Order, Subscription, License } from "../types";

export const CustomerAccountModal: React.FC = () => {
  const { user, setUser, isAccountOpen, setIsAccountOpen, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "licenses" | "subscriptions">("dashboard");
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAccountOpen && user) {
      loadCustomerData();
    }
  }, [isAccountOpen, user]);

  const loadCustomerData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.getCustomerProfile(user.id);
      setOrders(res.orders || []);
      setSubscriptions(res.subscriptions || []);
      setLicenses(res.licenses || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isAccountOpen || !user) return null;

  const handleLogout = async () => {
    try {
      await api.logout();
      setUser(null);
      setIsAccountOpen(false);
      showToast("Signed out of your customer account.");
    } catch {
      setUser(null);
      setIsAccountOpen(false);
    }
  };

  const copyLicense = (key: string) => {
    navigator.clipboard.writeText(key);
    showToast("License key copied to clipboard!");
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1060 }}>
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-2xl rounded-4 overflow-hidden">
          {/* Header */}
          <div className="modal-header border-bottom py-3 px-4 bg-light">
            <div className="d-flex align-items-center gap-3">
              <div className="w-10 h-10 rounded-circle bg-dark text-white fw-bold d-flex align-items-center justify-content-center">
                {user.name[0]}
              </div>
              <div>
                <h5 className="modal-title fw-bold text-dark fs-6 mb-0">{user.name}</h5>
                <small className="text-muted">{user.email}</small>
              </div>
            </div>
            <button type="button" className="btn-close" onClick={() => setIsAccountOpen(false)}></button>
          </div>

          <div className="modal-body p-0 d-flex flex-column flex-md-row" style={{ minHeight: "480px" }}>
            {/* Left Nav */}
            <div className="p-3 border-end bg-light" style={{ width: "220px", minWidth: "220px" }}>
              <div className="d-flex flex-column gap-1">
                {[
                  { id: "dashboard", label: "Dashboard", icon: "bi-grid-1x2" },
                  { id: "orders", label: "Order History", icon: "bi-bag-check", count: orders.length },
                  { id: "licenses", label: "My Digital Licenses", icon: "bi-key", count: licenses.length },
                  { id: "subscriptions", label: "Subscriptions", icon: "bi-arrow-repeat", count: subscriptions.length },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`btn btn-sm d-flex align-items-center justify-content-between text-start border-0 rounded-3 px-3 py-2 ${
                      activeTab === t.id ? "btn-dark text-white fw-bold" : "text-secondary hover:bg-white"
                    }`}
                  >
                    <span className="d-flex align-items-center gap-2 small">
                      <i className={`bi ${t.icon}`}></i> {t.label}
                    </span>
                    {t.count !== undefined && t.count > 0 && (
                      <span className="badge bg-secondary-subtle text-secondary rounded-pill text-[10px]">
                        {t.count}
                      </span>
                    )}
                  </button>
                ))}

                <hr className="my-2" />

                <button
                  onClick={handleLogout}
                  className="btn btn-sm btn-outline-danger border-0 text-start px-3 py-2 d-flex align-items-center gap-2 small fw-semibold"
                >
                  <i className="bi bi-box-arrow-right"></i> Sign Out
                </button>
              </div>
            </div>

            {/* Right Tab Content */}
            <div className="flex-grow-1 p-4 overflow-y-auto">
              {loading ? (
                <div className="text-center py-5">
                  <span className="spinner-border spinner-border-sm text-primary"></span>
                </div>
              ) : (
                <>
                  {activeTab === "dashboard" && (
                    <div className="space-y-4">
                      <h6 className="fw-bold text-dark">Member Overview</h6>
                      <div className="row g-3">
                        <div className="col-4">
                          <div className="card p-3 border-0 bg-light rounded-3">
                            <span className="text-muted text-[10px] uppercase font-bold">Total Orders</span>
                            <b className="fs-4 text-dark">{orders.length}</b>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="card p-3 border-0 bg-light rounded-3">
                            <span className="text-muted text-[10px] uppercase font-bold">Active Passes</span>
                            <b className="fs-4 text-dark">{subscriptions.filter((s) => s.status === "Active").length}</b>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="card p-3 border-0 bg-light rounded-3">
                            <span className="text-muted text-[10px] uppercase font-bold">Digital Keys</span>
                            <b className="fs-4 text-dark">{licenses.length}</b>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "orders" && (
                    <div className="space-y-3">
                      <h6 className="fw-bold text-dark">Order History</h6>
                      {orders.length === 0 ? (
                        <p className="text-muted small">No orders recorded yet.</p>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-hover align-middle text-xs">
                            <thead className="table-light text-muted">
                              <tr>
                                <th>Order Ref</th>
                                <th>Date</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orders.map((o) => (
                                <tr key={o.id}>
                                  <td className="fw-bold font-mono text-dark">{o.orderNumber}</td>
                                  <td className="text-muted">{new Date(o.createdAt).toLocaleDateString()}</td>
                                  <td>{o.items.map((i) => i.name).join(", ")}</td>
                                  <td className="fw-bold text-dark">${o.total}</td>
                                  <td>
                                    <span className="badge bg-success-subtle text-success">{o.status}</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "licenses" && (
                    <div className="space-y-3">
                      <h6 className="fw-bold text-dark">My Digital License Vault</h6>
                      {licenses.length === 0 ? (
                        <p className="text-muted small">No digital licenses allocated to this account.</p>
                      ) : (
                        <div className="space-y-2">
                          {licenses.map((lic) => (
                            <div key={lic.id} className="p-3 border rounded-3 bg-light d-flex align-items-center justify-content-between">
                              <div>
                                <b className="text-dark d-block text-xs">{lic.productName}</b>
                                <code className="text-primary font-mono fw-bold fs-6">{lic.licenseKey}</code>
                              </div>
                              <button
                                onClick={() => copyLicense(lic.licenseKey)}
                                className="btn btn-outline-dark btn-sm rounded-pill text-xs px-3"
                              >
                                Copy Key
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "subscriptions" && (
                    <div className="space-y-3">
                      <h6 className="fw-bold text-dark">Active Cloud Subscriptions</h6>
                      {subscriptions.length === 0 ? (
                        <p className="text-muted small">No recurring subscriptions active.</p>
                      ) : (
                        subscriptions.map((s) => (
                          <div key={s.id} className="p-3 border rounded-3 bg-light d-flex align-items-center justify-content-between">
                            <div>
                              <b className="text-dark d-block text-xs">{s.productName}</b>
                              <span className="text-muted text-xs">Plan: {s.planPeriod} (${s.amount}/mo)</span>
                            </div>
                            <span className="badge bg-success-subtle text-success">{s.status}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
