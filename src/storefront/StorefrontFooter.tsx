import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { PlayBeatLogo } from "../components/PlayBeatLogo";
import { AdminSecuritySeal } from "../components/AdminSecuritySeal";

export const StorefrontFooter: React.FC = () => {
  const { theme, showToast } = useStore();
  const [emailInput, setEmailInput] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) return;
    showToast("Subscribed! You will receive our weekly software drops.");
    setEmailInput("");
  };

  const footer = theme?.footer || {
    aboutText: "Premium SaaS, digital software, AI tool suites, and developer assets with instant digital license key provisioning.",
    newsletterTitle: "Join 45,000+ founders and engineers getting our curated product drops.",
    copyright: "© 2026 PlayBeat Digital SaaS Platforms. All rights reserved.",
    socials: {
      twitter: "https://twitter.com",
      github: "https://github.com",
      discord: "https://discord.com",
      linkedin: "https://linkedin.com",
    },
  };

  return (
    <footer className="bg-dark text-white pt-5 pb-4 border-top border-secondary">
      <div className="container-xl">
        <div className="row g-5 mb-5">
          {/* Brand Info & Newsletter */}
          <div className="col-12 col-lg-4 space-y-3">
            <div className="mb-2">
              <PlayBeatLogo
                size="md"
                customText={theme?.logoText}
                customTagline={theme?.logoTagline}
                customImage={theme?.logoImage}
                showLiveBadge={theme?.logoShowLiveBadge}
                liveBadgeText={theme?.logoLiveBadgeText}
                liveBadgeColor={theme?.logoLiveBadgeColor}
                showEqualizer={theme?.logoShowEqualizer}
                lightMode={false}
              />
            </div>

            <p className="text-white-50 small leading-relaxed max-w-sm">
              {footer.aboutText}
            </p>

            <form onSubmit={handleSubscribe} className="pt-2">
              <span className="text-white text-xs fw-bold d-block mb-1.5">{footer.newsletterTitle}</span>
              <div className="input-group input-group-sm">
                <input
                  type="email"
                  required
                  placeholder="Enter your work email..."
                  className="form-control bg-secondary bg-opacity-25 border-secondary text-white text-xs"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
                <button type="submit" className="btn btn-primary px-3 text-xs fw-bold">
                  Subscribe
                </button>
              </div>
            </form>
          </div>

          {/* Links Columns */}
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-bold text-white text-xs uppercase tracking-wider mb-3">Solutions & Work</h6>
            <ul className="list-unstyled space-y-2 text-xs text-white-50">
              <li><a href="#/services" className="text-white-50 text-decoration-none hover:text-white">Services & Prices</a></li>
              <li><a href="#/demos" className="text-white-50 text-decoration-none hover:text-white">Interactive Demos</a></li>
              <li><a href="#/build" className="text-white-50 text-decoration-none hover:text-white">Project Estimator</a></li>
              <li><a href="#/categories" className="text-white-50 text-decoration-none hover:text-white">Domain Explorer</a></li>
              <li><a href="#/shop" className="text-white-50 text-decoration-none hover:text-white">Software Catalog</a></li>
            </ul>
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-bold text-white text-xs uppercase tracking-wider mb-3">Capabilities</h6>
            <ul className="list-unstyled space-y-2 text-xs text-white-50">
              <li><a href="#/services?g=saas" className="text-white-50 text-decoration-none hover:text-white">SaaS & Web Apps</a></li>
              <li><a href="#/services?g=ai" className="text-white-50 text-decoration-none hover:text-white">AI Agent Studios</a></li>
              <li><a href="#/services?g=mob" className="text-white-50 text-decoration-none hover:text-white">Mobile Applications</a></li>
              <li><a href="#/services?g=eco" className="text-white-50 text-decoration-none hover:text-white">Ecommerce & Shopify</a></li>
              <li><a href="#/services?g=fin" className="text-white-50 text-decoration-none hover:text-white">Fintech Ledgers</a></li>
            </ul>
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-bold text-white text-xs uppercase tracking-wider mb-3">Support</h6>
            <ul className="list-unstyled space-y-2 text-xs text-white-50">
              <li><a href="#/contact" className="text-white-50 text-decoration-none hover:text-white">Contact Desk</a></li>
              <li><a href="#/faq" className="text-white-50 text-decoration-none hover:text-white">Licensing FAQ</a></li>
              <li><a href="#/account" className="text-white-50 text-decoration-none hover:text-white">Track Order & Keys</a></li>
              <li><a href="https://wa.me/923199980011" target="_blank" rel="noopener noreferrer" className="text-emerald-400 text-decoration-none">WhatsApp Support</a></li>
            </ul>
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-bold text-white text-xs uppercase tracking-wider mb-3">Trust & Security</h6>
            <ul className="list-unstyled space-y-2 text-xs text-white-50">
              <li><a href="#/privacy" className="text-white-50 text-decoration-none hover:text-white">Privacy Policy</a></li>
              <li><a href="#/terms" className="text-white-50 text-decoration-none hover:text-white">Terms of Service</a></li>
              <li><a href="#/refund" className="text-white-50 text-decoration-none hover:text-white">Refund & IP Handover</a></li>
              <li><a href="#/security" className="text-white-50 text-decoration-none hover:text-white">Security & Encryption</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Socials */}
        <div className="pt-4 border-top border-secondary border-opacity-50 d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3 text-xs text-white-50">
          <div className="d-flex align-items-center gap-3">
            <span>{footer.copyright}</span>
            {/* Embedded Discrete Verification Emblem (hidden admin entry) */}
            <AdminSecuritySeal size="sm" variant="inline" showDetails={false} />
          </div>

          <div className="d-flex align-items-center gap-3 fs-6">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white-50 hover:text-white">
              <i className="bi bi-twitter-x"></i>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-white-50 hover:text-white">
              <i className="bi bi-github"></i>
            </a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-white-50 hover:text-white">
              <i className="bi bi-discord"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white-50 hover:text-white">
              <i className="bi bi-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
