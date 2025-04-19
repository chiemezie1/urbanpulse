import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { v4 as uuidv4 } from 'uuid'

// GET /api/communities/:id/posts - Get all posts for a community
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const communityId = params.id
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const skip = (page - 1) * pageSize

    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if the community exists
    const community = await prisma.community.findUnique({
      where: { id: communityId },
      include: {
        members: {
          where: { userId: session.user.id }
        }
      }
    })

    if (!community) {
      return NextResponse.json(
        { error: "Community not found" },
        { status: 404 }
      )
    }

    // Get posts for this community
    const posts = await prisma.post.findMany({
      where: {
        communityId: communityId,
      },
      include: {
        User: true,
        likes: {
          select: {
            id: true,
            userId: true
          }
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            User: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 3 // Just get the 3 most recent comments for preview
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: pageSize
    })

    // Count total posts for pagination
    const totalPosts = await prisma.post.count({
      where: {
        communityId: communityId
      }
    })

    // Format the posts to include whether the current user has liked them
    const formattedPosts = posts.map(post => ({
      id: post.id,
      content: post.content,
      createdAt: post.createdAt.toISOString(),
      author: post.User,
      likes: post.likes.length,
      hasLiked: post.likes.some(like => like.userId === session.user.id),
      comments: post.comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
        author: comment.User
      })),
      commentCount: post.comments.length
    }))

    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        page,
        pageSize,
        totalPages: Math.ceil(totalPosts / pageSize),
        totalItems: totalPosts
      }
    })
  } catch (error) {
    console.error("Error fetching community posts:", error)
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    )
  }
}

// POST /api/communities/:id/posts - Create a new post in a community
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const communityId = params.id
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const body = await request.json()
    const { content } = body

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Post content is required" },
        { status: 400 }
      )
    }

    // Check if the user is a member of the community
    const membership = await prisma.communityMember.findFirst({
      where: {
        communityId,
        userId
      }
    })

    if (!membership) {
      return NextResponse.json(
        { error: "You must be a member of the community to post" },
        { status: 403 }
      )
    }

    // Get user to get their locationId
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { locationId: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Create the post
    const post = await prisma.post.create({
      data: {
        id: uuidv4(),
        content,
        authorId: userId,
        communityId,
        locationId: user.locationId,
        category: "COMMUNITY", // Default category for community posts
        isPublic: true, // Community posts are public by default
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        User: true
      }
    })

    return NextResponse.json({
      id: post.id,
      content: post.content,
      createdAt: post.createdAt.toISOString(),
      author: post.User,
      likes: 0,
      hasLiked: false,
      comments: [],
      commentCount: 0
    })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    )
  }
}
