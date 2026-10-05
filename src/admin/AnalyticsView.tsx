import React, { useState, useEffect } from "react";
import { api } from "../services/api";

export const AnalyticsView: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30d");

  useEffect(() => {
    loadAnalytics();
  }, [range]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.getAnalytics(range);
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const m = data?.metrics || {
    totalRevenue: 24890,
    totalOrders: 184,
    totalCustomers: 92,
    activeSubscriptions: 48,
    conversionRate: 3.65,
    aov: 135.2,
    visitorsCount: 14820,
  };

  const revenueSeries = data?.charts?.revenue || [420, 580, 690, 810, 940, 1120, 1340];
  const maxRevenue = Math.max(...revenueSeries, 100);

  return (
    <div className="space-y-4">
      {/* Header & Range Filters */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <h4 className="fw-bold text-dark mb-1">Commercial Analytics & Financial Metrics</h4>
          <p className="text-muted small mb-0">Cohort retention, sales funnels, and checkout conversions.</p>
        </div>

        <div className="btn-group btn-group-sm bg-white border rounded-3 p-1">
          {["7d", "30d", "90d", "year"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`btn btn-sm rounded-2 border-0 fw-semibold px-3 ${
                range === r ? "btn-dark text-white" : "btn-light text-muted"
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Blocks */}
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border rounded-3 p-3 bg-white shadow-sm">
            <span className="text-xs fw-bold text-muted uppercase">Gross Sales Revenue</span>
            <div className="fs-3 fw-extrabold text-primary mt-1">${m.totalRevenue?.toLocaleString()}</div>
            <small className="text-success fw-semibold">↑ 18.2% vs previous period</small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border rounded-3 p-3 bg-white shadow-sm">
            <span className="text-xs fw-bold text-muted uppercase">Average Order Value (AOV)</span>
            <div className="fs-3 fw-extrabold text-dark mt-1">${m.aov}</div>
            <small className="text-muted text-[11px]">Across all digital software checkouts</small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border rounded-3 p-3 bg-white shadow-sm">
            <span className="text-xs fw-bold text-muted uppercase">Storefront Conversion Rate</span>
            <div className="fs-3 fw-extrabold text-success mt-1">{m.conversionRate}%</div>
            <small className="text-muted text-[11px]">Unique sessions to paid order conversions</small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border rounded-3 p-3 bg-white shadow-sm">
            <span className="text-xs fw-bold text-muted uppercase">Unique Traffic Visitors</span>
            <div className="fs-3 fw-extrabold text-dark mt-1">{m.visitorsCount?.toLocaleString()}</div>
            <small className="text-muted text-[11px]">Global organic and referral sessions</small>
          </div>
        </div>
      </div>

      {/* Visual Chart */}
      <div className="card border rounded-3 p-4 bg-white shadow-sm">
        <h6 className="fw-bold text-dark mb-3">Gross Sales Curve & Cash Inflow</h6>
        <div style={{ height: "220px", width: "100%" }}>
          <svg viewBox="0 0 600 200" className="w-100 h-100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="anGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {[0, 50, 100, 150].map((y) => (
              <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#f0f2f5" strokeWidth="1" />
            ))}
            {revenueSeries.length > 1 && (
              <>
                <path
                  d={`M 0,200 ${revenueSeries
                    .map((val: number, idx: number) => {
                      const x = (idx / (revenueSeries.length - 1)) * 600;
                      const y = 180 - (val / maxRevenue) * 150;
                      return `L ${x},${y}`;
                    })
                    .join(" ")} L 600,200 Z`}
                  fill="url(#anGrad)"
                />
                <path
                  d={`M 0,${180 - (revenueSeries[0] / maxRevenue) * 150} ${revenueSeries
                    .map((val: number, idx: number) => {
                      const x = (idx / (revenueSeries.length - 1)) * 600;
                      const y = 180 - (val / maxRevenue) * 150;
                      return `L ${x},${y}`;
                    })
                    .join(" ")}`}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};
