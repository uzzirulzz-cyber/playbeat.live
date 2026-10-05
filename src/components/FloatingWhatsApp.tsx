import React from "react";
import { MessageCircle } from "lucide-react";

interface FloatingWhatsAppProps {
  currentServiceTitle?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  currentServiceTitle,
}) => {
  const message = currentServiceTitle
    ? `Hello PlayBeat Digital,\nI am interested in ${currentServiceTitle}.\nI reviewed the demo and would like a quotation.`
    : `Hello PlayBeat Digital,\nI am interested in your digital development services.\nI would like to discuss my project.`;

  const waUrl = `https://wa.me/923199980011?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed z-40 right-5 bottom-5 flex items-center gap-2.5 h-13 px-5 rounded-full bg-emerald-500 text-slate-950 font-bold text-sm shadow-[0_16px_36px_-10px_rgba(16,185,129,0.9)] hover:scale-105 active:scale-95 transition-transform"
      aria-label="Discuss project on WhatsApp"
    >
      <MessageCircle className="w-5 h-5 fill-slate-950" />
      <span className="hidden sm:inline">Discuss your project</span>
    </a>
  );
};
