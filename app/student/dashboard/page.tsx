"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function StudentDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      router.push("/login?callbackUrl=/student/dashboard")
      return
    }

    // Fetch student projects
    if (user) {
      // This would be an API call in a real app
      setProjects([
        {
          id: "proj-1",
          title: "Web Development Project",
          description: "Create a responsive website with authentication",
          status: "In Progress",
          dueDate: "2023-05-15",
          students: ["John Doe", "Jane Smith"],
          leadStudent: "John Doe",
        },
        {
          id: "proj-2",
          title: "Mobile App Development",
          description: "Build a cross-platform mobile application",
          status: "Pending Payment",
          dueDate: "2023-06-20",
          students: ["John Doe"],
          leadStudent: "John Doe",
        },
      ])
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  if (!user) {
    return null // Router will redirect
  }

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
          <p className="text-muted-foreground mb-6">Welcome back, {user.name}. Manage your projects and submissions.</p>

          <Tabs defaultValue="active" className="w-full">
            <TabsList>
              <TabsTrigger value="active">Active Projects</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="space-y-4 mt-4">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
              {projects.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No active projects found.</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="completed">
              <div className="text-center py-8">
                <p className="text-muted-foreground">No completed projects yet.</p>
              </div>
            </TabsContent>
            <TabsContent value="drafts">
              <div className="text-center py-8">
                <p className="text-muted-foreground">No draft projects found.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-full md:w-80 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/student/new-project">New Project</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/student/upload-documents">Upload Documents</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/marketplace">Browse Marketplace</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Project Stats</CardTitle>
              <CardDescription>Your project activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Projects</span>
                  <span className="font-medium">{projects.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pending Review</span>
                  <span className="font-medium">0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

interface ProjectCardProps {
  project: any
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span className="font-medium">{project.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Due Date:</span>
            <span className="font-medium">{new Date(project.dueDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Team Size:</span>
            <span className="font-medium">{project.students.length} student(s)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Lead:</span>
            <span className="font-medium">{project.leadStudent}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {project.status === "Pending Payment" ? (
          <Button>Complete Payment</Button>
        ) : (
          <Button variant="outline">View Details</Button>
        )}
      </CardFooter>
    </Card>
  )
}
