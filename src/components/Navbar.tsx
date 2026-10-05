import React, { useState, useEffect } from "react";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  Layers,
  Sparkles,
  ShoppingBag,
  CreditCard,
  HeartPulse,
  Truck,
  Building2,
  Palette,
  ExternalLink,
} from "lucide-react";
import { GR, DEMOS } from "../data/servicesData";

interface NavbarProps {
  currentPath: string;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onOpenSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenus = () => {
    setIsMegaOpen(false);
    setIsMobileOpen(false);
  };

  const navLinks = [
    { label: "Solutions", href: "#/solutions", key: "solutions" },
    { label: "Demos", href: "#/demos", key: "demos" },
    { label: "Industries", href: "#/industries", key: "industries" },
    { label: "Pricing", href: "#/pricing", key: "pricing" },
    { label: "Company", href: "#/company", key: "company" },
    { label: "Socials", href: "#/links", key: "links", badge: "Bio" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 px-4 pt-3.5 transition-all duration-300 pointer-events-none`}
      >
        <div
          className={`max-w-7xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between rounded-2xl border transition-all duration-300 pointer-events-auto ${
            isScrolled
              ? "bg-[#060B1A]/90 border-white/15 shadow-2xl backdrop-blur-xl"
              : "bg-[#080E20]/65 border-white/10 backdrop-blur-md"
          }`}
        >
          {/* Logo */}
          <a
            href="#/"
            onClick={closeMenus}
            className="flex items-center gap-2.5 font-extrabold text-lg tracking-tight text-white group"
          >
            <div className="w-7.5 h-7.5 rounded-lg bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-white ml-0.5" />
            </div>
            <span>
              PlayBeat <span className="text-slate-400 font-semibold">Digital</span>
            </span>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-300">
            {/* Services with Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => setIsMegaOpen(true)}
              onMouseLeave={() => setIsMegaOpen(false)}
            >
              <button
                type="button"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors hover:text-white hover:bg-white/10 ${
                  currentPath.startsWith("services") ? "text-white bg-white/10" : ""
                }`}
                onClick={() => {
                  window.location.hash = "#/services";
                  closeMenus();
                }}
              >
                Services
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isMegaOpen ? "rotate-180 text-cyan-400" : ""
                  }`}
                />
              </button>

              {/* Mega Menu Dropdown */}
              {isMegaOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[720px] pointer-events-auto">
                  <div className="p-6 rounded-2xl bg-[#070C1C]/95 border border-white/15 backdrop-blur-2xl shadow-2xl grid grid-cols-3 gap-6 text-slate-200">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
                        Core Products
                      </h4>
                      <div className="space-y-1">
                        <a
                          href="#/services?g=web"
                          onClick={closeMenus}
                          className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
                        >
                          <Building2 className="w-4 h-4 text-cyan-400" />
                          Websites & Portals
                        </a>
                        <a
                          href="#/services?g=saas"
                          onClick={closeMenus}
                          className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
                        >
                          <Layers className="w-4 h-4 text-purple-400" />
                          SaaS & Web Apps
                        </a>
                        <a
                          href="#/services?g=mob"
                          onClick={closeMenus}
                          className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
                        >
                          <Sparkles className="w-4 h-4 text-pink-400" />
                          Mobile Applications
                        </a>
                        <a
                          href="#/services?g=ai"
                          onClick={closeMenus}
                          className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
                        >
                          <Sparkles className="w-4 h-4 text-cyan-400" />
                          AI Agents & Workspaces
                        </a>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
                        Commerce & Growth
                      </h4>
                      <div className="space-y-1">
                        <a
                          href="#/services?g=eco"
                          onClick={closeMenus}
                          className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
                        >
                          <ShoppingBag className="w-4 h-4 text-orange-400" />
                          Ecommerce & Stores
                        </a>
                        <a
                          href="#/services?g=fin"
                          onClick={closeMenus}
                          className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
                        >
                          <CreditCard className="w-4 h-4 text-emerald-400" />
                          Fintech & Payments
                        </a>
                        <a
                          href="#/services?g=brand"
                          onClick={closeMenus}
                          className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
                        >
                          <Palette className="w-4 h-4 text-pink-400" />
                          Brand & Logo Systems
                        </a>
                        <a
                          href="#/services?g=log"
                          onClick={closeMenus}
                          className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
                        >
                          <Truck className="w-4 h-4 text-amber-400" />
                          Logistics & Tracking
                        </a>
                      </div>
                    </div>

                    <div className="rounded-xl bg-gradient-to-br from-blue-600 via-purple-700 to-pink-600 p-4 flex flex-col justify-end text-white shadow-lg">
                      <span className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">
                        Interactive Demos
                      </span>
                      <h5 className="font-extrabold text-base leading-snug mb-2">
                        Try our {DEMOS.length} working live simulations
                      </h5>
                      <a
                        href="#/demos"
                        onClick={closeMenus}
                        className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-slate-900 px-3 py-1.5 rounded-lg w-max hover:bg-slate-100 transition-colors"
                      >
                        Explore Demos <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {navLinks.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors hover:text-white hover:bg-white/10 ${
                  currentPath === item.key ? "text-white bg-white/10" : ""
                }`}
              >
                {item.label}
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-cyan-400/20 text-cyan-300">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 h-10 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
              title="Search (Ctrl + K)"
            >
              <Search className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden md:inline px-1.5 py-0.5 rounded bg-white/10 text-[10px]">
                Ctrl K
              </kbd>
            </button>

            <a
              href="https://wa.me/923199980011?text=Hello%20PlayBeat%20Digital,%20I%20would%20like%20to%20discuss%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center justify-center h-10 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 hover:brightness-110 active:scale-95 transition-all"
            >
              Talk to us
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 bg-[#050816]/98 backdrop-blur-2xl flex flex-col p-6 pt-20 overflow-y-auto text-white">
          <button
            onClick={closeMenus}
            className="absolute top-5 right-5 w-11 h-11 rounded-xl border border-white/15 flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex flex-col gap-2 text-2xl font-bold divide-y divide-white/10">
            <a
              href="#/services"
              onClick={closeMenus}
              className="py-3 text-cyan-400 hover:text-white"
            >
              Services
            </a>
            <a href="#/solutions" onClick={closeMenus} className="py-3 hover:text-cyan-400">
              Solutions
            </a>
            <a href="#/demos" onClick={closeMenus} className="py-3 hover:text-cyan-400">
              Live Demos
            </a>
            <a href="#/industries" onClick={closeMenus} className="py-3 hover:text-cyan-400">
              Industries
            </a>
            <a href="#/pricing" onClick={closeMenus} className="py-3 hover:text-cyan-400">
              Pricing
            </a>
            <a href="#/company" onClick={closeMenus} className="py-3 hover:text-cyan-400">
              Company
            </a>
            <a
              href="#/links"
              onClick={closeMenus}
              className="py-3 text-pink-400 hover:text-white flex items-center justify-between"
            >
              Socials & Bio Links
              <span className="text-xs bg-pink-500/20 text-pink-300 px-2 py-1 rounded-full">
                Links
              </span>
            </a>
            <a href="#/build" onClick={closeMenus} className="py-3 text-purple-400 hover:text-white">
              Project Builder
            </a>
            <a href="#/contact" onClick={closeMenus} className="py-3 text-xs text-slate-400 hover:text-white">
              Contact Desk
            </a>
          </div>

          <div className="mt-8 pt-4">
            <a
              href="https://wa.me/923199980011?text=Hello%20PlayBeat%20Digital,%20I%20would%20like%20to%20discuss%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center h-12 rounded-xl bg-emerald-500 text-slate-950 font-bold"
            >
              WhatsApp (+92 319 9980011)
            </a>
          </div>
        </div>
      )}
    </>
  );
};
