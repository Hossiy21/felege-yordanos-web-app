"use client"

import Link from "next/link"
import { useTranslation } from "react-i18next"

export function LandingFooter() {
  const { t } = useTranslation()

  const footerLinks = {
    [t("quick_links")]: [
      { label: t("home"), href: "/home" },
      { label: t("about"), href: "/about" },
      { label: t("news_events"), href: "/news" },
      { label: t("gallery"), href: "/gallery" },
      { label: t("classes"), href: "/classes" },
      { label: t("contact"), href: "/contact" },
    ],
  }

  return (
    <footer className="relative border-t border-white/10 bg-[#001229] overflow-hidden text-white w-full mt-auto">
      {/* ── Subtle Premium Abstract Background ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a274a]/40 to-transparent" />

        {/* Subtle architectural grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />

        {/* Faint ambient orbs */}
        <div className="absolute -top-[50%] -left-[10%] w-[500px] h-[500px] bg-[#0066cc]/5 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[50%] right-[0%] w-[500px] h-[500px] bg-[#FFB800]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
          {/* Brand */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0a274a] to-[#001229] border border-white/10 text-[#FFB800] font-black text-lg shadow-lg">
                FY
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-tight leading-tight">Felege Yordanos</span>
                <span className="text-[10px] font-bold text-[#FFB800] uppercase tracking-widest">{t("sunday_school", "Sunday School")}</span>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed font-medium max-w-sm">
              ቦሌ ደብረ ሳሌም መድኃኔዓለም መጥምቁ ቅዱስ ዮሐንስ ወአቡነ አረጋዊ ካቴድራል ፈለገ ዮርዳኖስ ሰንበት ትምህርት ቤት
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="flex flex-col gap-3">
              <h4 className="text-[13px] font-black text-white uppercase tracking-widest">{title}</h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-white/50 hover:text-[#FFB800] hover:translate-x-1 transition-all inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
            {t("footer_copyright")} © {new Date().getFullYear()}
          </p>

        </div>
      </div>
    </footer>
  )
}
