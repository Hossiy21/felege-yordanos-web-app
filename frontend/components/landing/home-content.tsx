"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import {
    BookOpen,
    Users,
    Heart,
    Globe,
    ArrowRight,
    ChevronRight,
    MapPin,
    Phone,
    Mail,
    Clock,
    Calendar,
    Star,
    Flame,
    GraduationCap,
    Music,
    HandHeart,
    Church,
    Quote,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "react-i18next"
import { getRecentNews, type NewsArticle } from "@/lib/news-store"

// ─── Animated Counter ─────────────────────────────────────────────────────────
function useCounter(target: number, duration = 2000) {
    const [count, setCount] = useState(0)
    const [started, setStarted] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting && !started) setStarted(true) },
            { threshold: 0.5 }
        )
        if (ref.current) obs.observe(ref.current)
        return () => obs.disconnect()
    }, [started])

    useEffect(() => {
        if (!started) return
        let t0: number | null = null
        const step = (ts: number) => {
            if (!t0) t0 = ts
            const p = Math.min((ts - t0) / duration, 1)
            setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target))
            if (p < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
    }, [started, target, duration])

    return { count, ref }
}

function StatCard({ target, suffix, label, sub }: { target: number; suffix?: string; label: string; sub: string }) {
    const { count, ref } = useCounter(target)
    return (
        <div ref={ref} className="flex flex-col items-center text-center p-8 rounded-2xl bg-[#0a274a] shadow-xl hover:-translate-y-1 transition-transform duration-300">
            <span className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">{count}{suffix}</span>
            <span className="mt-4 text-[15px] font-bold text-[#FFB800] tracking-wide uppercase">{label}</span>
            <span className="mt-2 text-sm text-white/60 font-medium leading-relaxed max-w-[160px]">{sub}</span>
        </div>
    )
}

// ─── Main Page Content ────────────────────────────────────────────────────────
export function HomeContent() {
    const { t } = useTranslation()
    const [articles, setArticles] = useState<NewsArticle[]>([])
    const [newsLoading, setNewsLoading] = useState(true)

    useEffect(() => {
        getRecentNews(3).then(setArticles).catch(console.error).finally(() => setNewsLoading(false))
    }, [])

    const stats = [
        { target: 500, suffix: "+", label: "Students", sub: "Active Sunday School members" },
        { target: 30, suffix: "+", label: "Years", sub: "Serving the community" },
        { target: 20, suffix: "+", label: "Teachers", sub: "Dedicated spiritual educators" },
        { target: 12, suffix: "", label: "Programs", sub: "Weekly spiritual activities" },
    ]

    const values = [
        { icon: BookOpen, label: t("religious_education"), desc: t("religious_education_desc"), color: "bg-blue-600" },
        { icon: Users, label: t("community_growth"), desc: t("community_growth_desc"), color: "bg-emerald-600" },
        { icon: Heart, label: t("spiritual_service"), desc: t("spiritual_service_desc"), color: "bg-rose-600" },
        { icon: Globe, label: t("cultural_heritage"), desc: t("cultural_heritage_desc"), color: "bg-amber-600" },
    ]

    const programs = [
        { icon: BookOpen, name: t("program_biblical"), desc: "In-depth study of Old and New Testaments" },
        { icon: Music, name: t("program_zema"), desc: "Traditional Ethiopian liturgical chanting" },
        { icon: GraduationCap, name: t("program_theology"), desc: "Core teachings of the Tewahedo faith" },
        { icon: HandHeart, name: t("program_community"), desc: "Outreach programs serving those in need" },
        { icon: Flame, name: t("program_prayer"), desc: "Guided spiritual disciplines" },
        { icon: Church, name: t("program_liturgy"), desc: "Preserving 2,000-year-old sacred rites" },
    ]

    const contactInfo = [
        { icon: MapPin, label: t("address"), value: t("address_value") },
        { icon: Phone, label: t("phone"), value: "+251 11 662 0000" },
        { icon: Mail, label: t("email"), value: "info@felegeyordanos.org" },
        { icon: Clock, label: t("office_hours"), value: "Sun: 2:00–5:30 AM (Eth) | Sat: Morning" },
    ]

    return (
        <>
            {/* ══════════════════════════════════════════════════════════
          STATS BAND  (dark navy)
      ══════════════════════════════════════════════════════════ */}
            <section className="relative py-20 z-10 -mt-20">
                <div className="relative mx-auto max-w-6xl px-6 z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {stats.map((s) => <StatCard key={s.label} {...s} />)}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
          ABOUT PREVIEW
      ══════════════════════════════════════════════════════════ */}
            <section className="py-24 lg:py-32">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left: text */}
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-widest text-[hsl(40,90%,45%)] mb-3">
                                Who We Are
                            </p>
                            <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance mb-6">
                                Rooted in Faith,{" "}
                                <span className="text-[#003366] dark:text-[#FFB800]">Growing in Grace</span>
                            </h2>
                            <p className="text-muted-foreground leading-relaxed mb-5 text-base text-justify">
                                Felege Yordanos — <em>"Stream of Jordan"</em> — is the Sunday School of Bole Debre Salem
                                Medhanealem Cathedral in Addis Ababa, Ethiopia. For over three decades we have been a spiritual
                                home for hundreds of young Orthodox believers.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mb-8 text-base text-justify">
                                Our mission is to nurture the next generation in the living tradition of the Ethiopian Orthodox
                                Tewahedo Church through Biblical study, liturgy, music, and community service.
                            </p>

                            {/* Scripture */}
                            <div className="rounded-2xl bg-[#003366]/5 dark:bg-[#FFB800]/5 border border-[#003366]/10 dark:border-[#FFB800]/10 p-5 mb-8">
                                <Quote className="h-5 w-5 text-[#FFB800] mb-2" />
                                <p className="text-sm text-foreground italic font-medium leading-relaxed">
                                    "Train up a child in the way he should go; even when he is old he will not depart from it."
                                </p>
                                <p className="text-xs text-[#003366] dark:text-[#FFB800] font-bold mt-2">— Proverbs 22:6</p>
                            </div>

                            <Link href="/about">
                                <Button className="bg-[#003366] text-white hover:bg-[#003366]/90 font-bold px-7 rounded-full group">
                                    Learn Our Full Story
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>

                        {/* Right: church image card */}
                        <div className="relative">
                            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] border border-border shadow-2xl">
                                <img
                                    src="/images/bole-church.png"
                                    alt="Bole Debre Salem Medhanealem Cathedral"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/60 to-transparent" />

                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
          OUR VALUES
      ══════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-muted/40">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="text-center mb-16">
                        <p className="text-sm font-semibold uppercase tracking-widest text-[hsl(40,90%,45%)] mb-3">
                            What Guides Us
                        </p>
                        <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
                            Our Core Values
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground leading-relaxed">
                            These four pillars define everything we teach, how we serve, and who we are as a community.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((v, i) => (
                            <div key={v.label} className="group flex flex-col p-7 rounded-2xl border border-border bg-card hover:shadow-lg hover:-translate-y-1 transition-all hover:border-[#FFB800]/30">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${v.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                                    <v.icon className="h-6 w-6" />
                                </div>
                                <div className="text-3xl font-extrabold text-[#003366] dark:text-[#FFB800] mb-2 opacity-10 select-none">
                                    {String(i + 1).padStart(2, "0")}
                                </div>
                                <h3 className="text-base font-bold text-foreground mb-2">{v.label}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
          SCRIPTURE BANNER
      ══════════════════════════════════════════════════════════ */}
            <section className="py-20 bg-gradient-to-r from-[#003366] to-[#004080] relative overflow-hidden">
                <div className="absolute inset-0 opacity-5" aria-hidden>
                    <div className="h-full w-full bg-[repeating-linear-gradient(45deg,white,white_1px,transparent_0,transparent_50%)] bg-[length:10px_10px]" />
                </div>
                <div className="relative mx-auto max-w-3xl px-6 text-center">
                    <Quote className="h-10 w-10 text-[#FFB800] mx-auto mb-5 opacity-80" />
                    <blockquote className="text-2xl sm:text-3xl font-bold text-white leading-snug italic">
                        "Ask, and it will be given to you; seek, and you will find; knock, and it will be opened to you."
                    </blockquote>
                    <p className="mt-5 text-[#FFB800] font-semibold tracking-wide">— Matthew 7:7</p>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
          PROGRAMS
      ══════════════════════════════════════════════════════════ */}
            <section id="programs" className="py-24 lg:py-32">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-widest text-[hsl(40,90%,45%)] mb-3">
                                What We Offer
                            </p>
                            <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
                                Our Spiritual Programs
                            </h2>
                        </div>

                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {programs.map((p) => (
                            <div key={p.name} className="group flex items-start gap-4 p-5 rounded-xl border border-border bg-card hover:border-[#FFB800]/40 hover:shadow-md transition-all">
                                <div className="flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-xl bg-[#003366] dark:bg-[#FFB800]/10 text-[#FFB800] group-hover:scale-110 transition-transform">
                                    <p.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-1">{p.name}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
          NEWS & EVENTS
      ══════════════════════════════════════════════════════════ */}
            <section id="news" className="py-24 bg-muted/30">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-widest text-[hsl(40,90%,45%)] mb-3">
                                {t("news_events_title")}
                            </p>
                            <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
                                {t("news_subtitle")}
                            </h2>
                        </div>
                        <Link href="/news">
                            <Button variant="outline" className="rounded-full border-[#003366] text-[#003366] dark:border-[#FFB800] dark:text-[#FFB800] font-semibold group">
                                {t("view_all_news")}
                                <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {newsLoading ? (
                            [1, 2, 3].map((i) => (
                                <div key={i} className="rounded-2xl bg-card border border-border overflow-hidden animate-pulse">
                                    <div className="aspect-video bg-muted" />
                                    <div className="p-6 space-y-3">
                                        <div className="h-3 bg-muted rounded w-1/3" />
                                        <div className="h-5 bg-muted rounded" />
                                        <div className="h-4 bg-muted rounded w-5/6" />
                                    </div>
                                </div>
                            ))
                        ) : articles.length === 0 ? (
                            <div className="col-span-full text-center py-16 rounded-2xl bg-card border border-dashed border-border">
                                <p className="text-muted-foreground italic">{t("check_back_soon")}</p>
                            </div>
                        ) : (
                            articles.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/news/${item.slug || item.id}`}
                                    className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:border-[#FFB800]/30 transition-all"
                                >
                                    <div className="aspect-video overflow-hidden relative">
                                        <img
                                            src={item.image_url || "https://images.unsplash.com/photo-1544427928-c49cddee6eac?q=80&w=800&auto=format&fit=crop"}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        {item.category && (
                                            <div className="absolute top-3 left-3">
                                                <Badge className="bg-[#FFB800] text-[#003366] font-bold text-[10px] uppercase tracking-wider border-none">
                                                    {item.category}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </div>
                                        <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-[#003366] dark:group-hover:text-[#FFB800] transition-colors line-clamp-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1 mb-4">
                                            {item.summary}
                                        </p>
                                        <span className="flex items-center gap-1 text-xs font-bold text-[#003366] dark:text-[#FFB800] uppercase tracking-wider group-hover:gap-2 transition-all">
                                            {t("read_more")} <ArrowRight className="h-3.5 w-3.5" />
                                        </span>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
          CONTACT TEASER
      ══════════════════════════════════════════════════════════ */}
            <section id="contact" className="py-24 lg:py-32">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                        {/* Left info */}
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-widest text-[hsl(40,90%,45%)] mb-3">
                                {t("contact_us")}
                            </p>
                            <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-6 text-balance">
                                {t("get_in_touch")}
                            </h2>
                            <p className="text-muted-foreground leading-relaxed mb-10">
                                We welcome all inquiries, partnerships, and prayer requests. Reach us at the cathedral or contact
                                us online — we'd love to hear from you.
                            </p>
                            <div className="flex flex-col gap-5">
                                {contactInfo.map((c) => (
                                    <div key={c.label} className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#003366] text-[#FFB800]">
                                            <c.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">{c.label}</p>
                                            <p className="text-sm text-muted-foreground">{c.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8">
                                <Link href="/contact">
                                    <Button className="bg-[#003366] text-white hover:bg-[#003366]/90 font-bold px-7 rounded-full group">
                                        {t("contact_us")}
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Right: map card placeholder with church bg */}
                        <div className="relative rounded-3xl overflow-hidden border border-border shadow-xl aspect-[4/3]">
                            <img
                                src="/images/bole-church.png"
                                alt="Cathedral location"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/80 via-[#003366]/30 to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-4">
                                    <div className="flex items-center gap-2 text-white">
                                        <MapPin className="h-4 w-4 text-[#FFB800] shrink-0" />
                                        <p className="text-sm font-semibold">Bole Sub-City, Addis Ababa, Ethiopia</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
          CTA FOOTER BAND
      ══════════════════════════════════════════════════════════ */}

        </>
    )
}
