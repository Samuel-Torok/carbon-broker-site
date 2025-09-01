import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "./en.json";
import fr from "./fr.json";

const dicts = { en, fr };
const I18nCtx = createContext({ lang: "en", setLang: () => {}, t: (k) => k });

const resolve = (obj, path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
const format = (msg, params) =>
  !params || typeof msg !== "string" ? msg : msg.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || (navigator.language?.startsWith("fr") ? "fr" : "en"));
  useEffect(() => { localStorage.setItem("lang", lang); document.documentElement.lang = lang; }, [lang]);

  const t = useMemo(() => (key, params) => {
    const v = resolve(dicts[lang], key) ?? resolve(dicts.en, key) ?? key;
    return typeof v === "string" ? format(v, params) : v;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);
  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}
export function useI18n() { return useContext(I18nCtx); }
