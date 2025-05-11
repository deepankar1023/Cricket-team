"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EditorSettings {
  fontSize: number
  tabSize: number
  wordWrap: string
}

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  settings: EditorSettings
  onSettingsChange: (settings: EditorSettings) => void
}

export function SettingsDialog({ open, onOpenChange, settings, onSettingsChange }: SettingsDialogProps) {
  const [localSettings, setLocalSettings] = useState<EditorSettings>(settings)

  useEffect(() => {
    setLocalSettings(settings)
  }, [settings, open])

  const handleSave = () => {
    onSettingsChange(localSettings)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editor Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fontSize" className="text-right">
              Font Size
            </Label>
            <Input
              id="fontSize"
              type="number"
              value={localSettings.fontSize}
              onChange={(e) => setLocalSettings({ ...localSettings, fontSize: Number.parseInt(e.target.value) || 14 })}
              className="col-span-3"
              min={8}
              max={32}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tabSize" className="text-right">
              Tab Size
            </Label>
            <Input
              id="tabSize"
              type="number"
              value={localSettings.tabSize}
              onChange={(e) => setLocalSettings({ ...localSettings, tabSize: Number.parseInt(e.target.value) || 2 })}
              className="col-span-3"
              min={1}
              max={8}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="wordWrap" className="text-right">
              Word Wrap
            </Label>
            <Select
              value={localSettings.wordWrap}
              onValueChange={(value) => setLocalSettings({ ...localSettings, wordWrap: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Word Wrap" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="off">Off</SelectItem>
                <SelectItem value="on">On</SelectItem>
                <SelectItem value="wordWrapColumn">Column</SelectItem>
                <SelectItem value="bounded">Bounded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
