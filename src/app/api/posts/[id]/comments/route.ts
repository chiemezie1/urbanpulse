import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { v4 as uuidv4 } from 'uuid'

// GET /api/posts/[id]/comments - Get all comments for a post
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id

    // Get all comments for the post
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "asc" },
      include: { User: true }
    })

    // Format the comments to match the expected structure
    const formattedComments = comments.map(comment => {
      return {
        id: comment.id,
        content: comment.content,
        postId: comment.postId,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString(),
        user: {
          id: comment.User?.id || '',
          name: comment.User?.name || 'Unknown User',
          image: comment.User?.image || '/placeholder.svg',
        }
      }
    })

    return NextResponse.json(formattedComments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}

// POST /api/posts/[id]/comments - Create a new comment
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Make sure to await params.id
    const { id: postId } = params
    const userId = session.user.id

    // Check if the post exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const { content } = await request.json()

    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      )
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        id: uuidv4(),
        content,
        postId,
        authorId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        User: true
      }
    })

    // Format the comment to match the expected structure
    const formattedComment = {
      id: comment.id,
      content: comment.content,
      postId: comment.postId,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
      user: {
        id: comment.User?.id || '',
        name: comment.User?.name || 'Unknown User',
        image: comment.User?.image || '/placeholder.svg',
      }
    }

    return NextResponse.json(formattedComment)
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    )
  }
}
