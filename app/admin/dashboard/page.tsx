"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BarChart, Users, ShoppingBag, Archive, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalStudents: 45,
    totalAgents: 12,
    pendingProjects: 8,
    completedProjects: 32,
    totalRevenue: 15600,
  })
  const [recentProjects, setRecentProjects] = useState<any[]>([])
  const [flaggedContent, setFlaggedContent] = useState<any[]>([])

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      router.push("/login?callbackUrl=/admin/dashboard")
      return
    }

    // Fetch admin data
    if (user) {
      // This would be an API call in a real app
      setRecentProjects([
        {
          id: "proj-1",
          title: "Web Development Project",
          student: "John Doe",
          agent: "David Wilson",
          status: "In Progress",
          dueDate: "2023-05-15",
          value: 500,
        },
        {
          id: "proj-2",
          title: "Mobile App Development",
          student: "Jane Smith",
          agent: "Pending Assignment",
          status: "Pending",
          dueDate: "2023-06-20",
          value: 800,
        },
        {
          id: "proj-3",
          title: "Database Design",
          student: "Alex Johnson",
          agent: "Sarah Brown",
          status: "Completed",
          dueDate: "2023-04-30",
          value: 400,
        },
      ])

      setFlaggedContent([
        {
          id: "flag-1",
          type: "Marketplace Product",
          title: "Used Exam Papers",
          reason: "Potential academic integrity violation",
          reportedBy: "System",
          date: "2023-04-28",
        },
        {
          id: "flag-2",
          type: "Chat Message",
          title: "Inappropriate language",
          reason: "Violation of community guidelines",
          reportedBy: "User: David Wilson",
          date: "2023-04-27",
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage users, projects, and platform content</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={<Users className="h-5 w-5 text-blue-600" />}
          description="Active students"
        />
        <StatCard
          title="Total Agents"
          value={stats.totalAgents}
          icon={<Users className="h-5 w-5 text-green-600" />}
          description="Available agents"
        />
        <StatCard
          title="Pending Projects"
          value={stats.pendingProjects}
          icon={<ShoppingBag className="h-5 w-5 text-yellow-600" />}
          description="Awaiting assignment"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue}`}
          icon={<BarChart className="h-5 w-5 text-purple-600" />}
          description="All time"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Overview of the latest project submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      <div>
                        {project.title}
                        <div className="text-xs text-muted-foreground mt-1">Student: {project.student}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          project.status === "In Progress"
                            ? "default"
                            : project.status === "Completed"
                              ? "outline"
                              : "secondary"
                        }
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>${project.value}</TableCell>
                    <TableCell>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin/projects/${project.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 text-center">
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/projects">View All Projects</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                Flagged Content
              </CardTitle>
              <CardDescription>Content requiring review and moderation</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {flaggedContent.length > 0 ? (
              <div className="space-y-4">
                {flaggedContent.map((item) => (
                  <div key={item.id} className="rounded-md border p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {item.type}
                        </Badge>
                        <h4 className="font-medium">{item.title}</h4>
                      </div>
                      <Button variant="destructive" size="sm">
                        Review
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{item.reason}</p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{item.reportedBy}</span>
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No flagged content to review</p>
              </div>
            )}
            <div className="mt-4 text-center">
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/moderation">View All Moderation Tasks</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Administration</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="archive">Archive</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Quick Actions</CardTitle>
              <CardDescription>Manage various system functions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Link href="/admin/users">
                    <Users className="h-5 w-5 mb-1" />
                    <span>Manage Users</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Link href="/admin/projects">
                    <ShoppingBag className="h-5 w-5 mb-1" />
                    <span>Manage Projects</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Link href="/admin/marketplace">
                    <BarChart className="h-5 w-5 mb-1" />
                    <span>Marketplace</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Link href="/admin/archive">
                    <Archive className="h-5 w-5 mb-1" />
                    <span>View Archives</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Link href="/admin/settings">
                    <span>System Settings</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Link href="/admin/reports">
                    <span>Generate Reports</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">Manage student and agent accounts</p>
                <div className="flex justify-center gap-4">
                  <Button asChild>
                    <Link href="/admin/users">View All Users</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/admin/users/create">Create User</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketplace">
          <Card>
            <CardHeader>
              <CardTitle>Marketplace Management</CardTitle>
              <CardDescription>Manage online marketplace products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">Review, approve, and moderate marketplace listings</p>
                <div className="flex justify-center gap-4">
                  <Button asChild>
                    <Link href="/admin/marketplace">View Marketplace</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/admin/marketplace/pending">Pending Approvals</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archive">
          <Card>
            <CardHeader>
              <CardTitle>Archive</CardTitle>
              <CardDescription>View archived content and deleted items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">Access archived projects, users, and marketplace listings</p>
                <div className="flex justify-center gap-4">
                  <Button asChild>
                    <Link href="/admin/archive">View Archives</Link>
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

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  description: string
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}
