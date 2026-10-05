import React from "react";
import { ArrowRight, Check, Play, Shield, Users, Headphones, MessageCircle } from "lucide-react";
import { GR, DEMOS, getStoredServices } from "../data/servicesData";

export const CompanyPage: React.FC = () => {
  const services = getStoredServices();

  const principles = [
    {
      icon: Play,
      title: "Demo Before You Order",
      desc: "Every service opens a working live prototype. You click through and test it before spending a rupee.",
    },
    {
      icon: Shield,
      title: "Prices in the Open",
      desc: "Each solution has clear baseline pricing and turnaround estimates. No vague quotes or hidden surprises.",
    },
    {
      icon: Users,
      title: "One Accountable Studio",
      desc: "Strategy, design, and engineering sit under one roof. Nothing gets diluted between subcontracted vendors.",
    },
    {
      icon: Headphones,
      title: "Support Beyond Day One",
      desc: "Every project includes a post-launch warranty window and continuous maintenance agreements to scale with your traction.",
    },
  ];

  return (
    <div className="pt-28 pb-24 space-y-16 wrap">
      {/* Hero */}
      <div className="card-paper p-8 lg:p-14 space-y-6">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-cyan-300 text-xs font-semibold">
          PlayBeat Digital (Private) Limited
        </span>

        <h1 className="h-lg text-white max-w-3xl">
          We Build Systems, <span className="gt">Not Just Screens.</span>
        </h1>

        <p className="lead max-w-2xl">
          PlayBeat Digital is a specialized digital product studio. We architect, design, and engineer custom websites, mobile applications, SaaS platforms, ecommerce solutions, and brand identities with working interactive demos before you commit.
        </p>

        <div className="flex flex-wrap gap-4 pt-4">
          <a
            href="#/build"
            className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-xs shadow-lg hover:brightness-110"
          >
            Build Your Project <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="https://wa.me/923199980011"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-12 px-5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold text-xs hover:bg-emerald-500/30"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp (+92 319 9980011)
          </a>
        </div>
      </div>

      {/* Principles */}
      <div className="space-y-8">
        <div>
          <h2 className="h-md text-white">How We Work With You</h2>
          <p className="lead text-xs mt-1">
            Four foundational commitments that hold true across every single engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {principles.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="glow-card p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-cyan-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">{p.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Solutions overview */}
      <div className="space-y-6">
        <div>
          <h2 className="h-md text-white">What We Build</h2>
          <p className="lead text-xs mt-1">
            {Object.keys(GR).length} solution categories and {services.length} transparently priced options.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(GR).map(([key, group]) => {
            const count = services.filter((s) => s.g === key).length;
            return (
              <a
                key={key}
                href={`#/services?g=${key}`}
                className="p-4 rounded-xl border border-white/10 bg-white/5 hover:border-cyan-400/50 hover:bg-white/10 transition-all"
              >
                <b className="block text-sm font-bold text-white">{group.name}</b>
                <span className="text-xs text-slate-400">{count} services</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};
