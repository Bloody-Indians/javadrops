"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Clock, AlertCircle } from "lucide-react"
import { PayPalButton } from "@/components/paypal-button"
import { purchaseMarketplaceProduct } from "@/lib/actions"
import { isMarketplaceOpen, getMarketplaceTimeInfo } from "@/lib/utils"
import Image from "next/image"

export default function ProductPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [marketStatus, setMarketStatus] = useState({ isOpen: false, timeLeft: "" })
  const [isProcessing, setIsProcessing] = useState(false)

  // Check marketplace status every minute
  useEffect(() => {
    const checkMarketStatus = () => {
      const status = getMarketplaceTimeInfo()
      setMarketStatus(status)
    }

    // Initial check
    checkMarketStatus()

    // Set up interval
    const interval = setInterval(checkMarketStatus, 60000)

    return () => clearInterval(interval)
  }, [])

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // This would be an API call in a real app
        setProduct({
          id,
          title: "Advanced Algorithms Study Notes",
          description:
            "Comprehensive study notes for advanced algorithms course, including time complexity analysis, sorting algorithms, graph algorithms, and dynamic programming.",
          longDescription:
            "These study notes cover all aspects of advanced algorithms, from basic concepts to complex implementations. Topics include:\n\n- Big O notation and time complexity analysis\n- Sorting algorithms (quicksort, mergesort, heapsort)\n- Graph algorithms (BFS, DFS, Dijkstra's, A*)\n- Dynamic programming techniques\n- NP-completeness and approximation algorithms\n\nThe notes include practical examples, pseudocode, and implementation tips for each algorithm.",
          price: 25,
          originalPrice: 40,
          discount: 38,
          seller: "John Doe",
          sellerAvatar: "/placeholder.svg?height=40&width=40",
          rating: 4.8,
          reviews: 12,
          image: "/placeholder.svg?height=400&width=600",
          createdAt: "2023-04-15",
        })
      } catch (error) {
        console.error("Error fetching product:", error)
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, toast])

  const handlePurchase = async (details: any) => {
    if (!isMarketplaceOpen()) {
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
      router.push(`/login?callbackUrl=/marketplace/product/${id}`)
      return
    }

    setIsProcessing(true)

    try {
      const paymentDetails = {
        transactionId: details.id,
        amount: product.price,
        payerId: details.payer.payer_id,
        payerEmail: details.payer.email_address,
        payerName: `${details.payer.name.given_name} ${details.payer.name.surname}`,
        location: "Browser",
      }

      const result = await purchaseMarketplaceProduct(id as string, paymentDetails)

      if (result.success) {
        toast({
          title: "Purchase Successful",
          description: "Your purchase has been completed successfully.",
        })
        router.push("/marketplace/purchases")
      } else {
        toast({
          title: "Purchase Error",
          description: result.error || "There was an error processing your purchase.",
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

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  if (!product) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Product not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <div className="relative aspect-video rounded-lg overflow-hidden border">
            <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
          </div>

          <div className="mt-6">
            <Tabs defaultValue="description">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="seller">Seller</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="prose max-w-none">
                      <p>{product.longDescription}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="reviews" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold">{product.rating}</div>
                        <div className="flex">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                        </div>
                        <div className="text-sm text-muted-foreground">({product.reviews} reviews)</div>
                      </div>

                      <div className="space-y-4">
                        <ReviewItem
                          name="Alex Johnson"
                          date="2023-04-10"
                          rating={5}
                          comment="Excellent study notes! Very comprehensive and well-organized. Helped me ace my algorithms exam."
                        />
                        <ReviewItem
                          name="Sarah Brown"
                          date="2023-04-05"
                          rating={4}
                          comment="Great content, but could use more examples for some of the more complex algorithms."
                        />
                        <ReviewItem
                          name="Michael Wilson"
                          date="2023-03-28"
                          rating={5}
                          comment="These notes saved me so much time. The explanations are clear and concise."
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="seller" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={product.sellerAvatar || "/placeholder.svg"} />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{product.seller}</div>
                        <div className="text-sm text-muted-foreground">Member since January 2023</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-sm font-medium">Seller Rating</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            ))}
                        </div>
                        <div className="text-sm text-muted-foreground">(24 reviews)</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-sm font-medium">Other Products by this Seller</div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Button variant="outline" size="sm" className="justify-start">
                          Data Structures Cheat Sheet
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start">
                          Machine Learning Notes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{product.title}</CardTitle>
                  <CardDescription className="mt-2">{product.description}</CardDescription>
                </div>
                {product.discount > 0 && <Badge className="bg-red-500">{product.discount}% OFF</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-end gap-2">
                <div className="text-3xl font-bold">${product.price.toFixed(2)}</div>
                {product.originalPrice && (
                  <div className="text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <div className="text-sm">
                  {marketStatus.isOpen ? (
                    <span className="text-green-600 font-medium">Market Open! Closes in {marketStatus.timeLeft}</span>
                  ) : (
                    <span className="text-muted-foreground">Market Closed. {marketStatus.timeLeft}</span>
                  )}
                </div>
              </div>

              {!marketStatus.isOpen && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-yellow-800">Marketplace is currently closed</div>
                    <p className="text-sm text-yellow-700 mt-1">
                      The marketplace is only open from 10 PM to 11 PM London time. You can browse products, but
                      purchases can only be made during open hours.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="font-medium">Product Details</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seller:</span>
                    <span>{product.seller}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating:</span>
                    <span>
                      {product.rating} ★ ({product.reviews})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Listed:</span>
                    <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <div className="font-medium mb-2">Purchase Options</div>
                {marketStatus.isOpen ? (
                  <div className="space-y-4">
                    <PayPalButton amount={product.price} onSuccess={handlePurchase} />
                    <p className="text-xs text-muted-foreground text-center">
                      By purchasing, you agree to the marketplace terms and conditions.
                    </p>
                  </div>
                ) : (
                  <Button className="w-full" disabled>
                    Available during market hours only
                  </Button>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.back()}>
                Back to Marketplace
              </Button>
              <Button variant="outline" disabled={isProcessing}>
                Add to Wishlist
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Have Questions?</CardTitle>
              <CardDescription>Ask the seller about this product</CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full border rounded-md p-2 h-24"
                placeholder="Type your question here..."
              ></textarea>
            </CardContent>
            <CardFooter>
              <Button>Send Message</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

interface ReviewItemProps {
  name: string
  date: string
  rating: number
  comment: string
}

function ReviewItem({ name, date, rating, comment }: ReviewItemProps) {
  return (
    <div className="border-b pb-4 last:border-none">
      <div className="flex justify-between items-center">
        <div className="font-medium">{name}</div>
        <div className="text-sm text-muted-foreground">{new Date(date).toLocaleDateString()}</div>
      </div>
      <div className="flex mt-1">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
          ))}
      </div>
      <p className="mt-2 text-sm">{comment}</p>
    </div>
  )
}
