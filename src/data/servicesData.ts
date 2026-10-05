export interface Service {
  t: string; // Title
  c: string; // Category code
  d: string; // Mockup code
  p: number; // Starting price in PKR
  pUSD: number; // Starting price in USD
  dl: string; // Delivery time
  slug: string;
  on: boolean;
  del?: boolean;
  g: string; // Solution group
  m: string; // Mockup type
  rating?: number;
  ordersCount?: number;
  tags?: string[];
  badge?: string;
  agency?: string;
  popular?: boolean;
}

export interface SolutionGroup {
  name: string;
  c1: string;
  c2: string;
  icon: string;
  description: string;
  gradientClass?: string;
}

export const GR: Record<string, SolutionGroup> = {
  web: {
    name: "Websites",
    c1: "#3B82F6",
    c2: "#22D3EE",
    icon: "globe",
    description: "Corporate sites, landing pages and redesigns that turn visits into high-value enquiries.",
  },
  saas: {
    name: "SaaS & Web Apps",
    c1: "#7C3AED",
    c2: "#3B82F6",
    icon: "layers",
    description: "Subscription platforms, analytics dashboards and scalable cloud architectures.",
  },
  mob: {
    name: "Mobile Apps",
    c1: "#EC4899",
    c2: "#A855F7",
    icon: "phone",
    description: "iOS and Android apps, from research and design to production store release.",
  },
  ai: {
    name: "AI & Agents",
    c1: "#A855F7",
    c2: "#22D3EE",
    icon: "spark",
    description: "Autonomous reasoning agents, prompt studios, and conversational AI interfaces.",
  },
  eco: {
    name: "Ecommerce",
    c1: "#FF7A18",
    c2: "#EC4899",
    icon: "bag",
    description: "High-converting online stores, Shopify custom themes, and frictionless checkout funnels.",
  },
  fin: {
    name: "Fintech",
    c1: "#22D3EE",
    c2: "#10B981",
    icon: "card",
    description: "Digital banking, crypto wallets, and financial dashboards that command security.",
  },
  hlth: {
    name: "Healthcare",
    c1: "#3B82F6",
    c2: "#2DD4BF",
    icon: "pulse",
    description: "Patient portals, HIPAA-conscious medical scheduling, and clinical reporting tools.",
  },
  edu: {
    name: "Education",
    c1: "#7C3AED",
    c2: "#EC4899",
    icon: "cap",
    description: "LMS systems, student portals, online courses, and academic gradebook automation.",
  },
  log: {
    name: "Logistics",
    c1: "#FF7A18",
    c2: "#FBBF24",
    icon: "truck",
    description: "Fleet tracking, real-time shipment monitoring, and global freight portals.",
  },
  brand: {
    name: "Branding",
    c1: "#EC4899",
    c2: "#FF7A18",
    icon: "pen",
    description: "Full brand identities, logo marks, design guidelines, and investor pitch decks.",
  },
  ent: {
    name: "Enterprise",
    c1: "#4F46E5",
    c2: "#3B82F6",
    icon: "building",
    description: "Internal CRM, role-based workflows, audit logs, and mission-critical software.",
  },
  ux: {
    name: "UI/UX",
    c1: "#A855F7",
    c2: "#EC4899",
    icon: "frame",
    description: "User research, wireframing, clickable interactive prototypes, and design systems.",
  },
  ill: {
    name: "Illustration",
    c1: "#FBBF24",
    c2: "#EC4899",
    icon: "image",
    description: "Custom vector artwork, character design, and 3D isometric scenes with commercial rights.",
  },
};

export const CAT: Record<string, string> = {
  web: "Websites",
  app: "Web Applications",
  saas: "SaaS",
  mob: "Mobile Apps",
  ai: "AI & Agents",
  eco: "Ecommerce",
  shp: "Shopify",
  wf: "Webflow",
  fr: "Framer",
  dash: "Dashboards",
  ux: "UI/UX",
  brand: "Branding",
  logo: "Logo Design",
  ill: "Illustration",
  ent: "Enterprise Solutions",
};

export const TECH: Record<string, string> = {
  web: "React, Next.js, Node.js, Tailwind",
  app: "React, Node.js, Express, Postgres",
  saas: "React, TypeScript, Stripe, Auth",
  mob: "React Native, Expo, iOS, Android",
  ai: "Gemini API, LangChain, Vector DB",
  eco: "Shopify Liquid, Stripe, Headless",
  shp: "Shopify Plus, Liquid, JavaScript",
  wf: "Webflow CMS, Custom JS, SEO",
  fr: "Framer Motion, Responsive Layouts",
  dash: "React, Chart.js, Tremor, Tailwind",
  ux: "Figma, Design Tokens, Prototyping",
  brand: "Adobe Illustrator, Figma Guidelines",
  logo: "Vector SVG, Typography System",
  ill: "Procreate, Vector Illustration",
  ent: "Node.js, Postgres, Docker, Cloud",
};

export const FEAT: Record<string, string[]> = {
  web: ["Custom UI/UX", "Ultra-responsive layout", "Headless CMS", "SEO foundations", "Contact funnels", "Analytics", "Admin panel", "Performance tuning"],
  app: ["Role-based access", "Custom UI/UX", "REST/GraphQL API", "Admin portal", "Secure auth", "PDF reporting"],
  saas: ["Subscription billing", "User analytics", "Multi-tenant roles", "API gateway", "Admin dashboard", "Scalable cloud"],
  mob: ["iOS & Android native", "Custom gesture UI", "Push notifications", "Offline caching", "Store submission support"],
  ai: ["LLM integration", "Streaming response", "Agent tools", "Fine-tuned prompts", "Knowledge base grounding"],
  eco: ["Product catalog", "Dynamic cart", "Stripe & PKR gateways", "Admin orders", "Inventory tracking"],
  shp: ["Custom theme build", "Product catalog setup", "Checkout optimization", "Speed tuning", "Custom apps"],
  wf: ["Tailored animations", "CMS collections", "Microinteractions", "SEO metadata", "Handoff documentation"],
  fr: ["Fluid spring animations", "Responsive breakpoints", "CMS blog/portfolio", "Zero-config hosting"],
  dash: ["Real-time KPI widgets", "Data tables with filters", "Export CSV/PDF", "Light/Dark mode", "Role permissions"],
  ux: ["User interviews", "Wireframes", "Interactive prototype", "Design system", "Developer handoff"],
  brand: ["Primary & secondary marks", "Color palette", "Type scale", "Stationery", "Social launch kit"],
  logo: ["3 distinct concepts", "Scalable vector SVG", "Light/Dark versions", "Favicon & app icons", "Usage rules"],
  ill: ["Handcrafted vector art", "High-res PNG & SVG", "Full commercial license", "Custom color styling"],
  ent: ["Microservices architecture", "SSO/SAML auth", "Audit trails", "Webhooks & integrations", "Enterprise SLA"],
};

export const DESC: Record<string, string> = {
  web: "Strategy, editorial layout, and technical build for a website that establishes instant authority and turns visits into conversions.",
  app: "A bespoke web application with role permissions, secure session handling, and real-time workflows your team uses daily.",
  saas: "Turnkey software-as-a-service with tiered subscription billing, analytics, and infrastructure engineered for hyper-growth.",
  mob: "A fluid, tactile mobile experience for iOS and Android, polished down to micro-gestures and haptic feedback.",
  ai: "Autonomous AI agents, conversational prompts, and automated reasoning tools designed to handle complex business logic.",
  eco: "High-ticket e-commerce store with optimized cart funnels, multi-currency support, and instant payment clearing.",
  shp: "Custom Shopify store designed to maximize average order value, page speed, and repeat purchase loyalty.",
  wf: "A cinematic Webflow site that your marketing team can update, edit, and expand without touching a single line of code.",
  fr: "Lightning-fast Framer website with smooth kinetic animations and interactive states, ready for immediate launch.",
  dash: "Information-dense data architecture turned into clean, scannable KPIs, real-time chart widgets, and filtered tables.",
  ux: "Research-driven product design from wireframes to clickable prototypes that eliminate user friction.",
  brand: "Comprehensive visual identity that defines your brand's presence across digital products, pitch decks, and campaigns.",
  logo: "A memorable brand emblem and bespoke wordmark that stands out across billboards, mobile app headers, and favicons.",
  ill: "Original character, vector, and isometric artwork crafted to give your digital products an unmistakable personality.",
  ent: "Enterprise software with rigorous security compliance, role matrices, audit logging, and legacy system bridges.",
};

export const SD: Record<string, string> = {
  "Website Design + Development": "Complete corporate web experience designed and built end-to-end with CMS, SEO, and lightning performance.",
  "Website Design": "Page designs for your full site with responsive breakpoints and design tokens ready for development.",
  "6 Digital Concept Sketches": "Rapid exploration of 6 distinct visual directions and interactive layout concepts for your new brand or product.",
  "Product Design (Web, Mobile, AI Agents)": "Complete flagship product design including web platform, native mobile app flows, and autonomous AI interface.",
  "High Converting Landing Page Design": "Laser-focused landing page layout engineered specifically around your primary value proposition and call to action.",
  "Human Crafted UI For AI Backed Mobile App": "Tactile mobile interface with streaming prompts, conversational cards, and fluid generative feedback states.",
  "AI Mobile App UX/UI Design": "Native iOS & Android interface designed specifically for generative workflows, voice, and AI assistants.",
  "AI Dashboard UX/UI Product Design": "Autonomous agent orchestration workspace with prompt tuning, real-time logs, and token cost analytics.",
  "SaaS Based Site Design & Development": "Full marketing site and conversion funnel for modern software products, with pricing tiers and interactive previews.",
  "SaaS Product Development": "Production-ready SaaS architecture with automated billing, subscriptions, team seats, and developer APIs.",
  "Dashboard Design Concept": "High-density enterprise analytics screen with KPI counters, revenue line charts, and status indicators.",
  "Shopify Website Design & Development": "Custom Shopify store built for high conversion, fast checkout, inventory sync, and multi-currency sales.",
  "Logo & Brand Creation Service": "Bespoke brand emblem, typography system, color tokens, and usage guidelines packaged for immediate rollout.",
  "Logo Design": "Three bespoke mark concepts refined into one distinctive vector asset with full commercial ownership.",
  "Fintech Website Design And Development": "Institutional-grade finance site designed to instill instant credibility, compliance clarity, and trust.",
  "Fintech Dashboard UX/UI Product Design": "Multi-currency digital wallet, ledger transactions, card issuance, and investment analytics.",
  "Healthcare Dashboard UX/UI Product Design": "Clinical EHR portal, patient appointment queues, telehealth streams, and diagnostic telemetry.",
  "Supply Chain & Logistics Website": "Real-time vessel & shipment tracking portal with interactive route maps and automated customs quotes.",
  "Custom Vector Illustration Hand Drawn": "Original hand-drawn vector artwork with custom color sweeps for editorial features and hero sections.",
  "Exclusive Illustration Package": "Suite of custom isometric and narrative illustrations crafted to elevate product storytelling.",
  "Webflow Website Development": "Pixel-perfect Webflow implementation with rich CMS collections, responsive states, and handover training.",
  "Framer Website Development": "High-velocity Framer site featuring silky-smooth scroll choreography and dynamic interactive components.",
  "Wireframing & UI Prototyping": "Interactive clickable prototype to validate product assumptions with target users and angel investors.",
  "Website/App UX Design Audit": "Deep diagnostic analysis of your product's user friction points, drop-off rates, and UI heuristics.",
  "School & College Web Application": "Unified student information system, online tuition payments, course rosters, and automated grading.",
  "Corporate Website": "Multi-page enterprise showcase with solutions, leadership, case studies, and corporate governance portals.",
  "Mobile App Development": "Cross-platform React Native app with native performance, push notifications, and app store approval support.",
  "Ecommerce Website": "Custom digital storefront with secure credit card and local payment gateways, cart recovery, and coupon engines.",
};

// Complete Service Catalog populated with real pricing matching Dribbble marketplace
export const RAW_SERVICES_DATA: Array<{
  t: string;
  c: string;
  d: string;
  pUSD: number;
  pPKR: number;
  dl: string;
  popular?: boolean;
  badge?: string;
  agency?: string;
}> = [
  { t: "Website Design + Development", c: "web", d: "site", pUSD: 10000, pPKR: 2800000, dl: "14–21 days", popular: true, badge: "MOST POPULAR", agency: "PlayBeat Studio" },
  { t: "6 Digital Concept Sketches", c: "brand", d: "brand", pUSD: 1200, pPKR: 336000, dl: "4–6 days", popular: true, badge: "FEATURED", agency: "PlayBeat Design" },
  { t: "Website UI Concepts > Guaranteed Quality", c: "ux", d: "site", pUSD: 2000, pPKR: 560000, dl: "7–10 days", agency: "PlayBeat Studio" },
  { t: "Custom Vector Illustration Hand Drawn", c: "ill", d: "brand", pUSD: 150, pPKR: 42000, dl: "3–5 days", badge: "FAST DELIVERY", agency: "PlayBeat Art" },
  { t: "High Converting Landing Page Design", c: "web", d: "site", pUSD: 2500, pPKR: 700000, dl: "5–7 days", popular: true, badge: "HIGH ROI", agency: "PlayBeat Studio" },
  { t: "Human Crafted UI For AI Backed Mobile App", c: "ai", d: "mob", pUSD: 2280, pPKR: 638000, dl: "7–10 days", popular: true, badge: "AI SPECIALIST", agency: "PlayBeat AI Lab" },
  { t: "Product Design (Web, Mobile, AI Agents)", c: "ux", d: "saas", pUSD: 12000, pPKR: 3360000, dl: "30–45 days", popular: true, badge: "ENTERPRISE", agency: "PlayBeat Studio" },
  { t: "Web Application Design (72h Delivery)", c: "app", d: "saas", pUSD: 1299, pPKR: 364000, dl: "72h Delivery", badge: "72H EXPRESS", agency: "PlayBeat Speed" },
  { t: "Web UI UX Design", c: "ux", d: "saas", pUSD: 2000, pPKR: 560000, dl: "7–10 days", agency: "PlayBeat Studio" },
  { t: "App Design + Development", c: "mob", d: "mob", pUSD: 15000, pPKR: 4200000, dl: "45–60 days", popular: true, badge: "FLAGSHIP", agency: "PlayBeat Mobile" },
  { t: "Landing Page Design", c: "web", d: "site", pUSD: 2500, pPKR: 700000, dl: "5–7 days", agency: "PlayBeat Studio" },
  { t: "Webflow Development", c: "wf", d: "site", pUSD: 8000, pPKR: 2240000, dl: "14–21 days", agency: "PlayBeat Webflow" },
  { t: "Web Design & Art Direction", c: "web", d: "site", pUSD: 5000, pPKR: 1400000, dl: "10–14 days", agency: "PlayBeat Creative" },
  { t: "SaaS Based Site Design & Development", c: "saas", d: "site", pUSD: 884, pPKR: 247500, dl: "7–10 days", popular: true, badge: "BEST VALUE", agency: "PlayBeat SaaS" },
  { t: "Dashboard Design Concept", c: "dash", d: "saas", pUSD: 3000, pPKR: 840000, dl: "7–10 days", popular: true, agency: "PlayBeat Studio" },
  { t: "Mobile App UI UX Design Concepts", c: "mob", d: "mob", pUSD: 2000, pPKR: 560000, dl: "7–10 days", agency: "PlayBeat Mobile" },
  { t: "Logo & Brand Creation Service", c: "logo", d: "brand", pUSD: 700, pPKR: 196000, dl: "5–7 days", popular: true, badge: "VERIFIED", agency: "PlayBeat Identity" },
  { t: "Exclusive Illustration Package", c: "ill", d: "brand", pUSD: 1600, pPKR: 448000, dl: "7–10 days", agency: "PlayBeat Art" },
  { t: "UX/UI Audit", c: "ux", d: "saas", pUSD: 2500, pPKR: 700000, dl: "4–6 days", badge: "AUDIT REPORT", agency: "PlayBeat Research" },
  { t: "Shopify Website Design & Development", c: "shp", d: "store", pUSD: 7000, pPKR: 1960000, dl: "14–21 days", popular: true, badge: "ECOMMERCE", agency: "PlayBeat Commerce" },
  { t: "Logo Design", c: "logo", d: "brand", pUSD: 149, pPKR: 41700, dl: "3–5 days", badge: "POPULAR", agency: "PlayBeat Identity" },
  { t: "Website/App UX Design Audit", c: "ux", d: "saas", pUSD: 1000, pPKR: 280000, dl: "4–6 days", agency: "PlayBeat Research" },
  { t: "Custom Vector Illustrations Scene", c: "ill", d: "brand", pUSD: 500, pPKR: 140000, dl: "5–7 days", agency: "PlayBeat Art" },
  { t: "Corporate Website", c: "web", d: "site", pUSD: 6500, pPKR: 1820000, dl: "21–30 days", popular: true, agency: "PlayBeat Studio" },
  { t: "Product Design", c: "ux", d: "saas", pUSD: 10000, pPKR: 2800000, dl: "30–45 days", agency: "PlayBeat Studio" },
  { t: "Mobile App UI UX Design (5 Screens)", c: "mob", d: "mob", pUSD: 2500, pPKR: 700000, dl: "7–10 days", agency: "PlayBeat Mobile" },
  { t: "Character Design", c: "ill", d: "brand", pUSD: 3000, pPKR: 840000, dl: "10–14 days", agency: "PlayBeat Art" },
  { t: "Brand Identity Creation", c: "brand", d: "brand", pUSD: 5000, pPKR: 1400000, dl: "14–21 days", popular: true, badge: "BRANDING", agency: "PlayBeat Identity" },
  { t: "Ecommerce Design", c: "eco", d: "store", pUSD: 5000, pPKR: 1400000, dl: "14–21 days", agency: "PlayBeat Commerce" },
  { t: "Custom Icon Design", c: "ill", d: "brand", pUSD: 60, pPKR: 16800, dl: "2–3 days", agency: "PlayBeat Art" },
  { t: "Pitch Decks And Slides Design", c: "brand", d: "brand", pUSD: 500, pPKR: 140000, dl: "4–6 days", badge: "INVESTOR DECK", agency: "PlayBeat Strategy" },
  { t: "Mobile App Development", c: "mob", d: "mob", pUSD: 5000, pPKR: 1400000, dl: "30–45 days", popular: true, agency: "PlayBeat Mobile" },
  { t: "School & College Web Application", c: "app", d: "edu", pUSD: 992, pPKR: 277700, dl: "30–45 days", badge: "EDTECH", agency: "PlayBeat Ed" },
  { t: "Webflow Website Design & Development", c: "wf", d: "site", pUSD: 3490, pPKR: 977200, dl: "14–21 days", agency: "PlayBeat Webflow" },
  { t: "Supply Chain & Logistics Website", c: "web", d: "log", pUSD: 8000, pPKR: 2240000, dl: "21–30 days", badge: "ENTERPRISE", agency: "PlayBeat Logistics" },
  { t: "Fintech Website Design And Development", c: "web", d: "fin", pUSD: 25000, pPKR: 7000000, dl: "45–60 days", popular: true, badge: "HIGH-END FINTECH", agency: "PlayBeat Fintech" },
  { t: "Shopify Website Design And Development", c: "shp", d: "store", pUSD: 1450, pPKR: 406000, dl: "10–14 days", agency: "PlayBeat Commerce" },
  { t: "Dashboard Design | SaaS UI UX Design", c: "dash", d: "saas", pUSD: 1200, pPKR: 336000, dl: "7–10 days", agency: "PlayBeat Studio" },
  { t: "Website UI Design | Website Redesign", c: "web", d: "site", pUSD: 4000, pPKR: 1120000, dl: "14–21 days", agency: "PlayBeat Studio" },
  { t: "E Commerce Site Design & Development", c: "eco", d: "store", pUSD: 730, pPKR: 204400, dl: "14–21 days", badge: "BUDGET STORE", agency: "PlayBeat Commerce" },
  { t: "Starter Branding Package", c: "brand", d: "brand", pUSD: 12000, pPKR: 3360000, dl: "21–30 days", agency: "PlayBeat Identity" },
  { t: "Fintech Dashboard UX/UI Product Design", c: "dash", d: "fin", pUSD: 9000, pPKR: 2520000, dl: "21–30 days", popular: true, badge: "FINTECH", agency: "PlayBeat Fintech" },
  { t: "AI Dashboard UX/UI Product Design", c: "dash", d: "ai", pUSD: 9000, pPKR: 2520000, dl: "21–30 days", popular: true, badge: "AI LAB", agency: "PlayBeat AI Lab" },
  { t: "AI Mobile App UX/UI Design", c: "mob", d: "ai", pUSD: 6000, pPKR: 1680000, dl: "14–21 days", popular: true, badge: "AI MOBILE", agency: "PlayBeat Mobile" },
  { t: "Healthcare Dashboard UX/UI Product Design", c: "dash", d: "hlth", pUSD: 9000, pPKR: 2520000, dl: "21–30 days", badge: "MEDTECH", agency: "PlayBeat Health" },
  { t: "Wireframing & UI Prototyping", c: "ux", d: "site", pUSD: 300, pPKR: 84000, dl: "3–5 days", badge: "PROTOTYPE", agency: "PlayBeat Studio" },
  { t: "Framer Website Development", c: "fr", d: "site", pUSD: 2500, pPKR: 700000, dl: "10–14 days", agency: "PlayBeat Framer" },
  { t: "Enterprise Web Application", c: "ent", d: "crm", pUSD: 18000, pPKR: 5040000, dl: "60–90 days", badge: "MISSION CRITICAL", agency: "PlayBeat Enterprise" },
];

export const RAW_SERVICES: Service[] = RAW_SERVICES_DATA.map((item) => {
  const slug = item.t
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const sGroup = /\bAI\b/i.test(item.t)
    ? "ai"
    : /Fintech/i.test(item.t)
    ? "fin"
    : item.d === "hlth"
    ? "hlth"
    : item.d === "edu"
    ? "edu"
    : item.d === "log"
    ? "log"
    : item.c === "ent"
    ? "ent"
    : item.c === "ill"
    ? "ill"
    : item.c === "brand" || item.c === "logo"
    ? "brand"
    : item.c === "shp" || item.c === "eco"
    ? "eco"
    : item.c === "mob"
    ? "mob"
    : item.c === "ux"
    ? "ux"
    : item.c === "saas" || item.c === "app" || item.c === "dash"
    ? "saas"
    : "web";

  return {
    t: item.t,
    c: item.c,
    d: item.d,
    p: item.pPKR,
    pUSD: item.pUSD,
    dl: item.dl,
    slug,
    on: true,
    del: false,
    g: sGroup,
    m: item.c === "ill" ? "ill" : item.d,
    rating: 4.9 + (Math.floor(slug.length % 3) * 0.05),
    ordersCount: 14 + (slug.length * 3),
    tags: FEAT[item.c]?.slice(0, 3) || ["Custom UI", "Responsive", "Delivery Ready"],
    badge: item.badge,
    agency: item.agency || "PlayBeat Digital",
    popular: item.popular,
  };
});

export const FAQ = [
  ["How does pricing work (USD vs PKR)?", "We offer transparent flat-rate pricing. You can pay internationally via credit card, wire transfer, or locally in PKR via Nayapay, SadaPay, or direct bank transfer."],
  ["Can I test the live demos before placing an order?", "Yes! Explore our 12+ fully functional interactive live demos right in the browser. You can test workflows, responsiveness, and features before initiating your brief."],
  ["How fast is delivery?", "Typical turnarounds range from 72 hours for express packages to 2-3 weeks for comprehensive platforms. Fast-track expedited sprints are also available."],
  ["Do you provide full source code and ownership?", "Absolutely. Upon final milestone approval, you receive 100% intellectual property ownership, Git repository access, and production credentials."],
];

export const DEMOS: [string, string][] = [
  ["Corporate Website", "corporate-website"],
  ["SaaS Dashboard", "saas-dashboard-design"],
  ["Enterprise CRM", "enterprise-web-application"],
  ["Ecommerce Store", "ecommerce-website"],
  ["Mobile App", "mobile-app-development"],
  ["AI Workspace", "ai-dashboard-design"],
  ["Fintech Dashboard", "fintech-dashboard"],
  ["Healthcare Portal", "healthcare-dashboard"],
  ["Education Platform", "school-and-college-web-application"],
  ["Logistics Tracking", "supply-chain-and-logistics-website"],
  ["Brand Identity", "brand-identity"],
  ["Illustration Gallery", "illustration"],
];

export const INDS: [string, string, string, string][] = [
  ["Fintech", "fin", "card", "Wallets, trading ledgers and compliant banking apps"],
  ["Healthcare", "hlth", "pulse", "EHR portals, diagnostic views and patient schedules"],
  ["Education", "edu", "cap", "LMS portals, tuition billing and student gradebooks"],
  ["Real Estate", "web", "building", "High-velocity property portals and virtual tours"],
  ["Hospitality", "mob", "spark", "Guest booking engines and luxury resort concierge"],
  ["Retail & Commerce", "eco", "bag", "Direct-to-consumer catalogs and omnichannel stores"],
  ["Logistics & Freight", "log", "truck", "Live vessel telemetry and customs workflow portals"],
  ["Professional Services", "brand", "pen", "Authority advisory platforms and global brand marks"],
  ["Enterprise Tech", "ent", "shield", "Mission-critical internal tooling and RBAC workflows"],
  ["AI & Autonomous", "ai", "code", "Agent reasoning workbenches and conversational engines"],
];

export const ADD: [string, string, number, string][] = [
  ["Ecommerce module", "Catalogue, cart and payment gateway", 125000, "bag"],
  ["Admin dashboard", "Manage users, content and system logs", 100000, "grid"],
  ["Custom API integration", "Connect third-party enterprise webhooks", 80000, "code"],
  ["Mobile responsive design", "Zero-friction layouts across all devices", 0, "phone"],
  ["SEO foundations & indexing", "Technical meta, schemas and sitemaps", 0, "search"],
];

export const PKG: [string, string, number][] = [
  ["Starter", "Core production build, 2 revision rounds", 1],
  ["Professional", "Full integrations, 4 rounds, priority support", 1.8],
  ["Enterprise", "Full custom stack, dedicated architect, SLA", 3],
];

export const TL: [string, string, number][] = [
  ["Standard", "The timeline shown on the service", 1],
  ["Fast-track", "Priority delivery sprint, +20%", 1.2],
  ["Flexible", "No urgent deadline, 5% savings", 0.95],
];

export const formatPKR = (amount: number): string => {
  return "PKR " + Math.round(amount).toLocaleString("en-US");
};

export const formatUSD = (amountUSD: number): string => {
  return "$" + Math.round(amountUSD).toLocaleString("en-US");
};

export const formatCurrency = (pPKR: number, pUSD?: number, currency: "USD" | "PKR" = "USD"): string => {
  if (currency === "USD") {
    const usd = pUSD ?? Math.round(pPKR / 280);
    return formatUSD(usd);
  }
  return formatPKR(pPKR);
};

export const getServiceDesc = (s: Service): string => {
  return SD[s.t] || DESC[s.c] || "";
};

// Storage helper
export const getStoredServices = (): Service[] => {
  try {
    const raw = localStorage.getItem("pb_svc");
    if (!raw) return RAW_SERVICES;
    const st = JSON.parse(raw);
    return RAW_SERVICES.map((s) => ({
      ...s,
      ...(st[s.slug] || {}),
    })).filter((s) => !s.del);
  } catch {
    return RAW_SERVICES;
  }
};

export const saveServiceOverride = (slug: string, patch: Partial<Service>) => {
  try {
    const raw = localStorage.getItem("pb_svc") || "{}";
    const st = JSON.parse(raw);
    st[slug] = { ...(st[slug] || {}), ...patch };
    localStorage.setItem("pb_svc", JSON.stringify(st));
  } catch (e) {
    console.error("Failed to save service override", e);
  }
};
