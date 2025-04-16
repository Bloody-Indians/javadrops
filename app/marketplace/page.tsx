"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/hooks/use-auth"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Clock, Users, Search, ShoppingCart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function MarketplacePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isMarketOpen, setIsMarketOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [filter, setFilter] = useState("")

  // Check if market is open (10 PM - 11 PM London time)
  useEffect(() => {
    // Update current time every minute
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)

      // Convert to London time
      const londonTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/London" }))
      const hours = londonTime.getHours()
      const minutes = londonTime.getMinutes()

      // Market is open from 10 PM to 11 PM London time
      const isOpen = hours === 22
      setIsMarketOpen(isOpen)

      if (isOpen) {
        // Calculate time left until 11 PM
        const minutesLeft = 60 - minutes
        setTimeLeft(`${minutesLeft} minute${minutesLeft !== 1 ? "s" : ""}`)
      } else {
        // Calculate time until next opening
        let hoursUntilOpen = 0
        if (hours < 22) {
          hoursUntilOpen = 22 - hours
        } else {
          hoursUntilOpen = 24 - hours + 22
        }

        if (hours === 22 && minutes >= 0) {
          setTimeLeft("Market closed for today")
        } else {
          setTimeLeft(`Opens in ${hoursUntilOpen} hour${hoursUntilOpen !== 1 ? "s" : ""}`)
        }
      }
    }, 60000)

    // Initial check
    const now = new Date()
    const londonTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/London" }))
    const hours = londonTime.getHours()
    const minutes = londonTime.getMinutes()

    const isOpen = hours === 22
    setIsMarketOpen(isOpen)

    if (isOpen) {
      const minutesLeft = 60 - minutes
      setTimeLeft(`${minutesLeft} minute${minutesLeft !== 1 ? "s" : ""}`)
    } else {
      let hoursUntilOpen = 0
      if (hours < 22) {
        hoursUntilOpen = 22 - hours
      } else {
        hoursUntilOpen = 24 - hours + 22
      }

      if (hours === 22 && minutes >= 0) {
        setTimeLeft("Market closed for today")
      } else {
        setTimeLeft(`Opens in ${hoursUntilOpen} hour${hoursUntilOpen !== 1 ? "s" : ""}`)
      }
    }

    return () => clearInterval(timer)
  }, [])

  // Load products
  useEffect(() => {
    // This would be an API call in a real app
    setProducts([
      {
        id: "prod-1",
        title: "Advanced Algorithms Study Notes",
        description:
          "Comprehensive study notes for advanced algorithms course, including time complexity analysis, sorting algorithms, graph algorithms, and dynamic programming.",
        price: 25,
        originalPrice: 40,
        discount: 38,
        seller: "John Doe",
        rating: 4.8,
        reviews: 12,
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "prod-2",
        title: "Database Design Project Template",
        description:
          "Complete database design project template including ER diagrams, schema design, normalization examples, and SQL implementation scripts.",
        price: 35,
        originalPrice: 50,
        discount: 30,
        seller: "Jane Smith",
        rating: 4.5,
        reviews: 8,
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "prod-3",
        title: "Machine Learning Crash Course",
        description:
          "Comprehensive guide to machine learning fundamentals, including supervised and unsupervised learning algorithms, model evaluation, and practical implementation examples.",
        price: 45,
        originalPrice: 65,
        discount: 31,
        seller: "Alex Johnson",
        rating: 4.9,
        reviews: 15,
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "prod-4",
        title: "Web Development Project Starter",
        description:
          "Complete starter code for a full-stack web application, including authentication, database integration, and responsive UI components.",
        price: 30,
        originalPrice: 45,
        discount: 33,
        seller: "Sarah Brown",
        rating: 4.7,
        reviews: 10,
        image: "/placeholder.svg?height=200&width=300",
      },
    ])
  }, [])

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(filter.toLowerCase()) ||
      product.description.toLowerCase().includes(filter.toLowerCase()),
  )

  const handlePurchase = (productId: string) => {
    if (!isMarketOpen) {
      toast({
        title: "Market is closed",
        description: "The marketplace is only open from 10 PM to 11 PM London time.",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to purchase items from the marketplace.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Item added to cart",
      description: "The selected item has been added to your cart.",
    })
  }

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Online Marketplace</h1>
          <p className="text-muted-foreground">Discover student-created resources and materials</p>
        </div>

        <div className="flex items-center space-x-2 bg-muted p-2 rounded-md">
          <Clock className="h-5 w-5 text-primary" />
          <div>
            {isMarketOpen ? (
              <span className="text-sm font-medium text-green-600">Market Open! Closes in {timeLeft}</span>
            ) : (
              <span className="text-sm font-medium text-muted-foreground">Market Closed. {timeLeft}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Filter Products</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-8"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="font-medium text-sm">Categories</div>
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start text-sm h-8">
                    All Categories
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm h-8">
                    Study Materials
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm h-8">
                    Project Templates
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm h-8">
                    Code Samples
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm h-8">
                    Courses
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-medium text-sm">Price Range</div>
                <div className="flex space-x-2">
                  <Input placeholder="Min" type="number" className="w-1/2" />
                  <Input placeholder="Max" type="number" className="w-1/2" />
                </div>
              </div>

              <Button className="w-full" variant="outline">
                Apply Filters
              </Button>
            </CardContent>
          </Card>

          {user && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/marketplace/sell">Sell Product</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/marketplace/my-products">My Products</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex-1">
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="recent">Recently Added</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isMarketOpen={isMarketOpen}
                    onPurchase={handlePurchase}
                  />
                ))}

                {filteredProducts.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No products found matching your search.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="popular">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Popular products will appear here.</p>
              </div>
            </TabsContent>

            <TabsContent value="recent">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Recently added products will appear here.</p>
              </div>
            </TabsContent>
          </Tabs>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Discussion Forum</CardTitle>
              <CardDescription>Discuss marketplace items with other students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">JS</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">Jane Smith</div>
                          <div className="text-xs text-muted-foreground">2 hours ago</div>
                        </div>
                      </div>
                      <p className="mt-2 text-sm">
                        Has anyone used the Database Design Project Template? I'm wondering if it's helpful for
                        beginners or more geared toward advanced students.
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <Button variant="ghost" size="sm">
                          Reply
                        </Button>
                        <Button variant="ghost" size="sm">
                          Like
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">AJ</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">Alex Johnson</div>
                          <div className="text-xs text-muted-foreground">1 day ago</div>
                        </div>
                      </div>
                      <p className="mt-2 text-sm">
                        Just purchased the Machine Learning Crash Course and it's excellent! Very comprehensive and
                        well-structured.
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <Button variant="ghost" size="sm">
                          Reply
                        </Button>
                        <Button variant="ghost" size="sm">
                          Like
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Input placeholder="Add your comment..." className="mb-2" />
                <Button>Post Comment</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

interface ProductCardProps {
  product: any
  isMarketOpen: boolean
  onPurchase: (productId: string) => void
}

function ProductCard({ product, isMarketOpen, onPurchase }: ProductCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative h-48">
        <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
        {product.discount > 0 && <Badge className="absolute top-2 right-2 bg-red-500">{product.discount}% OFF</Badge>}
      </div>
      <CardContent className="flex-1 p-4">
        <h3 className="font-bold text-lg line-clamp-1">{product.title}</h3>
        <p className="text-muted-foreground text-sm mt-1 mb-2 line-clamp-2">{product.description}</p>
        <div className="flex items-center space-x-1 mt-3">
          <div className="font-bold text-lg">${product.price}</div>
          {product.originalPrice && (
            <div className="text-muted-foreground line-through text-sm">${product.originalPrice}</div>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="text-sm text-muted-foreground flex items-center">
            <Users className="h-3 w-3 mr-1" />
            <span>{product.seller}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {product.rating} ★ ({product.reviews})
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between gap-2">
        <Button variant="outline" className="flex-1" asChild>
          <Link href={`/marketplace/product/${product.id}`}>Details</Link>
        </Button>
        <Button className="flex-1" onClick={() => onPurchase(product.id)} disabled={!isMarketOpen}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  )
}
