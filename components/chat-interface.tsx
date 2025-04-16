"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/lib/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SendHorizontal } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "agent" | "ai"
  timestamp: Date
}

interface ChatInterfaceProps {
  isAi?: boolean
}

export function ChatInterface({ isAi = false }: ChatInterfaceProps) {
  const { user } = useAuth()
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const initialMessage: Message = {
        id: "init-1",
        text: isAi
          ? "Hello! I'm your AI assistant. How can I help you with JavaDrops today?"
          : "Welcome to JavaDrops support! How can we assist you today?",
        sender: isAi ? "ai" : "agent",
        timestamp: new Date(),
      }
      setMessages([initialMessage])
    }
  }, [isAi, messages.length])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInput("")

    // Simulate response
    setIsTyping(true)
    setTimeout(() => {
      let responseText = ""

      if (isAi) {
        // AI response patterns
        if (input.toLowerCase().includes("project")) {
          responseText =
            "To submit a project, go to your student dashboard and click on 'New Project'. You'll need to provide project details, upload any relevant documents, and complete the payment process."
        } else if (input.toLowerCase().includes("payment") || input.toLowerCase().includes("pay")) {
          responseText =
            "We accept payments via PayPal. For students, payment is required after project submission. For agents, you'll receive 50% upfront and 50% upon project completion."
        } else if (input.toLowerCase().includes("marketplace")) {
          responseText =
            "The online marketplace is open from 10 PM to 11 PM London time. During this hour, students can buy and sell educational resources."
        } else {
          responseText =
            "I'm here to help with any questions about JavaDrops. You can ask about projects, payments, the marketplace, or account management."
        }
      } else {
        // Human agent response patterns
        if (input.toLowerCase().includes("hello") || input.toLowerCase().includes("hi")) {
          responseText = "Hello there! How can I assist you with JavaDrops today?"
        } else if (input.toLowerCase().includes("help")) {
          responseText =
            "I'd be happy to help. Could you please provide more details about what you need assistance with?"
        } else {
          responseText =
            "Thank you for your message. Our support team is reviewing your inquiry and will respond shortly. Is there anything else you'd like to know in the meantime?"
        }
      }

      const responseMessage: Message = {
        id: Date.now().toString(),
        text: responseText,
        sender: isAi ? "ai" : "agent",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, responseMessage])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col h-[600px] border-t">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}

          {isTyping && (
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>{isAi ? "AI" : "S"}</AvatarFallback>
              </Avatar>
              <div className="flex items-center h-10">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </form>
      </div>

      <style jsx global>{`
        .typing-indicator {
          display: flex;
          align-items: center;
        }
        
        .typing-indicator span {
          height: 8px;
          width: 8px;
          background-color: hsl(var(--muted-foreground));
          border-radius: 50%;
          display: inline-block;
          margin-right: 3px;
          animation: bounce 1.5s infinite ease-in-out;
          opacity: 0.6;
        }
        
        .typing-indicator span:nth-child(1) {
          animation-delay: 0s;
        }
        
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
          margin-right: 0;
        }
        
        @keyframes bounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </div>
  )
}

interface MessageProps {
  message: Message
}

function Message({ message }: MessageProps) {
  const isUserMessage = message.sender === "user"

  if (isUserMessage) {
    return (
      <div className="flex flex-col items-end">
        <div className="bg-primary text-primary-foreground rounded-lg rounded-tr-none p-3 max-w-[80%]">
          <p>{message.text}</p>
        </div>
        <span className="text-xs text-muted-foreground mt-1">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3">
      <Avatar>
        <AvatarImage src="/placeholder.svg?height=40&width=40" />
        <AvatarFallback>{message.sender === "ai" ? "AI" : "S"}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <div className="bg-muted rounded-lg rounded-tl-none p-3 max-w-[80%]">
          <p>{message.text}</p>
        </div>
        <span className="text-xs text-muted-foreground mt-1">
          {message.sender === "ai" ? "AI Assistant" : "Support Agent"} •{" "}
          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  )
}
