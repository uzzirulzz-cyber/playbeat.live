import React, { useState, useEffect, useRef } from "react";
import { Search, ArrowRight, X } from "lucide-react";
import { getStoredServices, DEMOS, INDS, GR, formatPKR } from "../data/servicesData";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (hash: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const services = getStoredServices();

  const allItems = [
    ...services.map((s) => ({
      title: s.t,
      category: "Services",
      sub: `${GR[s.g]?.name || "Solution"} · from ${formatPKR(s.p)}`,
      hash: `#/services/${s.slug}`,
    })),
    ...DEMOS.map(([name, slug]) => {
      const s = services.find((x) => x.slug === slug);
      return {
        title: `${name} Interactive Demo`,
        category: "Demos",
        sub: "Live working simulation",
        hash: `#/demo/${s?.slug || slug}`,
      };
    }),
    ...INDS.map(([name, g, , desc]) => ({
      title: `${name} Solutions`,
      category: "Industries",
      sub: desc,
      hash: `#/services?g=${g}`,
    })),
    {
      title: "PlayBeat Digital Bio & Social Links",
      category: "Connect",
      sub: "WhatsApp, Instagram, TikTok & Facebook",
      hash: `#/links`,
    },
    {
      title: "Project Price Estimator & Proposal Builder",
      category: "Tools",
      sub: "Instant customized pricing calculation",
      hash: `#/build`,
    },
  ];

  const filtered = allItems.filter(
    (item) =>
      !query ||
      `${item.title} ${item.sub} ${item.category}`
        .toLowerCase()
        .includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
          e.preventDefault();
          // parent handles open
        }
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(filtered.length - 1, prev + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          onNavigate(filtered[selectedIndex].hash);
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose, onNavigate]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#0A1124] border border-white/15 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-0 outline-none text-white text-lg placeholder-slate-500"
            placeholder="Search services, demos, pricing, industries or links..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <kbd className="px-2 py-0.5 rounded bg-white/10 text-xs font-semibold text-slate-400">
            Esc
          </kbd>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-3 divide-y divide-white/5 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No matching results for "{query}". Try "SaaS", "Mobile", "WhatsApp", or "Ecommerce".
            </div>
          ) : (
            filtered.slice(0, 30).map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors ${
                  idx === selectedIndex
                    ? "bg-white/10 text-white"
                    : "hover:bg-white/5 text-slate-300"
                }`}
                onClick={() => {
                  onNavigate(item.hash);
                  onClose();
                }}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {item.category[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{item.title}</div>
                  <div className="text-xs text-slate-400 truncate">{item.sub}</div>
                </div>
                <div className="text-xs font-medium text-cyan-400 px-2 py-0.5 rounded bg-cyan-400/10">
                  {item.category}
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
