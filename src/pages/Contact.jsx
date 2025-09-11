import PagePanel from "../components/PagePanel.jsx";
import { Mail, Phone, Instagram } from "lucide-react";
import { useI18n } from "../i18n";

export default function Contact() {
  const { t } = useI18n();
  return (
    <PagePanel maxWidth="max-w-3xl">
      <main className="py-12 space-y-6 leading-7">
        <h1 className="text-3xl font-bold title-gradient">{t("contact.title")}</h1>
        <p className="opacity-80">{t("contact.subtitle")}</p>

        <div className="grid gap-4">
          <a href="mailto:hello@example.com" className="flex items-center gap-3 rounded-xl ring-1 ring-white/10 bg-white/5 hover:bg-white/10 px-4 py-3">
            <Mail className="h-5 w-5 text-emerald-400" />
            <div>
              <div className="font-medium">{t("contact.email")}</div>
              <div className="text-sm opacity-80">hello@example.com</div>
            </div>
          </a>

          <a href="tel:+15551234567" className="flex items-center gap-3 rounded-xl ring-1 ring-white/10 bg-white/5 hover:bg-white/10 px-4 py-3">
            <Phone className="h-5 w-5 text-emerald-400" />
            <div>
              <div className="font-medium">{t("contact.phone")}</div>
              <div className="text-sm opacity-80">+1 (555) 123-4567</div>
            </div>
          </a>

          <a href="https://instagram.com/luxoffset" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl ring-1 ring-white/10 bg-white/5 hover:bg-white/10 px-4 py-3">
            <Instagram className="h-5 w-5 text-emerald-400" />
            <div>
              <div className="font-medium">{t("contact.instagram")}</div>
              <div className="text-sm opacity-80">@LuxOffset</div>
            </div>
          </a>
        </div>
      </main>
    </PagePanel>
  );
}
