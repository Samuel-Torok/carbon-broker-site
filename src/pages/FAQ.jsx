import PagePanel from "../components/PagePanel.jsx";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../components/ui/accordion";

export default function FAQ() {
  return (
    <PagePanel maxWidth="max-w-3xl">
      <main className="py-12">
        <h1 className="mb-6 text-3xl font-bold title-gradient">FAQ</h1>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="1">
            <AccordionTrigger>Which standards do you support?</AccordionTrigger>
            <AccordionContent>Verra (VCS), Gold Standard, ACR and others. We match to your policy and claims.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="2">
            <AccordionTrigger>Do you retire credits?</AccordionTrigger>
            <AccordionContent>Yes—custody, retirement, and certificates included.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="3">
            <AccordionTrigger>How are prices set?</AccordionTrigger>
            <AccordionContent>By technology, region, vintage and liquidity. We quote best execution from our network.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
    </PagePanel>
  );
}
