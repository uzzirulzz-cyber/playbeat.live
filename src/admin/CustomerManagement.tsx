import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { Customer, Order, Subscription, License } from "../types";

export const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [profileData, setProfileData] = useState<{
    orders: Order[];
    subscriptions: Subscription[];
    licenses: License[];
  } | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await api.getCustomers();
      setCustomers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleInspectCustomer = async (c: Customer) => {
    setSelectedCustomer(c);
    setProfileLoading(true);
    try {
      const res = await api.getCustomerProfile(c.id);
      setProfileData({
        orders: res.orders,
        subscriptions: res.subscriptions,
        licenses: res.licenses,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setProfileLoading(false);
    }
  };

  const filtered = customers.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <h4 className="fw-bold text-dark mb-1">Customer Directory</h4>
          <p className="text-muted small mb-0">Inspect customer profiles, lifetime value, software downloads, and active licenses.</p>
        </div>

        <button onClick={loadCustomers} className="btn btn-outline-secondary btn-sm rounded-3">
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh
        </button>
      </div>

      {/* Search Input */}
      <div className="card border rounded-3 p-3 bg-white shadow-sm">
        <div className="input-group input-group-sm max-w-md">
          <span className="input-group-text bg-white text-muted border-end-0">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control border-start-0"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="card border rounded-3 bg-white shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-sm">
            <thead className="table-light text-muted small text-uppercase">
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Active Subs</th>
                <th>Status</th>
                <th>Registered</th>
                <th className="text-end">Profile</th>
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
                    No customers found.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="fw-bold text-dark text-xs">{c.name}</div>
                      <div className="text-muted text-[11px]">{c.email}</div>
                    </td>
                    <td className="text-xs text-muted">{c.phone || "—"}</td>
                    <td className="text-xs font-semibold">{c.ordersCount}</td>
                    <td className="fw-bold text-dark text-xs">${c.totalSpent}</td>
                    <td className="text-xs">{c.subscriptionsCount}</td>
                    <td>
                      <span className="badge rounded-pill bg-success-subtle text-success text-[10px]">
                        {c.status}
                      </span>
                    </td>
                    <td className="text-muted text-xs">
                      {new Date(c.createdDate).toLocaleDateString()}
                    </td>
                    <td className="text-end">
                      <button
                        onClick={() => handleInspectCustomer(c)}
                        className="btn btn-outline-dark btn-sm rounded-2 text-xs py-1 px-2.5"
                      >
                        View Account
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom py-3 px-4">
                <div className="d-flex align-items-center gap-2.5">
                  <div className="w-10 h-10 rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold">
                    {selectedCustomer.name[0]}
                  </div>
                  <div>
                    <h5 className="modal-title fw-bold text-dark fs-6 mb-0">
                      {selectedCustomer.name}
                    </h5>
                    <small className="text-muted">{selectedCustomer.email} · {selectedCustomer.phone}</small>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedCustomer(null)}
                ></button>
              </div>

              <div className="modal-body p-4 space-y-4">
                {/* Stats Row */}
                <div className="row g-2 text-center">
                  <div className="col-4">
                    <div className="card p-2 bg-light border-0">
                      <span className="text-[10px] text-muted uppercase font-bold">Lifetime Value</span>
                      <b className="fs-5 text-dark">${selectedCustomer.totalSpent}</b>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="card p-2 bg-light border-0">
                      <span className="text-[10px] text-muted uppercase font-bold">Total Orders</span>
                      <b className="fs-5 text-dark">{selectedCustomer.ordersCount}</b>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="card p-2 bg-light border-0">
                      <span className="text-[10px] text-muted uppercase font-bold">Licenses Owned</span>
                      <b className="fs-5 text-dark">{profileData?.licenses?.length || 0}</b>
                    </div>
                  </div>
                </div>

                {profileLoading ? (
                  <div className="text-center py-4">
                    <span className="spinner-border spinner-border-sm text-primary"></span>
                  </div>
                ) : (
                  <>
                    {/* Orders History */}
                    <div>
                      <h6 className="fw-bold text-dark text-xs text-uppercase tracking-wider mb-2">Order History</h6>
                      <div className="card border rounded-3 bg-white overflow-hidden">
                        <table className="table table-sm mb-0 text-xs">
                          <thead className="table-light text-muted">
                            <tr>
                              <th>Order</th>
                              <th>Date</th>
                              <th>Items</th>
                              <th>Total</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {profileData?.orders && profileData.orders.length > 0 ? (
                              profileData.orders.map((ord) => (
                                <tr key={ord.id}>
                                  <td className="fw-bold">{ord.orderNumber}</td>
                                  <td>{new Date(ord.createdAt).toLocaleDateString()}</td>
                                  <td>{ord.items.length} item(s)</td>
                                  <td className="fw-bold">${ord.total}</td>
                                  <td><span className="badge bg-success-subtle text-success">{ord.status}</span></td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={5} className="text-center py-2 text-muted">No orders found.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Assigned Digital Licenses */}
                    <div>
                      <h6 className="fw-bold text-dark text-xs text-uppercase tracking-wider mb-2">Assigned License Keys</h6>
                      <div className="space-y-1.5">
                        {profileData?.licenses && profileData.licenses.length > 0 ? (
                          profileData.licenses.map((lic) => (
                            <div key={lic.id} className="p-2.5 rounded-2 bg-light border d-flex align-items-center justify-content-between text-xs">
                              <div>
                                <b className="d-block text-dark">{lic.productName}</b>
                                <code className="text-primary font-mono">{lic.licenseKey}</code>
                              </div>
                              <span className="badge bg-success-subtle text-success">{lic.status}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-muted text-xs p-2 text-center">No digital licenses allocated.</div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="modal-footer border-top py-2.5 px-4 bg-light">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedCustomer(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
