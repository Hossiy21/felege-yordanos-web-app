"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Send } from "lucide-react"

const contactInfo = [
  {
    icon: MapPin,
    label: "Address",
    value: "Bole, Addis Ababa, Ethiopia (Debre Salem Medhanealem)",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+251 11 662 0000 / +251 900 000 000",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@felegeyordanos.org",
  },
]

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section id="contact" className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-[hsl(40,90%,45%)] mb-3">
            Contact Us
          </p>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
            Get in Touch
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground leading-relaxed">
            Have questions for Felege Yordanos Sunday School? Reach out to us.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              {contactInfo.map((c) => (
                <div key={c.label} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[hsl(222,47%,11%)] text-[hsl(40,90%,50%)]">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{c.label}</p>
                    <p className="text-sm text-muted-foreground">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-muted/50 border border-border p-6">
              <h3 className="text-base font-semibold text-foreground mb-2">Office Hours</h3>
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                <p>Saturday: 9:00 AM - 1:00 PM</p>
                <p>Sunday: After church service</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-xl bg-card border border-border p-6">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success mb-4">
                  <Send className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Message Sent</h3>
                <p className="text-sm text-muted-foreground">
                  Thank you for reaching out. We will get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Abebe" required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Tadesse" required />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input id="contactEmail" type="email" placeholder="you@church.org" required />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" required />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Tell us more about your needs..." rows={4} required />
                </div>
                <Button type="submit" className="w-full gap-2 bg-[hsl(222,47%,11%)] text-[hsl(0,0%,98%)] hover:bg-[hsl(222,47%,16%)]">
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
