import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

// GET /api/communities/[id] - Get a specific community
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const communityId = params.id

    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    // Get the community
    const community = await prisma.community.findUnique({
      where: { id: communityId },
      include: {
        location: true,
        members: {
          include: {
            user: true
          }
        }
      }
    })

    if (!community) {
      return NextResponse.json(
        { error: "Community not found" },
        { status: 404 }
      )
    }

    // Check if the user is a member or admin
    const isMember = community.members.some(member => member.user.id === userId)
    const isAdmin = community.members.some(member => member.user.id === userId && member.role === 'ADMIN')

    // Format the response
    const formattedCommunity = {
      id: community.id,
      name: community.name,
      description: community.description,
      locationId: community.locationId,
      locationName: [community.location?.city, community.location?.state, community.location?.country]
                   .filter(Boolean).join(', '),
      memberCount: community.members.length,
      isAdmin,
      isMember,
      createdAt: community.createdAt.toISOString(),
      members: community.members.map(member => ({
        id: member.id,
        userId: member.userId,
        role: member.role,
        joinedAt: member.joinedAt.toISOString(),
        user: {
          id: member.user.id,
          name: member.user.name,
          image: member.user.image
        }
      }))
    }

    return NextResponse.json(formattedCommunity)
  } catch (error) {
    console.error("Error fetching community:", error)
    return NextResponse.json(
      { error: "Failed to fetch community" },
      { status: 500 }
    )
  }
}

// PATCH /api/communities/[id] - Update a community
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const communityId = params.id
    const userId = session.user.id

    // Check if the community exists
    const community = await prisma.community.findUnique({
      where: { id: communityId },
      include: {
        members: true
      }
    })

    if (!community) {
      return NextResponse.json(
        { error: "Community not found" },
        { status: 404 }
      )
    }

    // Check if the user is an admin
    const isAdmin = community.members.some(member => member.userId === userId && member.role === 'ADMIN')

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Only admins can update the community" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, description } = body

    // Update the community
    const updatedCommunity = await prisma.community.update({
      where: { id: communityId },
      data: {
        name: name || community.name,
        description: description || community.description,
        updatedAt: new Date()
      },
      include: {
        location: true,
        members: {
          include: {
            user: true
          }
        }
      }
    })

    // Format the response
    const formattedCommunity = {
      id: updatedCommunity.id,
      name: updatedCommunity.name,
      description: updatedCommunity.description,
      locationId: updatedCommunity.locationId,
      locationName: [updatedCommunity.location?.city, updatedCommunity.location?.state, updatedCommunity.location?.country]
                   .filter(Boolean).join(', '),
      memberCount: updatedCommunity.members.length,
      isAdmin: true,
      isMember: true,
      createdAt: updatedCommunity.createdAt.toISOString(),
      members: updatedCommunity.members.map(member => ({
        id: member.id,
        userId: member.userId,
        role: member.role,
        joinedAt: member.joinedAt.toISOString(),
        user: {
          id: member.user.id,
          name: member.user.name,
          image: member.user.image
        }
      }))
    }

    return NextResponse.json(formattedCommunity)
  } catch (error) {
    console.error("Error updating community:", error)
    return NextResponse.json(
      { error: "Failed to update community" },
      { status: 500 }
    )
  }
}

// DELETE /api/communities/[id] - Delete a community
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const communityId = params.id
    const userId = session.user.id

    // Check if the community exists
    const community = await prisma.community.findUnique({
      where: { id: communityId },
      include: {
        members: true
      }
    })

    if (!community) {
      return NextResponse.json(
        { error: "Community not found" },
        { status: 404 }
      )
    }

    // Check if the user is an admin
    const isAdmin = community.members.some(member => member.userId === userId && member.role === 'ADMIN')

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Only admins can delete the community" },
        { status: 403 }
      )
    }

    // Delete all members first
    await prisma.communityMember.deleteMany({
      where: { communityId }
    })

    // Delete the community
    await prisma.community.delete({
      where: { id: communityId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting community:", error)
    return NextResponse.json(
      { error: "Failed to delete community" },
      { status: 500 }
    )
  }
}
