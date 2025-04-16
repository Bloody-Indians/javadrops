"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/hooks/use-auth"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Mail, HelpCircle, Bot } from "lucide-react"
import { ChatInterface } from "@/components/chat-interface"

export default function SupportPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // This would be an API call in a real app
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Support request sent",
        description: "We'll get back to you as soon as possible.",
      })

      setFormData({
        ...formData,
        subject: "",
        message: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send your request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const faqs = [
    {
      question: "How do I submit a project?",
      answer:
        "To submit a project, log in to your student account, navigate to the dashboard, and click on 'New Project'. Fill in the project details, upload any necessary documents, and proceed to payment.",
    },
    {
      question: "How do project agents get paid?",
      answer:
        "Project agents receive 50% of the payment upfront when they accept a project. The remaining 50% is released after the student reviews and approves the completed work.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept payments via PayPal, credit/debit cards, and bank transfers. All payments are processed securely.",
    },
    {
      question: "How does the online marketplace work?",
      answer:
        "The online marketplace is open from 10 PM to 11 PM London time. During this hour, students can buy and sell educational resources. All listings must comply with our content guidelines.",
    },
    {
      question: "Can I cancel a project after submission?",
      answer:
        "Projects can be cancelled before they are assigned to an agent. Once assigned, cancellations are subject to our refund policy, which depends on the progress made.",
    },
  ]

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Customer Support</h1>
        <p className="text-muted-foreground">Get help with your projects, payments, and platform usage</p>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span>Live Chat</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>Contact Form</span>
          </TabsTrigger>
          <TabsTrigger value="ai-assistant" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            <span>AI Assistant</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span>FAQs</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Live Chat Support</CardTitle>
                <CardDescription>Chat with our support team in real-time</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ChatInterface />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Support Team</CardTitle>
                <CardDescription>Our team is available Monday to Friday, 9 AM - 5 PM</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-md bg-muted">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>SB</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Sarah Brown</div>
                    <div className="text-sm text-muted-foreground">Student Support</div>
                  </div>
                  <div className="ml-auto">
                    <Badge status="online" />
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-md bg-muted">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>MJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Michael Johnson</div>
                    <div className="text-sm text-muted-foreground">Technical Support</div>
                  </div>
                  <div className="ml-auto">
                    <Badge status="away" />
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-md bg-muted">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>DW</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">David Wilson</div>
                    <div className="text-sm text-muted-foreground">Payment Support</div>
                  </div>
                  <div className="ml-auto">
                    <Badge status="online" />
                  </div>
                </div>

                <div className="mt-6 text-sm text-muted-foreground text-center">
                  Average response time: <span className="font-medium">5 minutes</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contact">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Contact Form</CardTitle>
                <CardDescription>Send us a message and we'll get back to you via email</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" name="subject" value={formData.subject} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Alternative ways to reach our support team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="font-medium">Email Support</div>
                  <a href="mailto:support@javadrops.co.in" className="text-primary">
                    support@javadrops.co.in
                  </a>
                </div>

                <div className="space-y-2">
                  <div className="font-medium">Business Hours</div>
                  <p className="text-sm text-muted-foreground">Monday - Friday: 9 AM - 5 PM (London, UK time)</p>
                </div>

                <div className="space-y-2">
                  <div className="font-medium">Emergency Contact</div>
                  <p className="text-sm text-muted-foreground">
                    For urgent matters outside business hours:
                    <a href="mailto:urgent@javadrops.co.in" className="text-primary block mt-1">
                      urgent@javadrops.co.in
                    </a>
                  </p>
                </div>

                <div className="mt-4 p-4 bg-muted rounded-md">
                  <div className="font-medium mb-2">Response Time</div>
                  <p className="text-sm text-muted-foreground">
                    We aim to respond to all inquiries within 24 hours during business days.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-assistant">
          <Card>
            <CardHeader>
              <CardTitle>AI Support Assistant</CardTitle>
              <CardDescription>Get instant answers to common questions and issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col h-[500px]">
                <ChatInterface isAi={true} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b pb-4 last:border-none">
                    <h3 className="font-medium text-lg mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Can't find what you're looking for? Contact our support team using the chat or contact form.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface BadgeProps {
  status: "online" | "away" | "offline"
}

function Badge({ status }: BadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 w-2 rounded-full ${getStatusColor()}`} />
      <span className="text-xs text-muted-foreground capitalize">{status}</span>
    </div>
  )
}
