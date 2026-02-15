import { AuditLogsList } from "@/components/audit/audit-logs-list"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function AuditLogsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground text-balance">Audit Logs</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Complete trail of all system actions and changes
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>
      <AuditLogsList />
    </div>
  )
}
