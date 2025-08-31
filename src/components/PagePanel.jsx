import React from "react";
import BackHome from "./BackHome.jsx";

export default function PagePanel({ children, maxWidth = "max-w-5xl" }) {
  return (
    <div className="relative isolate flex-1 flex min-h-0">
      {/* fixed ocean background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src="/images/ocean.jpg" alt="" className="h-full w-full object-cover" />
      </div>

      {/* full-height centered block */}
      <div className={`relative z-10 mx-auto w-full ${maxWidth} flex min-h-0`}>
        <div className="flex-1 min-h-0">
          <div className="relative h-full bg-slate-950/80 ring-1 ring-white/10 backdrop-blur-sm px-6 md:px-10 text-slate-100">
            {/* Back to home */}
            <div className="absolute top-4 left-6">
              <BackHome />
            </div>

            <div className="pt-14 md:pt-16">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
