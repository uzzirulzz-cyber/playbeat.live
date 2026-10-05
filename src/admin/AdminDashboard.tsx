import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { Order, Product } from "../types";

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const [data, setData] = useState<{
    metrics: any;
    charts: { labels: string[]; revenue: number[]; orders: number[]; traffic: number[] };
    recentOrders: Order[];
    topProducts: Product[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");
  const [inquiries, setInquiries] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.getAnalytics(timeRange);
      setData(res);
    } catch (e) {
      console.error(e);
    }

    try {
      const inq = await api.getInquiries();
      if (inq && inq.length > 0) {
        setInquiries(inq);
      } else {
        const local = JSON.parse(localStorage.getItem("pb_inquiries") || "[]");
        setInquiries(local);
      }
    } catch {
      try {
        const local = JSON.parse(localStorage.getItem("pb_inquiries") || "[]");
        setInquiries(local);
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "Completed":
      case "Paid":
        return "bg-success-subtle text-success border border-success-subtle";
      case "Processing":
        return "bg-primary-subtle text-primary border border-primary-subtle";
      case "Pending":
        return "bg-warning-subtle text-warning border border-warning-subtle";
      case "Cancelled":
      case "Refunded":
        return "bg-danger-subtle text-danger border border-danger-subtle";
      default:
        return "bg-secondary-subtle text-secondary";
    }
  };

  if (loading && !data) {
    return (
      <div className="d-flex align-items-center justify-content-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const m = data?.metrics || {
    totalRevenue: 24890,
    todayRevenue: 620,
    totalOrders: 184,
    totalCustomers: 92,
    activeSubscriptions: 48,
    conversionRate: 3.65,
    aov: 135.2,
  };

  const revenueSeries = data?.charts?.revenue || [420, 580, 690, 810, 940, 1120, 1340];
  const maxRevenue = Math.max(...revenueSeries, 100);

  return (
    <div className="space-y-4">
      {/* Top Welcome Bar & Filter */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Executive Overview</h4>
          <p className="text-muted small mb-0">Real-time enterprise metrics across storefront, subscriptions and license provisioning.</p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <div className="btn-group btn-group-sm bg-white border rounded-3 p-1">
            {["7d", "30d", "90d"].map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`btn btn-sm rounded-2 border-0 fw-semibold px-3 ${
                  timeRange === r ? "btn-dark text-white" : "btn-light text-muted"
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={fetchData} className="btn btn-outline-secondary btn-sm rounded-3">
            <i className="bi bi-arrow-clockwise"></i>
          </button>
        </div>
      </div>

      {/* 6 Key Enterprise Metric Cards */}
      <div className="row g-3 mb-4">
        {/* Total Revenue */}
        <div className="col-12 col-sm-6 col-xl-2">
          <div className="card border rounded-3 p-3 bg-white shadow-sm h-100">
            <div className="d-flex justify-content-between align-items-center text-muted mb-2">
              <span className="text-xs fw-bold text-uppercase tracking-wider">Total Revenue</span>
              <div className="p-1.5 rounded-2 bg-primary-subtle text-primary">
                <i className="bi bi-currency-dollar"></i>
              </div>
            </div>
            <h4 className="fw-extrabold text-dark mb-1">${m.totalRevenue?.toLocaleString()}</h4>
            <div className="small text-success fw-semibold">
              <i className="bi bi-arrow-up-short"></i> +14.2% <span className="text-muted fw-normal">vs prev</span>
            </div>
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="col-12 col-sm-6 col-xl-2">
          <div className="card border rounded-3 p-3 bg-white shadow-sm h-100">
            <div className="d-flex justify-content-between align-items-center text-muted mb-2">
              <span className="text-xs fw-bold text-uppercase tracking-wider">Today's Sales</span>
              <div className="p-1.5 rounded-2 bg-success-subtle text-success">
                <i className="bi bi-graph-up"></i>
              </div>
            </div>
            <h4 className="fw-extrabold text-dark mb-1">${m.todayRevenue?.toLocaleString()}</h4>
            <div className="small text-muted">
              Live orders today
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="col-12 col-sm-6 col-xl-2">
          <div className="card border rounded-3 p-3 bg-white shadow-sm h-100">
            <div className="d-flex justify-content-between align-items-center text-muted mb-2">
              <span className="text-xs fw-bold text-uppercase tracking-wider">Orders</span>
              <div className="p-1.5 rounded-2 bg-info-subtle text-info">
                <i className="bi bi-bag-check"></i>
              </div>
            </div>
            <h4 className="fw-extrabold text-dark mb-1">{m.totalOrders}</h4>
            <div className="small text-success fw-semibold">
              <i className="bi bi-arrow-up-short"></i> +8.5%
            </div>
          </div>
        </div>

        {/* Customers */}
        <div className="col-12 col-sm-6 col-xl-2">
          <div className="card border rounded-3 p-3 bg-white shadow-sm h-100">
            <div className="d-flex justify-content-between align-items-center text-muted mb-2">
              <span className="text-xs fw-bold text-uppercase tracking-wider">Customers</span>
              <div className="p-1.5 rounded-2 bg-purple-subtle text-purple">
                <i className="bi bi-people"></i>
              </div>
            </div>
            <h4 className="fw-extrabold text-dark mb-1">{m.totalCustomers}</h4>
            <div className="small text-muted">Active accounts</div>
          </div>
        </div>

        {/* Active Subscriptions */}
        <div className="col-12 col-sm-6 col-xl-2">
          <div className="card border rounded-3 p-3 bg-white shadow-sm h-100">
            <div className="d-flex justify-content-between align-items-center text-muted mb-2">
              <span className="text-xs fw-bold text-uppercase tracking-wider">Active Subs</span>
              <div className="p-1.5 rounded-2 bg-warning-subtle text-warning">
                <i className="bi bi-arrow-repeat"></i>
              </div>
            </div>
            <h4 className="fw-extrabold text-dark mb-1">{m.activeSubscriptions}</h4>
            <div className="small text-muted">Recurring passes</div>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="col-12 col-sm-6 col-xl-2">
          <div className="card border rounded-3 p-3 bg-white shadow-sm h-100">
            <div className="d-flex justify-content-between align-items-center text-muted mb-2">
              <span className="text-xs fw-bold text-uppercase tracking-wider">Conversion</span>
              <div className="p-1.5 rounded-2 bg-danger-subtle text-danger">
                <i className="bi bi-lightning-charge"></i>
              </div>
            </div>
            <h4 className="fw-extrabold text-dark mb-1">{m.conversionRate}%</h4>
            <div className="small text-muted">AOV: ${m.aov}</div>
          </div>
        </div>
      </div>

      {/* Charts & Visual Representation */}
      <div className="row g-3 mb-4">
        {/* Revenue SVG Trend Line */}
        <div className="col-12 col-lg-8">
          <div className="card border rounded-3 p-4 bg-white shadow-sm h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h6 className="fw-bold text-dark mb-0">Revenue Velocity</h6>
                <small className="text-muted">Calculated over selected period ({timeRange.toUpperCase()})</small>
              </div>
              <div className="badge bg-light text-secondary border">Gross Volume</div>
            </div>

            {/* Responsive SVG Chart */}
            <div style={{ height: "200px", width: "100%" }}>
              <svg viewBox="0 0 600 200" className="w-100 h-100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d6efd" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#0d6efd" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Grid Lines */}
                {[0, 50, 100, 150].map((y) => (
                  <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#f0f2f5" strokeWidth="1" />
                ))}

                {/* Path Area */}
                {revenueSeries.length > 1 && (
                  <>
                    <path
                      d={`M 0,200 ${revenueSeries
                        .map((val, idx) => {
                          const x = (idx / (revenueSeries.length - 1)) * 600;
                          const y = 180 - (val / maxRevenue) * 150;
                          return `L ${x},${y}`;
                        })
                        .join(" ")} L 600,200 Z`}
                      fill="url(#chartGrad)"
                    />
                    <path
                      d={`M 0,${180 - (revenueSeries[0] / maxRevenue) * 150} ${revenueSeries
                        .map((val, idx) => {
                          const x = (idx / (revenueSeries.length - 1)) * 600;
                          const y = 180 - (val / maxRevenue) * 150;
                          return `L ${x},${y}`;
                        })
                        .join(" ")}`}
                      fill="none"
                      stroke="#0d6efd"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </>
                )}
              </svg>
            </div>

            {/* Labels */}
            <div className="d-flex justify-content-between text-muted text-[11px] pt-2">
              {data?.charts?.labels?.filter((_, i) => i % 2 === 0).map((lbl, idx) => (
                <span key={idx}>{lbl}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Action Station */}
        <div className="col-12 col-lg-4">
          <div className="card border rounded-3 p-4 bg-white shadow-sm h-100">
            <h6 className="fw-bold text-dark mb-3">Quick Operations</h6>
            <div className="d-grid gap-2">
              <button
                onClick={() => onNavigateTab("products")}
                className="btn btn-outline-secondary text-start d-flex align-items-center justify-content-between py-2.5 px-3 rounded-3"
              >
                <span className="d-flex align-items-center gap-2 small fw-semibold text-dark">
                  <i className="bi bi-plus-circle text-primary fs-6"></i> Add New Product
                </span>
                <i className="bi bi-chevron-right text-muted text-xs"></i>
              </button>

              <button
                onClick={() => onNavigateTab("builder")}
                className="btn btn-outline-secondary text-start d-flex align-items-center justify-content-between py-2.5 px-3 rounded-3"
              >
                <span className="d-flex align-items-center gap-2 small fw-semibold text-dark">
                  <i className="bi bi-magic text-purple fs-6"></i> Open Website Builder
                </span>
                <i className="bi bi-chevron-right text-muted text-xs"></i>
              </button>

              <button
                onClick={() => onNavigateTab("licenses")}
                className="btn btn-outline-secondary text-start d-flex align-items-center justify-content-between py-2.5 px-3 rounded-3"
              >
                <span className="d-flex align-items-center gap-2 small fw-semibold text-dark">
                  <i className="bi bi-key text-warning fs-6"></i> License Key Vault
                </span>
                <i className="bi bi-chevron-right text-muted text-xs"></i>
              </button>

              <button
                onClick={() => onNavigateTab("coupons")}
                className="btn btn-outline-secondary text-start d-flex align-items-center justify-content-between py-2.5 px-3 rounded-3"
              >
                <span className="d-flex align-items-center gap-2 small fw-semibold text-dark">
                  <i className="bi bi-ticket-perforated text-success fs-6"></i> Issue Discount Coupon
                </span>
                <i className="bi bi-chevron-right text-muted text-xs"></i>
              </button>

              <button
                onClick={() => onNavigateTab("theme")}
                className="btn btn-outline-info text-start d-flex align-items-center justify-content-between py-2.5 px-3 rounded-3 border-info-subtle bg-info-subtle/20"
              >
                <span className="d-flex align-items-center gap-2 small fw-bold text-dark">
                  <i className="bi bi-broadcast-pin text-info fs-6"></i> PlayBeat LIVE Update Logo
                </span>
                <span className="badge rounded-pill bg-info text-dark text-[9px] px-2 py-0.5">LIVE</span>
              </button>

              <button
                onClick={() => onNavigateTab("theme")}
                className="btn btn-outline-secondary text-start d-flex align-items-center justify-content-between py-2.5 px-3 rounded-3"
              >
                <span className="d-flex align-items-center gap-2 small fw-semibold text-dark">
                  <i className="bi bi-palette text-info fs-6"></i> Customize Storefront Theme
                </span>
                <i className="bi bi-chevron-right text-muted text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tables: Recent Orders & Top Products */}
      <div className="row g-3">
        {/* Recent Orders */}
        <div className="col-12 col-xl-8">
          <div className="card border rounded-3 p-4 bg-white shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold text-dark mb-0">Recent Storefront Orders</h6>
              <button
                onClick={() => onNavigateTab("orders")}
                className="btn btn-link btn-sm text-decoration-none text-primary p-0 small fw-semibold"
              >
                View All Orders →
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 text-sm">
                <thead className="table-light text-muted small text-uppercase">
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.recentOrders && data.recentOrders.length > 0 ? (
                    data.recentOrders.map((ord) => (
                      <tr key={ord.id} className="cursor-pointer" onClick={() => onNavigateTab("orders")}>
                        <td className="fw-bold text-dark">{ord.orderNumber}</td>
                        <td>
                          <div className="fw-semibold text-dark text-xs">{ord.customerName}</div>
                          <div className="text-muted text-[11px]">{ord.customerEmail}</div>
                        </td>
                        <td className="text-xs text-muted">{ord.items.length} item(s)</td>
                        <td className="fw-bold text-dark text-xs">${ord.total}</td>
                        <td>
                          <span className={`badge rounded-pill text-[10px] ${statusBadge(ord.paymentStatus)}`}>
                            {ord.paymentStatus}
                          </span>
                        </td>
                        <td>
                          <span className={`badge rounded-pill text-[10px] ${statusBadge(ord.status)}`}>
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-muted small">
                        No orders recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="col-12 col-xl-4">
          <div className="card border rounded-3 p-4 bg-white shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold text-dark mb-0">Top Performing Products</h6>
              <button
                onClick={() => onNavigateTab("products")}
                className="btn btn-link btn-sm text-decoration-none text-primary p-0 small fw-semibold"
              >
                Manage →
              </button>
            </div>

            <div className="space-y-3">
              {data?.topProducts && data.topProducts.length > 0 ? (
                data.topProducts.map((p) => (
                  <div key={p.id} className="d-flex align-items-center gap-3 p-2 rounded-2 hover:bg-light transition-colors">
                    <img
                      src={p.images?.[0] || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80"}
                      alt={p.name}
                      className="rounded-2 border"
                      style={{ width: "42px", height: "42px", objectFit: "cover" }}
                    />
                    <div className="flex-grow-1 overflow-hidden">
                      <div className="fw-semibold text-dark text-xs text-truncate">{p.name}</div>
                      <div className="text-muted text-[11px]">{p.category} · ★ {p.rating}</div>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold text-dark text-xs">${p.price}</div>
                      <span className="badge bg-light text-muted border text-[9px]">{p.productType}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted small">No products available.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Incoming Client Inquiries (From Contact Desk) */}
      <div className="card border rounded-3 p-4 bg-white shadow-sm mt-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h6 className="fw-bold text-dark mb-0">Contact Desk & Client Inquiries</h6>
            <small className="text-muted">Direct project scopes submitted through the storefront contact portal</small>
          </div>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2.5 py-1 text-xs">
            {inquiries.length} Lead(s)
          </span>
        </div>

        {inquiries.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 text-sm">
              <thead className="table-light text-muted small text-uppercase">
                <tr>
                  <th>Client</th>
                  <th>Solution</th>
                  <th>Budget</th>
                  <th>Requirements / Message</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq: any, idx: number) => (
                  <tr key={inq.id || idx}>
                    <td>
                      <div className="fw-semibold text-dark text-xs">{inq.name}</div>
                      <div className="text-muted text-[11px]">{inq.email}</div>
                      {inq.whatsapp && (
                        <div className="text-success text-[11px]">
                          <i className="bi bi-whatsapp me-1"></i>
                          {inq.whatsapp}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border text-[11px] text-uppercase">
                        {inq.serviceType}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs fw-semibold text-dark">{inq.budget}</span>
                    </td>
                    <td style={{ maxWidth: "340px" }}>
                      <p className="text-muted small mb-0 text-truncate" title={inq.message}>
                        {inq.message || "No additional comments"}
                      </p>
                    </td>
                    <td>
                      {inq.whatsapp ? (
                        <a
                          href={`https://wa.me/${inq.whatsapp.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-success btn-sm rounded-pill py-1 px-2.5 text-xs fw-semibold d-inline-flex align-items-center gap-1"
                        >
                          <i className="bi bi-whatsapp"></i>
                          <span>Reply</span>
                        </a>
                      ) : (
                        <a
                          href={`mailto:${inq.email}?subject=PlayBeat%20Digital%20Project%20Consultation`}
                          className="btn btn-outline-primary btn-sm rounded-pill py-1 px-2.5 text-xs fw-semibold d-inline-flex align-items-center gap-1"
                        >
                          <i className="bi bi-envelope"></i>
                          <span>Email</span>
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4 text-muted small bg-light rounded-3">
            <i className="bi bi-inbox fs-3 d-block mb-1 text-secondary"></i>
            No client inquiries received yet. Inquiries submitted through the Contact Desk will show up here.
          </div>
        )}
      </div>
    </div>
  );
};
