// src/Site.jsx
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Leaf, Shield, Gift } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Footer from "./components/Footer.jsx";

const BRAND = "Zephyr";

/* ---- copy tuned for offsets (SME, individuals, gifts) ---- */
const features = [
  {
    icon: Leaf,
    title: "Verified projects",
    desc: "Curated supply from leading standards (e.g., Gold Standard, Verra) with traceable retirements.",
  },
  {
    icon: Shield,
    title: "Retirement handled",
    desc: "We retire on registry for you and provide official certificates for reporting.",
  },
  {
    icon: Gift,
    title: "Flexible options",
    desc: "Offset once, set a monthly plan, or gift carbon neutrality to someone you care about.",
  },
];

/* ---- FULL-SCREEN SLIDES ---- */
const slides = [
  {
    label: "For SMEs",
    title: "Offset your company’s footprint",
    subtitle: "Simple bundles for Scope 1–3, verified and retired on registry.",
    href: "/companies",
  },
  {
    label: "For Individuals",
    title: "Make your life carbon neutral",
    subtitle: "Offset once or subscribe monthly. Certificates included.",
    href: "/buy/individuals",
  },
  {
    label: "Carbon Credits",
    title: "Understand quality & traceability",
    subtitle: "Standards, vintages, and retirement proof explained.",
    href: "/credits",
  },
  {
    label: "About us",
    title: "Who we are",
    subtitle: "Transparent sourcing and reporting, built for trust.",
    href: "/about",
  },
  {
    label: "FAQ",
    title: "Common questions",
    subtitle: "Pricing, standards, retirement, and certificates.",
    href: "/faq",
  },
];

export default function Site() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div className="dark">
      <div className="min-h-screen flex flex-col text-slate-100">
        <main
          className={
            isHome
              ? "relative z-10 snap-container h-[100svh] overflow-y-scroll snap-y snap-mandatory scroll-smooth overscroll-contain"
              : "relative z-10 flex-1 flex min-h-0"
          }
        >
          {/* Fixed hero background only on the homepage */}
          {isHome && (
            <div className="fixed inset-0 z-0 pointer-events-none">
              <img
                src="/images/hero-background.jpg"
                alt="Background"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
          )}

          {isHome && (
            <>
              {/* ---------- HERO ---------- */}
              <section className="relative overflow-hidden h-[100svh] snap-start snap-always">
                <div className="relative mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-12 gap-10 px-4 min-h-[100svh] items-center">

                  <motion.div
                    className="md:col-span-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Badge className="mb-4">Voluntary offsets</Badge>
                    <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                      Go{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">
                        carbon neutral
                      </span>{" "}
                      with clarity
                    </h1>
                    <p className="mt-4 text-lg leading-relaxed text-white/85">
                      Simple, verified carbon offsets for small businesses,
                      individuals, and organizations. Offset once, subscribe
                      monthly, or gift carbon neutrality — we retire credits
                      and deliver certificates you can trust.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <Link to="/companies">
                        <Button size="lg">See options</Button>
                      </Link>
                      <Link to="/credits">
                        <Button size="lg" variant="outline">
                          How it works
                        </Button>
                      </Link>
                    </div>
                    <div className="mt-6 flex items-center gap-5 text-sm text-white/70">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" /> Registry retirement
                      </div>
                      <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4" /> Verified supply
                      </div>
                    </div>
                  </motion.div>
                  <div className="md:col-span-4" />
                </div>
              </section>

              {/* ---------- FULL-SCREEN SLIDES ---------- */}
              <section aria-label="Quick paths" className="w-full">
                {slides.map((s, i) => (
                  <MotionSlide key={s.href} slide={s} alignRight={i % 2 === 1} />
                ))}
              </section>

              {/* ---------- FEATURES ---------- */}
              <section id="features" className="mx-auto max-w-6xl px-4 py-8">
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-bold">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">
                      Everything you need
                    </span>
                  </h2>
                  <p className="mt-2 text-white/75">
                    Sourcing, retirement, and proof — handled end-to-end.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {features.map(({ icon: Icon, title, desc }) => (
                    <Card key={title} className="border-white/10 bg-white/5">
                      <CardHeader className="flex flex-row items-center gap-3">
                        <div className="rounded-2xl p-2 ring-1 ring-white/10">
                          <Icon className="h-5 w-5 text-emerald-400" />
                        </div>
                        <CardTitle className="text-lg">{title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-white/80">{desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* ---------- CONTACT ---------- */}
              <section id="contact" className="mx-auto max-w-4xl px-4 py-12">
                <div className="text-center">
                  <h2 className="text-3xl font-bold">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">
                      Questions?
                    </span>
                  </h2>
                  <p className="mt-2 text-white/75">
                    Email us and we’ll reply within 1 business day.
                  </p>
                  <a href="mailto:hello@example.com" className="inline-block mt-4">
                    <Button>Email us</Button>
                  </a>
                </div>
              </section>
            </>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}

/* --- Full-screen slide component --- */
function MotionSlide({ slide, alignRight }) {
  return (
    <section className="relative h-[100svh] w-full overflow-hidden snap-start snap-always">
      <motion.div
        className={`absolute bottom-14 ${alignRight ? "right-10" : "left-10"} max-w-[36rem]`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ amount: 0.75 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm backdrop-blur">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400 font-semibold">
            {slide.label}
          </span>
        </div>

        <h3 className="mt-4 text-3xl md:text-4xl font-extrabold leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">
            {slide.title}
          </span>
        </h3>

        <p className="mt-3 text-white/85 text-base md:text-lg">{slide.subtitle}</p>

        <Link
          to={slide.href}
          className="group mt-6 inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur hover:bg-white/15 transition"
        >
          <span className="font-medium">Explore</span>
          <svg
            className="h-5 w-5 translate-x-0 transition group-hover:translate-x-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </motion.div>
    </section>
  );
}
