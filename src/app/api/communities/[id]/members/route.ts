import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { v4 as uuidv4 } from 'uuid'

// GET /api/communities/[id]/members - Get all members of a community
export async function GET(
  _request: Request, // Prefix with underscore to indicate it's not used
  { params }: { params: { id: string } }
) {
  try {
    const communityId = params.id

    // Check if the community exists
    const community = await prisma.community.findUnique({
      where: { id: communityId }
    })

    if (!community) {
      return NextResponse.json(
        { error: "Community not found" },
        { status: 404 }
      )
    }

    // Get all members
    const members = await prisma.communityMember.findMany({
      where: { communityId },
      include: {
        user: true
      }
    })

    // Format the response
    const formattedMembers = members.map(member => ({
      id: member.id,
      userId: member.userId,
      role: member.role,
      joinedAt: member.joinedAt.toISOString(),
      user: {
        id: member.user.id,
        name: member.user.name,
        image: member.user.image,
        email: member.user.email
      }
    }))

    return NextResponse.json(formattedMembers)
  } catch (error) {
    console.error("Error fetching community members:", error)
    return NextResponse.json(
      { error: "Failed to fetch community members" },
      { status: 500 }
    )
  }
}

// POST /api/communities/[id]/members - Join a community
export async function POST(
  _request: Request, // Prefix with underscore to indicate it's not used
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
        location: true
      }
    })

    if (!community) {
      return NextResponse.json(
        { error: "Community not found" },
        { status: 404 }
      )
    }

    // Check if the user is already a member
    const existingMember = await prisma.communityMember.findFirst({
      where: {
        communityId,
        userId
      }
    })

    if (existingMember) {
      return NextResponse.json(
        { error: "You are already a member of this community" },
        { status: 400 }
      )
    }

    // Add the user as a member
    await prisma.communityMember.create({
      data: {
        id: uuidv4(),
        communityId,
        userId,
        role: 'MEMBER',
        joinedAt: new Date()
      }
    })

    // Get the updated community with members
    const updatedCommunity = await prisma.community.findUnique({
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

    // Format the response
    const formattedCommunity = {
      id: updatedCommunity!.id,
      name: updatedCommunity!.name,
      description: updatedCommunity!.description,
      locationId: updatedCommunity!.locationId,
      locationName: [updatedCommunity!.location?.city, updatedCommunity!.location?.state, updatedCommunity!.location?.country]
                   .filter(Boolean).join(', '),
      memberCount: updatedCommunity!.members.length,
      isAdmin: false,
      isMember: true,
      createdAt: updatedCommunity!.createdAt.toISOString()
    }

    return NextResponse.json(formattedCommunity)
  } catch (error) {
    console.error("Error joining community:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to join community" },
      { status: 500 }
    )
  }
}

// DELETE /api/communities/[id]/members - Leave a community
export async function DELETE(
  _request: Request, // Prefix with underscore to indicate it's not used
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
      where: { id: communityId }
    })

    if (!community) {
      return NextResponse.json(
        { error: "Community not found" },
        { status: 404 }
      )
    }

    // Check if the user is a member
    const member = await prisma.communityMember.findFirst({
      where: {
        communityId,
        userId
      }
    })

    if (!member) {
      return NextResponse.json(
        { error: "You are not a member of this community" },
        { status: 400 }
      )
    }

    // Check if the user is the only admin
    if (member.role === 'ADMIN') {
      const adminCount = await prisma.communityMember.count({
        where: {
          communityId,
          role: 'ADMIN'
        }
      })

      if (adminCount === 1) {
        // Check if there are other members who could become admin
        const otherMembers = await prisma.communityMember.findMany({
          where: {
            communityId,
            userId: { not: userId }
          },
          orderBy: { joinedAt: 'asc' }
        })

        if (otherMembers.length > 0) {
          // Promote the oldest member to admin
          await prisma.communityMember.update({
            where: { id: otherMembers[0].id },
            data: { role: 'ADMIN' }
          })
        } else {
          // If there are no other members, delete the community
          await prisma.community.delete({
            where: { id: communityId }
          })

          return NextResponse.json({ success: true, communityDeleted: true })
        }
      }
    }

    // Remove the user from the community
    await prisma.communityMember.delete({
      where: { id: member.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error leaving community:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to leave community" },
      { status: 500 }
    )
  }
}
