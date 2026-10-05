import React from "react";

interface MockPreviewProps {
  type: string;
  className?: string;
  c1?: string;
  c2?: string;
}

export const MockPreview: React.FC<MockPreviewProps> = ({
  type,
  className = "",
  c1 = "#3B82F6",
  c2 = "#22D3EE",
}) => {
  const style = {
    "--c1": c1,
    "--c2": c2,
  } as React.CSSProperties;

  if (type === "mob") {
    return (
      <div className={`mkp ${className}`} style={style} aria-hidden="true">
        <div className="mkp-s">
          <div className="mkp-h">
            <small>Today</small>
            <b>8,420 steps</b>
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="mkp-r">
              <i />
              <u />
            </div>
          ))}
          <div className="mkp-t">
            <i className="on" />
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
    );
  }

  if (type === "ai") {
    return (
      <div className={`mk ${className}`} style={style} aria-hidden="true">
        <div className="mk-bar">
          <i />
          <i />
          <i />
          <span />
        </div>
        <div className="flex-1 p-3 grid grid-cols-2 gap-2 bg-[#0b0720] items-center">
          <div className="w-16 h-16 rounded-full mx-auto bg-gradient-to-tr from-purple-500 via-cyan-400 to-blue-500 animate-spin" />
          <div className="flex flex-col gap-1.5 justify-center">
            <div className="h-4 rounded-md bg-white/10 w-full" />
            <div className="h-4 rounded-md bg-gradient-to-r from-purple-600 to-blue-500 w-3/4 self-end" />
            <div className="h-4 rounded-md bg-white/10 w-4/5" />
          </div>
        </div>
      </div>
    );
  }

  if (type === "store") {
    return (
      <div className={`mk ${className}`} style={style} aria-hidden="true">
        <div className="mk-bar">
          <i />
          <i />
          <i />
          <span />
        </div>
        <div className="flex-1 bg-[#FFF8EE] p-2.5 grid grid-rows-[auto_1fr] gap-2 text-[#0b1220]">
          <div className="rounded-lg p-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-extrabold text-xs flex justify-between items-center">
            <span>New season</span>
            <span className="bg-white text-slate-900 rounded-full px-2 py-0.5 text-[9px]">Shop</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {["12.9k", "24.9k", "6.9k", "18.5k"].map((price, idx) => (
              <div key={idx} className="bg-white rounded p-1 flex flex-col gap-1">
                <div className="flex-1 rounded bg-orange-100 min-h-[30px]" />
                <div className="h-1 rounded bg-slate-800/20 w-3/4" />
                <b className="text-[8px]">Rs {price}</b>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "crm") {
    return (
      <div className={`mk ${className}`} style={style} aria-hidden="true">
        <div className="mk-bar">
          <i />
          <i />
          <i />
          <span />
        </div>
        <div className="flex-1 bg-slate-900/90 p-2.5 grid grid-cols-4 gap-1.5">
          {[
            { label: "New", color: "#3B82F6", count: 2 },
            { label: "Contact", color: "#22D3EE", count: 1 },
            { label: "Deal", color: "#FF7A18", count: 2 },
            { label: "Won", color: "#10B981", count: 1 },
          ].map((col, idx) => (
            <div key={idx} className="bg-white/5 rounded p-1 flex flex-col gap-1">
              <span className="text-[8px] font-bold text-slate-300">{col.label}</span>
              {Array.from({ length: col.count }).map((_, cIdx) => (
                <div
                  key={cIdx}
                  className="h-5 rounded bg-white/10 border-l-2"
                  style={{ borderLeftColor: col.color }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Standard dashboard / site mock
  return (
    <div className={`mk ${className}`} style={style} aria-hidden="true">
      <div className="mk-bar">
        <i />
        <i />
        <i />
        <span />
      </div>
      <div className="mk-body">
        <div className="mk-side">
          <b />
          <i className="on" />
          <i />
          <i />
          <i />
        </div>
        <div className="mk-main">
          <div className="mk-k">
            <div>
              <small>MRR</small>
              <b>$48.2k</b>
            </div>
            <div>
              <small>Users</small>
              <b>3,120</b>
            </div>
            <div>
              <small>Rate</small>
              <b>99.4%</b>
            </div>
          </div>
          <div className="mk-ch">
            <svg viewBox="0 0 100 40" preserveAspectRatio="none">
              <path
                className="a"
                d="M0 30C12 26 18 14 30 18S50 30 62 16 82 8 100 6V40H0Z"
              />
              <path
                className="l"
                d="M0 30C12 26 18 14 30 18S50 30 62 16 82 8 100 6"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
