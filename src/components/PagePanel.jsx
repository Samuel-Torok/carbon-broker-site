import React from "react";
import BackHome from "./BackHome.jsx";

export default function PagePanel({
  children,
  title,
  subtitle,
  icon: Icon,
  badge,
  maxWidth = "max-w-5xl",
}) {
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
              {(title || subtitle) && (
                <header className="mb-4 md:mb-6">
                  <div className="flex items-center gap-2 text-emerald-400">
                    {Icon ? <Icon className="h-5 w-5" /> : null}
                    {badge ? (
                      <span className="text-xs rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30 px-2 py-0.5">
                        {badge}
                      </span>
                    ) : null}
                  </div>
                  {title && (
                    <h1 className="mt-1 text-2xl md:text-3xl font-semibold text-emerald-300">
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="mt-1 text-sm md:text-base text-white/80 max-w-3xl">
                      {subtitle}
                    </p>
                  )}
                </header>
              )}

              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
