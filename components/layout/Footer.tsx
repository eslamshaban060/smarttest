// "use client";

// import Link from "next/link";
// import { Mail, MapPin, Facebook, Instagram } from "lucide-react";
// import { useLanguage } from "@/app/hooks/useLanguage";

// export const Footer = () => {
//   const { t, isRTL } = useLanguage();

//   const links = [
//     { label: t("Home", "الرئيسية"), href: "/" },
//     { label: t("About", "عنا"), href: "/about" },
//     { label: t("Courses", "الدورات"), href: "/courses" },
//     { label: t("Book Series", "سلسلة الكتب"), href: "#book" },
//     { label: t("Workshops", "الورش"), href: "/workshops" },
//   ];

//   return (
//     <footer dir={isRTL ? "rtl" : "ltr"} className="bg-[#06101f] text-white/50">
//       <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-white/[0.05]">
//         <div className="lg:col-span-2">
//           <Link href="/" className="flex items-center gap-3 mb-4 w-fit">
//             <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
//               <span className="font-bold text-white text-base font-serif">
//                 S
//               </span>
//             </div>
//             <span className="text-white font-semibold text-[17px]">
//               {t("EN-AVM Academy", "سمارت أكاديمي")}
//             </span>
//           </Link>
//           <p className="text-[14px] leading-[1.8] max-w-xs">
//             {t(
//               "A trusted learning space for Audio-Vestibular Medicine, led by Prof. Dr. Ebtessam Nada.",
//               "منصة تعليمية موثوقة في طب السمع والاتزان، بقيادة أ.د. ابتسام ندى.",
//             )}
//           </p>
//         </div>

//         <div>
//           <p className="text-white font-semibold text-[15px] mb-5">
//             {t("Quick Links", "روابط سريعة")}
//           </p>
//           <nav className="flex flex-col gap-2.5">
//             {links.map((l) => (
//               <Link
//                 key={l.href}
//                 href={l.href}
//                 className="text-[14px] hover:text-secondary transition-colors"
//               >
//                 {l.label}
//               </Link>
//             ))}
//           </nav>
//         </div>

//         <div>
//           <p className="text-white font-semibold text-[15px] mb-5">
//             {t("Contact", "تواصل")}
//           </p>
//           <div className="flex flex-col gap-3 mb-6">
//             <div className="flex items-center gap-2.5 text-[14px]">
//               <Mail className="w-4 h-4 text-secondary flex-shrink-0" />
//               dktwrabtsam60@gmail.com
//             </div>
//             <div className="flex items-center gap-2.5 text-[14px]">
//               <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
//               {t("Zagazig University, Egypt", "جامعة الزقازيق، مصر")}
//             </div>
//           </div>
//           <div className="flex gap-2.5">
//             {([Facebook, Instagram] as React.ElementType[]).map((Icon, i) => (
//               <a
//                 key={i}
//                 href="#"
//                 className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center hover:bg-secondary hover:border-secondary text-white/50 hover:text-white transition-all"
//               >
//                 <Icon className="w-4 h-4" />
//               </a>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 text-[13px] text-center text-white/20">
//         © {new Date().getFullYear()} EN-AVM Academy — Prof. Dr. Ebtessam Nada.{" "}
//         {t("All rights reserved.", "جميع الحقوق محفوظة.")}
//       </div>
//     </footer>
//   );
// };
"use client";

import Link from "next/link";
import { Mail, MapPin, Facebook, Instagram } from "lucide-react";
import { useLanguage } from "@/app/hooks/useLanguage";

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
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
              <span className="font-bold text-white text-base font-serif">
                S
              </span>
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
              dktwrabtsam60@gmail.com
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
