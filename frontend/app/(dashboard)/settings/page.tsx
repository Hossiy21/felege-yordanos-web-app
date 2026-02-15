import { Settings } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          System configuration and preferences
        </p>
      </div>
      <Card className="border border-border">
        <CardContent className="flex flex-col items-center justify-center py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <Settings className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            Settings Coming Soon
          </h2>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            System configuration will be available here. This includes organization settings, notification preferences, and security options.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
