
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { MainNav } from "@/components/main-nav"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import { PayPalProvider } from "@/components/paypal-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "JavaDrops Portal",
  description: "Student projects, agents, and online marketplace",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <PayPalProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <div className="flex min-h-screen flex-col">
                <MainNav />
                <main className="flex-1">{children}</main>
                <footer className="border-t py-4 text-center text-sm text-muted-foreground">
                  © {new Date().getFullYear()} JavaDrops. All rights reserved for javadrops.co.in@gmail.com
                </footer>
              </div>
              <Toaster />
            </ThemeProvider>
          </PayPalProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
