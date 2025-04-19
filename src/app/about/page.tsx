import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  MapPin,
  Users,
  Heart,
  Lightbulb,
  Target,
  TrendingUp,
  Clock,
  Globe,
  Mail,
  ExternalLink,
  ChevronRight,
  Building
} from "lucide-react"

export const metadata = {
  title: "About Us | UrbanPulse",
  description: "Learn about our mission to connect communities and empower citizens with local knowledge.",
}

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main>
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/20 dark:to-background relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
            <div className="grid grid-cols-6 h-full">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border-r border-emerald-500/10"></div>
              ))}
            </div>
          </div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 text-sm font-medium mb-6">
                Our Story
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6">
                Building a <span className="text-emerald-500">Connected</span> Urban Future
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                UrbanPulse was founded with a simple but powerful vision: to strengthen communities by connecting people with the places they live, work, and play.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Image
                  src="/images/four_people_of_family.jpeg"
                  alt="UrbanPulse team meeting"
                  width={600}
                  height={400}
                  className="rounded-xl shadow-lg object-cover"
                />
              </div>
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 text-sm font-medium mb-2">
                    Our Mission
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter mb-4">
                    Empowering Citizens Through Local Knowledge
                  </h2>
                  <p className="text-muted-foreground">
                    We're on a mission to transform how people interact with their cities by providing real-time, location-based information that matters. By connecting residents with their surroundings, we help create safer, more engaged, and more resilient communities.
                  </p>
                </div>

                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 text-sm font-medium mb-2">
                    Our Vision
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter mb-4">
                    Cities Where Everyone Feels Connected
                  </h2>
                  <p className="text-muted-foreground">
                    We envision a world where every urban resident feels deeply connected to their community, empowered with the information they need, and engaged in making their neighborhoods better places to live.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 text-sm font-medium mb-4">
                Our Values
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">
                The Principles That Guide Us
              </h2>
              <p className="text-muted-foreground text-lg">
                Our core values shape everything we do, from product development to community engagement.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-emerald-100 dark:border-emerald-900/20">
                <CardContent className="p-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mx-auto mb-4">
                    <Heart className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Community First</h3>
                  <p className="text-muted-foreground">
                    We believe in the power of connected communities to solve problems and create positive change.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-emerald-100 dark:border-emerald-900/20">
                <CardContent className="p-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mx-auto mb-4">
                    <Lightbulb className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Radical Transparency</h3>
                  <p className="text-muted-foreground">
                    We're committed to openness in how we build our platform and how information is shared within communities.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-emerald-100 dark:border-emerald-900/20">
                <CardContent className="p-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mx-auto mb-4">
                    <Target className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Local Relevance</h3>
                  <p className="text-muted-foreground">
                    We focus on delivering information that matters to people where they are, when they need it.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-emerald-100 dark:border-emerald-900/20">
                <CardContent className="p-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mx-auto mb-4">
                    <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Continuous Innovation</h3>
                  <p className="text-muted-foreground">
                    We're constantly evolving our platform to better serve urban communities and their changing needs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 text-sm font-medium mb-4">
                Our Team
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">
                Meet the People Behind UrbanPulse
              </h2>
              <p className="text-muted-foreground text-lg">
                We're a diverse team of technologists, urban planners, and community advocates passionate about building better cities.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Peter Johnson",
                  role: "Founder & CEO",
                  bio: "Former urban planner with a passion for technology and community building.",
                  image: "/images/peter.jpeg"
                },
                {
                  name: "Sunday Rodriguez",
                  role: "Chief Technology Officer",
                  bio: "Software engineer with expertise in location-based services and real-time data systems.",
                  image: "/images/sunday.jpeg"
                },
                {
                  name: "David Chen",
                  role: "Head of Product",
                  bio: "Product leader focused on creating intuitive, impactful user experiences.",
                  image: "/images/lady_eating_using_app.jpeg"
                },
                {
                  name: "Sarah Williams",
                  role: "Community Director",
                  bio: "Community organizer with experience in neighborhood advocacy and civic engagement.",
                  image: "/placeholder.svg?height=300&width=300&text=SW"
                },
                {
                  name: "James Taylor",
                  role: "Lead Designer",
                  bio: "UX/UI designer specializing in creating accessible, inclusive digital experiences.",
                  image: "/placeholder.svg?height=300&width=300&text=JT"
                },
                {
                  name: "Priya Patel",
                  role: "Data Science Lead",
                  bio: "Data scientist with a background in urban analytics and predictive modeling.",
                  image: "/placeholder.svg?height=300&width=300&text=PP"
                }
              ].map((member, index) => (
                <Card key={index} className="overflow-hidden border-emerald-100 dark:border-emerald-900/20">
                  <div className="aspect-square relative">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold">{member.name}</h3>
                    <p className="text-emerald-600 dark:text-emerald-400 font-medium mb-2">{member.role}</p>
                    <p className="text-muted-foreground text-sm">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 text-sm font-medium mb-4">
                Our Journey
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">
                The UrbanPulse Story
              </h2>
              <p className="text-muted-foreground text-lg">
                From idea to reality, our journey to build a platform that connects communities.
              </p>
            </div>

            <div className="relative max-w-3xl mx-auto">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-emerald-200 dark:bg-emerald-800/50"></div>

              <div className="space-y-12">
                {[
                  {
                    year: "2020",
                    title: "The Idea",
                    description: "UrbanPulse was born from a simple observation: people were disconnected from what was happening in their own neighborhoods."
                  },
                  {
                    year: "2021",
                    title: "First Prototype",
                    description: "We launched our first prototype in three test cities, focusing on incident reporting and local alerts."
                  },
                  {
                    year: "2022",
                    title: "Community Features",
                    description: "Based on user feedback, we expanded our platform to include community engagement tools and local service directories."
                  },
                  {
                    year: "2023",
                    title: "National Expansion",
                    description: "UrbanPulse expanded to 50 cities across the country, with over 500,000 active users."
                  },
                  {
                    year: "2024",
                    title: "Today & Beyond",
                    description: "We continue to innovate and expand, with a focus on building more resilient, connected communities worldwide."
                  }
                ].map((milestone, index) => (
                  <div key={index} className="relative pl-10">
                    <div className="absolute left-0 top-1.5 h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border-4 border-background flex items-center justify-center">
                      <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm border border-emerald-100 dark:border-emerald-900/20">
                      <div className="inline-block px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-sm font-medium mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 text-sm font-medium mb-2">
                  Get In Touch
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">
                  We'd Love to Hear From You
                </h2>
                <p className="text-muted-foreground text-lg mb-6">
                  Have questions about UrbanPulse? Want to partner with us? We're always open to connecting with people who share our vision.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Email Us</h3>
                      <p className="text-muted-foreground">hello@urbanpulse.example.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Building className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Headquarters</h3>
                      <p className="text-muted-foreground">123 Innovation Way, San Francisco, CA 94107</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Globe className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Social Media</h3>
                      <div className="flex gap-3 mt-2">
                        <Link href="#" className="text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
                            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                          </svg>
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                            <rect width="4" height="12" x="2" y="9"></rect>
                            <circle cx="4" cy="4" r="2"></circle>
                          </svg>
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-emerald-100 dark:border-emerald-900/20 p-6">
                <h3 className="text-xl font-bold mb-4">Send Us a Message</h3>
                <form className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Name</label>
                      <input
                        id="name"
                        type="text"
                        className="w-full px-3 py-2 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email</label>
                      <input
                        id="email"
                        type="email"
                        className="w-full px-3 py-2 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Your email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                    <input
                      id="subject"
                      type="text"
                      className="w-full px-3 py-2 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Subject"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-3 py-2 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Your message"
                    ></textarea>
                  </div>
                  <Button className="w-full">Send Message</Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-emerald-50 dark:bg-emerald-950/10">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">
                Join Us in Building Connected Communities
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Be part of the movement to create more informed, engaged, and resilient cities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="gap-1.5 shadow-lg shadow-emerald-500/20">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard/demo">
                  <Button size="lg" variant="outline" className="border-emerald-200 dark:border-emerald-800">
                    Try Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
