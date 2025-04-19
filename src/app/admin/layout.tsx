import { Metadata } from "next"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"

export const metadata: Metadata = {
  title: "Admin Dashboard | UrbanPulse",
  description: "Manage users and incidents on the UrbanPulse platform",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-muted/20">
      <AdminSidebar />
      {/* Spacer div to compensate for the fixed sidebar */}
      <div className="hidden md:block md:w-64 shrink-0" />
      <div className="flex-1">
        <AdminHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
