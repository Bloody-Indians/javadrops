"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PayPalButton } from "@/components/paypal-button"
import { processPayment } from "@/lib/actions"

export default function PaymentPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [project, setProject] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const projectId = searchParams.get("projectId")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?callbackUrl=/student/payment")
      return
    }

    if (!projectId) {
      router.push("/student/dashboard")
      return
    }

    // Fetch project details
    // This would be an API call in a real app
    setProject({
      id: projectId,
      title: "Sample Project",
      description: "This is a sample project description",
      price: 250.0,
    })
  }, [projectId, user, loading, router])

  const handlePaymentSuccess = async (details: any) => {
    if (!projectId) return

    setIsProcessing(true)

    try {
      const paymentDetails = {
        transactionId: details.id,
        amount: project.price,
        payerId: details.payer.payer_id,
        payerEmail: details.payer.email_address,
        payerName: `${details.payer.name.given_name} ${details.payer.name.surname}`,
        location: "Browser",
      }

      const result = await processPayment(projectId, paymentDetails)

      if (result.success) {
        toast({
          title: "Payment Processed",
          description: "Your project has been successfully paid for.",
        })
        router.push("/student/dashboard")
      } else {
        toast({
          title: "Processing Error",
          description: result.error || "There was an error processing your payment on our end.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading || !project) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  return (
    <div className="container mx-auto p-4 py-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Complete Payment</CardTitle>
          <CardDescription>Pay for your project submission</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Project Details</h3>
            <div className="bg-muted p-4 rounded-md">
              <div className="font-medium">{project.title}</div>
              <div className="text-sm text-muted-foreground mt-1">{project.description}</div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Payment Amount</h3>
            <div className="text-2xl font-bold">${project.price.toFixed(2)}</div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Payment Method</h3>
            <div className="border rounded-md p-4">
              <PayPalButton amount={project.price} onSuccess={handlePaymentSuccess} />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => router.back()} disabled={isProcessing}>
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
