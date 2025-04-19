import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

// DELETE /api/communities/[id]/members/[memberId] - Remove a specific member
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; memberId: string } }
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
    const memberUserId = params.memberId
    const currentUserId = session.user.id
    
    // Check if the community exists
    const community = await prisma.community.findUnique({
      where: { id: communityId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true
              }
            }
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
    
    // Check if the current user is an admin or the member being removed
    const isAdmin = community.members.some(member => 
      member.userId === currentUserId && member.role === 'ADMIN'
    )
    
    const isSelfRemoval = memberUserId === currentUserId
    
    if (!isAdmin && !isSelfRemoval) {
      return NextResponse.json(
        { error: "Only admins can remove other members" },
        { status: 403 }
      )
    }
    
    // Find the member to remove
    const memberToRemove = community.members.find(member => member.userId === memberUserId)
    
    if (!memberToRemove) {
      return NextResponse.json(
        { error: "Member not found in this community" },
        { status: 404 }
      )
    }
    
    // Check if the member is the last admin
    if (memberToRemove.role === 'ADMIN') {
      const adminCount = community.members.filter(m => m.role === 'ADMIN').length
      
      if (adminCount === 1 && memberToRemove.userId === currentUserId) {
        // If this is the last admin and they're removing themselves
        // Check if there are other members who could become admin
        const otherMembers = community.members.filter(m => m.userId !== currentUserId)
        
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
      } else if (adminCount === 1 && !isSelfRemoval) {
        return NextResponse.json(
          { error: "Cannot remove the last admin" },
          { status: 400 }
        )
      }
    }
    
    // Remove the member
    await prisma.communityMember.delete({
      where: { id: memberToRemove.id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing member:", error)
    return NextResponse.json(
      { error: "Failed to remove member" },
      { status: 500 }
    )
  }
}
