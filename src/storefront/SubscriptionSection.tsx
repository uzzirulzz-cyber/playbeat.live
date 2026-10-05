import React, { useState } from "react";
import { Check, Zap } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { Product } from "../types";

interface SubscriptionSectionProps {
  products: Product[];
}

export const SubscriptionSection: React.FC<SubscriptionSectionProps> = ({ products }) => {
  const { addToCart, setIsCheckoutOpen } = useStore();
  const [selectedTerm, setSelectedTerm] = useState<"1 Month" | "3 Months" | "6 Months" | "12 Months">("1 Month");

  const subProduct =
    products.find((p) => p.productType === "subscription") || products[0];

  const plans = [
    {
      term: "1 Month",
      months: 1,
      price: 79,
      discount: "Standard",
      popular: false,
      benefits: [
        "Full access to cluster orchestration runtime",
        "Unlimited scale-to-zero microservice deployments",
        "Automated hourly database backup snapshots",
        "Standard Slack technical support (1-hour SLA)",
      ],
    },
    {
      term: "3 Months",
      months: 3,
      price: 69,
      discount: "Save 12%",
      popular: false,
      benefits: [
        "All 1-Month features included",
        "Multi-region failover and edge Anycast CDN",
        "Priority ticket escalation with lead architect",
        "Free migration assistance for legacy workloads",
      ],
    },
    {
      term: "6 Months",
      months: 6,
      price: 59,
      discount: "Save 25%",
      popular: true,
      benefits: [
        "All 3-Month features included",
        "Dedicated private Slack channel with 15-min response",
        "Custom SSL certificate provisioning & DDoS shield",
        "Quarterly architectural compliance audits",
      ],
    },
    {
      term: "12 Months",
      months: 12,
      price: 49,
      discount: "Best Value (Save 38%)",
      popular: false,
      benefits: [
        "All 6-Month enterprise features included",
        "Contractual 99.99% Uptime Guarantee backed by SLA credits",
        "White-glove 1-on-1 deployment pairing session",
        "Unlimited license key seats for your engineering team",
      ],
    },
  ];

  const handleSubscribe = (plan: typeof plans[0]) => {
    if (!subProduct) return;
    const customizedProduct: Product = {
      ...subProduct,
      name: `${subProduct.name} (${plan.term} Pass)`,
      price: plan.price * plan.months,
      pricingInterval: plan.months === 12 ? "yearly" : "monthly",
    };
    addToCart(customizedProduct, 1, plan.term);
    setIsCheckoutOpen(true);
  };

  return (
    <section id="subscriptions" className="py-5 py-lg-6 bg-light border-bottom">
      <div className="container-xl">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-5">
          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 text-xs font-bold uppercase tracking-wider">
            Continuous Cloud Access
          </span>
          <h2 className="display-6 fw-extrabold text-dark tracking-tight">
            Flexible Subscription Passes
          </h2>
          <p className="text-secondary small leading-relaxed">
            Enterprise infrastructure orchestration, automated telemetry monitors, and priority SLAs with zero lock-in contracts.
          </p>
        </div>

        {/* 4 Tier Cards */}
        <div className="row g-4 align-items-stretch">
          {plans.map((p, idx) => (
            <div key={idx} className="col-12 col-md-6 col-xl-3">
              <div
                className={`card h-100 rounded-4 p-4 border transition-all d-flex flex-column justify-content-between position-relative ${
                  p.popular
                    ? "bg-dark text-white border-primary shadow-lg ring-2 ring-primary ring-offset-2"
                    : "bg-white text-dark shadow-sm hover:border-primary"
                }`}
              >
                {p.popular && (
                  <span className="position-absolute top-0 start-50 translate-middle badge bg-primary text-white rounded-pill px-3 py-1 text-[11px] fw-bold uppercase tracking-wider shadow-sm">
                    Most Popular
                  </span>
                )}

                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className={`fw-extrabold mb-0 ${p.popular ? "text-white" : "text-dark"}`}>{p.term}</h5>
                    <span className={`badge rounded-pill text-[10px] ${p.popular ? "bg-light text-dark" : "bg-primary-subtle text-primary"}`}>
                      {p.discount}
                    </span>
                  </div>

                  <div className="my-3">
                    <span className="display-5 fw-extrabold tracking-tight">${p.price}</span>
                    <span className={`small ms-1 ${p.popular ? "text-white-50" : "text-muted"}`}>/month</span>
                    <div className={`text-[11px] mt-1 ${p.popular ? "text-white-50" : "text-muted"}`}>
                      Billed {p.months === 1 ? "monthly" : `every ${p.months} months ($${p.price * p.months})`}
                    </div>
                  </div>

                  <hr className={p.popular ? "border-secondary" : ""} />

                  {/* Benefits */}
                  <ul className="list-unstyled space-y-2.5 my-4 text-xs font-medium">
                    {p.benefits.map((b, bIdx) => (
                      <li key={bIdx} className="d-flex align-items-start gap-2">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${p.popular ? "text-cyan-400" : "text-success"}`} />
                        <span className={p.popular ? "text-white-75" : "text-secondary"}>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSubscribe(p)}
                  className={`btn btn-lg rounded-pill fw-bold text-xs py-2.5 w-100 shadow-sm ${
                    p.popular ? "btn-primary" : "btn-outline-dark hover:btn-dark"
                  }`}
                >
                  Subscribe Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
