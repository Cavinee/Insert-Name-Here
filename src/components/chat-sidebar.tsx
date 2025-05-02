"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sparkles, Send, X, Maximize2, Minimize2 } from "lucide-react"

type Message = {
  id: string
  content: string
  sender: "user" | "freelancer"
  timestamp: Date
}

type ChatSidebarProps = {
  freelancerId: string
  freelancerName: string
  freelancerAvatar?: string
  serviceId: string
  serviceName: string
  isOpen: boolean
  onClose: () => void
}

export function ChatSidebar({
  freelancerId,
  freelancerName,
  freelancerAvatar,
  serviceId,
  serviceName,
  isOpen,
  onClose,
}: ChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Hi there! I'm interested in your "${serviceName}" service. Can you tell me more about it?`,
      sender: "user",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: "2",
      content: `Hello! Thanks for your interest in my service. I'd be happy to tell you more about it. What specific aspects would you like to know about?`,
      sender: "freelancer",
      timestamp: new Date(Date.now() - 1000 * 60 * 4),
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")

    // Simulate freelancer response after a short delay
    setTimeout(() => {
      const freelancerMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Thanks for your message! I'll get back to you as soon as possible regarding "${newMessage.substring(0, 20)}${newMessage.length > 20 ? "..." : ""}"`,
        sender: "freelancer",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, freelancerMessage])
    }, 1000)
  }

  const beautifyWithAI = () => {
    if (newMessage.trim() === "") return

    // Simulate AI beautification
    const beautified = `I would like to inquire about your ${serviceName} service. Specifically, I'm interested in understanding the timeline, deliverables, and if you have any examples of similar work you've done in the past. Looking forward to your response!`

    setNewMessage(beautified)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed right-0 bottom-0 z-40 h-[80%] w-[30%] border-l-2 border-t-2 rounded-md bg-background shadow-xl transition-all duration-300 ${isMinimized ? "translate-y-[calc(100%-3.5rem)]" : ""}`}
    >
      <div className="flex h-14 items-center justify-between border-b px-4">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={freelancerAvatar || "/placeholder.svg"} />
            <AvatarFallback>{freelancerName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{freelancerName}</p>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" onClick={() => setIsMinimized(!isMinimized)} className="h-8 w-8">
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100%-8rem)] flex-col overflow-y-auto p-4">
        {messages.map((message) => (
          <div key={message.id} className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            {message.sender === "freelancer" && (
              <Avatar className="mr-2 h-8 w-8">
                <AvatarImage src={freelancerAvatar || "/placeholder.svg"} />
                <AvatarFallback>{freelancerName.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="mt-1 text-right text-xs opacity-70">{formatTime(message.timestamp)}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t bg-background p-4">
        <div className="flex space-x-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />
        </div>
        <div className="mt-2 flex justify-between">
          <Button variant="outline" size="sm" onClick={beautifyWithAI} className="text-xs">
            <Sparkles className="mr-1 h-3 w-3 text-yellow-500" />
            Beautify with AI
          </Button>
          <Button size="sm" onClick={handleSendMessage}>
            <Send className="mr-1 h-3 w-3" />
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
