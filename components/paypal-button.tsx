"use client"

import { useState } from "react"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { useToast } from "@/components/ui/use-toast"

interface PayPalButtonProps {
  amount: number
  currency?: string
  onSuccess: (details: any) => void
  onError?: (error: any) => void
}

export function PayPalButton({ amount, currency = "USD", onSuccess, onError }: PayPalButtonProps) {
  const { toast } = useToast()
  const [isPending, setIsPending] = useState(false)

  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
    currency,
    intent: "capture",
  }

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        disabled={isPending}
        forceReRender={[amount, currency]}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount.toString(),
                },
                payee: {
                  email_address: "dineshmoorthy87@gmail.com",
                },
              },
            ],
          })
        }}
        onApprove={(data, actions) => {
          setIsPending(true)
          return actions.order.capture().then((details) => {
            setIsPending(false)
            toast({
              title: "Payment Successful",
              description: `Transaction completed by ${details.payer.name.given_name}`,
            })
            onSuccess(details)
          })
        }}
        onError={(err) => {
          setIsPending(false)
          toast({
            title: "Payment Error",
            description: "There was an error processing your payment",
            variant: "destructive",
          })
          if (onError) onError(err)
        }}
        style={{ layout: "vertical", label: "pay" }}
      />
    </PayPalScriptProvider>
  )
}
