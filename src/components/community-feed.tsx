"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageSquare, Share2, MoreHorizontal } from "lucide-react"
import { useSession } from "next-auth/react"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"

interface Post {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    name: string
    image: string
  }
  _count: {
    comments: number
    likes: number
  }
  liked?: boolean
}

interface CommunityFeedProps {
  limit?: number;
}

export function CommunityFeed({ limit }: CommunityFeedProps = {}) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/posts")

      if (!response.ok) {
        throw new Error("Failed to fetch posts")
      }

      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error("Error fetching posts:", error)
      toast({
        title: "Error",
        description: "Failed to load community posts",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePostSubmit = async () => {
    if (!newPost.trim()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newPost }),
      })

      if (!response.ok) {
        throw new Error("Failed to create post")
      }

      const post = await response.json()
      setPosts([{ ...post, _count: { comments: 0, likes: 0 } }, ...posts])
      setNewPost("")

      toast({
        title: "Success",
        description: "Your post has been shared with the community",
      })
    } catch (error) {
      console.error("Error creating post:", error)
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/likes`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to toggle like")
      }

      const { liked } = await response.json()

      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              _count: {
                ...post._count,
                likes: liked ? post._count.likes + 1 : post._count.likes - 1,
              },
              liked,
            }
          }
          return post
        }),
      )
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (error) {
      return "recently"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage
            src={session?.user?.image || "/placeholder.svg?height=40&width=40"}
            alt={session?.user?.name || "User"}
          />
          <AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder="Share something with your community..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <div className="flex justify-end">
            <Button onClick={handlePostSubmit} disabled={!newPost.trim() || isSubmitting}>
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No posts yet. Be the first to share with your community!
          </div>
        ) : (
          (limit ? posts.slice(0, limit) : posts).map((post) => (
            <div key={post.id} className="space-y-2 rounded-lg border p-4">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.user.image || "/placeholder.svg"} alt={post.user.name} />
                    <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{post.user.name}</div>
                    <div className="text-xs text-muted-foreground">{getTimeAgo(post.createdAt)}</div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </div>
              <div className="text-sm">{post.content}</div>
              <div className="flex items-center gap-4 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-1 ${post.liked ? "text-red-500" : "text-muted-foreground"}`}
                  onClick={() => handleLike(post.id)}
                >
                  <Heart className={`h-4 w-4 ${post.liked ? "fill-current" : ""}`} />
                  {post._count.likes}
                </Button>
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  {post._count.comments}
                </Button>
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                  <Share2 className="h-4 w-4" />0
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
