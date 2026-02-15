import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Abebe Tadesse",
    role: "Sunday School Director",
    initials: "AT",
    quote:
      "SST Manager has transformed how we handle correspondence. What used to take hours of paperwork now takes minutes. The letter tracking feature alone saved us countless hours.",
    rating: 5,
  },
  {
    name: "Sara Mekonnen",
    role: "Finance Committee Lead",
    initials: "SM",
    quote:
      "The approval workflow is exactly what we needed. Now every financial letter goes through the proper channels, and we have a complete audit trail for accountability.",
    rating: 5,
  },
  {
    name: "Daniel Kebede",
    role: "Church Administrator",
    initials: "DK",
    quote:
      "Managing meeting minutes and decisions used to be chaotic. With SST Manager, everything is organized, searchable, and accessible to the right people.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-muted/50">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-[hsl(40,90%,45%)] mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
            Trusted by Sunday School Leaders
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground leading-relaxed">
            Hear from the people who use SST Manager every day to run their operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col p-6 rounded-xl bg-card border border-border"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-[hsl(40,90%,50%)] text-[hsl(40,90%,50%)]"
                  />
                ))}
              </div>
              <blockquote className="flex-1 text-sm text-muted-foreground leading-relaxed mb-6">
                {`"${t.quote}"`}
              </blockquote>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <Avatar className="h-10 w-10 bg-[hsl(222,47%,11%)] text-[hsl(0,0%,98%)]">
                  <AvatarFallback className="bg-[hsl(222,47%,11%)] text-[hsl(0,0%,98%)] text-xs font-semibold">
                    {t.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
