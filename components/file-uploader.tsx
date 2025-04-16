"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void
  maxFiles?: number
  acceptedFileTypes?: string
}

export function FileUploader({ onFilesSelected, maxFiles = 5, acceptedFileTypes = "" }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files)
      onFilesSelected(filesArray.slice(0, maxFiles))
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      onFilesSelected(filesArray.slice(0, maxFiles))

      // Reset the input to allow re-uploading the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div
      className={`border-2 border-dashed rounded-md p-6 text-center ${
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        className="hidden"
        multiple={maxFiles > 1}
        accept={acceptedFileTypes}
      />
      <div className="flex flex-col items-center space-y-4">
        <div className="p-3 bg-primary/10 rounded-full">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium">Drag and drop files here or click to browse</p>
          <p className="text-xs text-muted-foreground mt-1">Upload up to {maxFiles} files (PDF, DOC, DOCX)</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={handleButtonClick}>
          Select Files
        </Button>
      </div>
    </div>
  )
}
