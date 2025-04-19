"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    content: "UrbanPulse has completely changed how I stay informed about my neighborhood. The real-time incident reporting helped me avoid a major traffic jam last week!",
    author: {
      name: "Sarah Johnson",
      role: "Community Organizer",
      avatar: "/placeholder.svg?text=SJ"
    }
  },
  {
    id: 2,
    content: "As a small business owner, the local services feature has helped me connect with so many new customers in my area. It's like having a digital main street for our community.",
    author: {
      name: "Michael Chen",
      role: "Café Owner",
      avatar: "/placeholder.svg?text=MC"
    }
  },
  {
    id: 3,
    content: "The weather alerts are incredibly accurate and have saved me from getting caught in the rain multiple times. I love how everything I need to know about my city is in one app.",
    author: {
      name: "Aisha Patel",
      role: "Teacher",
      avatar: "/placeholder.svg?text=AP"
    }
  },
  {
    id: 4,
    content: "I've met so many neighbors through the community feed. We organized a block party last month that would never have happened without UrbanPulse!",
    author: {
      name: "David Rodriguez",
      role: "Neighborhood Resident",
      avatar: "/placeholder.svg?text=DR"
    }
  }
]

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  
  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }
  
  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }
  
  return (
    <div className="relative">
      <div className="absolute -top-16 right-0 text-9xl opacity-10 text-emerald-500">
        <Quote />
      </div>
      
      <div className="relative z-10">
        <div className="flex flex-col items-center">
          <div className="flex gap-2 mb-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === activeIndex ? "bg-emerald-500" : "bg-muted"
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          <Card className="border-none bg-transparent shadow-none">
            <CardContent className="pt-6 px-0 text-center">
              <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-6">
                "{testimonials[activeIndex].content}"
              </blockquote>
              
              <div className="flex flex-col items-center gap-2">
                <Avatar className="h-12 w-12 border-2 border-emerald-100">
                  <AvatarImage src={testimonials[activeIndex].author.avatar} alt={testimonials[activeIndex].author.name} />
                  <AvatarFallback>{testimonials[activeIndex].author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <div className="font-medium">{testimonials[activeIndex].author.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonials[activeIndex].author.role}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex gap-2 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
