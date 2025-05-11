"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ThemeSelectorProps {
  currentTheme: string
  onThemeChange: (theme: string) => void
}

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const themes = [
    { id: "vs", name: "Light", icon: Sun },
    { id: "vs-dark", name: "Dark", icon: Moon },
    { id: "github-light", name: "GitHub Light", icon: Sun },
    { id: "github-dark", name: "GitHub Dark", icon: Moon },
  ]

  const currentThemeObj = themes.find((t) => t.id === currentTheme) || themes[1]
  const ThemeIcon = currentThemeObj.icon

  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <ThemeIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <DropdownMenuContent align="end">
            {themes.map((theme) => (
              <DropdownMenuItem
                key={theme.id}
                onClick={() => onThemeChange(theme.id)}
                className={currentTheme === theme.id ? "bg-accent" : ""}
              >
                <theme.icon className="h-4 w-4 mr-2" />
                {theme.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipContent>Theme</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
