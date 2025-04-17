
'use client'

import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { ReactNode } from "react"

export function PayPalProvider({ children }: { children: ReactNode }) {
  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
        currency: "USD",
      }}
    >
      {children}
    </PayPalScriptProvider>
  )
}
