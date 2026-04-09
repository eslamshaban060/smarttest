"use client";

import Link from "next/link";
import { Mail, MapPin, Facebook, Instagram } from "lucide-react";
import { useLanguage } from "@/app/hooks/useLanguage";
import Image from "next/image";
import Logo from "@/app/assets/logo.jpeg";
export const Footer = () => {
  const { t, isRTL } = useLanguage();

  const links = [
    { label: t("Home", "الرئيسية"), href: "/" },
    { label: t("About", "عنا"), href: "/about" },
    { label: t("Courses", "الدورات"), href: "/courses" },
    { label: t("Book Series", "سلسلة الكتب"), href: "#book" },
    { label: t("Workshops", "الورش"), href: "/workshops" },
  ];

  return (
    <footer
      dir={isRTL ? "rtl" : "ltr"}
      className="bg-primary text-primary-foreground/50"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-primary-foreground/[0.05]">
        {/* Brand */}
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-3 mb-4 w-fit">
            <div className="w-18 h-10 rounded-xl   flex items-center justify-center">
              <Image
                src={Logo}
                alt="logo"
                className="  w-fit h-full  "
                width={100}
                height={100}
              />
            </div>
            <span className="text-primary-foreground font-semibold text-[17px]">
              {t("EN-AVM Academy", "سمارت أكاديمي")}
            </span>
          </Link>
          <p className="text-[14px] leading-[1.8] max-w-xs">
            {t(
              "A trusted learning space for Audio-Vestibular Medicine, led by Prof. Dr. Ebtessam Nada.",
              "منصة تعليمية موثوقة في طب السمع والاتزان، بقيادة أ.د. ابتسام ندى.",
            )}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <p className="text-primary-foreground font-semibold text-[15px] mb-5">
            {t("Quick Links", "روابط سريعة")}
          </p>
          <nav className="flex flex-col gap-2.5">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[14px] hover:text-secondary transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div>
          <p className="text-primary-foreground font-semibold text-[15px] mb-5">
            {t("Contact", "تواصل")}
          </p>
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex items-center gap-2.5 text-[14px]">
              <Mail className="w-4 h-4 text-secondary flex-shrink-0" />
              nadaebtessam@gmail.com{" "}
            </div>
            <div className="flex items-center gap-2.5 text-[14px]">
              <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
              {t("Zagazig University, Egypt", "جامعة الزقازيق، مصر")}
            </div>
          </div>
          <div className="flex gap-2.5">
            {([Facebook, Instagram] as React.ElementType[]).map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-xl bg-primary-foreground/[0.05] border border-primary-foreground/[0.08] flex items-center justify-center hover:bg-secondary hover:border-secondary text-primary-foreground/50 hover:text-white transition-all"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 text-[13px] text-center text-primary-foreground/20">
        © {new Date().getFullYear()} EN-AVM Academy — Prof. Dr. Ebtessam Nada.{" "}
        {t("All rights reserved.", "جميع الحقوق محفوظة.")}
      </div>
    </footer>
  );
};
