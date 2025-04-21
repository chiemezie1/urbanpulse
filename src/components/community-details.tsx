"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Users, MapPin, MessageCircle, Settings, UserPlus, LogOut, Send, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CommunityDetailsProps {
  communityId: string
}

export function CommunityDetails({ communityId }: CommunityDetailsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [community, setCommunity] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isJoining, setIsJoining] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const [activeTab, setActiveTab] = useState("posts")
  const [newPost, setNewPost] = useState("")
  const [posts, setPosts] = useState<any[]>([])
  const [isPostingMessage, setIsPostingMessage] = useState(false)

  // Fetch community details
  useEffect(() => {
    const fetchCommunityDetails = async () => {
      try {
        setIsLoading(true)
        console.log('Fetching community details for ID:', communityId)
        const response = await fetch(`/api/communities/${communityId}`)

        if (response.ok) {
          const data = await response.json()
          console.log('Community details:', data)
          setCommunity(data)

          // Fetch posts for this community
          fetchCommunityPosts()
        } else {
          console.error('Failed to fetch community details:', response.status)
          toast({
            title: "Error",
            description: "Failed to load community details",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error('Error fetching community details:', error)
        toast({
          title: "Error",
          description: "Failed to load community details",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (communityId) {
      fetchCommunityDetails()
    }
  }, [communityId, toast])

  const handleJoinCommunity = async () => {
    try {
      setIsJoining(true)
      const response = await fetch(`/api/communities/${communityId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      })

      if (response.ok) {
        await response.json() // We don't need the response data
        setCommunity({
          ...community,
          isMember: true,
          memberCount: community.memberCount + 1
        })
        toast({
          title: "Success",
          description: "You've joined the community"
        })
      } else {
        throw new Error("Failed to join community")
      }
    } catch (error) {
      console.error("Error joining community:", error)
      toast({
        title: "Error",
        description: "Failed to join community",
        variant: "destructive"
      })
    } finally {
      setIsJoining(false)
    }
  }

  const handleLeaveCommunity = async () => {
    try {
      setIsLeaving(true)
      const response = await fetch(`/api/communities/${communityId}/members`, {
        method: "DELETE"
      })

      if (response.ok) {
        setCommunity({
          ...community,
          isMember: false,
          memberCount: Math.max(0, community.memberCount - 1)
        })
        toast({
          title: "Success",
          description: "You've left the community"
        })

        // If the user was an admin, redirect to the communities page
        if (community.isAdmin) {
          router.push("/dashboard/community")
        }
      } else {
        throw new Error("Failed to leave community")
      }
    } catch (error) {
      console.error("Error leaving community:", error)
      toast({
        title: "Error",
        description: "Failed to leave community",
        variant: "destructive"
      })
    } finally {
      setIsLeaving(false)
    }
  }

  // Function to fetch posts for the community
  const fetchCommunityPosts = async () => {
    try {
      const response = await fetch(`/api/communities/${communityId}/posts`)

      if (response.ok) {
        const data = await response.json()
        console.log('Community posts:', data)
        setPosts(data.posts || [])
      } else {
        console.error('Failed to fetch community posts:', response.status)
        toast({
          title: "Error",
          description: "Failed to load community posts",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error fetching community posts:', error)
      toast({
        title: "Error",
        description: "Failed to load community posts",
        variant: "destructive"
      })
    }
  }

  // Function to handle post creation
  const handlePostMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newPost.trim()) return

    try {
      setIsPostingMessage(true)

      // Make API call to create the post
      const response = await fetch(`/api/communities/${communityId}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: newPost
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create post')
      }

      const newPostData = await response.json()

      // Add the new post to the list
      setPosts([newPostData, ...posts])
      setNewPost("")

      toast({
        title: "Success",
        description: "Message posted successfully"
      })
    } catch (error) {
      console.error("Error posting message:", error)
      toast({
        title: "Error",
        description: "Failed to post message",
        variant: "destructive"
      })
    } finally {
      setIsPostingMessage(false)
    }
  }

  // Function to handle liking a post
  const handleLikePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/likes`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Failed to like post')
      }

      const data = await response.json()

      // Update the posts list with the new like status
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: data.likeCount,
            hasLiked: data.liked
          }
        }
        return post
      }))
    } catch (error) {
      console.error('Error liking post:', error)
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive"
      })
    }
  }

  // Function to handle commenting on a post
  const handleCommentPost = async (postId: string, commentContent: string) => {
    try {
      if (!commentContent.trim()) return

      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: commentContent
        })
      })

      if (!response.ok) {
        throw new Error('Failed to add comment')
      }

      const newComment = await response.json()

      // Update the posts list with the new comment
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [newComment, ...(post.comments || [])],
            commentCount: (post.commentCount || 0) + 1
          }
        }
        return post
      }))

      toast({
        title: "Success",
        description: "Comment added successfully"
      })
    } catch (error) {
      console.error('Error adding comment:', error)
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!community) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Community not found</p>
        <Button variant="outline" onClick={() => router.push("/dashboard/community")}>
          Back to Communities
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{community.name}</CardTitle>
              <CardDescription className="mt-2">{community.description}</CardDescription>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{community.locationName}</span>
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  <span>{community.memberCount} members</span>
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              {community.isAdmin ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/dashboard/community/manage?id=${communityId}`)}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Manage
                </Button>
              ) : community.isMember ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" disabled={isLeaving}>
                      {isLeaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          Leaving...
                        </>
                      ) : (
                        <>
                          <LogOut className="h-4 w-4 mr-1" />
                          Leave
                        </>
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Leave Community</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to leave this community? You can rejoin at any time.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLeaveCommunity}>Leave</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button size="sm" onClick={handleJoinCommunity} disabled={isJoining}>
                  {isJoining ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-1" />
                      Join
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="posts">
                <MessageCircle className="h-4 w-4 mr-2" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="members">
                <Users className="h-4 w-4 mr-2" />
                Members
              </TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="space-y-4 mt-4">
              {community.isMember && (
                <form onSubmit={handlePostMessage} className="space-y-2">
                  <Textarea
                    placeholder="Share something with the community..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isPostingMessage || !newPost.trim()}>
                      {isPostingMessage ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-1" />
                          Post
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {posts.length > 0 ? (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <Card key={post.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={post.author?.image || ""} alt={post.author?.name || "User"} />
                            <AvatarFallback>{post.author?.name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{post.author?.name || "Unknown User"}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p>{post.content}</p>
                      </CardContent>
                      <CardFooter className="pt-0 flex flex-col gap-4">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <button
                              className={`flex items-center gap-1 hover:text-primary ${post.hasLiked ? 'text-primary font-medium' : ''}`}
                              onClick={() => handleLikePost(post.id)}
                            >
                              <span>Like ({post.likes || 0})</span>
                            </button>
                            <button
                              className="flex items-center gap-1 hover:text-primary"
                              onClick={() => {
                                // Toggle comment input visibility
                                const commentInput = document.getElementById(`comment-input-${post.id}`);
                                if (commentInput) {
                                  commentInput.classList.toggle('hidden');
                                  commentInput.querySelector('textarea')?.focus();
                                }
                              }}
                            >
                              <span>Comment ({post.commentCount || 0})</span>
                            </button>
                          </div>
                        </div>

                        {/* Comment input */}
                        <div id={`comment-input-${post.id}`} className="w-full hidden">
                          <form
                            className="flex gap-2"
                            onSubmit={(e) => {
                              e.preventDefault();
                              const textarea = e.currentTarget.querySelector('textarea');
                              if (textarea) {
                                handleCommentPost(post.id, textarea.value);
                                textarea.value = '';
                              }
                            }}
                          >
                            <Textarea
                              placeholder="Write a comment..."
                              className="min-h-[60px] flex-1"
                            />
                            <Button type="submit" size="sm" className="self-end">
                              <Send className="h-4 w-4" />
                            </Button>
                          </form>
                        </div>

                        {/* Comments display */}
                        {post.comments && post.comments.length > 0 && (
                          <div className="w-full space-y-2 border-t pt-2">
                            {post.comments.map((comment: { id: string; author?: { image?: string; name?: string }; content: string; createdAt: string }) => (
                              <div key={comment.id} className="flex gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={comment.author?.image || ""} alt={comment.author?.name || "User"} />
                                  <AvatarFallback>{comment.author?.name?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="bg-muted rounded-md p-2">
                                    <p className="text-xs font-medium">{comment.author?.name || "Unknown User"}</p>
                                    <p className="text-sm">{comment.content}</p>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {post.commentCount > post.comments.length && (
                              <Button variant="link" size="sm" className="px-0">
                                View all {post.commentCount} comments
                              </Button>
                            )}
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No posts yet</p>
                  {community.isMember && (
                    <p className="text-sm text-muted-foreground mt-1">Be the first to post in this community!</p>
                  )}
                </div>
              )}
            </TabsContent>
            <TabsContent value="members" className="mt-4">
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Member list will be shown here</p>
                <p className="text-sm text-muted-foreground mt-1">This feature is coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
