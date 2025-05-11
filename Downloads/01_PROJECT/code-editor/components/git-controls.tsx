"use client"

import { useState } from "react"
import { Github, GitCommit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface GitControlsProps {
  project: any
}

export function GitControls({ project }: GitControlsProps) {
  const { toast } = useToast()
  const [showCommitDialog, setShowCommitDialog] = useState(false)
  const [commitMessage, setCommitMessage] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleGitHubLogin = () => {
    // This would connect to GitHub OAuth in a real implementation
    toast({
      title: "GitHub Authentication",
      description:
        "This feature requires GitHub authentication. Please set up GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET environment variables.",
    })
  }

  const handleCommit = () => {
    if (!isAuthenticated) {
      handleGitHubLogin()
      return
    }

    setShowCommitDialog(true)
  }

  const handleSaveCommit = () => {
    if (!commitMessage.trim()) {
      toast({
        title: "Commit message required",
        description: "Please enter a commit message",
        variant: "destructive",
      })
      return
    }

    // This would connect to GitHub API in a real implementation
    toast({
      title: "Commit successful",
      description: "Your changes have been committed",
    })

    setShowCommitDialog(false)
    setCommitMessage("")
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={handleGitHubLogin}>
              <Github className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Connect to GitHub</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={handleCommit}>
              <GitCommit className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Commit Changes</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={showCommitDialog} onOpenChange={setShowCommitDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Commit Changes</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="commitMessage" className="text-right">
                Message
              </Label>
              <Textarea
                id="commitMessage"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                className="col-span-3"
                placeholder="Enter commit message"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveCommit}>
              Commit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
