"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Send, CheckCircle2, ArrowLeft } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

export function ContactSection() {
  const { t } = useTranslation()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const contactInfo = [
    {
      icon: MapPin,
      label: t("address"),
      value: t("address_value"),
    },
    {
      icon: Phone,
      label: t("phone"),
      value: t("phone_value"),
    },
    {
      icon: Mail,
      label: t("email"),
      value: t("email_value"),
    },
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("contactEmail"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    }

    const promise = fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(async (res) => {
      if (!res.ok) throw new Error("Failed to send")
      setSubmitted(true)
      return res.json()
    })

    toast.promise(promise, {
      loading: 'Sending your message...',
      success: 'Message delivered successfully!',
      error: 'Could not send message. Please try again.',
    })

    try {
      await promise
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-[hsl(40,90%,45%)] mb-3">
            {t("contact_us")}
          </p>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
            {t("get_in_touch")}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground leading-relaxed">
            {t("contact_subtitle")}
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
              <h3 className="text-base font-semibold text-foreground mb-2">{t("office_hours")}</h3>
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <p>{t("mon_fri")}</p>
                <p>{t("saturday")}</p>
                <p>{t("sunday")}</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-xl bg-card border border-border p-6 min-h-[400px] flex flex-col justify-center">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-green-500 mb-6">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Message Sent!</h3>
                <p className="text-muted-foreground max-w-[280px] mx-auto mb-8">
                  Thank you for reaching out. We have received your message and will get back to you soon.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setSubmitted(false)}
                  className="gap-2 rounded-full border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white transition-all"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="firstName">{t("first_name")}</Label>
                    <Input name="firstName" id="firstName" placeholder="Abebe" required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="lastName">{t("last_name")}</Label>
                    <Input name="lastName" id="lastName" placeholder="Tadesse" required />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="contactEmail">{t("email")}</Label>
                  <Input name="contactEmail" id="contactEmail" type="email" placeholder="you@church.org" required />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="subject">{t("subject")}</Label>
                  <Input name="subject" id="subject" placeholder={t("subject_placeholder")} required />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="message">{t("message")}</Label>
                  <Textarea name="message" id="message" placeholder={t("message_placeholder")} rows={4} required />
                </div>
                <Button type="submit" disabled={loading} className="w-full gap-2 bg-[hsl(222,47%,11%)] text-[hsl(0,0%,98%)] hover:bg-[hsl(222,47%,16%)]">
                  {loading ? "Sending..." : (
                    <>
                      <Send className="h-4 w-4" />
                      {t("send_message")}
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
