"use client";

import { createContext, useState, type ReactNode } from "react";
import type { Lang } from "../../lib/i18n";

export interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (en: string, ar: string) => string;
  isRTL: boolean;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("ar");
  const t = (en: string, ar: string) => (lang === "en" ? en : ar);
  const isRTL = lang === "ar";
  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};
