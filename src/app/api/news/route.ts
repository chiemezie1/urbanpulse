import { NextResponse } from "next/server"
import { getLocalNews } from "@/lib/news"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get("location") || "New York"
  const page = searchParams.get("page") ? Number.parseInt(searchParams.get("page") as string, 10) : 1
  const pageSize = searchParams.get("pageSize") ? Number.parseInt(searchParams.get("pageSize") as string, 10) : 5

  try {
    const newsData = await getLocalNews(location, page, pageSize)
    return NextResponse.json(newsData)
  } catch (error) {
    console.error("Error fetching news data:", error)
    return NextResponse.json({ error: "Failed to fetch news data" }, { status: 500 })
  }
}
