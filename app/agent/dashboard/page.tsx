"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function AgentDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [availableProjects, setAvailableProjects] = useState<any[]>([])
  const [assignedProjects, setAssignedProjects] = useState<any[]>([])

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      router.push("/login?callbackUrl=/agent/dashboard")
      return
    }

    // Fetch projects
    if (user) {
      // This would be an API call in a real app
      setAvailableProjects([
        {
          id: "proj-1",
          title: "Web Development Project",
          description: "Create a responsive website with authentication",
          dueDate: "2023-05-15",
          budget: 500,
          complexity: "Medium",
          studentName: "John Doe",
        },
        {
          id: "proj-2",
          title: "Mobile App Development",
          description: "Build a cross-platform mobile application",
          dueDate: "2023-06-20",
          budget: 800,
          complexity: "High",
          studentName: "Jane Smith",
        },
      ])

      setAssignedProjects([
        {
          id: "proj-3",
          title: "Database Design",
          description: "Design a relational database for an e-commerce platform",
          dueDate: "2023-04-30",
          budget: 400,
          progress: 75,
          studentName: "Alex Johnson",
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
          <h1 className="text-3xl font-bold mb-2">Agent Dashboard</h1>
          <p className="text-muted-foreground mb-6">
            Welcome back, {user.name}. Manage your project assignments and earnings.
          </p>

          <Tabs defaultValue="assigned" className="w-full">
            <TabsList>
              <TabsTrigger value="assigned">Assigned Projects</TabsTrigger>
              <TabsTrigger value="available">Available Projects</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="assigned" className="mt-4">
              {assignedProjects.length > 0 ? (
                assignedProjects.map((project) => <AssignedProjectCard key={project.id} project={project} />)
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No assigned projects yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">Browse available projects to find work.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="available" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Available Projects</CardTitle>
                  <CardDescription>Browse and apply for available student projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Complexity</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {availableProjects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">
                            <div>
                              {project.title}
                              <div className="text-xs text-muted-foreground mt-1">By {project.studentName}</div>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(project.dueDate).toLocaleDateString()}</TableCell>
                          <TableCell>${project.budget}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                project.complexity === "High"
                                  ? "destructive"
                                  : project.complexity === "Medium"
                                    ? "default"
                                    : "outline"
                              }
                            >
                              {project.complexity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button asChild size="sm">
                              <Link href={`/agent/projects/${project.id}`}>View Details</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {availableProjects.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6">
                            No available projects found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="completed">
              <div className="text-center py-8">
                <p className="text-muted-foreground">No completed projects yet.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-full md:w-80 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Agent Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assigned Projects</span>
                  <span className="font-medium">{assignedProjects.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg. Rating</span>
                  <span className="font-medium">4.8/5.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Earnings</span>
                  <span className="font-medium">$0</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full" variant="outline">
                <Link href="/agent/browse-projects">Browse Projects</Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link href="/agent/messages">Messages</Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link href="/agent/profile">Update Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

interface AssignedProjectCardProps {
  project: any
}

function AssignedProjectCard({ project }: AssignedProjectCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Progress:</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium">Due Date</div>
              <div>{new Date(project.dueDate).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Budget</div>
              <div>${project.budget}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Student</div>
              <div>{project.studentName}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Payment Status</div>
              <Badge variant="outline">50% Paid</Badge>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Upload Deliverables</Button>
        <Button>View Details</Button>
      </CardFooter>
    </Card>
  )
}
