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
    [t("platform")]: [
      { label: t("dashboard"), href: "/dashboard" },
      { label: t("letters"), href: "/letters/incoming" },
      { label: t("meetings"), href: "/meetings" },
      { label: t("documents"), href: "/documents" },
    ],
    [t("legal")]: [
      { label: t("privacy_policy"), href: "#" },
      { label: t("terms_of_service"), href: "#" },
    ],
  }

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[hsl(222,47%,11%)] text-[hsl(40,90%,50%)] font-bold text-xs">
                FY
              </div>
              <span className="text-lg font-bold text-foreground">Felege Yordanos</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              ቦሌ ደብረ ሳሌም መድኃኔዓለም መጥምቁ ቅዱስ ዮሐንስ ወአቡነ አረጋዊ ካቴድራል ፈለገ ዮርዳኖስ ሰንበት ትምህርት ቤት
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-foreground mb-4">{title}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            {t("footer_copyright")}
          </p>
          <p className="text-xs text-muted-foreground font-amharic">
            {t("footer_amharic")}
          </p>
        </div>
      </div>
    </footer>
  )
}
