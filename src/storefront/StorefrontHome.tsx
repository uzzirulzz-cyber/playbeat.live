import React, { useState, useEffect } from "react";
import { StorefrontHero } from "./StorefrontHero";
import { CategoryCards } from "./CategoryCards";
import { ServicesMarketplaceGrid } from "../components/ServicesMarketplaceGrid";
import { ProductGrid } from "./ProductGrid";
import { SubscriptionSection } from "./SubscriptionSection";
import { ContactSection } from "../components/ContactSection";
import { ProductDetailModal } from "./ProductDetailModal";
import { CartDrawer } from "./CartDrawer";
import { CheckoutModal } from "./CheckoutModal";
import { CustomerAccountModal } from "./CustomerAccountModal";
import { CustomerAuthModal } from "./CustomerAuthModal";
import { api } from "../services/api";
import { Product, Category } from "../types";
import { useStore } from "../context/StoreContext";
import { getStoredServices, DEMOS, Service } from "../data/servicesData";
import { getDemoSrcDoc } from "../data/mockTemplates";
import {
  ArrowRight,
  Play,
  Monitor,
  Laptop,
  Tablet,
  Smartphone,
  Maximize2,
  Check,
  ShieldCheck,
  Zap,
  Sparkles,
  Layers,
  MessageCircle,
} from "lucide-react";

export const StorefrontHome: React.FC = () => {
  const { viewingProduct, setViewingProduct } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Live Demo Section State
  const [activeDemoSlug, setActiveDemoSlug] = useState("corporate-website");
  const [deviceView, setDeviceView] = useState<"desktop" | "laptop" | "tablet" | "mobile">("laptop");

  const services = getStoredServices();
  const currentDemoService =
    services.find((s) => s.slug === activeDemoSlug) || services[0];

  useEffect(() => {
    loadStorefrontData();
  }, []);

  const loadStorefrontData = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([api.getProducts(), api.getCategories()]);
      setProducts(prods);
      setCategories(cats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const featured = products.filter((p) => p.status === "published");

  // Process Steps
  const processSteps = [
    {
      num: "01",
      title: "Discover",
      desc: "We dissect your business model, target users, and growth objectives before wireframing.",
      color: "#3B82F6",
    },
    {
      num: "02",
      title: "Design",
      desc: "Tactile, clickable prototypes and pixel-perfect design systems ready for user testing.",
      color: "#8B5CF6",
    },
    {
      num: "03",
      title: "Build",
      desc: "Production code with weekly milestone deployments and continuous staging previews.",
      color: "#EC4899",
    },
    {
      num: "04",
      title: "Test",
      desc: "Cross-device responsiveness, end-to-end security audits, and latency optimization.",
      color: "#FF7A18",
    },
    {
      num: "05",
      title: "Launch",
      desc: "Live zero-downtime deployment, automated backups, and 100% intellectual property handover.",
      color: "#10B981",
    },
    {
      num: "06",
      title: "Scale",
      desc: "Post-launch warranty, feature sprints, and dedicated ongoing maintenance SLA support.",
      color: "#22D3EE",
    },
  ];

  // Device Dimensions
  const deviceStyles: Record<string, { width: string; height: string; border: string }> = {
    desktop: { width: "100%", height: "540px", border: "1px solid rgba(255,255,255,0.15)" },
    laptop: { width: "min(960px, 100%)", height: "500px", border: "1px solid rgba(255,255,255,0.15)" },
    tablet: { width: "min(720px, 100%)", height: "480px", border: "1px solid rgba(255,255,255,0.15)" },
    mobile: { width: "min(360px, 100%)", height: "520px", border: "1px solid rgba(255,255,255,0.2)" },
  };

  const demoCategories = [
    { label: "Corporate Website", slug: "corporate-website" },
    { label: "SaaS Dashboard", slug: "saas-dashboard-design" },
    { label: "Enterprise CRM", slug: "enterprise-web-application" },
    { label: "Ecommerce Shop", slug: "ecommerce-website" },
    { label: "Pulse Mobile App", slug: "mobile-app-development" },
    { label: "AI Agent Workspace", slug: "ai-dashboard-design" },
    { label: "Fintech Banking", slug: "fintech-dashboard" },
    { label: "Healthcare Portal", slug: "healthcare-dashboard" },
  ];

  return (
    <div style={{ backgroundColor: "#050816", color: "#F8FAFC" }}>
      {/* 1. STRIKING VIBRANT HERO */}
      <StorefrontHero />

      {/* 2. DISTINCTIVE CATEGORY CARDS */}
      <CategoryCards />

      {/* 3. PRODUCTIZED SERVICES MARKETPLACE WITH PRICES (Dribbble Showcase) */}
      <ServicesMarketplaceGrid
        sectionTitle="Popular Services & Digital Deliverables"
        sectionSubtitle="Explore transparent upfront pricing, guaranteed turnaround times, and verified deliverables."
        limit={8}
      />

      {/* 4. ALTERNATING SECTION: HOW WE WORK (LIGHT SURFACE #F4F7FB) */}
      <section className="py-5 py-lg-6 position-relative text-dark" style={{ backgroundColor: "#F4F7FB" }}>
        <div className="container-xl">
          <div className="text-center max-w-2xl mx-auto mb-5">
            <span className="badge rounded-pill px-3 py-1 bg-primary text-white text-xs fw-bold text-uppercase tracking-wider mb-2">
              Our Blueprint
            </span>
            <h2 className="fw-extrabold text-dark mb-2" style={{ fontSize: "clamp(28px, 3.5vw, 44px)", letterSpacing: "-0.03em" }}>
              FROM IDEA TO LAUNCH.
            </h2>
            <p className="text-secondary small leading-relaxed">
              We execute with military precision. No bloated discovery phases or hidden surprises — just weekly milestone handoffs you can touch and verify.
            </p>
          </div>

          <div className="row g-4">
            {processSteps.map((s, idx) => (
              <div key={s.num} className="col-12 col-md-6 col-lg-4">
                <div
                  className="card h-100 border-0 rounded-4 p-4 shadow-sm transition-all hover:translate-y--2"
                  style={{
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
                    borderTop: `4px solid ${s.color}`,
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="h3 fw-extrabold mb-0 font-mono" style={{ color: s.color }}>
                      {s.num}
                    </span>
                    <span className="badge rounded-pill bg-light text-muted border text-xs">
                      Phase {idx + 1}
                    </span>
                  </div>
                  <h5 className="fw-bold text-dark mb-2">{s.title}</h5>
                  <p className="text-secondary small mb-0 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE LIVE DEMO SHOWCASE SECTION ("DON'T JUST IMAGINE IT. TRY IT.") */}
      <section className="py-5 py-lg-6 position-relative overflow-hidden" style={{ backgroundColor: "#060D1E" }}>
        {/* Glow Blobs */}
        <div
          className="position-absolute top-20 start-50 translate-middle-x rounded-circle pointer-events-none opacity-30"
          style={{
            width: "600px",
            height: "400px",
            background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />

        <div className="container-xl position-relative z-1">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-4">
            <span className="badge rounded-pill px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs fw-bold text-uppercase tracking-wider mb-2">
              Working Browser Prototypes
            </span>
            <h2 className="fw-extrabold text-white mb-2" style={{ fontSize: "clamp(28px, 3.8vw, 48px)", letterSpacing: "-0.035em" }}>
              DON’T JUST IMAGINE IT. <span className="text-gt-primary">TRY IT.</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-0">
              Explore interactive examples of the digital products PlayBeat Digital can build for your business. Click buttons, test workflows, and switch device viewports in real time.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="d-flex align-items-center justify-content-center flex-wrap gap-2 mb-4">
            {demoCategories.map((dm) => (
              <button
                key={dm.slug}
                onClick={() => setActiveDemoSlug(dm.slug)}
                className={`btn btn-sm rounded-pill text-xs fw-bold px-3 py-1.5 transition-all ${
                  activeDemoSlug === dm.slug
                    ? "btn-light text-dark shadow-md"
                    : "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10"
                }`}
              >
                {dm.label}
              </button>
            ))}
          </div>

          {/* Device Controls Bar */}
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 p-2.5 px-3 rounded-4 bg-white/5 border border-white/10 backdrop-blur-md mb-3 max-w-3xl mx-auto">
            <div className="d-flex align-items-center gap-1.5">
              <span className="text-xs text-slate-400 me-2 font-medium">Device View:</span>
              {[
                { id: "laptop", label: "Laptop", icon: <Laptop className="w-3.5 h-3.5" /> },
                { id: "desktop", label: "Desktop", icon: <Monitor className="w-3.5 h-3.5" /> },
                { id: "tablet", label: "Tablet", icon: <Tablet className="w-3.5 h-3.5" /> },
                { id: "mobile", label: "Mobile", icon: <Smartphone className="w-3.5 h-3.5" /> },
              ].map((dev) => (
                <button
                  key={dev.id}
                  onClick={() => setDeviceView(dev.id as any)}
                  className={`btn btn-xs rounded-pill px-2.5 py-1 text-xs fw-semibold d-inline-flex align-items-center gap-1.5 transition-all ${
                    deviceView === dev.id
                      ? "bg-cyan-500 text-dark fw-bold shadow-sm"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {dev.icon}
                  <span>{dev.label}</span>
                </button>
              ))}
            </div>

            <div className="d-flex align-items-center gap-2">
              <span className="badge rounded-pill bg-success-subtle text-success text-[10px]">
                ● Interactive Sandbox Active
              </span>
              <a
                href={`#/demo/${activeDemoSlug}`}
                className="btn btn-xs btn-outline-light rounded-pill px-2.5 py-1 text-xs d-inline-flex align-items-center gap-1"
                title="Open in Fullscreen Player"
              >
                <Maximize2 className="w-3 h-3" />
                <span>Fullscreen</span>
              </a>
            </div>
          </div>

          {/* Interactive Device Sandbox Frame */}
          <div className="d-flex justify-content-center">
            <div
              className="rounded-4 overflow-hidden shadow-2xl transition-all duration-300 position-relative"
              style={{
                width: deviceStyles[deviceView].width,
                height: deviceStyles[deviceView].height,
                border: deviceStyles[deviceView].border,
                background: "#081026",
                boxShadow: "0 25px 65px -15px rgba(0,0,0,0.9), 0 0 40px -5px rgba(56, 189, 248, 0.25)",
              }}
            >
              {/* Device Header Chrome */}
              <div className="px-3 py-2 bg-white/5 border-bottom border-white/10 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-1.5">
                  <span className="rounded-circle bg-danger opacity-75 d-inline-block" style={{ width: 8, height: 8 }} />
                  <span className="rounded-circle bg-warning opacity-75 d-inline-block" style={{ width: 8, height: 8 }} />
                  <span className="rounded-circle bg-success opacity-75 d-inline-block" style={{ width: 8, height: 8 }} />
                </div>
                <div className="badge rounded-pill bg-white/10 text-slate-300 text-[10px] font-mono px-3 py-0.5">
                  https://preview.playbeat.cloud/{activeDemoSlug}
                </div>
                <span className="badge rounded-pill bg-info text-dark text-[9px] fw-bold">
                  LIVE
                </span>
              </div>

              {/* Iframe Rendering Mockup */}
              <iframe
                title="PlayBeat Live Demo"
                srcDoc={getDemoSrcDoc(currentDemoService)}
                className="w-100 h-100 border-0"
                style={{ height: "calc(100% - 36px)", background: "#FFFFFF" }}
              />
            </div>
          </div>

          {/* Under-frame CTA */}
          <div className="text-center pt-4">
            <a
              href={`#/services/${currentDemoService.slug}`}
              className="btn btn-sm btn-outline-cyan rounded-pill px-4 py-2 text-xs fw-bold text-white text-decoration-none border border-cyan-400/40 hover:bg-cyan-400 hover:text-dark transition-all shadow-sm me-2"
            >
              View Service Deliverables & Pricing →
            </a>
            <a
              href="#/demos"
              className="btn btn-sm btn-link text-slate-400 text-decoration-none text-xs hover:text-white"
            >
              Browse all 12+ live demo showcases
            </a>
          </div>
        </div>
      </section>

      {/* 6. OVERSIZED TYPOGRAPHY BREAK SECTION */}
      <section className="py-5 position-relative overflow-hidden text-center border-y border-white/10" style={{ backgroundColor: "#050816" }}>
        <div className="container-xl py-4">
          <span className="badge rounded-pill px-3 py-1 bg-white/5 border border-white/10 text-slate-400 text-xs fw-bold text-uppercase tracking-wider mb-3">
            Our Core Thesis
          </span>
          <h2
            className="fw-extrabold tracking-tight text-white mb-2"
            style={{
              fontSize: "clamp(32px, 5.5vw, 76px)",
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
            }}
          >
            WE DON’T JUST DESIGN SCREENS.
          </h2>
          <h2
            className="fw-extrabold tracking-tight text-gt-energy mb-4"
            style={{
              fontSize: "clamp(32px, 5.5vw, 76px)",
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
            }}
          >
            WE BUILD DIGITAL BUSINESSES.
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            From user research and brand architecture to full-stack cloud code and conversion funnels, we engineer products that drive tangible revenue.
          </p>
        </div>
      </section>

      {/* 7. TRANSPARENT PROJECT PRICING SECTION (LIGHT SURFACE #F4F7FB) */}
      <section id="pricing" className="py-5 py-lg-6 position-relative text-dark" style={{ backgroundColor: "#F4F7FB" }}>
        <div className="container-xl">
          <div className="text-center max-w-2xl mx-auto mb-5">
            <span className="badge rounded-pill px-3 py-1 bg-primary text-white text-xs fw-bold text-uppercase tracking-wider mb-2">
              Predictable Engagements
            </span>
            <h2 className="fw-extrabold text-dark mb-2" style={{ fontSize: "clamp(28px, 3.5vw, 44px)", letterSpacing: "-0.03em" }}>
              Tailored Project Packages
            </h2>
            <p className="text-secondary small leading-relaxed">
              Transparent, milestone-based pricing with no hourly overages. Every package includes working interactive staging environments.
            </p>
          </div>

          <div className="row g-4 align-items-stretch">
            {/* Starter */}
            <div className="col-12 col-lg-4">
              <div className="card h-100 border rounded-4 p-4 p-xl-5 bg-white shadow-sm d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="fw-bold text-dark mb-0">Starter Package</h5>
                    <span className="badge bg-light text-muted border text-xs">MVPs & Launches</span>
                  </div>
                  <p className="text-muted small mb-4">
                    Ideal for startups and companies launching their first digital product with rapid turnarounds.
                  </p>
                  <div className="mb-4">
                    <span className="text-muted text-xs d-block">Starting from</span>
                    <span className="display-6 fw-extrabold text-dark">$1,200</span>
                    <span className="text-muted small ms-2">/ PKR 336,000</span>
                  </div>
                  <ul className="list-unstyled space-y-2.5 small text-secondary mb-4">
                    <li className="d-flex align-items-center gap-2">
                      <Check className="w-4 h-4 text-primary" /> Up to 5 custom-designed screens
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <Check className="w-4 h-4 text-primary" /> Full responsive mobile layouts
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <Check className="w-4 h-4 text-primary" /> 2 dedicated revision rounds
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <Check className="w-4 h-4 text-primary" /> 7-10 business days delivery
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <Check className="w-4 h-4 text-primary" /> 100% intellectual property ownership
                    </li>
                  </ul>
                </div>
                <a
                  href="#/build?p=1"
                  className="btn btn-outline-dark rounded-pill py-2.5 fw-bold text-sm w-100"
                >
                  Start Starter Project
                </a>
              </div>
            </div>

            {/* Professional (MOST POPULAR with gradient edge) */}
            <div className="col-12 col-lg-4">
              <div
                className="card h-100 rounded-4 p-4 p-xl-5 bg-white shadow-xl d-flex flex-column justify-content-between position-relative"
                style={{
                  border: "2px solid #7C3AED",
                  boxShadow: "0 20px 50px -10px rgba(124, 58, 237, 0.25)",
                }}
              >
                <div
                  className="position-absolute top-0 start-50 translate-middle badge rounded-pill px-4 py-1.5 text-white text-xs fw-extrabold shadow-sm"
                  style={{ background: "linear-gradient(110deg, #3B82F6 0%, #7C3AED 50%, #22D3EE 100%)" }}
                >
                  ⭐ MOST POPULAR
                </div>
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2 mt-2">
                    <h5 className="fw-bold text-dark mb-0">Professional</h5>
                    <span className="badge bg-purple-subtle text-purple border text-xs">High Growth</span>
                  </div>
                  <p className="text-muted small mb-4">
                    For scaling SaaS products, comprehensive corporate redesigns, and high-converting ecommerce platforms.
                  </p>
                  <div className="mb-4">
                    <span className="text-muted text-xs d-block">Starting from</span>
                    <span className="display-6 fw-extrabold text-dark">$3,500</span>
                    <span className="text-muted small ms-2">/ PKR 980,000</span>
                  </div>
                  <ul className="list-unstyled space-y-2.5 small text-secondary mb-4">
                    <li className="d-flex align-items-center gap-2">
                      <Check className="w-4 h-4 text-primary" /> Comprehensive multi-page architecture
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <Check className="w-4 h-4 text-primary" /> Interactive clickable prototypes
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <Check className="w-4 h-4 text-primary" /> Headless CMS / API integration
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <Check className="w-4 h-4 text-primary" /> 4 dedicated revision rounds
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <Check className="w-4 h-4 text-primary" /> Technical SEO & analytics foundations
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <Check className="w-4 h-4 text-primary" /> Priority delivery & direct Slack channel
                    </li>
                  </ul>
                </div>
                <a
                  href="#/build?p=1.8"
                  className="btn btn-primary rounded-pill py-2.5 fw-bold text-sm w-100 shadow-sm border-0"
                  style={{ background: "linear-gradient(110deg, #3B82F6, #7C3AED)" }}
                >
                  Start Professional Project
                </a>
              </div>
            </div>

            {/* Enterprise */}
            <div className="col-12 col-lg-4">
              <div className="card h-100 border rounded-4 p-4 p-xl-5 bg-white shadow-sm d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="fw-bold text-dark mb-0">Enterprise Suite</h5>
                    <span className="badge bg-light text-muted border text-xs">Mission Critical</span>
                  </div>
                  <p className="text-muted small mb-4">
                    Full-scale custom engineering, rigorous security audits, role matrices, and dedicated SLA support.
                  </p>
                  <div className="mb-4">
                    <span className="text-muted text-xs d-block">Starting from</span>
                    <span className="display-6 fw-extrabold text-dark">$10,000+</span>
                    <span className="text-muted small ms-2">/ PKR 2.8M+</span>
                  </div>
                  <ul className="list-unstyled space-y-2.5 small text-secondary mb-4">
                    <li className="d-flex align-items-center gap-2">
                      <Check className="w-4 h-4 text-primary" /> Bespoke enterprise platform build
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <Check className="w-4 h-4 text-primary" /> SSO / SAML & role-based permissions
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <Check className="w-4 h-4 text-primary" /> Dedicated lead software architect
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <Check className="w-4 h-4 text-primary" /> Unlimited milestone revisions
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <Check className="w-4 h-4 text-primary" /> Guaranteed 99.9% uptime SLA warranty
                    </li>
                  </ul>
                </div>
                <a
                  href="#/build?p=3"
                  className="btn btn-outline-dark rounded-pill py-2.5 fw-bold text-sm w-100"
                >
                  Contact Enterprise Team
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. DIGITAL SOFTWARE PACKAGES & LICENSES (From Database) */}
      <ProductGrid
        products={featured}
        categories={categories}
        isFeaturedOnly={true}
        title="Ready-To-Deploy Digital Software & Frameworks"
        subtitle="Cryptographically verified software binaries and design frameworks with instant digital license key issuance."
      />

      {/* 9. RECURRING PASSES */}
      <SubscriptionSection products={products} />

      {/* 10. FAQ SECTION */}
      <section className="py-5 bg-white text-dark border-top">
        <div className="container-xl">
          <div className="row g-4 align-items-start">
            <div className="col-12 col-lg-5">
              <span className="text-primary text-xs fw-bold text-uppercase tracking-wider">
                Common Questions
              </span>
              <h3 className="fw-extrabold text-dark mb-3">Frequently Asked Questions</h3>
              <p className="text-secondary small leading-relaxed">
                Everything you need to know about our productized delivery, milestone guarantees, intellectual property handover, and currency handling.
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/923199980011"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-success btn-sm rounded-pill px-3 py-2 fw-bold d-inline-flex align-items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp: +92 319 9980011</span>
                </a>
              </div>
            </div>

            <div className="col-12 col-lg-7 space-y-3">
              {[
                ["How does pricing work (USD vs PKR)?", "We offer transparent flat-rate pricing. You can pay internationally via credit card, wire transfer, or locally in PKR via Nayapay, SadaPay, or direct bank transfer."],
                ["Can I test the live demos before placing an order?", "Yes! Explore our 12+ fully functional interactive live demos right in the browser. You can test workflows, responsiveness, and features before initiating your brief."],
                ["How fast is delivery?", "Typical turnarounds range from 72 hours for express packages to 2-3 weeks for comprehensive platforms. Fast-track expedited sprints are also available."],
                ["Do you provide full source code and ownership?", "Absolutely. Upon final milestone approval, you receive 100% intellectual property ownership, Git repository access, and production credentials."],
              ].map(([q, a], idx) => (
                <div key={idx} className="p-3.5 rounded-3 bg-light border">
                  <h6 className="fw-bold text-dark mb-1 text-sm">{q}</h6>
                  <p className="text-muted small mb-0 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 11. DIRECT CONTACT SECTION WITH EMBEDDED ADMIN ENTRY SEAL */}
      <ContactSection id="contact" />

      {/* 12. FINAL GRADIENT CTA SECTION */}
      <section className="py-5 py-lg-6 position-relative overflow-hidden text-center" style={{ background: "linear-gradient(110deg, #081226 0%, #17113A 50%, #050816 100%)", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
        <div
          className="position-absolute top-50 start-50 translate-middle rounded-circle pointer-events-none opacity-25"
          style={{
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, #38bdf8 0%, #a855f7 50%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        <div className="container-xl position-relative z-1 py-4">
          <span className="badge rounded-pill px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs fw-bold text-uppercase tracking-wider mb-3">
            Ready to Begin?
          </span>
          <h2 className="fw-extrabold text-white mb-3" style={{ fontSize: "clamp(30px, 4vw, 54px)", letterSpacing: "-0.03em" }}>
            YOUR NEXT DIGITAL PRODUCT <span className="text-gt-primary">STARTS HERE.</span>
          </h2>
          <p className="text-slate-300 text-base max-w-xl mx-auto leading-relaxed mb-4">
            Tell us about your project or launch our interactive 6-step project estimator to calculate price and turnaround time instantly.
          </p>

          <div className="d-flex flex-wrap justify-content-center gap-3">
            <a
              href="#/build"
              className="btn btn-lg rounded-pill px-5 py-2.5 text-white fw-bold shadow-xl border-0 hover:scale-105 transition-all"
              style={{
                background: "linear-gradient(110deg, #3B82F6 0%, #7C3AED 50%, #22D3EE 100%)",
                boxShadow: "0 10px 30px -5px rgba(124, 58, 237, 0.5)",
              }}
            >
              <span>Launch 6-Step Project Estimator</span>
              <ArrowRight className="w-4 h-4 ms-2" />
            </a>

            <a
              href="https://wa.me/923199980011"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg rounded-pill px-4 py-2.5 text-white fw-semibold bg-white/10 border border-white/20 hover:bg-white/15 backdrop-blur-md transition-all d-inline-flex align-items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Direct WhatsApp Inquiry</span>
            </a>
          </div>
        </div>
      </section>

      {/* Global Modals & Drawers */}
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
    </div>
  );
};
