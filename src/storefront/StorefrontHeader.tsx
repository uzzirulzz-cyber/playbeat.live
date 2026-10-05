import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { PlayBeatLogo } from "../components/PlayBeatLogo";

interface StorefrontHeaderProps {
  onOpenSearch: () => void;
}

export const StorefrontHeader: React.FC<StorefrontHeaderProps> = ({ onOpenSearch }) => {
  const {
    theme,
    cartCount,
    setIsCartOpen,
    user,
    adminUser,
    setIsAccountOpen,
    setIsAuthOpen,
    setAuthMode,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const headerSettings = theme?.header || {
    announcementBanner: "⚡ Spring Release: 50% Off Lifetime AI Tool Licenses — Use Code: SPRING50",
    announcementLink: "#/shop?category=ai-tools",
    showAnnouncement: true,
    navLinks: [
      { label: "Home", href: "#/" },
      { label: "Services & Prices", href: "#/services", badge: "Popular" },
      { label: "Categories", href: "#/categories" },
      { label: "Live Demos", href: "#/demos" },
      { label: "Subscriptions", href: "#/subscriptions" },
      { label: "Project Estimator", href: "#/build", badge: "Live" },
      { label: "Company", href: "#/company" },
    ],
    showSearch: true,
    showCart: true,
    showAccount: true,
    ctaButton: { text: "Start Project", link: "#/build" },
  };

  return (
    <>
      {/* Top Announcement Bar */}
      {headerSettings.showAnnouncement && headerSettings.announcementBanner && (
        <div
          className="py-2 px-3 text-center text-xs fw-semibold text-white d-flex align-items-center justify-content-center gap-2"
          style={{ background: "linear-gradient(90deg, #0b132b, #1d4ed8, #0b132b)" }}
        >
          <span>{headerSettings.announcementBanner}</span>
          {headerSettings.announcementLink && (
            <a
              href={headerSettings.announcementLink}
              className="text-white text-decoration-underline ms-1 font-semibold hover:opacity-80"
            >
              Learn more →
            </a>
          )}
        </div>
      )}

      {/* Main Navbar */}
      <header
        className="sticky-top bg-white border-bottom shadow-sm z-3"
        style={{ borderColor: "#e5e7eb" }}
      >
        <div className="container-xl d-flex align-items-center justify-content-between h-16 py-2.5">
          {/* LEFT: Logo */}
          <div className="d-flex align-items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn btn-sm btn-light d-lg-none p-1.5 border-0 text-dark"
              aria-label="Toggle menu"
            >
              <i className="bi bi-list fs-4"></i>
            </button>

            <a href="#/" className="text-decoration-none group">
              <PlayBeatLogo
                size="md"
                customText={theme?.logoText}
                customTagline={theme?.logoTagline}
                customImage={theme?.logoImage}
                showLiveBadge={theme?.logoShowLiveBadge}
                liveBadgeText={theme?.logoLiveBadgeText}
                liveBadgeColor={theme?.logoLiveBadgeColor}
                showEqualizer={theme?.logoShowEqualizer}
                lightMode={true}
              />
            </a>
          </div>

          {/* CENTER: Navigation Links (Evenly spaced & balanced) */}
          <nav className="d-none d-lg-flex align-items-center gap-1">
            {headerSettings.navLinks.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="px-3 py-2 rounded-3 text-secondary hover:text-dark text-decoration-none small fw-semibold transition-colors d-flex align-items-center gap-1.5"
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="badge rounded-pill bg-danger-subtle text-danger text-[9px] px-1.5 py-0.5">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </nav>

          {/* RIGHT: Search, Account, Cart */}
          <div className="d-flex align-items-center gap-2">
            {/* Search */}
            {headerSettings.showSearch && (
              <button
                onClick={onOpenSearch}
                className="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center text-secondary hover:text-dark border"
                style={{ width: "38px", height: "38px" }}
                title="Search products (Ctrl+K)"
              >
                <i className="bi bi-search"></i>
              </button>
            )}

            {/* Account */}
            {headerSettings.showAccount && (
              <>
                {user ? (
                  <button
                    onClick={() => setIsAccountOpen(true)}
                    className="btn btn-outline-secondary btn-sm rounded-pill d-flex align-items-center gap-2 px-3 py-1.5 text-xs fw-semibold"
                  >
                    <i className="bi bi-person-circle fs-6 text-primary"></i>
                    <span className="d-none d-sm-inline">{user.name.split(" ")[0]}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setAuthMode("login");
                      setIsAuthOpen(true);
                    }}
                    className="btn btn-outline-dark btn-sm rounded-pill px-3 py-1.5 text-xs fw-semibold"
                  >
                    Sign In
                  </button>
                )}
              </>
            )}

            {/* Cart with Counter Badge */}
            {headerSettings.showCart && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="btn btn-dark btn-sm rounded-pill d-flex align-items-center gap-2 px-3 py-1.5 text-xs fw-bold shadow-sm"
              >
                <i className="bi bi-bag"></i>
                <span className="d-none d-sm-inline">Cart</span>
                <span className="badge bg-primary rounded-pill text-[10px] px-1.5">
                  {cartCount}
                </span>
              </button>
            )}

            {/* Admin shortcut only if already authenticated */}
            {adminUser && (
              <a
                href="#/admin"
                className="btn btn-sm btn-outline-primary rounded-pill px-2.5 py-1 text-xs d-none d-xl-inline-flex align-items-center gap-1.5 ms-1"
                title="Return to Admin Console"
              >
                <i className="bi bi-speedometer2"></i>
                <span>Console</span>
              </a>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="d-lg-none border-top bg-white p-3 shadow-lg">
            <div className="d-flex flex-column gap-1">
              {headerSettings.navLinks.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-2 text-dark text-decoration-none fw-semibold small d-flex justify-content-between align-items-center hover:bg-light"
                >
                  <span>{item.label}</span>
                  {item.badge && <span className="badge bg-danger">{item.badge}</span>}
                </a>
              ))}
              {adminUser && (
                <>
                  <hr className="my-2" />
                  <a
                    href="#/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 rounded-2 text-primary text-decoration-none fw-bold small d-flex align-items-center gap-2"
                  >
                    <i className="bi bi-speedometer2"></i>
                    <span>Admin Console</span>
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
