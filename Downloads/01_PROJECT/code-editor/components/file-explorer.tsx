"use client"

import { useState } from "react"
import { Folder, File, ChevronRight, ChevronDown, Plus, Trash2, Edit2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FileData {
  id: string
  name: string
  language: string
  content: string
  path: string
  isActive?: boolean
}

interface FileExplorerProps {
  files: FileData[]
  onFileSelect: (fileId: string) => void
  onAddFile: () => void
  onDeleteFile: (fileId: string) => void
  onRenameFile: (fileId: string, newName: string) => void
  activeFileId: string
}

export function FileExplorer({
  files,
  onFileSelect,
  onAddFile,
  onDeleteFile,
  onRenameFile,
  activeFileId,
}: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({ "/": true })
  const [editingFile, setEditingFile] = useState<string | null>(null)
  const [newFileName, setNewFileName] = useState("")

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }))
  }

  const startRenameFile = (fileId: string, currentName: string) => {
    setEditingFile(fileId)
    setNewFileName(currentName)
  }

  const cancelRenameFile = () => {
    setEditingFile(null)
    setNewFileName("")
  }

  const confirmRenameFile = (fileId: string) => {
    if (newFileName.trim()) {
      onRenameFile(fileId, newFileName.trim())
    }
    setEditingFile(null)
    setNewFileName("")
  }

  // Group files by path
  const filesByPath: Record<string, FileData[]> = {}
  files.forEach((file) => {
    if (!filesByPath[file.path]) {
      filesByPath[file.path] = []
    }
    filesByPath[file.path].push(file)
  })

  const renderFolder = (path: string, depth = 0) => {
    const isExpanded = expandedFolders[path] || false
    const folderFiles = filesByPath[path] || []

    // Get folder name from path
    const folderName = path === "/" ? "Project Files" : path.split("/").pop()

    return (
      <div key={path} className="select-none">
        <div
          className={`flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
            depth > 0 ? "ml-4" : ""
          }`}
          onClick={() => toggleFolder(path)}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 mr-1 text-gray-500" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-1 text-gray-500" />
          )}
          <Folder className="h-4 w-4 mr-2 text-blue-500" />
          <span className="text-sm">{folderName}</span>
        </div>

        {isExpanded && (
          <div>
            {folderFiles.map((file) => (
              <div key={file.id}>
                {editingFile === file.id ? (
                  <div className="flex items-center py-1 px-2 ml-8">
                    <Input
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      className="h-6 text-xs mr-1"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") confirmRenameFile(file.id)
                        if (e.key === "Escape") cancelRenameFile()
                      }}
                    />
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => confirmRenameFile(file.id)}>
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={cancelRenameFile}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className={`flex items-center py-1 px-2 ml-8 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
                      file.id === activeFileId ? "bg-blue-100 dark:bg-blue-900" : ""
                    }`}
                    onClick={() => onFileSelect(file.id)}
                  >
                    <File className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm flex-1 truncate">{file.name}</span>

                    <div className="flex opacity-0 group-hover:opacity-100 hover:opacity-100">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation()
                                startRenameFile(file.id, file.name)
                              }}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Rename</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation()
                                onDeleteFile(file.id)
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="h-full border-r dark:border-gray-800">
      <div className="flex items-center justify-between p-2 border-b dark:border-gray-800">
        <h3 className="text-sm font-medium">Explorer</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onAddFile}>
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>New File</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <ScrollArea className="h-[calc(100%-41px)]">
        <div className="p-2">{renderFolder("/")}</div>
      </ScrollArea>
    </div>
  )
}
