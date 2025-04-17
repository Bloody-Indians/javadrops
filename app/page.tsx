import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <div className="relative h-32 w-32">
          <Image src="/javadrops-logo.png" alt="JavaDrops Logo" fill className="object-contain" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Welcome to JavaDrops</h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Empower your learning journey with AI-driven solutions, intelligent project matching, and cutting-edge educational resources.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/student/login">Student Portal</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/agent/login">Agent Portal</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/admin/login">Admin Portal</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/marketplace">Online Marketplace</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
