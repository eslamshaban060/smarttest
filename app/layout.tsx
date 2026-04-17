import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import { Footer } from "@/components/layout/Footer";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "next-themes";
import { PageLoader } from "@/components/layout/PageLoader";
import { Chatbot } from "@/components/chatboot/page";
export const metadata: Metadata = {
  title: "EN-AVM Academy",
  description: "A trusted learning space for Audio-Vestibular Medicine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Suspense>
            <PageLoader />
          </Suspense>
          <LanguageProvider>
            {children}
            <Chatbot />

            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
