"use server"

import { revalidatePath } from "next/cache"
import clientPromise from "./mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { sendEmail } from "./email"
import { ObjectId } from "mongodb"

/**
 * Adds a new customer to the database
 */
export async function addCustomer(formData: FormData) {
  try {
    const client = await clientPromise
    const db = client.db("javadrops")

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const role = formData.get("role") as string

    const result = await db.collection("customer_detail").insertOne({
      name,
      email,
      role,
      createdAt: new Date(),
    })

    revalidatePath("/admin/users")

    return { success: true, id: result.insertedId }
  } catch (error) {
    console.error("Database error:", error)
    return { success: false, error: "Failed to add customer" }
  }
}

/**
 * Submits a new student project
 */
export async function submitProject(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return { success: false, error: "Authentication required" }
    }

    const client = await clientPromise
    const db = client.db("javadrops")

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const dueDate = formData.get("dueDate") as string
    const teamSize = Number.parseInt(formData.get("teamSize") as string)
    const reportCopies = Number.parseInt(formData.get("reportCopies") as string)

    // In a real app, you would handle file uploads to a storage service

    const result = await db.collection("projects").insertOne({
      title,
      description,
      dueDate: new Date(dueDate),
      teamSize,
      reportCopies,
      studentId: session.user.id,
      studentName: session.user.name,
      studentEmail: session.user.email,
      status: "Pending Payment",
      createdAt: new Date(),
    })

    // Send email notification to admin
    await sendEmail({
      to: "admin@javadrops.co.in",
      template: "projectSubmission",
      data: {
        title,
        studentName: session.user.name,
        dueDate,
      },
    })

    revalidatePath("/student/dashboard")

    return {
      success: true,
      id: result.insertedId,
      redirectUrl: `/student/payment?projectId=${result.insertedId}`,
    }
  } catch (error) {
    console.error("Database error:", error)
    return { success: false, error: "Failed to submit project" }
  }
}

/**
 * Process payment for a project
 */
export async function processPayment(projectId: string, paymentDetails: any) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return { success: false, error: "Authentication required" }
    }

    const client = await clientPromise
    const db = client.db("javadrops")

    // Find the project
    const project = await db.collection("projects").findOne({
      _id: new ObjectId(projectId),
    })

    if (!project) {
      return { success: false, error: "Project not found" }
    }

    // Update project status
    await db.collection("projects").updateOne(
      { _id: new ObjectId(projectId) },
      {
        $set: {
          status: "Paid",
          paymentDetails: {
            transactionId: paymentDetails.transactionId,
            amount: paymentDetails.amount,
            date: new Date(),
          },
        },
      },
    )

    // Record the payment
    await db.collection("payments").insertOne({
      projectId: new ObjectId(projectId),
      studentId: session.user.id,
      amount: paymentDetails.amount,
      transactionId: paymentDetails.transactionId,
      paymentMethod: "PayPal",
      status: "Completed",
      createdAt: new Date(),
    })

    // Send confirmation emails
    await sendEmail({
      to: session.user.email as string,
      cc: "admin@javadrops.co.in",
      template: "paymentConfirmation",
      data: {
        title: project.title,
        amount: paymentDetails.amount,
        transactionId: paymentDetails.transactionId,
      },
    })

    // Remove the SQS code and replace with MongoDB tracking
    // Store purchase details in MongoDB instead of sending to SQS
    await db.collection("purchase_tracking").insertOne({
      projectId: new ObjectId(projectId),
      productName: project.title,
      price: paymentDetails.amount,
      userId: session.user.id,
      userName: session.user.name,
      userEmail: session.user.email,
      location: paymentDetails.location || "Unknown",
      purchaseTime: new Date(),
    })

    revalidatePath("/student/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Payment processing error:", error)
    return { success: false, error: "Failed to process payment" }
  }
}

/**
 * Assigns a project to an agent
 */
export async function assignProject(projectId: string, agentId: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return { success: false, error: "Authentication required" }
    }

    const client = await clientPromise
    const db = client.db("javadrops")

    // Get project and agent details
    const project = await db.collection("projects").findOne({ _id: new ObjectId(projectId) })
    const agent = await db.collection("users").findOne({ _id: new ObjectId(agentId) })

    if (!project || !agent) {
      return { success: false, error: "Project or agent not found" }
    }

    // Update project with agent assignment
    await db.collection("projects").updateOne(
      { _id: new ObjectId(projectId) },
      {
        $set: {
          agentId,
          agentName: agent.name,
          agentEmail: agent.email,
          status: "In Progress",
          assignedAt: new Date(),
        },
      },
    )

    // Send email notifications
    await sendEmail({
      to: agent.email,
      template: "projectAssigned",
      data: {
        title: project.title,
        agentName: agent.name,
        dueDate: project.dueDate,
      },
    })

    await sendEmail({
      to: project.studentEmail,
      template: "projectAssigned",
      data: {
        title: project.title,
        agentName: agent.name,
        dueDate: project.dueDate,
      },
    })

    revalidatePath("/agent/dashboard")
    revalidatePath("/student/dashboard")
    revalidatePath("/admin/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Database error:", error)
    return { success: false, error: "Failed to assign project" }
  }
}

/**
 * Completes a project
 */
export async function completeProject(projectId: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return { success: false, error: "Authentication required" }
    }

    const client = await clientPromise
    const db = client.db("javadrops")

    // Get project details
    const project = await db.collection("projects").findOne({ _id: new ObjectId(projectId) })

    if (!project) {
      return { success: false, error: "Project not found" }
    }

    // Update project status
    await db.collection("projects").updateOne(
      { _id: new ObjectId(projectId) },
      {
        $set: {
          status: "Completed",
          completedAt: new Date(),
        },
      },
    )

    // Send email notifications
    await sendEmail({
      to: [project.studentEmail, project.agentEmail],
      cc: "admin@javadrops.co.in",
      template: "projectCompleted",
      data: {
        title: project.title,
        studentName: project.studentName,
        agentName: project.agentName,
      },
    })

    revalidatePath("/agent/dashboard")
    revalidatePath("/student/dashboard")
    revalidatePath("/admin/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Database error:", error)
    return { success: false, error: "Failed to complete project" }
  }
}

/**
 * Lists a product in the marketplace
 */
export async function listMarketplaceProduct(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return { success: false, error: "Authentication required" }
    }

    const client = await clientPromise
    const db = client.db("javadrops")

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const originalPrice = Number.parseFloat(formData.get("originalPrice") as string)

    // Calculate discount percentage
    const discount = originalPrice > 0 ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

    // In a real app, you would handle image uploads to a storage service

    const result = await db.collection("marketplace").insertOne({
      title,
      description,
      price,
      originalPrice,
      discount,
      sellerId: session.user.id,
      sellerName: session.user.name,
      sellerEmail: session.user.email,
      status: "Active",
      createdAt: new Date(),
    })

    revalidatePath("/marketplace")

    return { success: true, id: result.insertedId }
  } catch (error) {
    console.error("Database error:", error)
    return { success: false, error: "Failed to list product" }
  }
}

/**
 * Purchase a marketplace product
 */
export async function purchaseMarketplaceProduct(productId: string, paymentDetails: any) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return { success: false, error: "Authentication required" }
    }

    const client = await clientPromise
    const db = client.db("javadrops")

    // Get product details
    const product = await db.collection("marketplace").findOne({ _id: new ObjectId(productId) })

    if (!product) {
      return { success: false, error: "Product not found" }
    }

    // Record the purchase
    await db.collection("marketplace_purchases").insertOne({
      productId: new ObjectId(productId),
      productName: product.title,
      price: product.price,
      buyerId: session.user.id,
      buyerName: session.user.name,
      buyerEmail: session.user.email,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      sellerEmail: product.sellerEmail,
      transactionId: paymentDetails.transactionId,
      status: "Completed",
      createdAt: new Date(),
    })

    // Send email notifications
    await sendEmail({
      to: [session.user.email as string, product.sellerEmail],
      cc: "admin@javadrops.co.in",
      template: "marketplacePurchase",
      data: {
        productName: product.title,
        price: product.price,
        buyerName: session.user.name,
        sellerName: product.sellerName,
      },
    })

    // Store purchase details in MongoDB instead of sending to SQS
    await db.collection("purchase_tracking").insertOne({
      productId: new ObjectId(productId),
      productName: product.title,
      price: product.price,
      userId: session.user.id,
      userName: session.user.name,
      userEmail: session.user.email,
      location: paymentDetails.location || "Unknown",
      purchaseTime: new Date(),
    })

    revalidatePath("/marketplace")

    return { success: true }
  } catch (error) {
    console.error("Purchase error:", error)
    return { success: false, error: "Failed to complete purchase" }
  }
}

/**
 * Get analytics data for admin dashboard
 */
export async function getAdminAnalytics() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return { success: false, error: "Authentication required" }
    }

    const client = await clientPromise
    const db = client.db("javadrops")

    // Get counts
    const studentCount = await db.collection("users").countDocuments({ role: "student" })
    const agentCount = await db.collection("users").countDocuments({ role: "agent" })
    const projectCount = await db.collection("projects").countDocuments()
    const marketplaceCount = await db.collection("marketplace").countDocuments()

    // Get project status counts
    const pendingProjects = await db.collection("projects").countDocuments({ status: "Pending Payment" })
    const inProgressProjects = await db.collection("projects").countDocuments({ status: "In Progress" })
    const completedProjects = await db.collection("projects").countDocuments({ status: "Completed" })

    // Get revenue data
    const payments = await db.collection("payments").find().sort({ createdAt: 1 }).toArray()

    // Calculate total revenue
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0)

    // Calculate monthly revenue for the past 6 months
    const monthlyRevenue = Array(6)
      .fill(0)
      .map((_, i) => {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const month = date.getMonth()
        const year = date.getFullYear()

        const monthPayments = payments.filter((payment) => {
          const paymentDate = new Date(payment.createdAt)
          return paymentDate.getMonth() === month && paymentDate.getFullYear() === year
        })

        return {
          month: date.toLocaleString("default", { month: "short" }),
          revenue: monthPayments.reduce((sum, payment) => sum + payment.amount, 0),
        }
      })
      .reverse()

    // Get recent projects
    const recentProjects = await db.collection("projects").find().sort({ createdAt: -1 }).limit(5).toArray()

    return {
      success: true,
      data: {
        counts: {
          students: studentCount,
          agents: agentCount,
          projects: projectCount,
          marketplace: marketplaceCount,
        },
        projectStatus: {
          pending: pendingProjects,
          inProgress: inProgressProjects,
          completed: completedProjects,
        },
        revenue: {
          total: totalRevenue,
          monthly: monthlyRevenue,
        },
        recentProjects,
      },
    }
  } catch (error) {
    console.error("Analytics error:", error)
    return { success: false, error: "Failed to fetch analytics data" }
  }
}
