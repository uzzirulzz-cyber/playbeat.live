import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { api } from "../services/api";
import { PlayBeatLogo } from "../components/PlayBeatLogo";

interface AdminLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  children,
}) => {
  const { adminUser, setAdminUser, showToast } = useStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await api.logout();
      setAdminUser(null);
      showToast("Logged out of Admin Console");
      window.location.hash = "#/admin";
    } catch {
      setAdminUser(null);
    }
  };

  const menuSections = [
    {
      title: "Core",
      items: [{ id: "dashboard", label: "Dashboard", icon: "bi-grid-1x2" }],
    },
    {
      title: "Store Builder",
      items: [
        { id: "builder", label: "Website Builder", icon: "bi-magic", badge: "Live" },
        { id: "pages", label: "Pages", icon: "bi-file-earmark-richtext" },
        { id: "theme", label: "Theme Customizer", icon: "bi-palette" },
        { id: "media", label: "Media Library", icon: "bi-images" },
      ],
    },
    {
      title: "E-Commerce",
      items: [
        { id: "products", label: "Products", icon: "bi-box-seam" },
        { id: "categories", label: "Categories", icon: "bi-folder" },
        { id: "orders", label: "Orders", icon: "bi-bag-check" },
        { id: "customers", label: "Customers", icon: "bi-people" },
        { id: "subscriptions", label: "Subscriptions", icon: "bi-arrow-repeat" },
        { id: "licenses", label: "Digital License Vault", icon: "bi-key", badge: "Vault" },
        { id: "coupons", label: "Coupons", icon: "bi-ticket-perforated" },
      ],
    },
    {
      title: "Growth & Insights",
      items: [
        { id: "marketing", label: "Marketing & Banners", icon: "bi-megaphone" },
        { id: "analytics", label: "Analytics", icon: "bi-graph-up-arrow" },
        { id: "seo", label: "SEO & Sitemap", icon: "bi-search" },
      ],
    },
    {
      title: "System",
      items: [{ id: "settings", label: "Settings & Audit Logs", icon: "bi-gear" }],
    },
  ];

  return (
    <div className="d-flex min-vh-100 bg-light text-dark font-sans" style={{ fontFamily: "Plus Jakarta Sans, Inter, sans-serif" }}>
      {/* Sidebar */}
      <aside
        className={`bg-white border-end d-flex flex-column transition-all duration-300 z-3 ${
          sidebarCollapsed ? "sidebar-collapsed" : ""
        }`}
        style={{
          width: sidebarCollapsed ? "72px" : "260px",
          minWidth: sidebarCollapsed ? "72px" : "260px",
          borderColor: "#e5e7eb",
          boxShadow: "2px 0 12px rgba(0,0,0,0.02)",
        }}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 border-bottom d-flex align-items-center justify-content-between shrink-0" style={{ height: "64px" }}>
          {!sidebarCollapsed ? (
            <div className="overflow-hidden">
              <PlayBeatLogo
                size="sm"
                lightMode={true}
                showTagline={true}
              />
            </div>
          ) : (
            <div className="mx-auto">
              <PlayBeatLogo size="sm" showTagline={false} />
            </div>
          )}

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="btn btn-sm btn-light border-0 text-muted p-1"
            title="Toggle Sidebar"
          >
            <i className={`bi ${sidebarCollapsed ? "bi-layout-sidebar-inset" : "bi-layout-sidebar"}`}></i>
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-grow-1 overflow-y-auto py-3 px-2">
          {menuSections.map((sec, sIdx) => (
            <div key={sIdx} className="mb-3">
              {!sidebarCollapsed && (
                <div className="px-3 mb-1 text-[11px] fw-bold text-muted text-uppercase tracking-wider">
                  {sec.title}
                </div>
              )}
              <div className="d-flex flex-column gap-1">
                {sec.items.map((item) => {
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectTab(item.id)}
                      className={`btn btn-sm d-flex align-items-center border-0 text-start rounded-3 transition-colors ${
                        isActive
                          ? "bg-dark text-white fw-bold shadow-sm"
                          : "text-secondary hover:bg-light hover:text-dark fw-medium"
                      } ${sidebarCollapsed ? "justify-content-center px-0 py-2.5" : "px-3 py-2"}`}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <i className={`bi ${item.icon} ${isActive ? "text-primary" : "text-secondary"} ${sidebarCollapsed ? "fs-5" : "me-2.5 fs-6"}`}></i>
                      {!sidebarCollapsed && (
                        <span className="flex-grow-1 text-truncate" style={{ fontSize: "13px" }}>
                          {item.label}
                        </span>
                      )}
                      {!sidebarCollapsed && item.badge && (
                        <span
                          className={`badge rounded-pill text-[10px] fw-bold ${
                            isActive ? "bg-primary text-white" : "bg-light text-primary border"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Card & Logout */}
        <div className="p-3 border-top bg-light" style={{ borderColor: "#e5e7eb" }}>
          {!sidebarCollapsed ? (
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2 overflow-hidden">
                <img
                  src={adminUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"}
                  alt="Admin"
                  className="rounded-circle border"
                  style={{ width: "36px", height: "36px", objectFit: "cover" }}
                />
                <div className="overflow-hidden">
                  <div className="fw-bold text-dark text-truncate text-xs">{adminUser?.name || "Admin Director"}</div>
                  <div className="text-muted text-[11px] text-truncate">{adminUser?.role || "Super Admin"}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-sm btn-outline-danger border-0 p-1.5"
                title="Logout"
              >
                <i className="bi bi-box-arrow-right fs-6"></i>
              </button>
            </div>
          ) : (
            <button onClick={handleLogout} className="btn btn-sm btn-outline-danger border-0 w-100 p-2" title="Logout">
              <i className="bi bi-box-arrow-right"></i>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="d-flex flex-column flex-grow-1 min-vw-0 overflow-x-hidden">
        {/* Top Navbar */}
        <header
          className="bg-white border-bottom px-4 d-flex align-items-center justify-content-between shrink-0"
          style={{ height: "64px", borderColor: "#e5e7eb" }}
        >
          {/* Breadcrumb / Title */}
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted text-xs text-uppercase tracking-wider">Console</span>
            <span className="text-muted text-xs">/</span>
            <span className="fw-bold text-dark text-capitalize fs-6">{currentTab}</span>
          </div>

          {/* Right Header Actions */}
          <div className="d-flex align-items-center gap-3">
            {/* View Live Store Button */}
            <a
              href="#/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1.5 rounded-3 fw-semibold px-3 py-1.5"
              style={{ fontSize: "12.5px" }}
            >
              <i className="bi bi-shop"></i>
              <span>View Store</span>
              <i className="bi bi-box-arrow-up-right text-[10px]"></i>
            </a>

            {/* Quick Actions Dropdown */}
            <div className="dropdown">
              <button
                className="btn btn-dark btn-sm d-flex align-items-center gap-1.5 rounded-3 fw-semibold px-3 py-1.5 dropdown-toggle"
                data-bs-toggle="dropdown"
                style={{ fontSize: "12.5px" }}
              >
                <i className="bi bi-plus-lg"></i>
                <span>Quick Action</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-sm border py-2 rounded-3">
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2 small py-2" onClick={() => onSelectTab("products")}>
                    <i className="bi bi-box-seam text-primary"></i> Add New Product
                  </button>
                </li>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2 small py-2" onClick={() => onSelectTab("pages")}>
                    <i className="bi bi-file-earmark-plus text-success"></i> Create Page
                  </button>
                </li>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2 small py-2" onClick={() => onSelectTab("categories")}>
                    <i className="bi bi-folder-plus text-warning"></i> Add Category
                  </button>
                </li>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2 small py-2" onClick={() => onSelectTab("coupons")}>
                    <i className="bi bi-ticket-perforated text-info"></i> Create Coupon
                  </button>
                </li>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2 small py-2" onClick={() => onSelectTab("theme")}>
                    <i className="bi bi-broadcast-pin text-info"></i> Live Update Logo
                  </button>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2 small py-2" onClick={() => onSelectTab("builder")}>
                    <i className="bi bi-magic text-purple"></i> Open Website Builder
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-grow-1 p-4 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
