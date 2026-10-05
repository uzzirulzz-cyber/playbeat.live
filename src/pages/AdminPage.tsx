import React, { useState } from "react";
import { Trash2, Check, RefreshCw } from "lucide-react";
import {
  getStoredServices,
  saveServiceOverride,
  CAT,
  formatPKR,
  Service,
} from "../data/servicesData";

interface ProposalRequest {
  id: string;
  n: string;
  c: string;
  e: string;
  w: string;
  d: string;
  s: string;
  est: string;
  date: string;
}

export const AdminPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>(getStoredServices());
  const [proposals, setProposals] = useState<ProposalRequest[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("pb_req") || "[]");
    } catch {
      return [];
    }
  });

  const handlePriceChange = (slug: string, newPrice: number) => {
    saveServiceOverride(slug, { p: newPrice });
    setServices(getStoredServices());
  };

  const handlePublishToggle = (slug: string, isPublished: boolean) => {
    saveServiceOverride(slug, { on: isPublished });
    setServices(getStoredServices());
  };

  const handleDeleteService = (slug: string) => {
    if (confirm("Are you sure you want to remove this service from this browser?")) {
      saveServiceOverride(slug, { del: true });
      setServices(getStoredServices());
    }
  };

  const handleClearRequests = () => {
    if (confirm("Clear all submitted proposal requests?")) {
      localStorage.removeItem("pb_req");
      setProposals([]);
    }
  };

  return (
    <div className="pt-28 pb-24 wrap space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h-md text-white">Admin Management Console</h1>
          <p className="lead text-xs mt-1">
            Manage service baseline prices, toggle published states, and review client proposal requests.
          </p>
        </div>
        <button
          onClick={() => {
            setServices(getStoredServices());
            try {
              setProposals(JSON.parse(localStorage.getItem("pb_req") || "[]"));
            } catch {}
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-slate-300 hover:text-white"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Services Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Active Services ({services.length})</h2>
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-white/5 border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Service Title</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Price (PKR)</th>
                <th className="p-3.5">Published</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {services.map((s) => (
                <tr key={s.slug} className="hover:bg-white/5 transition-colors">
                  <td className="p-3.5 font-bold text-white">{s.t}</td>
                  <td className="p-3.5 text-slate-400">{CAT[s.c] || s.c}</td>
                  <td className="p-3.5">
                    <input
                      type="number"
                      step={1000}
                      min={0}
                      value={s.p}
                      onChange={(e) => handlePriceChange(s.slug, Number(e.target.value))}
                      className="w-28 h-8 px-2 rounded-lg bg-black/40 border border-white/15 text-white font-bold outline-none focus:border-cyan-400"
                    />
                  </td>
                  <td className="p-3.5">
                    <input
                      type="checkbox"
                      checked={s.on}
                      onChange={(e) => handlePublishToggle(s.slug, e.target.checked)}
                      className="w-4 h-4 accent-cyan-400 cursor-pointer"
                    />
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDeleteService(s.slug)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proposals Received */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            Client Proposal Requests ({proposals.length})
          </h2>
          {proposals.length > 0 && (
            <button
              onClick={handleClearRequests}
              className="text-xs text-red-400 hover:underline"
            >
              Clear Requests
            </button>
          )}
        </div>

        {proposals.length === 0 ? (
          <div className="p-10 rounded-2xl border border-dashed border-white/10 text-center text-slate-400 text-xs">
            No proposal requests submitted yet. Proposals requested from the Project Builder appear here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proposals.map((req, idx) => (
              <div key={idx} className="glow-card p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <b className="text-sm font-bold text-white block">{req.n}</b>
                    <small className="text-xs text-slate-400">{req.c || "Independent"}</small>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-400/15 text-cyan-300">
                    {req.s}
                  </span>
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <div>
                    <span className="text-slate-500">Email:</span> {req.e}
                  </div>
                  <div>
                    <span className="text-slate-500">WhatsApp:</span>{" "}
                    <a
                      href={`https://wa.me/${req.w.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline"
                    >
                      {req.w}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-500">Estimated Budget:</span> {req.est}
                  </div>
                  {req.d && (
                    <div className="pt-2 text-slate-400 italic">"{req.d}"</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
