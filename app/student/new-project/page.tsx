"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUploader } from "@/components/file-uploader"

export default function NewProjectPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    dueDate: "",
    teamSize: "1",
    reportCopies: "1",
    files: [] as File[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProjectData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setProjectData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (files: File[]) => {
    setProjectData((prev) => ({
      ...prev,
      files: [...prev.files, ...files],
    }))
  }

  const removeFile = (index: number) => {
    setProjectData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }))
  }

  const nextStep = () => {
    setStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // This would be an API call in a real app
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Project submitted",
        description: "You will be redirected to payment once approved.",
      })

      router.push("/student/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  if (!user) {
    router.push("/login?callbackUrl=/student/new-project")
    return null
  }

  return (
    <div className="container mx-auto p-4 py-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Project</h1>
        <p className="text-muted-foreground">Submit your project requirements and upload related documents</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Project Details</CardTitle>
            <div className="text-sm text-muted-foreground">Step {step} of 3</div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={projectData.title}
                    onChange={handleInputChange}
                    placeholder="Enter project title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={projectData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your project requirements"
                    rows={5}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Expected Completion Date</Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={projectData.dueDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="teamSize">Number of Students Involved</Label>
                  <Select value={projectData.teamSize} onValueChange={(value) => handleSelectChange("teamSize", value)}>
                    <SelectTrigger id="teamSize">
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reportCopies">Number of Report Copies</Label>
                  <Select
                    value={projectData.reportCopies}
                    onValueChange={(value) => handleSelectChange("reportCopies", value)}
                  >
                    <SelectTrigger id="reportCopies">
                      <SelectValue placeholder="Select number of copies" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {Number.parseInt(projectData.teamSize) > 1 && (
                  <div className="pt-4">
                    <div className="text-sm font-medium mb-2">Team Members</div>
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm">
                        You will be designated as the Team Lead by default. You'll be able to add team members and grant
                        them view access after project creation.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Upload Project Documents</Label>
                  <FileUploader
                    onFilesSelected={handleFileChange}
                    maxFiles={10}
                    acceptedFileTypes="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  />
                </div>

                {projectData.files.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Uploaded Files</h4>
                    <div className="space-y-2">
                      {projectData.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                          <div className="flex items-center">
                            <span className="text-sm font-medium">{file.name}</span>
                            <span className="ml-2 text-xs text-muted-foreground">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-muted p-4 rounded-md mt-4">
                  <h4 className="text-sm font-medium mb-2">Next Steps</h4>
                  <p className="text-sm">
                    After submission, you'll be directed to payment via PayPal. You'll receive a confirmation email once
                    payment is complete.
                  </p>
                </div>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
          ) : (
            <div />
          )}
          {step < 3 ? (
            <Button onClick={nextStep}>Continue</Button>
          ) : (
            <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Submit & Proceed to Payment"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
