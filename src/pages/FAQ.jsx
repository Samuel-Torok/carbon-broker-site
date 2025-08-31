// src/pages/FAQ.jsx
import PagePanel from "../components/PagePanel.jsx";
import { useI18n } from "../i18n";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/ui/accordion";

export default function FAQ() {
  const { t } = useI18n();
  const items = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
  ];

  return (
    <PagePanel maxWidth="max-w-3xl">
      <main className="py-12">
        <h1 className="mb-6 text-3xl font-bold title-gradient">{t("faq.title")}</h1>
        <Accordion type="single" collapsible className="w-full">
          {items.map((it, i) => (
            <AccordionItem key={i} value={`${i + 1}`}>
              <AccordionTrigger>{it.q}</AccordionTrigger>
              <AccordionContent>{it.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
    </PagePanel>
  );
}
