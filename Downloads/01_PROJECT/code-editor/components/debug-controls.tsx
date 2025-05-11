"use client"

import { StepForward, Square, Bug } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DebugControlsProps {
  isDebugging: boolean
  onDebugStart: () => void
  onDebugStep: () => void
  onDebugStop: () => void
  disabled: boolean
}

export function DebugControls({ isDebugging, onDebugStart, onDebugStep, onDebugStop, disabled }: DebugControlsProps) {
  const handleDebugStart = () => {
    try {
      onDebugStart()
    } catch (error) {
      console.error("Error starting debug:", error)
    }
  }

  const handleDebugStep = () => {
    try {
      onDebugStep()
    } catch (error) {
      console.error("Error stepping debug:", error)
    }
  }

  const handleDebugStop = () => {
    try {
      onDebugStop()
    } catch (error) {
      console.error("Error stopping debug:", error)
    }
  }

  return (
    <TooltipProvider>
      {!isDebugging ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={handleDebugStart} disabled={disabled}>
              <Bug className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Start Debugging</TooltipContent>
        </Tooltip>
      ) : (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleDebugStep}>
                <StepForward className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Step</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleDebugStop}>
                <Square className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Stop Debugging</TooltipContent>
          </Tooltip>
        </>
      )}
    </TooltipProvider>
  )
}
