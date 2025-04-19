import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        comments: true,
        likes: true,
      },
    })

    // Transform the data to match the expected format
    const formattedPosts = posts.map(post => ({
      id: post.id,
      content: post.content,
      createdAt: post.createdAt.toISOString(),
      user: {
        id: post.User?.id || '',
        name: post.User?.name || 'Unknown User',
        image: post.User?.image || '/placeholder.svg',
      },
      _count: {
        comments: post.comments?.length || 0,
        likes: post.likes?.length || 0,
      },
    }))

    return NextResponse.json(formattedPosts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { content } = await request.json()
    const userId = session.user.id

    // Get user's location
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { locationId: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create post with required fields
    const post = await prisma.post.create({
      data: {
        id: `post_${Date.now()}`,
        content,
        authorId: userId,
        locationId: user.locationId,
        category: "general",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    // Format the response to match expected structure
    const formattedPost = {
      id: post.id,
      content: post.content,
      createdAt: post.createdAt.toISOString(),
      user: {
        id: post.User?.id || '',
        name: post.User?.name || 'Unknown User',
        image: post.User?.image || '/placeholder.svg',
      },
      _count: {
        comments: 0,
        likes: 0,
      },
    }

    return NextResponse.json(formattedPost, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Failed to create post", details: String(error) }, { status: 500 })
  }
}
