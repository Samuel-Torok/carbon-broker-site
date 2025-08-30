// src/Site.jsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./components/ui/accordion";
import { Badge } from "./components/ui/badge";
import { Check, Leaf, Shield, Globe, Sun, Moon, Mail, Phone, ChevronRight } from "lucide-react";

const BRAND = "Zephyre"; // <- change me

const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="h-6 w-6 rounded-xl bg-emerald-500 dark:bg-emerald-400" />
    <span className="font-semibold tracking-tight">{BRAND}</span>
  </div>
);

const features = [
  {
    icon: Leaf,
    title: "Verified credits",
    desc: "Supply from Gold Standard & Verra projects with full traceability by vintage and serial.",
  },
  {
    icon: Shield,
    title: "Compliance handled",
    desc: "Contracts, custody, and retirement on registry — we manage the paperwork and risk checks.",
  },
  {
    icon: Globe,
    title: "Best execution",
    desc: "Global network of suppliers for liquidity and price discovery across geographies.",
  },
];

const tiers = [
  {
    name: "Buyer Desk",
    price: "From 2% fee",
    blurb: "For corporates offsetting Scope 1–3.",
    perks: ["Sourcing & DD", "Retirement certificates", "Quarterly reporting"],
    cta: "Request quote",
    highlight: true,
  },
  {
    name: "Supplier Desk",
    price: "Custom",
    blurb: "For project developers & holders.",
    perks: ["Mandated sell-side", "Book-building", "Settlement ops"],
    cta: "List inventory",
    highlight: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    blurb: "For high volume or RFPs.",
    perks: ["Hedging options", "Structured deals", "API / data room"],
    cta: "Talk to sales",
    highlight: false,
  },
];

export default function Site() {
  const [darkMode, setDarkMode] = useState(true);
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-slate-100">
        {/* NAV */}
        <header className="sticky top-0 z-30 border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Logo />
            <nav className="hidden items-center gap-6 md:flex">
              <a href="#features" className="text-sm font-medium hover:opacity-80">Features</a>
              <a href="#pricing" className="text-sm font-medium hover:opacity-80">Pricing</a>
              <a href="#faq" className="text-sm font-medium hover:opacity-80">FAQ</a>
              <a href="#contact" className="text-sm font-medium hover:opacity-80">Contact</a>
            </nav>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={() => setDarkMode(v => !v)}>
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button className="hidden md:inline-flex">Get Started</Button>
            </div>
          </div>
        </header>

        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_50%_at_50%_10%,black,transparent)]">
            <div className="absolute -inset-[10%] bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,.15),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,.15),transparent_30%)]" />
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-20 md:grid-cols-2 md:py-28">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge className="mb-4">New</Badge>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                Broker carbon credits <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">with confidence</span>
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                We source, verify, and retire high-quality offsets so you can hit targets and report with confidence.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button size="lg">
                  Request quote <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">View inventory</Button>
              </div>
              <div className="mt-6 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2"><Shield className="h-4 w-4" /> Registry retirement</div>
                <div className="flex items-center gap-2"><Leaf className="h-4 w-4" /> Verified supply</div>
              </div>
            </motion.div>

            {/* Lead form */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <Card className="border-emerald-200/20 bg-white/60 shadow-lg backdrop-blur dark:border-emerald-200/20 dark:bg-slate-900/60">
                <CardHeader><CardTitle>Request a callback</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    <Input placeholder="Company" />
                    <Input placeholder="Work email" type="email" />
                    <Input placeholder="Volume (tCO₂e)" />
                    <Textarea placeholder="Project preferences (tech, region, vintage)" className="min-h-[100px]" />
                    <Button className="w-full">Send</Button>
                    <p className="text-xs text-slate-500 mt-1">We’ll reply within 1 business day.</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Everything you need</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Sourcing, compliance, settlement — handled end-to-end.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="border-slate-200/60 dark:border-slate-700">
                <CardHeader className="flex flex-row items-center gap-3">
                  <div className="rounded-2xl p-2 ring-1 ring-slate-200 dark:ring-slate-700">
                    <Icon className="h-5 w-5 text-emerald-400" />
                  </div>
                  <CardTitle className="text-lg">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Simple pricing</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Transparent fees. No surprises.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {tiers.map((t) => (
              <Card key={t.name} className={`${t.highlight ? "ring-2 ring-emerald-400" : ""} border-slate-200/60 dark:border-slate-700`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{t.name}</CardTitle>
                    {t.highlight && <Badge>Popular</Badge>}
                  </div>
                  <div className="mt-2 text-2xl font-extrabold">{t.price}</div>
                  <p className="text-sm text-slate-500">{t.blurb}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {t.perks.map((p) => (
                      <li key={p} className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> {p}</li>
                    ))}
                  </ul>
                  <Button className="mt-6 w-full">{t.cta}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl px-4 py-16">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight">FAQ</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="1">
              <AccordionTrigger>Which standards do you support?</AccordionTrigger>
              <AccordionContent>
                Verra (VCS), Gold Standard, ACR and other leading registries. We’ll match projects to your policy and claims.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="2">
              <AccordionTrigger>Can you retire credits on our behalf?</AccordionTrigger>
              <AccordionContent>
                Yes. We manage custody and retirements, then issue official certificates and monthly/quarterly reports.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="3">
              <AccordionTrigger>How do fees work?</AccordionTrigger>
              <AccordionContent>
                Buyer desk typically charges a small brokerage fee (from 2%) included in quotes; enterprise & RFQs are custom.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* CONTACT */}
        <section id="contact" className="mx-auto max-w-4xl px-4 py-16">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Contact</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Ready to transact or list inventory?</p>
          </div>
          <Card className="border-slate-200/60 dark:border-slate-700">
            <CardContent className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
              <div className="space-y-3">
                <Input placeholder="Your name" />
                <Input placeholder="Email address" type="email" />
                <Input placeholder="Company" />
              </div>
              <div className="space-y-3">
                <Textarea placeholder="Tell us about your needs (volumes, tech, vintage)" className="min-h-[120px]" />
                <div className="flex gap-3">
                  <Button className="flex-1">Send</Button>
                  <Button variant="outline" className="flex items-center gap-2"><Mail className="h-4 w-4"/> Email</Button>
                </div>
                <p className="flex items-center gap-2 text-sm text-slate-500"><Phone className="h-4 w-4"/> +352 000 000</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-slate-200/60 bg-white/50 px-4 py-8 text-sm dark:border-slate-800 dark:bg-slate-900/50">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
            <Logo />
            <div className="text-slate-500">© {year} {BRAND}. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <a className="hover:underline" href="#">Privacy</a>
              <a className="hover:underline" href="#">Terms</a>
              <a className="hover:underline" href="#">Imprint</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
