import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Play,
  Check,
  ShieldCheck,
  Zap,
  Smartphone,
  Headphones,
  Code,
} from "lucide-react";
import {
  GR,
  DEMOS,
  INDS,
  RAW_SERVICES,
  formatPKR,
  getStoredServices,
} from "../data/servicesData";
import { MockPreview } from "../components/MockPreview";
import { getDemoSrcDoc } from "../data/mockTemplates";

export const HomePage: React.FC = () => {
  const [activeTabSlug, setActiveTabSlug] = useState("corporate-website");
  const services = getStoredServices();

  const activeService =
    services.find((s) => s.slug === activeTabSlug) || services[0];

  const featuredConcepts = [
    { title: "AI Support Workspace", slug: "ai-dashboard-design" },
    { title: "Fintech Dashboard", slug: "fintech-dashboard" },
    { title: "Luxury Ecommerce Shop", slug: "ecommerce-website" },
    { title: "Healthcare CareSync", slug: "healthcare-dashboard" },
    { title: "Enterprise Pipeline CRM", slug: "enterprise-web-application" },
    { title: "EduCore Platform", slug: "school-and-college-web-application" },
  ];

  const steps = [
    {
      step: "01",
      title: "Discover",
      desc: "We map your business goals, target users, and constraints before any design begins.",
    },
    {
      step: "02",
      title: "Design",
      desc: "Wireframes evolve into clickable, tactile prototypes your team can test directly.",
    },
    {
      step: "03",
      title: "Build",
      desc: "Experienced engineers build in weekly milestones with continuous preview access.",
    },
    {
      step: "04",
      title: "Test",
      desc: "Every interaction is tested for multi-device responsiveness, speed, and security.",
    },
    {
      step: "05",
      title: "Launch",
      desc: "We deploy to production cloud architecture, hand over source code, and train your team.",
    },
    {
      step: "06",
      title: "Scale",
      desc: "Post-launch warranty and continuous maintenance retainers keep your product growing.",
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-36 pb-24 bg-gradient-to-b from-[#081226] via-[#050816] to-[#050816] rounded-b-[40px] border-b border-white/10">
        <div className="wrap grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md text-xs font-semibold text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Web • Mobile • SaaS • AI • Brand
            </div>

            <h1 className="h-xl text-white">
              Build digital <span className="gt">experiences</span> people remember.
            </h1>

            <p className="lead max-w-xl">
              Premium websites, mobile apps, SaaS platforms, ecommerce systems, and enterprise software — designed to perform and engineered to scale with working demos you test before committing.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="#/services"
                className="inline-flex items-center gap-2.5 h-13 px-6 rounded-2xl font-extrabold text-sm bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-400 text-white shadow-xl shadow-purple-600/30 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Explore solutions <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#/demos"
                className="inline-flex items-center gap-2.5 h-13 px-6 rounded-2xl font-bold text-sm bg-white/5 border border-white/15 hover:border-cyan-400 text-white backdrop-blur-lg hover:bg-white/10 transition-all"
              >
                <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                View live demos
              </a>
            </div>
          </div>

          {/* 3D Visual Mockup Layer */}
          <div className="lg:col-span-5 relative h-[420px] sm:h-[480px]">
            {/* Glowing Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 to-cyan-500/20 rounded-full blur-3xl" />

            {/* Dashboard Mock */}
            <div className="absolute top-6 left-0 sm:left-4 z-10 transition-transform duration-500 hover:scale-105">
              <MockPreview type="saas" />
            </div>

            {/* Floating Mobile Phone Mock */}
            <div className="absolute bottom-2 right-2 sm:right-6 z-20 transition-transform duration-500 hover:scale-105">
              <MockPreview type="mob" />
            </div>

            {/* Floating KPI card */}
            <div className="absolute bottom-6 left-2 z-30 p-3.5 rounded-2xl bg-slate-900/90 border border-white/15 backdrop-blur-xl shadow-2xl">
              <span className="text-[11px] font-semibold text-slate-400 block">Conversion Rate</span>
              <span className="text-xl font-extrabold text-cyan-300">4.8%</span>
              <div className="w-32 h-6 mt-1">
                <svg viewBox="0 0 100 24" className="w-full h-full stroke-cyan-400 stroke-2 fill-none">
                  <path d="M0 20C15 18 20 8 35 12S60 22 75 10 90 4 100 2" />
                </svg>
              </div>
            </div>

            {/* 150+ Badge */}
            <div className="absolute -top-2 right-4 z-30 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-extrabold text-xs shadow-lg">
              150+ Digital Systems
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar & Statistics */}
      <section className="wrap">
        <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-white/10 text-slate-300 text-sm font-semibold">
          <span className="flex items-center gap-2">
            <Code className="w-4 h-4 text-cyan-400" /> Custom Architecture
          </span>
          <span className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-cyan-400" /> Responsive Design
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> Secure Engineering
          </span>
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" /> Ultra-Fast Delivery
          </span>
          <span className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-cyan-400" /> Dedicated Post-Launch Support
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16">
          <div className="space-y-1">
            <div className="text-5xl lg:text-6xl font-extrabold gt">13</div>
            <div className="text-sm font-semibold text-slate-400">Solution Categories</div>
          </div>
          <div className="space-y-1">
            <div className="text-5xl lg:text-6xl font-extrabold gt-energy">50+</div>
            <div className="text-sm font-semibold text-slate-400">Service Options</div>
          </div>
          <div className="space-y-1">
            <div className="text-5xl lg:text-6xl font-extrabold gt">12</div>
            <div className="text-sm font-semibold text-slate-400">Interactive Live Demos</div>
          </div>
          <div className="space-y-1">
            <div className="text-5xl lg:text-6xl font-extrabold gt-energy">100%</div>
            <div className="text-sm font-semibold text-slate-400">Fully Customizable</div>
          </div>
        </div>
      </section>

      {/* Solution Categories Grid */}
      <section id="solutions" className="wrap space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="h-lg text-white">
              Your idea. <span className="gt">Engineered</span> for growth.
            </h2>
            <p className="lead mt-2">
              Pick the kind of digital product you need. Every category features priced services with testable live prototypes.
            </p>
          </div>
          <a
            href="#/services"
            className="inline-flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300"
          >
            All {services.length} services <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Object.entries(GR).map(([key, group], idx) => {
            const count = services.filter((s) => s.g === key).length;
            return (
              <a
                key={key}
                href={`#/services?g=${key}`}
                className="glow-card p-6 flex flex-col justify-between min-h-[260px] group"
                style={{ "--c1": group.c1, "--c2": group.c2 } as React.CSSProperties}
              >
                <div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6 shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${group.c1}, ${group.c2})`,
                    }}
                  >
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                    {group.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {group.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5 text-xs font-bold text-slate-400">
                  <span>{count} services</span>
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white group-hover:bg-white/10 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* 6-Stage Process */}
      <section id="process" className="wrap">
        <div className="card-paper p-8 lg:p-14 space-y-12">
          <div>
            <h2 className="h-lg text-white">From Idea to Launch</h2>
            <p className="lead mt-2">
              Six disciplined stages, one accountable studio. You inspect real, working software at each sprint.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {steps.map((st) => (
              <div key={st.step} className="space-y-3">
                <span className="text-sm font-extrabold text-purple-400">{st.step}</span>
                <h4 className="text-lg font-bold text-white">{st.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Interactive Demo Sandbox Preview */}
      <section id="live" className="wrap space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="h-lg text-white">Don’t Just Imagine It. Try It.</h2>
            <p className="lead mt-2">
              Click through working live examples of systems PlayBeat Digital builds for clients.
            </p>
          </div>
          <a
            href={`#/demo/${activeService.slug}`}
            className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition-colors"
          >
            Launch Full Screen <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Demo Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/10">
          {[
            ["Corporate Website", "corporate-website"],
            ["SaaS Dashboard", "saas-dashboard-design"],
            ["Mobile App", "mobile-app-development"],
            ["Ecommerce Store", "ecommerce-website"],
            ["Pipeline CRM", "enterprise-web-application"],
            ["AI Workspace", "ai-dashboard-design"],
            ["Fintech Dashboard", "fintech-dashboard"],
          ].map(([label, slug]) => (
            <button
              key={slug}
              onClick={() => setActiveTabSlug(slug)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                activeTabSlug === slug
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                  : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Demo Iframe Frame */}
        <div className="rounded-2xl border border-white/15 bg-slate-950 overflow-hidden shadow-2xl">
          <div className="h-10 px-4 bg-slate-900 border-b border-white/10 flex items-center gap-2 text-xs text-slate-400">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="mx-auto px-4 py-1 rounded bg-black/40 text-[11px] font-mono text-slate-400">
              demo.playbeat.digital/{activeService.slug}
            </span>
          </div>

          <div className="h-[520px] bg-white">
            <iframe
              srcDoc={getDemoSrcDoc(activeService)}
              title="Interactive Live Demo"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Featured Projects Grid */}
      <section id="work" className="wrap space-y-10">
        <div>
          <h2 className="h-lg text-white">
            See it. Test it. <span className="gt-energy">Then build it.</span>
          </h2>
          <p className="lead mt-2">
            Six working demo concepts ready to test. Each serves as a battle-tested baseline customized for your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredConcepts.map((item, idx) => {
            const svc = services.find((s) => s.slug === item.slug) || services[0];
            return (
              <div
                key={idx}
                className="glow-card overflow-hidden flex flex-col group"
                style={{ "--c1": GR[svc.g]?.c1, "--c2": GR[svc.g]?.c2 } as React.CSSProperties}
              >
                <div className="h-56 bg-slate-900/60 p-4 flex items-center justify-center relative overflow-hidden">
                  <MockPreview type={svc.m} className="scale-95 group-hover:scale-100 transition-transform" />
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <a
                      href={`#/demo/${svc.slug}`}
                      className="px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs"
                    >
                      Test Demo
                    </a>
                    <a
                      href={`#/services/${svc.slug}`}
                      className="px-4 py-2 rounded-xl bg-white/20 text-white font-bold text-xs border border-white/30"
                    >
                      View Service
                    </a>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {GR[svc.g]?.name} baseline · Starting from {formatPKR(svc.p)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="wrap space-y-8">
        <div>
          <h2 className="h-lg text-white">We Build Systems, Not Just Screens</h2>
          <p className="lead mt-2">
            Ten specific industries we engineer systems for. Select your domain to view relevant services.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {INDS.map(([name, gKey, , desc], idx) => (
            <a
              key={idx}
              href={`#/services?g=${gKey}`}
              className="p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-cyan-400/50 hover:bg-white/10 transition-all flex flex-col justify-between min-h-[140px] group"
            >
              <Zap className="w-5 h-5 text-cyan-400 mb-2" />
              <div>
                <b className="block text-sm font-bold text-white group-hover:text-cyan-300">
                  {name}
                </b>
                <span className="block text-[11px] text-slate-400 mt-1 leading-tight">
                  {desc}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Pricing Tiers */}
      <section id="pricing" className="wrap">
        <div className="card-paper p-8 lg:p-14 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="h-lg text-white">Straightforward Engagement Models</h2>
            <p className="lead">
              Every service includes its own transparent baseline price. Use the interactive project builder to configure exact add-ons and timelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Starter */}
            <div className="glow-card p-8 flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Starter</h3>
                <p className="text-xs text-slate-400 mt-1">Single focused deliverable</p>
                <div className="text-3xl font-extrabold text-white mt-4">{formatPKR(45000)}</div>
                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Core build & clean handover
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> 2 rounds of revisions
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> 14 days warranty support
                  </li>
                </ul>
              </div>
              <a
                href="#/build"
                className="w-full h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center transition-colors"
              >
                Configure in Builder
              </a>
            </div>

            {/* Professional (Popular) */}
            <div className="glow-card p-8 flex flex-col justify-between space-y-6 border-cyan-400/50 shadow-2xl shadow-cyan-500/10 relative">
              <span className="absolute -top-3.5 left-8 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-extrabold text-[10px] tracking-wider uppercase">
                Most Popular
              </span>
              <div>
                <h3 className="text-xl font-bold text-white">Professional</h3>
                <p className="text-xs text-slate-400 mt-1">Full-stack platform with admin</p>
                <div className="text-3xl font-extrabold gt mt-4">{formatPKR(225000)}</div>
                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Full site, store or web dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Integrations & custom admin portal
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> 4 rounds of revisions
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> 60 days priority support
                  </li>
                </ul>
              </div>
              <a
                href="#/build?s=corporate-website"
                className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-lg hover:brightness-110 transition-all"
              >
                Start This Project
              </a>
            </div>

            {/* Enterprise */}
            <div className="glow-card p-8 flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Enterprise</h3>
                <p className="text-xs text-slate-400 mt-1">Custom architecture & scale</p>
                <div className="text-3xl font-extrabold text-white mt-4">Custom Quote</div>
                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Full SaaS products & CRM platforms
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Custom database architecture & SSO
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Dedicated SLA support contract
                  </li>
                </ul>
              </div>
              <a
                href="#/build?s=enterprise-web-application"
                className="w-full h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center transition-colors"
              >
                Request Enterprise Scope
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="wrap text-center py-16">
        <div className="rounded-[36px] bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 border border-white/20 p-10 lg:p-20 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="h-xl text-white">
              Your next digital product starts here.
            </h2>
            <p className="lead text-slate-200">
              Configure what you want to build in our project builder to receive an instant price range, or message our engineering leads directly on WhatsApp.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a
                href="#/build"
                className="inline-flex items-center gap-2.5 h-13 px-8 rounded-2xl bg-white text-slate-950 font-extrabold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                Build your project <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/923199980011"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 h-13 px-8 rounded-2xl bg-emerald-500 text-slate-950 font-extrabold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
