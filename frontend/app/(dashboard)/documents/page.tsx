import { DocumentsTable } from "@/components/documents/documents-table"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

export default function DocumentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground text-balance">Documents</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage uploaded files and scanned documents
          </p>
        </div>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
      </div>
      <DocumentsTable />
    </div>
  )
}
