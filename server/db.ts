import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const DATA_DIR = path.resolve(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "database.json");

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "Super Admin" | "Admin" | "Editor" | "Customer";
  avatar?: string;
  createdAt: string;
  phone?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  images: string[];
  price: number;
  comparePrice?: number;
  category: string;
  tags: string[];
  status: "published" | "draft";
  productType: "digital" | "subscription" | "service" | "physical";
  pricingInterval: "one-time" | "monthly" | "quarterly" | "yearly";
  subscriptionDurationMonths?: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  features: string[];
  licenseAvailableCount?: number;
  downloadUrl?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  count?: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  licenseKey?: string;
  productType: string;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: "Credit Card" | "Stripe" | "PayPal" | "Bank Transfer" | "Crypto";
  paymentStatus: "Paid" | "Pending" | "Processing" | "Refunded" | "Failed";
  status: "Pending" | "Paid" | "Processing" | "Completed" | "Cancelled" | "Refunded";
  fulfillmentStatus: "Fulfilled" | "Unfulfilled";
  timeline: { time: string; note: string }[];
  notes?: string;
  shippingAddress?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  ordersCount: number;
  subscriptionsCount: number;
  status: "Active" | "Inactive";
  createdDate: string;
  address?: string;
}

export interface Subscription {
  id: string;
  subscriptionNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  productId: string;
  productName: string;
  planPeriod: "1 Month" | "3 Months" | "6 Months" | "12 Months";
  amount: number;
  status: "Active" | "Trial" | "Cancelled" | "Expired" | "Paused";
  nextBillingDate: string;
  startDate: string;
  autoRenew: boolean;
}

export interface License {
  id: string;
  licenseKey: string;
  productId: string;
  productName: string;
  customerId?: string;
  customerEmail?: string;
  orderId?: string;
  status: "Available" | "Assigned" | "Used" | "Expired" | "Revoked";
  expirationDate: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed" | "subscription";
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  expirationDate: string;
  status: "active" | "expired" | "disabled";
}

export interface PageSection {
  id: string;
  type: string;
  title?: string;
  subtitle?: string;
  content?: string;
  styles?: Record<string, any>;
  settings?: Record<string, any>;
}

export interface PageModel {
  id: string;
  title: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  status: "published" | "draft";
  template: string;
  sections: PageSection[];
  lastSaved: string;
  lastPublished: string;
  publishedBy: string;
  version: number;
}

export interface ThemeSettings {
  logoText: string;
  logoTagline?: string;
  logoImage?: string;
  logoShowLiveBadge?: boolean;
  logoLiveBadgeText?: string;
  logoLiveBadgeColor?: "green" | "cyan" | "orange" | "purple";
  logoShowEqualizer?: boolean;
  primaryColor: string;
  secondaryColor: string;
  darkColor: string;
  lightColor: string;
  fontFamily: string;
  borderRadius: string;
  containerWidth: string;
  header: {
    announcementBanner: string;
    announcementLink: string;
    showAnnouncement: boolean;
    navLinks: { label: string; href: string; badge?: string }[];
    showSearch: boolean;
    showCart: boolean;
    showAccount: boolean;
    ctaButton: { text: string; link: string };
  };
  footer: {
    aboutText: string;
    newsletterTitle: string;
    copyright: string;
    socials: { twitter?: string; github?: string; discord?: string; linkedin?: string };
  };
  version: number;
  lastUpdated: string;
}

export interface DatabaseSchema {
  users: User[];
  products: Product[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];
  subscriptions: Subscription[];
  licenses: License[];
  coupons: Coupon[];
  pages: PageModel[];
  theme: ThemeSettings;
  themeDraft: ThemeSettings;
  themeRevisions: { version: number; date: string; user: string; theme: ThemeSettings }[];
  marketing: {
    banners: { id: string; title: string; text: string; active: boolean; type: string }[];
    abandonedCarts: { id: string; email: string; itemsCount: number; total: number; date: string }[];
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: string;
    robots: string;
  };
  auditLogs: { id: string; user: string; action: string; target: string; ip: string; timestamp: string; details?: string }[];
}

let dbCache: DatabaseSchema | null = null;

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function getInitialData(): DatabaseSchema {
  const passwordHash = bcrypt.hashSync("playbeat11222", 10);
  const customerPasswordHash = bcrypt.hashSync("password123", 10);

  const initialTheme: ThemeSettings = {
    logoText: "PlayBeat Digital",
    logoTagline: "DIGITAL",
    logoShowLiveBadge: true,
    logoLiveBadgeText: "LIVE",
    logoLiveBadgeColor: "cyan",
    logoShowEqualizer: true,
    primaryColor: "#0d6efd",
    secondaryColor: "#6c757d",
    darkColor: "#0b132b",
    lightColor: "#f8f9fa",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    borderRadius: "12px",
    containerWidth: "1240px",
    header: {
      announcementBanner: "⚡ Spring Release: 50% Off Lifetime AI Tool Licenses — Use Code: SPRING50",
      announcementLink: "#/shop?category=ai-tools",
      showAnnouncement: true,
      navLinks: [
        { label: "Home", href: "#/" },
        { label: "Shop", href: "#/shop" },
        { label: "Categories", href: "#/categories" },
        { label: "Subscriptions", href: "#/subscriptions" },
        { label: "AI Tools", href: "#/shop?category=ai-tools", badge: "Hot" },
        { label: "Software", href: "#/shop?category=software" },
        { label: "Coming Soon", href: "#/coming-soon" },
      ],
      showSearch: true,
      showCart: true,
      showAccount: true,
      ctaButton: { text: "Get Access", link: "#/subscriptions" },
    },
    footer: {
      aboutText: "Premium SaaS, digital software, AI tool suites, and developer assets with instant digital license key provisioning.",
      newsletterTitle: "Join 45,000+ founders and engineers getting our curated product drops.",
      copyright: "© 2026 PlayBeat Digital SaaS Platforms. All rights reserved.",
      socials: {
        twitter: "https://twitter.com",
        github: "https://github.com",
        discord: "https://discord.com",
        linkedin: "https://linkedin.com",
      },
    },
    version: 1,
    lastUpdated: new Date().toISOString(),
  };

  const users: User[] = [
    {
      id: "usr_admin_1",
      name: "Admin Director",
      email: "admin@playbeat.live",
      passwordHash: passwordHash,
      role: "Super Admin",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
      createdAt: new Date().toISOString(),
      phone: "+92 319 9980011",
    },
    {
      id: "usr_cust_1",
      name: "Sophia Martinez",
      email: "sophia@example.com",
      passwordHash: customerPasswordHash,
      role: "Customer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
      createdAt: new Date().toISOString(),
      phone: "+1 (555) 234-8901",
    },
    {
      id: "usr_cust_2",
      name: "David Chen",
      email: "david.chen@enterprise.io",
      passwordHash: customerPasswordHash,
      role: "Customer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
      createdAt: new Date().toISOString(),
      phone: "+1 (555) 872-9102",
    },
  ];

  const categories: Category[] = [
    {
      id: "cat_ai",
      name: "AI Tools",
      slug: "ai-tools",
      description: "Autonomous LLM reasoning agents, prompt engines, and neural media transformers.",
      icon: "bi-stars",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
      count: 4,
    },
    {
      id: "cat_sub",
      name: "Subscriptions",
      slug: "subscriptions",
      description: "Cloud infrastructure passes, enterprise developer licenses, and recurring SaaS suites.",
      icon: "bi-arrow-repeat",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
      count: 3,
    },
    {
      id: "cat_soft",
      name: "Software",
      slug: "software",
      description: "Desktop native workstations, developer compilers, and workflow automation apps.",
      icon: "bi-code-square",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
      count: 3,
    },
    {
      id: "cat_dig",
      name: "Digital Products",
      slug: "digital-products",
      description: "Production UI kit design systems, Figma master libraries, and full-stack code kits.",
      icon: "bi-box-seam",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
      count: 2,
    },
    {
      id: "cat_sec",
      name: "Security",
      slug: "security",
      description: "Zero-trust identity firewalls, encrypted vaults, and API token sanitizers.",
      icon: "bi-shield-check",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
      count: 2,
    },
    {
      id: "cat_prod",
      name: "Productivity",
      slug: "productivity",
      description: "Real-time task synchronization, executive Kanban pipelines, and team journals.",
      icon: "bi-lightning-charge",
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80",
      count: 2,
    },
  ];

  const products: Product[] = [
    {
      id: "prod_1",
      name: "NeuroSaaS Autonomous Agent Studio",
      slug: "neurosaas-autonomous-agent-studio",
      sku: "NS-AI-01",
      description: "Production-grade multi-agent autonomous framework capable of web search grounding, self-correcting coding loops, and automated ticket resolution. Includes full node/python client libraries and perpetual commercial usage.",
      shortDescription: "Enterprise multi-agent autonomous orchestration engine with live reasoning.",
      images: [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
      ],
      price: 249,
      comparePrice: 399,
      category: "ai-tools",
      tags: ["AI", "Agents", "Enterprise", "LLM"],
      status: "published",
      productType: "digital",
      pricingInterval: "one-time",
      rating: 4.95,
      reviewsCount: 88,
      badge: "Best Seller",
      features: [
        "Instant cryptographically signed License Key",
        "Full TypeScript + Python SDKs with complete documentation",
        "Self-hosted Docker and AWS Terraform scripts included",
        "Zero token telemetry or vendor lock-in",
      ],
      licenseAvailableCount: 42,
      downloadUrl: "https://downloads.playbeat.digital/packages/neurosaas-studio-v4.2.zip",
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    },
    {
      id: "prod_2",
      name: "Vaultly Cloud Security & Key Manager",
      slug: "vaultly-cloud-security-key-manager",
      sku: "VLT-SEC-02",
      description: "Zero-knowledge encryption suite designed for microservice API token management, hardware security module (HSM) bridging, and continuous leak scanning across public repos.",
      shortDescription: "Zero-knowledge secrets and API token management engine for distributed clouds.",
      images: [
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
      ],
      price: 189,
      comparePrice: 280,
      category: "security",
      tags: ["Security", "Keys", "Zero-Knowledge"],
      status: "published",
      productType: "digital",
      pricingInterval: "one-time",
      rating: 4.88,
      reviewsCount: 64,
      badge: "Security Audited",
      features: [
        "Post-quantum cryptographic cipher support",
        "Real-time audit log streaming to Datadog/Splunk",
        "Role-based emergency revocation kill-switch",
      ],
      licenseAvailableCount: 30,
      downloadUrl: "https://downloads.playbeat.digital/packages/vaultly-core-v2.1.zip",
      createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    },
    {
      id: "prod_3",
      name: "OmniFlow Cloud Infrastructure Subscription",
      slug: "omniflow-cloud-infrastructure-subscription",
      sku: "OF-SUB-01",
      description: "Full cluster provisioning pass including automated multi-region failover, edge routing CDN, continuous DB backup snapshots, and direct Slack SLA support with 15-minute response times.",
      shortDescription: "Unlimited high-availability cluster orchestration and edge CDN subscription.",
      images: [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      ],
      price: 79,
      comparePrice: 120,
      category: "subscriptions",
      tags: ["Subscription", "DevOps", "Cloud"],
      status: "published",
      productType: "subscription",
      pricingInterval: "monthly",
      subscriptionDurationMonths: 1,
      rating: 4.92,
      reviewsCount: 142,
      badge: "Top Rated",
      features: [
        "99.99% Uptime SLA backed by contractual credit refunds",
        "Global Anycast DNS with sub-50ms worldwide latency",
        "Unlimited scale-to-zero microservices and PostgreSQL read replicas",
        "Dedicated senior DevOps engineer on private Slack",
      ],
      licenseAvailableCount: 100,
      createdAt: new Date(Date.now() - 40 * 86400000).toISOString(),
    },
    {
      id: "prod_4",
      name: "Synthetix UI/UX Design System for Figma",
      slug: "synthetix-ui-ux-design-system-figma",
      sku: "SYN-UX-04",
      description: "Over 4,200 auto-layout components, 60+ pre-built SaaS dashboard screens, responsive mobile layouts, and a complete dark/light token architecture synced with Tailwind CSS 4 variables.",
      shortDescription: "4,200+ Figma component design system with production Tailwind tokens.",
      images: [
        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
      ],
      price: 129,
      comparePrice: 199,
      category: "digital-products",
      tags: ["Figma", "Design System", "Tailwind"],
      status: "published",
      productType: "digital",
      pricingInterval: "one-time",
      rating: 4.97,
      reviewsCount: 215,
      badge: "Staff Pick",
      features: [
        "Figma variables with full light, dark, and high-contrast modes",
        "Direct export mapping to React TypeScript and Bootstrap 5 styles",
        "Lifetime free updates as new components are added",
      ],
      licenseAvailableCount: 85,
      downloadUrl: "https://downloads.playbeat.digital/packages/synthetix-figma-pro-2026.zip",
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    },
    {
      id: "prod_5",
      name: "KubePulse Real-time Monitoring Station",
      slug: "kubepulse-real-time-monitoring-station",
      sku: "KP-DEV-05",
      description: "Low-overhead telemetry daemon with native OpenTelemetry collectors, GPU memory leak detectors, and instant alert routing to PagerDuty, WhatsApp, and Telegram.",
      shortDescription: "Microsecond telemetry aggregator for containerized clusters and web workers.",
      images: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      ],
      price: 49,
      comparePrice: 79,
      category: "software",
      tags: ["Monitoring", "Linux", "DevOps"],
      status: "published",
      productType: "subscription",
      pricingInterval: "monthly",
      subscriptionDurationMonths: 1,
      rating: 4.85,
      reviewsCount: 39,
      badge: "Popular",
      features: [
        "Under 1% CPU utilization footprint per host agent",
        "Pre-built Prometheus and Grafana dashboards",
        "One-command curl bash installation",
      ],
      licenseAvailableCount: 60,
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
      id: "prod_6",
      name: "PromptEngine Vector Matrix Optimizer",
      slug: "promptengine-vector-matrix-optimizer",
      sku: "PE-AI-06",
      description: "Algorithmic token compresser and semantic cache that slashes your monthly OpenAI and Claude API bills by up to 64% while maintaining 99.8% precision benchmark accuracy.",
      shortDescription: "Cut LLM inference costs by 64% using intelligent semantic prompt caching.",
      images: [
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
      ],
      price: 199,
      comparePrice: 350,
      category: "ai-tools",
      tags: ["AI", "Optimization", "API"],
      status: "published",
      productType: "digital",
      pricingInterval: "one-time",
      rating: 4.96,
      reviewsCount: 52,
      badge: "High ROI",
      features: [
        "Drop-in proxy for standard OpenAI / Anthropic / Gemini SDKs",
        "Local Redis vector cluster or in-memory LRU quantization",
        "Real-time dollar cost savings dashboard",
      ],
      licenseAvailableCount: 35,
      downloadUrl: "https://downloads.playbeat.digital/packages/prompt-engine-v3.0.zip",
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
  ];

  const licenses: License[] = [
    {
      id: "lic_1",
      licenseKey: "PB-AI-9941-8824-XQ71",
      productId: "prod_1",
      productName: "NeuroSaaS Autonomous Agent Studio",
      customerId: "usr_cust_1",
      customerEmail: "sophia@example.com",
      orderId: "ord_1001",
      status: "Assigned",
      expirationDate: "2028-12-31T23:59:59Z",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "lic_2",
      licenseKey: "PB-AI-4421-9901-LL04",
      productId: "prod_1",
      productName: "NeuroSaaS Autonomous Agent Studio",
      status: "Available",
      expirationDate: "2028-12-31T23:59:59Z",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "lic_3",
      licenseKey: "PB-SEC-8812-7741-VK99",
      productId: "prod_2",
      productName: "Vaultly Cloud Security & Key Manager",
      customerId: "usr_cust_2",
      customerEmail: "david.chen@enterprise.io",
      orderId: "ord_1002",
      status: "Assigned",
      expirationDate: "2029-01-01T00:00:00Z",
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: "lic_4",
      licenseKey: "PB-SEC-1192-3344-AV01",
      productId: "prod_2",
      productName: "Vaultly Cloud Security & Key Manager",
      status: "Available",
      expirationDate: "2029-01-01T00:00:00Z",
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
    {
      id: "lic_5",
      licenseKey: "PB-UX-7722-1049-UX99",
      productId: "prod_4",
      productName: "Synthetix UI/UX Design System for Figma",
      customerId: "usr_cust_1",
      customerEmail: "sophia@example.com",
      orderId: "ord_1001",
      status: "Assigned",
      expirationDate: "2099-12-31T23:59:59Z",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "lic_6",
      licenseKey: "PB-UX-9900-5511-UX02",
      productId: "prod_4",
      productName: "Synthetix UI/UX Design System for Figma",
      status: "Available",
      expirationDate: "2099-12-31T23:59:59Z",
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
  ];

  const orders: Order[] = [
    {
      id: "ord_1001",
      orderNumber: "PB-88421",
      customerId: "usr_cust_1",
      customerName: "Sophia Martinez",
      customerEmail: "sophia@example.com",
      customerPhone: "+1 (555) 234-8901",
      items: [
        {
          productId: "prod_1",
          name: "NeuroSaaS Autonomous Agent Studio",
          price: 249,
          quantity: 1,
          licenseKey: "PB-AI-9941-8824-XQ71",
          productType: "digital",
          image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80",
        },
        {
          productId: "prod_4",
          name: "Synthetix UI/UX Design System for Figma",
          price: 129,
          quantity: 1,
          licenseKey: "PB-UX-7722-1049-UX99",
          productType: "digital",
          image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=200&q=80",
        },
      ],
      subtotal: 378,
      discount: 37.8,
      couponCode: "WELCOME10",
      total: 340.2,
      paymentMethod: "Credit Card",
      paymentStatus: "Paid",
      status: "Completed",
      fulfillmentStatus: "Fulfilled",
      timeline: [
        { time: new Date(Date.now() - 86400000).toISOString(), note: "Order placed and payment authorized via Stripe" },
        { time: new Date(Date.now() - 86350000).toISOString(), note: "Digital license keys generated and bound to account" },
        { time: new Date(Date.now() - 86300000).toISOString(), note: "Download package links dispatched to sophia@example.com" },
      ],
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "ord_1002",
      orderNumber: "PB-88420",
      customerId: "usr_cust_2",
      customerName: "David Chen",
      customerEmail: "david.chen@enterprise.io",
      customerPhone: "+1 (555) 872-9102",
      items: [
        {
          productId: "prod_2",
          name: "Vaultly Cloud Security & Key Manager",
          price: 189,
          quantity: 1,
          licenseKey: "PB-SEC-8812-7741-VK99",
          productType: "digital",
          image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=200&q=80",
        },
      ],
      subtotal: 189,
      discount: 0,
      total: 189,
      paymentMethod: "Stripe",
      paymentStatus: "Paid",
      status: "Completed",
      fulfillmentStatus: "Fulfilled",
      timeline: [
        { time: new Date(Date.now() - 86400000 * 3).toISOString(), note: "Payment completed successfully" },
        { time: new Date(Date.now() - 86400000 * 3 + 120000).toISOString(), note: "Enterprise license assigned" },
      ],
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
  ];

  const customers: Customer[] = [
    {
      id: "usr_cust_1",
      name: "Sophia Martinez",
      email: "sophia@example.com",
      phone: "+1 (555) 234-8901",
      totalSpent: 340.2,
      ordersCount: 1,
      subscriptionsCount: 1,
      status: "Active",
      createdDate: new Date(Date.now() - 86400000 * 30).toISOString(),
      address: "742 Evergreen Terrace, Austin, TX 78701",
    },
    {
      id: "usr_cust_2",
      name: "David Chen",
      email: "david.chen@enterprise.io",
      phone: "+1 (555) 872-9102",
      totalSpent: 189.0,
      ordersCount: 1,
      subscriptionsCount: 0,
      status: "Active",
      createdDate: new Date(Date.now() - 86400000 * 15).toISOString(),
      address: "100 Tech Boulevard, San Francisco, CA 94107",
    },
  ];

  const subscriptions: Subscription[] = [
    {
      id: "sub_1",
      subscriptionNumber: "SUB-8942",
      customerId: "usr_cust_1",
      customerName: "Sophia Martinez",
      customerEmail: "sophia@example.com",
      productId: "prod_3",
      productName: "OmniFlow Cloud Infrastructure Subscription",
      planPeriod: "1 Month",
      amount: 79,
      status: "Active",
      nextBillingDate: new Date(Date.now() + 86400000 * 20).toISOString(),
      startDate: new Date(Date.now() - 86400000 * 10).toISOString(),
      autoRenew: true,
    },
    {
      id: "sub_2",
      subscriptionNumber: "SUB-8930",
      customerId: "usr_cust_2",
      customerName: "David Chen",
      customerEmail: "david.chen@enterprise.io",
      productId: "prod_5",
      productName: "KubePulse Real-time Monitoring Station",
      planPeriod: "1 Month",
      amount: 49,
      status: "Active",
      nextBillingDate: new Date(Date.now() + 86400000 * 12).toISOString(),
      startDate: new Date(Date.now() - 86400000 * 18).toISOString(),
      autoRenew: true,
    },
  ];

  const coupons: Coupon[] = [
    {
      id: "coup_1",
      code: "WELCOME10",
      discountType: "percentage",
      discountValue: 10,
      minOrder: 50,
      usageLimit: 1000,
      usedCount: 84,
      expirationDate: "2028-12-31",
      status: "active",
    },
    {
      id: "coup_2",
      code: "SPRING50",
      discountType: "percentage",
      discountValue: 50,
      minOrder: 100,
      maxDiscount: 200,
      usageLimit: 500,
      usedCount: 112,
      expirationDate: "2027-06-30",
      status: "active",
    },
    {
      id: "coup_3",
      code: "FIXED30",
      discountType: "fixed",
      discountValue: 30,
      minOrder: 150,
      usageLimit: 200,
      usedCount: 45,
      expirationDate: "2027-12-31",
      status: "active",
    },
  ];

  const pages: PageModel[] = [
    {
      id: "pg_home",
      title: "Storefront Home",
      slug: "home",
      seoTitle: "Premium Digital Products & Subscriptions Marketplace",
      seoDescription: "Discover high-performance SaaS tools, autonomous AI agents, developer kits, and security software with instant digital license key provisioning.",
      status: "published",
      template: "default",
      sections: [
        {
          id: "sec_hero",
          type: "hero",
          title: "Premium Digital Products & Subscriptions",
          subtitle: "Discover digital products, software, AI tools and subscription services in one premium marketplace.",
          content: "Explore 100% verified developer assets, automated deployment scripts, and perpetual cloud licenses with instant provisioning.",
          settings: { button1Text: "Explore Products", button1Link: "#/shop", button2Text: "View Subscriptions", button2Link: "#/subscriptions" },
        },
        {
          id: "sec_categories",
          type: "category_grid",
          title: "Browse by Domain",
          subtitle: "Engineered solutions tailored for scale, security, and developer productivity.",
        },
        {
          id: "sec_featured",
          type: "product_grid",
          title: "Featured Enterprise Suites",
          subtitle: "Hand-curated software packages trusted by over 45,000 engineering teams.",
        },
        {
          id: "sec_subscriptions",
          type: "pricing_matrix",
          title: "Flexible Subscription Tiers",
          subtitle: "Continuous cloud scale passes with guaranteed SLAs and zero lock-in contracts.",
        },
        {
          id: "sec_faq",
          type: "faq",
          title: "Frequently Asked Questions",
        },
      ],
      lastSaved: new Date().toISOString(),
      lastPublished: new Date().toISOString(),
      publishedBy: "Admin Director",
      version: 1,
    },
    {
      id: "pg_shop",
      title: "Product Catalog",
      slug: "shop",
      seoTitle: "Catalog — All Software & Digital Products",
      seoDescription: "Browse all digital licenses, developer software, AI models, and subscriptions.",
      status: "published",
      template: "shop",
      sections: [],
      lastSaved: new Date().toISOString(),
      lastPublished: new Date().toISOString(),
      publishedBy: "Admin Director",
      version: 1,
    },
    {
      id: "pg_about",
      title: "About Our Studio",
      slug: "about",
      seoTitle: "About PlayBeat Digital Cloud",
      seoDescription: "Pioneering sovereign digital products, subscription software, and enterprise developer tools.",
      status: "published",
      template: "content",
      sections: [],
      lastSaved: new Date().toISOString(),
      lastPublished: new Date().toISOString(),
      publishedBy: "Admin Director",
      version: 1,
    },
    {
      id: "pg_contact",
      title: "Contact & Support",
      slug: "contact",
      seoTitle: "Contact PlayBeat Digital Support",
      seoDescription: "Get 24/7 technical and license assistance from our engineering staff.",
      status: "published",
      template: "contact",
      sections: [],
      lastSaved: new Date().toISOString(),
      lastPublished: new Date().toISOString(),
      publishedBy: "Admin Director",
      version: 1,
    },
  ];

  return {
    users,
    products,
    categories,
    orders,
    customers,
    subscriptions,
    licenses,
    coupons,
    pages,
    theme: initialTheme,
    themeDraft: JSON.parse(JSON.stringify(initialTheme)),
    themeRevisions: [
      {
        version: 1,
        date: new Date().toISOString(),
        user: "Admin Director",
        theme: JSON.parse(JSON.stringify(initialTheme)),
      },
    ],
    marketing: {
      banners: [
        {
          id: "ban_1",
          title: "Spring Release Discount",
          text: "Get 50% Off Lifetime AI Tool Licenses with promo code SPRING50",
          active: true,
          type: "top_bar",
        },
        {
          id: "ban_2",
          title: "New Omniflow Cluster Version",
          text: "Version 4.2 now live with zero-trust network isolation.",
          active: true,
          type: "sidebar",
        },
      ],
      abandonedCarts: [
        {
          id: "ac_1",
          email: "marcus.k@fintechlabs.co",
          itemsCount: 2,
          total: 448,
          date: new Date(Date.now() - 3600000 * 4).toISOString(),
        },
        {
          id: "ac_2",
          email: "elena.v@cloudscale.net",
          itemsCount: 1,
          total: 189,
          date: new Date(Date.now() - 3600000 * 18).toISOString(),
        },
      ],
    },
    seo: {
      metaTitle: "PlayBeat Cloud — Premium Digital Products & Subscriptions",
      metaDescription: "Enterprise marketplace for AI tools, autonomous developer engines, and digital licenses.",
      canonicalUrl: "https://playbeat.digital",
      robots: "index, follow",
    },
    auditLogs: [
      {
        id: "log_1",
        user: "Admin Director",
        action: "Initial Seed",
        target: "Database",
        ip: "127.0.0.1",
        timestamp: new Date().toISOString(),
        details: "Database initialized with production models and initial schema.",
      },
    ],
  };
}

export function loadDatabase(): DatabaseSchema {
  if (dbCache) return dbCache;
  ensureDir(DATA_DIR);

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      dbCache = JSON.parse(raw);
      return dbCache!;
    } catch (e) {
      console.error("Error reading database file, reinitializing...", e);
    }
  }

  const initial = getInitialData();
  saveDatabase(initial);
  return initial;
}

export function saveDatabase(data: DatabaseSchema): void {
  ensureDir(DATA_DIR);
  dbCache = data;
  const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tempFile, DB_FILE);
}

export function logAudit(user: string, action: string, target: string, ip: string = "127.0.0.1", details?: string) {
  const db = loadDatabase();
  const log = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    user,
    action,
    target,
    ip,
    timestamp: new Date().toISOString(),
    details,
  };
  db.auditLogs.unshift(log);
  if (db.auditLogs.length > 500) db.auditLogs.pop();
  saveDatabase(db);
}
