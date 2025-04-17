
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

const trainingMaterials = [
  {
    title: "AWS Solution Architect Associate Course",
    description: "Comprehensive training material for AWS SAA certification",
    price: "$299",
    image: "/aws-saa.png",
    features: [
      "Video lectures",
      "Practice tests",
      "Study guides",
      "1-on-1 consultation"
    ]
  },
  {
    title: "AWS Cloud Practitioner",
    description: "Entry level AWS certification preparation",
    price: "$199",
    image: "/aws-cp.png",
    features: [
      "Beginner friendly content",
      "Hands-on labs",
      "Mock exams",
      "Discussion forum access"
    ]
  }
]

export default function AWSTraining() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">AWS Certification Training</h1>
        <p className="text-lg text-muted-foreground">Master AWS with our comprehensive training materials</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {trainingMaterials.map((material, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <div className="relative h-48 w-full mb-4">
                <Image
                  src={material.image}
                  alt={material.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <CardTitle>{material.title}</CardTitle>
              <CardDescription>{material.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <ul className="space-y-2">
                  {material.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <span className="mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="text-2xl font-bold">{material.price}</div>
                <Button className="w-full">Enroll Now</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
