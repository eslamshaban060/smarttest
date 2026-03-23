"use client";

import { useContext } from "react";
import {
  LanguageContext,
  type LanguageContextValue,
} from "../context/LanguageContext";

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
};
