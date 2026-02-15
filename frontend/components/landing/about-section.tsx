import { BookOpen, Users, Globe, Heart } from "lucide-react"

const values = [
  {
    icon: BookOpen,
    title: "Religious Education",
    description:
      "Teaching the scriptures and traditions of the Ethiopian Orthodox Tewahedo Church to all generations.",
  },
  {
    icon: Users,
    title: "Community Growth",
    description:
      "Fostering a strong sense of community and fellowship among our Sunday School members.",
  },
  {
    icon: Heart,
    title: "Spiritual Service",
    description:
      "Encouraging our members to serve others through charity and spiritual dedication.",
  },
  {
    icon: Globe,
    title: "Cultural Heritage",
    description:
      "Preserving and celebrating the deep spiritual and cultural roots of our faith.",
  },
]

export function AboutSection() {
  return (
    <section id="about" className="py-20 lg:py-28 bg-muted/50">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-[hsl(40,90%,45%)] mb-3">
            About Us
          </p>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
            Our Sunday School's Mission
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-muted-foreground leading-relaxed">
            Felege Yordanos Sunday School at Bole Debre Salem Medhanealem Cathedral is dedicated to
            providing spiritual guidance, religious education, and community service while preserving
            the rich traditions of the Ethiopian Orthodox Tewahedo Church.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v) => (
            <div
              key={v.title}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[hsl(222,47%,11%)] text-[hsl(40,90%,50%)] mb-4">
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
