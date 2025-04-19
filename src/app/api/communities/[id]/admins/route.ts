import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

// POST /api/communities/[id]/admins - Promote a member to admin
export async function POST(
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
        { error: "Only admins can promote members" },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const { memberId } = body
    
    if (!memberId) {
      return NextResponse.json(
        { error: "Member ID is required" },
        { status: 400 }
      )
    }
    
    // Get the member
    const member = await prisma.communityMember.findUnique({
      where: { id: memberId }
    })
    
    if (!member) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      )
    }
    
    // Check if the member is already an admin
    if (member.role === 'ADMIN') {
      return NextResponse.json(
        { error: "Member is already an admin" },
        { status: 400 }
      )
    }
    
    // Promote the member to admin
    const updatedMember = await prisma.communityMember.update({
      where: { id: memberId },
      data: { role: 'ADMIN' }
    })
    
    return NextResponse.json(updatedMember)
  } catch (error) {
    console.error("Error promoting member:", error)
    return NextResponse.json(
      { error: "Failed to promote member" },
      { status: 500 }
    )
  }
}

// DELETE /api/communities/[id]/admins - Demote an admin to member
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
        { error: "Only admins can demote other admins" },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const { memberId } = body
    
    if (!memberId) {
      return NextResponse.json(
        { error: "Member ID is required" },
        { status: 400 }
      )
    }
    
    // Get the member
    const member = await prisma.communityMember.findUnique({
      where: { id: memberId },
      include: {
        user: {
          select: {
            id: true
          }
        }
      }
    })
    
    if (!member) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      )
    }
    
    // Check if the member is an admin
    if (member.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Member is not an admin" },
        { status: 400 }
      )
    }
    
    // Check if the member is the current user
    if (member.user.id === userId) {
      return NextResponse.json(
        { error: "You cannot demote yourself" },
        { status: 400 }
      )
    }
    
    // Check if this is the last admin
    const adminCount = community.members.filter(m => m.role === 'ADMIN').length
    
    if (adminCount === 1) {
      return NextResponse.json(
        { error: "Cannot demote the last admin" },
        { status: 400 }
      )
    }
    
    // Demote the admin to member
    const updatedMember = await prisma.communityMember.update({
      where: { id: memberId },
      data: { role: 'MEMBER' }
    })
    
    return NextResponse.json(updatedMember)
  } catch (error) {
    console.error("Error demoting admin:", error)
    return NextResponse.json(
      { error: "Failed to demote admin" },
      { status: 500 }
    )
  }
}
