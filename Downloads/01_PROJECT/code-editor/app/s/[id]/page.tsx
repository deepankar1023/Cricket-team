"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Copy, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface CodeSnippet {
  code: string
  language: string
  createdAt: string
}

export default function SharedSnippetPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [snippet, setSnippet] = useState<CodeSnippet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const id = params.id as string

  useEffect(() => {
    // In a real implementation, this would fetch from the API
    // For demo purposes, we'll simulate a network request
    setIsLoading(true)

    setTimeout(() => {
      // Mock data
      if (id === "demo123") {
        setSnippet({
          code: 'console.log("This is a shared code snippet!");',
          language: "javascript",
          createdAt: new Date().toISOString(),
        })
      } else {
        // Simulate a random snippet
        setSnippet({
          code: `// Shared code snippet with ID: ${id}\n\nfunction greet(name) {\n  return \`Hello, \${name}!\`;\n}\n\nconsole.log(greet("World"));`,
          language: "javascript",
          createdAt: new Date().toISOString(),
        })
      }

      setIsLoading(false)
    }, 1000)
  }, [id])

  const handleCopyCode = () => {
    if (snippet) {
      navigator.clipboard.writeText(snippet.code)
      toast({
        title: "Code copied to clipboard",
        description: "You can now paste it in your editor.",
      })
    }
  }

  const handleOpenInEditor = () => {
    if (snippet) {
      const encodedCode = btoa(encodeURIComponent(snippet.code))
      router.push(`/editor?lang=${snippet.language}&code=${encodedCode}`)
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="mb-4">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="border rounded-lg p-4 bg-gray-50">
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Snippet Not Found</h1>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!snippet) {
    return null
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Shared Code Snippet</h1>
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            {snippet.language}
          </span>
          <span className="text-sm text-gray-500 ml-4">Created {new Date(snippet.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyCode}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Code
          </Button>
          <Button size="sm" onClick={handleOpenInEditor}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in Editor
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <pre className="p-4 bg-gray-50 overflow-x-auto">
          <code className="text-sm font-mono">{snippet.code}</code>
        </pre>
      </div>
    </div>
  )
}
