import { Mail, Send, CalendarDays, FileText, ClipboardList, Users, Settings, ShieldCheck } from "lucide-react"

const programs = [
  {
    icon: Mail,
    title: "Incoming Letters",
    description: "Register, track, and manage all received correspondence with status tracking and department routing.",
    tag: "Letter Management",
  },
  {
    icon: Send,
    title: "Outgoing Letters",
    description: "Draft, approve, and send official letters with reference numbering and approval workflows.",
    tag: "Letter Management",
  },
  {
    icon: CalendarDays,
    title: "Meeting Management",
    description: "Schedule meetings, track decisions and attendees, and maintain a complete record of minutes.",
    tag: "Operations",
  },
  {
    icon: FileText,
    title: "Document Storage",
    description: "Securely upload, organize, and retrieve important documents with type categorization.",
    tag: "Operations",
  },
  {
    icon: ClipboardList,
    title: "Audit Logs",
    description: "Complete trail of all system actions and changes for accountability and transparency.",
    tag: "Administration",
  },
  {
    icon: Users,
    title: "User Management",
    description: "Manage users, roles, and permissions across departments with activity monitoring.",
    tag: "Administration",
  },
  {
    icon: ShieldCheck,
    title: "Approval Workflows",
    description: "Multi-step approval processes for letters and documents with notification support.",
    tag: "Workflow",
  },
  {
    icon: Settings,
    title: "System Settings",
    description: "Configure departments, templates, notification preferences, and system-wide settings.",
    tag: "Configuration",
  },
]

export function ProgramsSection() {
  return (
    <section id="programs" className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-[hsl(40,90%,45%)] mb-3">
            Features & Programs
          </p>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
            Everything You Need to Manage
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground leading-relaxed">
            A complete suite of tools designed specifically for Sunday School administration and operations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((p) => (
            <div
              key={p.title}
              className="group flex flex-col p-6 rounded-xl border border-border bg-card hover:border-[hsl(40,90%,50%)]/40 hover:shadow-md transition-all"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground mb-4 group-hover:bg-[hsl(222,47%,11%)] group-hover:text-[hsl(40,90%,50%)] transition-colors">
                <p.icon className="h-5 w-5" />
              </div>
              <span className="inline-block self-start rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-3">
                {p.tag}
              </span>
              <h3 className="text-base font-semibold text-foreground mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
