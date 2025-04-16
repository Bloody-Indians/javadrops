"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const [isLoading, setIsLoading] = useState(false)

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true)
    await signIn(provider, { callbackUrl })
    setIsLoading(false)
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative h-16 w-16">
              <Image src="/javadrops-logo.png" alt="JavaDrops Logo" fill className="object-contain" />
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome to JavaDrops</CardTitle>
          <CardDescription>Choose your portal and sign in to continue</CardDescription>
        </CardHeader>
        <Tabs defaultValue="student" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="agent">Agent</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>
          <TabsContent value="student">
            <LoginContent
              title="Student Login"
              description="Access your projects and submissions"
              onSocialLogin={handleSocialLogin}
              isLoading={isLoading}
              redirectPath="/student/dashboard"
            />
          </TabsContent>
          <TabsContent value="agent">
            <LoginContent
              title="Agent Login"
              description="Manage student projects and assignments"
              onSocialLogin={handleSocialLogin}
              isLoading={isLoading}
              redirectPath="/agent/dashboard"
            />
          </TabsContent>
          <TabsContent value="admin">
            <LoginContent
              title="Admin Login"
              description="Access administrative controls"
              onSocialLogin={handleSocialLogin}
              isLoading={isLoading}
              redirectPath="/admin/dashboard"
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}

interface LoginContentProps {
  title: string
  description: string
  onSocialLogin: (provider: string) => Promise<void>
  isLoading: boolean
  redirectPath: string
}

function LoginContent({ title, description, onSocialLogin, isLoading, redirectPath }: LoginContentProps) {
  return (
    <CardContent className="space-y-4 py-4">
      <div className="space-y-2 text-center">
        <h3 className="text-xl font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-2">
        <Button variant="outline" className="w-full" onClick={() => onSocialLogin("google")} disabled={isLoading}>
          <div className="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-google"
            >
              <path d="M12 20.5c4.1 0 7.5-3.4 7.5-7.5S16.1 5.5 12 5.5 4.5 8.9 4.5 13s3.4 7.5 7.5 7.5z" />
              <path d="M12 20.5h7.9" />
              <path d="m8.7 8.7 6.6 6.6" />
              <path d="m15.3 8.7-6.6 6.6" />
            </svg>
          </div>
          Continue with Google
        </Button>
        <Button variant="outline" className="w-full" onClick={() => onSocialLogin("facebook")} disabled={isLoading}>
          <div className="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-facebook"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </div>
          Continue with Facebook
        </Button>
        <Button variant="outline" className="w-full" onClick={() => onSocialLogin("twitter")} disabled={isLoading}>
          <div className="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-twitter"
            >
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
            </svg>
          </div>
          Continue with Twitter
        </Button>
      </div>
    </CardContent>
  )
}
