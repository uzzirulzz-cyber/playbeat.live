import React, { useState, useEffect } from "react";
import { StoreProvider, useStore } from "./context/StoreContext";
import { AdminLogin } from "./admin/AdminLogin";
import { AdminLayout } from "./admin/AdminLayout";
import { AdminDashboard } from "./admin/AdminDashboard";
import { WebsiteBuilder } from "./admin/WebsiteBuilder";
import { PageManagement } from "./admin/PageManagement";
import { ThemeCustomizer } from "./admin/ThemeCustomizer";
import { ProductManagement } from "./admin/ProductManagement";
import { CategoryManagement } from "./admin/CategoryManagement";
import { OrderManagement } from "./admin/OrderManagement";
import { CustomerManagement } from "./admin/CustomerManagement";
import { SubscriptionManagement } from "./admin/SubscriptionManagement";
import { LicenseVault } from "./admin/LicenseVault";
import { CouponManagement } from "./admin/CouponManagement";
import { AnalyticsView } from "./admin/AnalyticsView";
import { MarketingView } from "./admin/MarketingView";
import { SEOManagement } from "./admin/SEOManagement";
import { SystemSettings } from "./admin/SystemSettings";

// Storefront & Agency Components
import { StorefrontHeader } from "./storefront/StorefrontHeader";
import { StorefrontHome } from "./storefront/StorefrontHome";
import { StorefrontFooter } from "./storefront/StorefrontFooter";
import { ServicesPage } from "./pages/ServicesPage";
import { ServiceDetailPage } from "./pages/ServiceDetailPage";
import { DemosGalleryPage } from "./pages/DemosGalleryPage";
import { DemoPlayerPage } from "./pages/DemoPlayerPage";
import { ProjectBuilderPage } from "./pages/ProjectBuilderPage";
import { CompanyPage } from "./pages/CompanyPage";
import { ContactPage } from "./pages/ContactPage";
import { LegalPage } from "./pages/LegalPage";
import { SocialLinksPage } from "./pages/SocialLinksPage";
import { FloatingWhatsApp } from "./components/FloatingWhatsApp";
import { CartDrawer } from "./storefront/CartDrawer";
import { CheckoutModal } from "./storefront/CheckoutModal";
import { CustomerAccountModal } from "./storefront/CustomerAccountModal";
import { CustomerAuthModal } from "./storefront/CustomerAuthModal";
import { ProductDetailModal } from "./storefront/ProductDetailModal";

function AppContent() {
  const { adminUser, viewingProduct, setViewingProduct } = useStore();
  const [currentHash, setCurrentHash] = useState(() => window.location.hash || "#/");
  const [adminTab, setAdminTab] = useState("dashboard");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash || "#/";
      setCurrentHash(hash);

      const path = hash.slice(1).split("?")[0].replace("/", "");
      if (path === "admin" && !adminTab) {
        setAdminTab("dashboard");
      }
    };

    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [adminTab]);

  const [rawRoute, rawQuery] = (currentHash.slice(1) || "/").split("?");
  const pathSegments = rawRoute.split("/").filter(Boolean);
  const route = pathSegments[0] || "";
  const subSlug = pathSegments[1] || "";
  const searchParams = new URLSearchParams(rawQuery || "");

  // Dedicated Link-in-bio page
  if (route === "links" || route === "bio") {
    return <SocialLinksPage />;
  }

  // ==========================================
  // PART 1: PREMIUM ADMIN PANEL (/admin)
  // ==========================================
  if (route === "admin") {
    if (!adminUser) {
      return <AdminLogin onSuccess={() => setAdminTab("dashboard")} />;
    }

    return (
      <AdminLayout currentTab={adminTab} onSelectTab={(tab) => setAdminTab(tab)}>
        {adminTab === "dashboard" && <AdminDashboard onNavigateTab={(t) => setAdminTab(t)} />}
        {adminTab === "builder" && <WebsiteBuilder />}
        {adminTab === "pages" && <PageManagement />}
        {adminTab === "theme" && <ThemeCustomizer />}
        {adminTab === "products" && <ProductManagement />}
        {adminTab === "categories" && <CategoryManagement />}
        {adminTab === "orders" && <OrderManagement />}
        {adminTab === "customers" && <CustomerManagement />}
        {adminTab === "subscriptions" && <SubscriptionManagement />}
        {adminTab === "licenses" && <LicenseVault />}
        {adminTab === "coupons" && <CouponManagement />}
        {adminTab === "analytics" && <AnalyticsView />}
        {adminTab === "marketing" && <MarketingView />}
        {adminTab === "seo" && <SEOManagement />}
        {adminTab === "settings" && <SystemSettings />}
      </AdminLayout>
    );
  }

  // ==========================================
  // PART 2: STOREFRONT & DIGITAL SOLUTIONS
  // ==========================================
  return (
    <div className="d-flex flex-column min-vh-100 bg-white">
      {/* Front End Header */}
      <StorefrontHeader onOpenSearch={() => setIsSearchModalOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-grow-1">
        {route === "" && <StorefrontHome />}

        {route === "shop" && <StorefrontHome />}

        {route === "categories" && <StorefrontHome />}

        {route === "subscriptions" && <StorefrontHome />}

        {route === "services" && !subSlug && (
          <ServicesPage
            initialGroup={searchParams.get("g") || "all"}
            initialQuery={searchParams.get("q") || ""}
          />
        )}

        {route === "services" && subSlug && (
          <ServiceDetailPage slug={subSlug} />
        )}

        {route === "demos" && <DemosGalleryPage />}

        {route === "demo" && subSlug && <DemoPlayerPage slug={subSlug} />}

        {route === "build" && (
          <ProjectBuilderPage
            initialServiceSlug={searchParams.get("s") || undefined}
            initialPackageMultiplier={
              searchParams.get("p") ? Number(searchParams.get("p")) : 1
            }
          />
        )}

        {route === "company" && <CompanyPage />}

        {route === "contact" && <ContactPage />}

        {route === "privacy" && <LegalPage initialTab="privacy" />}
        {route === "terms" && <LegalPage initialTab="terms" />}
        {route === "refund" && <LegalPage initialTab="refund" />}
        {route === "security" && <LegalPage initialTab="security" />}
        {route === "legal" && <LegalPage initialTab="privacy" />}

        {route === "coming-soon" && (
          <div className="py-5 text-center container-xl">
            <span className="badge bg-primary text-white rounded-pill px-3 py-1 text-xs mb-2">Q3 ROADMAP</span>
            <h2 className="fw-extrabold text-dark">Upcoming Enterprise Releases</h2>
            <p className="text-muted small max-w-lg mx-auto mb-4">
              Quantum encryption suites, edge neural reasoning models, and self-hosted vector clustering passes are currently in testing.
            </p>
            <a href="#/shop" className="btn btn-dark rounded-pill px-4 text-xs fw-semibold">
              ← Return to Catalog
            </a>
          </div>
        )}
      </main>

      {/* Front End Footer */}
      <StorefrontFooter />

      {/* Modals & Drawers */}
      <CartDrawer />
      <CheckoutModal />
      <CustomerAccountModal />
      <CustomerAuthModal />
      {viewingProduct && (
        <ProductDetailModal
          product={viewingProduct}
          onClose={() => setViewingProduct(null)}
        />
      )}

      {/* WhatsApp Floating Action Button */}
      <FloatingWhatsApp />

      {/* Real Product Search Modal */}
      {isSearchModalOpen && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1060 }}
          onClick={() => setIsSearchModalOpen(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: "560px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 shadow-2xl rounded-4 overflow-hidden">
              <div className="p-3 border-bottom d-flex align-items-center gap-2">
                <i className="bi bi-search text-muted fs-5 ms-2"></i>
                <input
                  type="text"
                  autoFocus
                  placeholder="Search products by name, tag or category..."
                  className="form-control border-0 shadow-none text-dark fs-6"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery) {
                      window.location.hash = `#/shop?search=${encodeURIComponent(searchQuery)}`;
                      setIsSearchModalOpen(false);
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-light border text-muted"
                  onClick={() => setIsSearchModalOpen(false)}
                >
                  Esc
                </button>
              </div>

              <div className="p-3 bg-light text-xs text-muted d-flex justify-content-between">
                <span>Press Enter to filter storefront</span>
                <span className="fw-semibold">PlayBeat Cloud</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
