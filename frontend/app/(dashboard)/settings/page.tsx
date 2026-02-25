"use client"

import { useState } from "react"
import { Building2, Globe, Bell, Shield, Palette, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTranslation } from "react-i18next"
import i18nInstance from "@/lib/i18n"

export default function SettingsPage() {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const changeLanguage = (lng: string) => {
    if (i18nInstance && typeof i18nInstance.changeLanguage === 'function') {
      i18nInstance.changeLanguage(lng)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">{t("settings_title")}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {t("settings_desc")}
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="general">{t("general")}</TabsTrigger>
          <TabsTrigger value="notifications">{t("notifications_tab")}</TabsTrigger>
          <TabsTrigger value="security">{t("security")}</TabsTrigger>
          <TabsTrigger value="appearance">{t("appearance_tab")}</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle>{t("org_details")}</CardTitle>
              </div>
              <CardDescription>
                {t("org_details_desc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="orgName">{t("org_name")}</Label>
                <Input id="orgName" defaultValue="Felege Yordanos Church" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">{t("official_email")}</Label>
                <Input id="email" defaultValue="contact@felegeyordanos.org" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">{t("address")}</Label>
                <Textarea id="address" defaultValue="Addis Ababa, Ethiopia" />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 bg-muted/40 flex justify-end">
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? t("saving") : t("save_changes")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>{t("notifications_tab")}</CardTitle>
              </div>
              <CardDescription>
                Configure how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about new letters and updates.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Meeting Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified 1 hour before scheduled meetings.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Weekly Digest</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a weekly summary of all activities.
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 bg-muted/40 flex justify-end">
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? t("saving") : t("save_changes")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>{t("security")}</CardTitle>
              </div>
              <CardDescription>
                Manage your password and security settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current">Current Password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new">New Password</Label>
                  <Input id="new" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm Password</Label>
                  <Input id="confirm" type="password" />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between space-x-2 pt-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account.
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 bg-muted/40 flex justify-end">
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? t("saving") : t("save_changes")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                <CardTitle>{t("appearance_tab")}</CardTitle>
              </div>
              <CardDescription>
                Customize the look and feel of the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-20 w-full rounded-md bg-white border-2 border-muted shadow-sm hover:border-primary cursor-pointer transition-colors" />
                    <span className="text-sm font-medium">Light</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-20 w-full rounded-md bg-slate-950 border-2 border-muted shadow-sm hover:border-primary cursor-pointer transition-colors" />
                    <span className="text-sm font-medium">Dark</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-20 w-full rounded-md bg-slate-100 border-2 border-muted shadow-sm hover:border-primary cursor-pointer transition-colors flex items-center justify-center">
                      <div className="w-1/2 h-full bg-slate-950 rounded-r-md"></div>
                    </div>
                    <span className="text-sm font-medium">System</span>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>{t("language")}</Label>
                <Select value={i18nInstance.language} onValueChange={changeLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="am">Amharic (አማርኛ)</SelectItem>
                    <SelectItem value="gez">Ge'ez (ግዕዝ)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select your preferred language for the interface.
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 bg-muted/40 flex justify-end">
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? t("saving") : t("save_changes")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
