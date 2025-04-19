"use client"

// This page is for managing an existing community

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { CommunityManagement } from "@/components/community-management"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function CommunityManagePage() {
  const { status } = useSession()
  const router = useRouter()
  const [communityId, setCommunityId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { searchParams } = new URL(window.location.href)
      const id = searchParams.get('id')
      if (id) {
        setCommunityId(id)
      }
      setIsLoading(false)
    }
  }, [])

  // Listen for URL changes
  useEffect(() => {
    const handleRouteChange = () => {
      if (typeof window !== 'undefined') {
        const { searchParams } = new URL(window.location.href)
        const id = searchParams.get('id')
        if (id && id !== communityId) {
          setCommunityId(id)
        }
      }
    }

    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [communityId])

  if (status === "loading" || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  if (!communityId) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">No community selected</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/dashboard/community")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go to Communities
        </Button>
      </div>
    )
  }

  return <CommunityManagement communityId={communityId} />
}
