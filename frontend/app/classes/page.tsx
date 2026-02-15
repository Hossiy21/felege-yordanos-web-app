import { LandingNav } from "@/components/landing/landing-nav"
import { LandingFooter } from "@/components/landing/landing-footer"
import { BookOpen, Users, Clock, MapPin, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Classes - Felege Yordanos Sunday School",
    description: "Browse our Sunday School classes for all ages, from youth to seniors.",
}

const schoolClasses = [
    {
        name: "Youth Bible Study",
        age: "13 - 18 years",
        time: "Sundays, 9:00 AM - 11:00 AM",
        description: "Deepening spiritual understanding through scripture reading and interactive discussions.",
        icon: GraduationCap
    },
    {
        name: "Elementary Spiritual Growth",
        age: "6 - 12 years",
        time: "Sundays, 9:30 AM - 11:00 AM",
        description: "Foundational teachings of the church through stories, chants, and fellowship.",
        icon: Users
    },
    {
        name: "Adult Theology Class",
        age: "18+ years",
        time: "Saturdays, 4:00 PM - 6:00 PM",
        description: "Advanced theological studies and history of the Ethiopian Orthodox Tewahedo Church.",
        icon: BookOpen
    },
    {
        name: "Liturgical Service Training",
        age: "All ages",
        time: "Fridays, 5:30 PM - 7:30 PM",
        description: "Training for deacons and choir members in the sacred liturgical practices.",
        icon: Clock
    }
]

export default function ClassesPage() {
    return (
        <div className="min-h-screen bg-background">
            <LandingNav />
            <main>
                <div className="bg-[#003366] py-20 text-white">
                    <div className="mx-auto max-w-6xl px-6 text-center">
                        <h1 className="text-4xl font-bold sm:text-5xl mb-6">Our Classes</h1>
                        <p className="text-xl text-white/80 max-w-3xl mx-auto">
                            Nurturing faith across all generations through structured spiritual education.
                        </p>
                    </div>
                </div>

                <section className="py-24">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {schoolClasses.map((item, idx) => (
                                <div key={idx} className="flex flex-col p-8 rounded-2xl border border-border bg-card hover:shadow-xl transition-all group">
                                    <div className="h-12 w-12 rounded-xl bg-[#003366]/5 flex items-center justify-center mb-6 text-[#003366] group-hover:bg-[#FFB800] group-hover:text-white transition-colors duration-300">
                                        <item.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground mb-4">{item.name}</h3>
                                    <div className="flex flex-wrap gap-4 mb-6">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                                            <Users className="h-3 w-3" />
                                            {item.age}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                                            <Clock className="h-3 w-3" />
                                            {item.time}
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed mb-8 flex-1">
                                        {item.description}
                                    </p>
                                    <Button className="w-full bg-[#003366] hover:bg-[#003366]/90 text-white font-bold">
                                        Enroll in this Class
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 bg-muted/50 rounded-2xl p-8 border border-border flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex items-start gap-4 text-left">
                                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Class Locations</h4>
                                    <p className="text-sm text-muted-foreground">
                                        All classes are held at the Bole Debre Salem Medhanealem Cathedral Educational Building.
                                    </p>
                                </div>
                            </div>
                            <Button variant="outline" className="shrink-0 border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white font-bold px-8">
                                Download Schedule
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
            <LandingFooter />
        </div>
    )
}
