"use client"

import { useState } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  Search, 
  HelpCircle, 
  FileText, 
  MessageSquare, 
  Mail, 
  Phone, 
  Video,
  ChevronRight,
  BookOpen,
  Lightbulb,
  LifeBuoy
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function HelpPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // In a real app, this would be an API call to submit the contact form
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Message sent",
        description: "We've received your message and will respond shortly",
      })
      
      setContactForm({
        name: "",
        email: "",
        subject: "",
        message: ""
      })
    } catch (error) {
      console.error("Error submitting contact form:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const faqCategories = [
    {
      id: "general",
      title: "General",
      items: [
        {
          question: "What is UrbanPulse?",
          answer: "UrbanPulse is a community platform that helps residents stay informed about local incidents, weather conditions, and community events. It provides real-time updates and allows users to report incidents and engage with their community."
        },
        {
          question: "How do I create an account?",
          answer: "To create an account, click on the 'Sign Up' button on the homepage. You'll need to provide your name, email address, and create a password. You can also sign up using your Google or Facebook account for faster registration."
        },
        {
          question: "Is UrbanPulse available in my area?",
          answer: "UrbanPulse is currently available in select cities across the United States. We're continuously expanding our coverage. You can check if your area is supported by entering your zip code on the homepage."
        }
      ]
    },
    {
      id: "incidents",
      title: "Incidents",
      items: [
        {
          question: "How do I report an incident?",
          answer: "To report an incident, navigate to the Incidents tab in the dashboard and click on the 'Report Incident' button. Fill in the details about the incident, including its type, severity, and location. You can also add photos if available."
        },
        {
          question: "What types of incidents can I report?",
          answer: "You can report various types of incidents, including traffic accidents, road closures, construction, floods, fires, power outages, and public events. Each incident can be categorized by severity to help prioritize community response."
        },
        {
          question: "How are incidents verified?",
          answer: "Incidents are initially marked as 'Reported' when submitted by users. Our community moderators and local authorities review these reports and update their status to 'Verified' once confirmed. Multiple reports of the same incident also increase its verification likelihood."
        }
      ]
    },
    {
      id: "community",
      title: "Community",
      items: [
        {
          question: "How do I interact with my community?",
          answer: "The Community tab allows you to create posts, comment on others' posts, and like content. You can share updates, ask questions, or organize local events. It's a great way to connect with neighbors and stay informed about local happenings."
        },
        {
          question: "Can I create private community groups?",
          answer: "Yes, you can create private groups for specific neighborhoods, interests, or organizations. Group members can share posts and events that are only visible to other members, making it ideal for neighborhood watch programs or local clubs."
        },
        {
          question: "How do I report inappropriate content?",
          answer: "If you come across content that violates our community guidelines, click the three dots menu on the post or comment and select 'Report'. Our moderation team will review the report and take appropriate action."
        }
      ]
    },
    {
      id: "account",
      title: "Account & Privacy",
      items: [
        {
          question: "How do I change my password?",
          answer: "To change your password, go to the Settings tab, select the Security section, and click on 'Change Password'. You'll need to enter your current password and then create a new one."
        },
        {
          question: "What information is shared with other users?",
          answer: "By default, your name, profile picture, and posts are visible to other community members. You can adjust your privacy settings in the Settings tab to control who can see your profile information and activity."
        },
        {
          question: "How do I delete my account?",
          answer: "To delete your account, go to Settings > Advanced > Delete Account. Please note that this action is irreversible and will permanently remove all your data from our systems."
        }
      ]
    }
  ]

  const helpArticles = [
    {
      id: "getting-started",
      title: "Getting Started with UrbanPulse",
      description: "Learn the basics of using UrbanPulse to stay connected with your community",
      icon: <BookOpen className="h-5 w-5" />,
      category: "Guides"
    },
    {
      id: "reporting-incidents",
      title: "How to Report Incidents",
      description: "A step-by-step guide to reporting incidents in your area",
      icon: <FileText className="h-5 w-5" />,
      category: "Guides"
    },
    {
      id: "community-guidelines",
      title: "Community Guidelines",
      description: "Our rules and expectations for community interaction",
      icon: <FileText className="h-5 w-5" />,
      category: "Policies"
    },
    {
      id: "privacy-policy",
      title: "Privacy Policy",
      description: "How we collect, use, and protect your personal information",
      icon: <FileText className="h-5 w-5" />,
      category: "Policies"
    },
    {
      id: "account-settings",
      title: "Managing Your Account Settings",
      description: "Learn how to customize your profile and notification preferences",
      icon: <BookOpen className="h-5 w-5" />,
      category: "Guides"
    },
    {
      id: "mobile-app",
      title: "Using the Mobile App",
      description: "Tips and tricks for getting the most out of the UrbanPulse mobile app",
      icon: <Lightbulb className="h-5 w-5" />,
      category: "Tips"
    }
  ]

  const filteredArticles = searchQuery
    ? helpArticles.filter(
        article =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : helpArticles

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground">
          Find answers to common questions and get support when you need it
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for help articles..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="faq" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span>FAQ</span>
          </TabsTrigger>
          <TabsTrigger value="articles" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Articles</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Contact</span>
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-2">
            <LifeBuoy className="h-4 w-4" />
            <span>Support</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find answers to the most common questions about UrbanPulse
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                {faqCategories.map((category) => (
                  <AccordionItem key={category.id} value={category.id}>
                    <AccordionTrigger className="text-lg font-medium">
                      {category.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        {category.items.map((item, index) => (
                          <div key={index} className="rounded-lg border p-4">
                            <h3 className="font-medium">{item.question}</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                              {item.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
            <CardFooter className="flex justify-center border-t p-4">
              <p className="text-sm text-muted-foreground">
                Can't find what you're looking for? <Button variant="link" className="h-auto p-0">Contact Support</Button>
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="articles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Help Articles</CardTitle>
              <CardDescription>
                Browse our collection of guides, tutorials, and documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {searchQuery && filteredArticles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Search className="h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No articles found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We couldn't find any articles matching "{searchQuery}"
                  </p>
                  <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                    Clear search
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredArticles.map((article) => (
                    <Card key={article.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex items-start gap-2">
                          {article.icon}
                          <div>
                            <CardTitle className="text-base">{article.title}</CardTitle>
                            <CardDescription>{article.category}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm">{article.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="ghost" className="w-full justify-between">
                          Read Article
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>
                Get in touch with our support team for assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactFormChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={contactForm.email}
                      onChange={handleContactFormChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleContactFormChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactFormChange}
                    className="min-h-[150px]"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  <span>Email</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  For general inquiries and support requests, email us at:
                </p>
                <p className="mt-2 font-medium">support@urbanpulse.example.com</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Send Email
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  <span>Phone</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Our support team is available Monday-Friday, 9AM-5PM EST:
                </p>
                <p className="mt-2 font-medium">(555) 123-4567</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Call Support
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  <span>Video Chat</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Schedule a video call with one of our support specialists:
                </p>
                <p className="mt-2 font-medium">Available by appointment</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Schedule Call
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="support" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Support Options</CardTitle>
              <CardDescription>
                Choose the support option that works best for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Live Chat Support</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Chat with our support team in real-time for immediate assistance
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>Available now</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button>Start Chat</Button>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Submit a Support Ticket</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create a support ticket for issues that require detailed investigation
                    </p>
                    <div className="text-sm text-muted-foreground">
                      Average response time: 24 hours
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline">Create Ticket</Button>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Community Forum</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect with other users and share solutions to common problems
                    </p>
                    <div className="text-sm text-muted-foreground">
                      1,245 active discussions
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline">Visit Forum</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feedback</CardTitle>
              <CardDescription>
                Help us improve UrbanPulse by sharing your thoughts and suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">
                  We're constantly working to improve UrbanPulse and your feedback is invaluable to us. Let us know what you love about the platform and what we can do better.
                </p>
                <div className="flex justify-center">
                  <Button>
                    Share Feedback
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
