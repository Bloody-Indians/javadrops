"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { getAdminAnalytics } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"

export default function AdminAnalyticsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      router.push("/login?callbackUrl=/admin/analytics")
      return
    }

    // Fetch analytics data
    const fetchAnalytics = async () => {
      try {
        const result = await getAdminAnalytics()
        if (result.success) {
          setAnalytics(result.data)
        } else {
          // Handle error case
          toast({
            title: "Error loading analytics",
            description: "Some data may be incomplete due to missing AWS integration.",
            variant: "warning",
          })
          // Set default analytics data
          setAnalytics({
            counts: {
              students: 0,
              agents: 0,
              projects: 0,
              marketplace: 0,
            },
            projectStatus: {
              pending: 0,
              inProgress: 0,
              completed: 0,
            },
            revenue: {
              total: 0,
              monthly: Array(6)
                .fill(0)
                .map((_, i) => {
                  const date = new Date()
                  date.setMonth(date.getMonth() - i)
                  return {
                    month: date.toLocaleString("default", { month: "short" }),
                    revenue: 0,
                  }
                })
                .reverse(),
            },
            recentProjects: [],
          })
        }
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchAnalytics()
    }
  }, [user, loading, router])

  if (loading || isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  if (!analytics) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Failed to load analytics data.</p>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const revenueData = analytics.revenue.monthly.map((item: any) => ({
    name: item.month,
    revenue: item.revenue,
  }))

  const projectStatusData = [
    { name: "Pending", value: analytics.projectStatus.pending },
    { name: "In Progress", value: analytics.projectStatus.inProgress },
    { name: "Completed", value: analytics.projectStatus.completed },
  ]

  const userDistributionData = [
    { name: "Students", value: analytics.counts.students },
    { name: "Agents", value: analytics.counts.agents },
  ]

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Comprehensive analytics and reporting for JavaDrops</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <StatCard title="Total Students" value={analytics.counts.students} />
        <StatCard title="Total Agents" value={analytics.counts.agents} />
        <StatCard title="Total Projects" value={analytics.counts.projects} />
        <StatCard title="Total Revenue" value={`$${analytics.revenue.total.toFixed(2)}`} />
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>Revenue trends over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <BarChart
                data={revenueData}
                index="name"
                categories={["revenue"]}
                colors={["blue"]}
                valueFormatter={(value) => `$${value}`}
                yAxisWidth={60}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Project Status Distribution</CardTitle>
                <CardDescription>Current status of all projects</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <PieChart
                  data={projectStatusData}
                  index="name"
                  category="value"
                  colors={["yellow", "blue", "green"]}
                  valueFormatter={(value) => `${value} projects`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Completion Rate</CardTitle>
                <CardDescription>Monthly project completion trends</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <LineChart
                  data={[
                    { month: "Jan", completed: 5 },
                    { month: "Feb", completed: 8 },
                    { month: "Mar", completed: 12 },
                    { month: "Apr", completed: 10 },
                    { month: "May", completed: 15 },
                    { month: "Jun", completed: 18 },
                  ]}
                  index="month"
                  categories={["completed"]}
                  colors={["green"]}
                  valueFormatter={(value) => `${value} projects`}
                  yAxisWidth={40}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Breakdown of user types</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <PieChart
                  data={userDistributionData}
                  index="name"
                  category="value"
                  colors={["blue", "green"]}
                  valueFormatter={(value) => `${value} users`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Monthly user registration trends</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <LineChart
                  data={[
                    { month: "Jan", students: 10, agents: 2 },
                    { month: "Feb", students: 15, agents: 3 },
                    { month: "Mar", students: 20, agents: 5 },
                    { month: "Apr", students: 25, agents: 7 },
                    { month: "May", students: 30, agents: 8 },
                    { month: "Jun", students: 35, agents: 10 },
                  ]}
                  index="month"
                  categories={["students", "agents"]}
                  colors={["blue", "green"]}
                  valueFormatter={(value) => `${value} users`}
                  yAxisWidth={40}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
