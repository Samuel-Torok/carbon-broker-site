import { useSearchParams, useNavigate } from "react-router-dom";
import PagePanel from "../components/PagePanel.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Building2, User2 } from "lucide-react";
import { useI18n } from "../i18n";

export default function GetStarted() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next"); // "/companies" or "/buy/individuals"
  const suggested =
    next === "/buy/individuals" ? "individual" :
    next === "/companies" ? "company" : null;

  const go = (who) => navigate(who === "company" ? "/companies" : "/buy/individuals");

  return (
    <PagePanel maxWidth="max-w-3xl">
      <main className="py-12 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold title-gradient">{t("start.title")}</h1>
          <p className="opacity-80">{t("start.subtitle")}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 items-stretch">
          <Card className={`${suggested === "company" ? "ring-2 ring-emerald-400" : ""} h-full flex flex-col`}>
            <CardHeader className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-emerald-400" />
              <CardTitle>{t("start.company.title")}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <p className="text-sm opacity-80">{t("start.company.desc")}</p>
              <Button
                className="mt-auto w-full bg-gradient-to-r from-emerald-400 to-indigo-400 text-white border-0 hover:brightness-110 hover:shadow-lg"
                onClick={() => go("company")}
              >
                {t("start.continue")}
              </Button>
            </CardContent>
          </Card>

          <Card className={`${suggested === "individual" ? "ring-2 ring-emerald-400" : ""} h-full flex flex-col`}>
            <CardHeader className="flex items-center gap-3">
              <User2 className="h-6 w-6 text-emerald-400" />
              <CardTitle>{t("start.individual.title")}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <p className="text-sm opacity-80">{t("start.individual.desc")}</p>
              <Button
                className="mt-auto w-full bg-gradient-to-r from-emerald-400 to-indigo-400 text-white border-0 hover:brightness-110 hover:shadow-lg"
                onClick={() => go("individual")}
              >
                {t("start.continue")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </PagePanel>
  );
}
