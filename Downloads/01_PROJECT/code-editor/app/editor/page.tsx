"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useMonaco } from "@monaco-editor/react"
import { Play, Save, Share2, Download, Upload, Loader2, FileText, Settings } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import Monaco Editor with no SSR
const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading editor...</div>,
})

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { executeCode } from "@/lib/code-execution"
import { parseVariables } from "@/lib/variable-parser"
import { VariableInspector } from "@/components/variable-inspector"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import { FileExplorer } from "@/components/file-explorer"
import { ThemeSelector } from "@/components/theme-selector"
import { SettingsDialog } from "@/components/settings-dialog"
import { DebugControls } from "@/components/debug-controls"
import { GitControls } from "@/components/git-controls"
import { TemplateSelector } from "@/components/template-selector"

const LANGUAGES = [
  { id: "javascript", name: "JavaScript", defaultCode: 'console.log("Hello, world!");', ext: "js" },
  {
    id: "typescript",
    name: "TypeScript",
    defaultCode: 'const greeting: string = "Hello, world!";\nconsole.log(greeting);',
    ext: "ts",
  },
  { id: "python", name: "Python", defaultCode: 'print("Hello, world!")', ext: "py" },
  {
    id: "java",
    name: "Java",
    defaultCode:
      'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, world!");\n  }\n}',
    ext: "java",
  },
  {
    id: "cpp",
    name: "C++",
    defaultCode: '#include <iostream>\n\nint main() {\n  std::cout << "Hello, world!" << std::endl;\n  return 0;\n}',
    ext: "cpp",
  },
]

// File type interface
interface FileData {
  id: string
  name: string
  language: string
  content: string
  path: string
  isActive?: boolean
}

// Project interface
interface Project {
  id: string
  name: string
  files: FileData[]
}

export default function CodeEditorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const isMobile = useMobile()
  const monaco = useMonaco()

  // Editor state
  const [language, setLanguage] = useState("javascript")
  const [code, setCode] = useState(LANGUAGES[0].defaultCode)
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isExecuting, setIsExecuting] = useState(false)
  const [variables, setVariables] = useState([])
  const [activeTab, setActiveTab] = useState("output")
  const [isDebugging, setIsDebugging] = useState(false)
  const [breakpoints, setBreakpoints] = useState([])
  const [currentLine, setCurrentLine] = useState(null)
  const editorRef = useRef(null)

  // File system state
  const [project, setProject] = useState<Project>({
    id: "default-project",
    name: "My Project",
    files: [
      {
        id: "file-1",
        name: "main.js",
        language: "javascript",
        content: LANGUAGES[0].defaultCode,
        path: "/",
        isActive: true,
      },
    ],
  })
  const [activeFileId, setActiveFileId] = useState("file-1")
  const [showFileExplorer, setShowFileExplorer] = useState(true)
  const [showSettings, setShowSettings] = useState(false)

  // Theme and settings
  const [theme, setTheme] = useState("vs-dark")
  const [fontSize, setFontSize] = useState(14)
  const [tabSize, setTabSize] = useState(2)
  const [wordWrap, setWordWrap] = useState("off")

  // Load settings from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("editor-settings")
      if (savedSettings) {
        const settings = JSON.parse(savedSettings)
        setTheme(settings.theme || "vs-dark")
        setFontSize(settings.fontSize || 14)
        setTabSize(settings.tabSize || 2)
        setWordWrap(settings.wordWrap || "off")
      }
    }
  }, [])

  // Save settings to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "editor-settings",
        JSON.stringify({
          theme,
          fontSize,
          tabSize,
          wordWrap,
        }),
      )
    }
  }, [theme, fontSize, tabSize, wordWrap])

  // Configure Monaco editor
  useEffect(() => {
    if (monaco) {
      try {
        // Configure JavaScript/TypeScript linting
        monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: false,
          noSyntaxValidation: false,
        })

        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
          target: monaco.languages.typescript.ScriptTarget.ES2020,
          allowNonTsExtensions: true,
        })

        // Add custom themes
        monaco.editor.defineTheme("github-dark", {
          base: "vs-dark",
          inherit: true,
          rules: [],
          colors: {
            "editor.background": "#0d1117",
            "editor.foreground": "#c9d1d9",
            "editor.lineHighlightBackground": "#161b22",
            "editorLineNumber.foreground": "#6e7681",
            "editor.selectionBackground": "#3b5070",
          },
        })

        monaco.editor.defineTheme("github-light", {
          base: "vs",
          inherit: true,
          rules: [],
          colors: {
            "editor.background": "#ffffff",
            "editor.foreground": "#24292f",
            "editor.lineHighlightBackground": "#f6f8fa",
            "editorLineNumber.foreground": "#8c959f",
            "editor.selectionBackground": "#b1d7fe",
          },
        })
      } catch (error) {
        console.error("Error configuring Monaco:", error)
      }
    }
  }, [monaco])

  useEffect(() => {
    // Check if there's a language or code in the URL
    const langParam = searchParams.get("lang")
    const codeParam = searchParams.get("code")

    if (langParam && LANGUAGES.some((l) => l.id === langParam)) {
      setLanguage(langParam)
    }

    if (codeParam) {
      try {
        const decodedCode = decodeURIComponent(atob(codeParam))
        setCode(decodedCode)

        // Create a new file with the code from URL
        const newFile = {
          id: `file-${Date.now()}`,
          name: `snippet.${LANGUAGES.find((l) => l.id === langParam)?.ext || "js"}`,
          language: langParam || "javascript",
          content: decodedCode,
          path: "/",
          isActive: true,
        }

        setProject((prev) => {
          const updatedFiles = prev.files.map((f) => ({ ...f, isActive: false }))
          return {
            ...prev,
            files: [...updatedFiles, newFile],
          }
        })

        setActiveFileId(newFile.id)
      } catch (e) {
        console.error("Failed to decode code from URL", e)
      }
    }
  }, [searchParams])

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor

    // Set up breakpoint handling only if monaco is available
    if (monaco && editor) {
      try {
        editor.onMouseDown((e) => {
          if (e.target.type === monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS) {
            const lineNumber = e.target.position.lineNumber
            toggleBreakpoint(lineNumber)
          }
        })
      } catch (error) {
        console.error("Error setting up editor mouse handlers:", error)
      }
    }
  }

  const toggleBreakpoint = (lineNumber) => {
    if (!editorRef.current || !monaco) return

    const updatedBreakpoints = [...breakpoints]
    const index = updatedBreakpoints.indexOf(lineNumber)

    if (index === -1) {
      updatedBreakpoints.push(lineNumber)
      // Add breakpoint decoration
      try {
        editorRef.current.deltaDecorations(
          [],
          [
            {
              range: { startLineNumber: lineNumber, startColumn: 1, endLineNumber: lineNumber, endColumn: 1 },
              options: {
                isWholeLine: true,
                className: "breakpoint-decoration",
                glyphMarginClassName: "breakpoint-glyph",
              },
            },
          ],
        )
      } catch (error) {
        console.error("Error adding breakpoint decoration:", error)
      }
    } else {
      updatedBreakpoints.splice(index, 1)
      // Remove breakpoint decoration
      try {
        editorRef.current.deltaDecorations(
          [
            {
              range: { startLineNumber: lineNumber, startColumn: 1, endLineNumber: lineNumber, endColumn: 1 },
              options: {
                isWholeLine: true,
                className: "breakpoint-decoration",
                glyphMarginClassName: "breakpoint-glyph",
              },
            },
          ],
          [],
        )
      } catch (error) {
        console.error("Error removing breakpoint decoration:", error)
      }
    }

    setBreakpoints(updatedBreakpoints)
  }

  const handleLanguageChange = (value) => {
    setLanguage(value)

    // Update the active file's language
    const activeFile = project.files.find((f) => f.id === activeFileId)
    if (activeFile) {
      const langInfo = LANGUAGES.find((l) => l.id === value)
      const newExt = langInfo?.ext || "txt"
      const baseName = activeFile.name.split(".")[0]

      setProject((prev) => ({
        ...prev,
        files: prev.files.map((f) =>
          f.id === activeFileId
            ? {
                ...f,
                language: value,
                name: `${baseName}.${newExt}`,
                content: f.content || langInfo?.defaultCode || "",
              }
            : f,
        ),
      }))
    }
  }

  const handleRunCode = async () => {
    setIsExecuting(true)
    setOutput("")
    setVariables([])
    setActiveTab("output")
    setIsDebugging(false)
    setCurrentLine(null)

    try {
      // Get the active file's content
      const activeFile = project.files.find((f) => f.id === activeFileId)
      if (!activeFile) throw new Error("No active file found")

      const result = await executeCode(activeFile.content, activeFile.language, input)
      setOutput(result.output || "No output")

      // Parse variables from execution result
      const parsedVars = parseVariables(result.debug || {}, activeFile.language)
      setVariables(parsedVars)

      if (parsedVars.length > 0) {
        setActiveTab("variables")
      }
    } catch (error) {
      setOutput(`Error: ${error.message || "Failed to execute code"}`)
    } finally {
      setIsExecuting(false)
    }
  }

  const handleDebugStart = async () => {
    setIsDebugging(true)
    setOutput("")
    setVariables([])
    setActiveTab("variables")

    // Start at the first line or first breakpoint
    const firstBreakpoint = breakpoints.length > 0 ? Math.min(...breakpoints) : 1
    setCurrentLine(firstBreakpoint)

    try {
      // Get the active file's content
      const activeFile = project.files.find((f) => f.id === activeFileId)
      if (!activeFile) throw new Error("No active file found")

      // Execute code up to the first breakpoint
      const result = await executeCode(activeFile.content, activeFile.language, input, { stopAtLine: firstBreakpoint })

      // Update variables
      const parsedVars = parseVariables(result.debug || {}, activeFile.language)
      setVariables(parsedVars)

      // Add line decoration
      if (editorRef.current) {
        editorRef.current.deltaDecorations(
          [],
          [
            {
              range: {
                startLineNumber: firstBreakpoint,
                startColumn: 1,
                endLineNumber: firstBreakpoint,
                endColumn: 1,
              },
              options: {
                isWholeLine: true,
                className: "current-line-decoration",
              },
            },
          ],
        )
      }
    } catch (error) {
      setOutput(`Debug Error: ${error.message || "Failed to start debugging"}`)
      setIsDebugging(false)
    }
  }

  const handleDebugStep = async () => {
    if (!isDebugging || !currentLine) return

    try {
      // Find next line or breakpoint
      const nextLine = currentLine + 1
      const nextBreakpoint = breakpoints.find((bp) => bp > currentLine)
      const stopAtLine = nextBreakpoint || nextLine

      // Get the active file's content
      const activeFile = project.files.find((f) => f.id === activeFileId)
      if (!activeFile) throw new Error("No active file found")

      // Execute code up to the next stopping point
      const result = await executeCode(activeFile.content, activeFile.language, input, {
        startAtLine: currentLine,
        stopAtLine: stopAtLine,
      })

      // Update output and variables
      setOutput((prev) => prev + (result.output || ""))
      const parsedVars = parseVariables(result.debug || {}, activeFile.language)
      setVariables(parsedVars)

      // Update current line
      setCurrentLine(stopAtLine)

      // Update line decoration
      if (editorRef.current) {
        try {
          editorRef.current.deltaDecorations(
            [],
            [
              {
                range: {
                  startLineNumber: stopAtLine,
                  startColumn: 1,
                  endLineNumber: stopAtLine,
                  endColumn: 1,
                },
                options: {
                  isWholeLine: true,
                  className: "current-line-decoration",
                },
              },
            ],
          )

          // Check if we've reached the end
          if (editorRef.current.getModel() && stopAtLine >= editorRef.current.getModel().getLineCount()) {
            setIsDebugging(false)
            toast({
              title: "Debug complete",
              description: "Reached the end of the file",
            })
          }
        } catch (error) {
          console.error("Error updating editor decorations:", error)
        }
      }
    } catch (error) {
      console.error("Debug step error:", error)
      setOutput((prev) => `${prev}\nDebug Error: ${error.message || "Failed during debugging"}`)
      setIsDebugging(false)
    }
  }

  const handleDebugStop = () => {
    setIsDebugging(false)
    setCurrentLine(null)

    // Remove line decoration
    if (editorRef.current) {
      editorRef.current.deltaDecorations([], [])
    }
  }

  const handleShareCode = () => {
    const activeFile = project.files.find((f) => f.id === activeFileId)
    if (!activeFile) return

    const encodedCode = btoa(encodeURIComponent(activeFile.content))
    const shareUrl = `${window.location.origin}/editor?lang=${activeFile.language}&code=${encodedCode}`

    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Link copied to clipboard",
        description: "Share this link with others to show your code.",
      })
    })
  }

  const handleSaveCode = () => {
    // This would connect to the backend to save the code for authenticated users
    toast({
      title: "Authentication required",
      description: "Please log in to save your code snippets.",
      variant: "destructive",
    })
  }

  const handleDownloadCode = () => {
    const activeFile = project.files.find((f) => f.id === activeFileId)
    if (!activeFile) return

    const blob = new Blob([activeFile.content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = activeFile.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target.result as string

      // Determine language from file extension
      const ext = file.name.split(".").pop().toLowerCase()
      const langMap = {
        js: "javascript",
        ts: "typescript",
        py: "python",
        java: "java",
        cpp: "cpp",
        c: "cpp",
        h: "cpp",
        hpp: "cpp",
      }

      const language = langMap[ext] || "plaintext"

      // Create a new file
      const newFile = {
        id: `file-${Date.now()}`,
        name: file.name,
        language,
        content,
        path: "/",
        isActive: true,
      }

      // Update project state
      setProject((prev) => {
        const updatedFiles = prev.files.map((f) => ({ ...f, isActive: false }))
        return {
          ...prev,
          files: [...updatedFiles, newFile],
        }
      })

      setActiveFileId(newFile.id)
      setLanguage(language)
      setCode(content)
    }
    reader.readAsText(file)
  }

  const handleAddFile = () => {
    const langInfo = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0]
    const newFile = {
      id: `file-${Date.now()}`,
      name: `new-file.${langInfo.ext}`,
      language: langInfo.id,
      content: langInfo.defaultCode,
      path: "/",
      isActive: true,
    }

    setProject((prev) => {
      const updatedFiles = prev.files.map((f) => ({ ...f, isActive: false }))
      return {
        ...prev,
        files: [...updatedFiles, newFile],
      }
    })

    setActiveFileId(newFile.id)
    setCode(langInfo.defaultCode)
  }

  const handleDeleteFile = (fileId) => {
    // Don't delete the last file
    if (project.files.length <= 1) {
      toast({
        title: "Cannot delete file",
        description: "You must have at least one file in the project",
        variant: "destructive",
      })
      return
    }

    setProject((prev) => {
      const updatedFiles = prev.files.filter((f) => f.id !== fileId)

      // If we're deleting the active file, set a new active file
      if (fileId === activeFileId) {
        const newActiveFile = updatedFiles[0]
        if (newActiveFile) {
          setActiveFileId(newActiveFile.id)
          setLanguage(newActiveFile.language)
          setCode(newActiveFile.content)
          updatedFiles[0] = { ...newActiveFile, isActive: true }
        }
      }

      return {
        ...prev,
        files: updatedFiles,
      }
    })
  }

  const handleRenameFile = (fileId, newName) => {
    setProject((prev) => ({
      ...prev,
      files: prev.files.map((f) => (f.id === fileId ? { ...f, name: newName } : f)),
    }))
  }

  const handleFileSelect = (fileId) => {
    const selectedFile = project.files.find((f) => f.id === fileId)
    if (!selectedFile) return

    setProject((prev) => ({
      ...prev,
      files: prev.files.map((f) => ({
        ...f,
        isActive: f.id === fileId,
      })),
    }))

    setActiveFileId(fileId)
    setLanguage(selectedFile.language)
    setCode(selectedFile.content)
  }

  const handleCodeChange = (value) => {
    setCode(value)

    // Update the file content
    setProject((prev) => ({
      ...prev,
      files: prev.files.map((f) => (f.id === activeFileId ? { ...f, content: value } : f)),
    }))
  }

  const handleApplyTemplate = (templateCode, templateLanguage) => {
    // Update the active file with the template
    setProject((prev) => ({
      ...prev,
      files: prev.files.map((f) =>
        f.id === activeFileId
          ? {
              ...f,
              content: templateCode,
              language: templateLanguage,
            }
          : f,
      ),
    }))

    setLanguage(templateLanguage)
    setCode(templateCode)
  }

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      // Clean up any resources
      if (editorRef.current) {
        try {
          editorRef.current.deltaDecorations([], [])
        } catch (error) {
          console.error("Error cleaning up editor decorations:", error)
        }
      }
    }
  }, [])

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b bg-white dark:bg-gray-900 dark:border-gray-800">
        <div className="container flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-4">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.id} value={lang.id}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <TemplateSelector onSelectTemplate={handleApplyTemplate} />
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleRunCode} disabled={isExecuting || isDebugging}>
                    {isExecuting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Run Code</TooltipContent>
              </Tooltip>

              <DebugControls
                isDebugging={isDebugging}
                onDebugStart={handleDebugStart}
                onDebugStep={handleDebugStep}
                onDebugStop={handleDebugStop}
                disabled={isExecuting}
              />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleShareCode}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share Code</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleSaveCode}>
                    <Save className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Save Code</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleDownloadCode}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download Code</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept=".js,.ts,.py,.java,.cpp,.c,.h,.hpp,.txt"
                      onChange={handleFileUpload}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => document.getElementById("file-upload").click()}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Upload Code</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setShowSettings(true)}>
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>

              <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />

              <GitControls project={project} />
            </TooltipProvider>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction={isMobile ? "vertical" : "horizontal"}>
          {showFileExplorer && (
            <ResizablePanel defaultSize={15} minSize={10} maxSize={25}>
              <FileExplorer
                files={project.files}
                onFileSelect={handleFileSelect}
                onAddFile={handleAddFile}
                onDeleteFile={handleDeleteFile}
                onRenameFile={handleRenameFile}
                activeFileId={activeFileId}
              />
            </ResizablePanel>
          )}

          <ResizablePanel defaultSize={showFileExplorer ? 45 : 60} minSize={30}>
            <div className="h-full">
              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={handleCodeChange}
                onMount={handleEditorDidMount}
                theme={theme}
                options={{
                  minimap: { enabled: false },
                  fontSize: fontSize,
                  tabSize: tabSize,
                  wordWrap: wordWrap,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  glyphMargin: true, // For breakpoints
                  lineNumbers: "on",
                }}
                loading={<div className="flex items-center justify-center h-full">Loading editor...</div>}
              />
            </div>
          </ResizablePanel>

          <ResizablePanel defaultSize={40} minSize={20}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={50} minSize={20}>
                <div className="h-full border-l border-t p-4 bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      Input
                    </h3>
                  </div>
                  <Textarea
                    className="h-[calc(100%-2rem)] resize-none font-mono text-sm dark:bg-gray-800 dark:text-gray-200"
                    placeholder="Enter input for your program here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </div>
              </ResizablePanel>

              <ResizablePanel defaultSize={50} minSize={20}>
                <div className="h-full border-l border-t bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                    <div className="border-b px-4 dark:border-gray-800">
                      <TabsList className="bg-transparent h-10">
                        <TabsTrigger
                          value="output"
                          className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
                        >
                          Output
                        </TabsTrigger>
                        <TabsTrigger
                          value="variables"
                          className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
                        >
                          Variables
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent value="output" className="flex-1 p-0 m-0">
                      <div className="p-4 h-full">
                        <pre className="font-mono text-sm whitespace-pre-wrap h-full overflow-auto dark:text-gray-200">
                          {isExecuting ? "Executing code..." : output || "Run your code to see output here."}
                        </pre>
                      </div>
                    </TabsContent>

                    <TabsContent value="variables" className="flex-1 p-0 m-0">
                      <VariableInspector variables={variables} />
                    </TabsContent>
                  </Tabs>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>

      <SettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        settings={{
          fontSize,
          tabSize,
          wordWrap,
        }}
        onSettingsChange={(newSettings) => {
          setFontSize(newSettings.fontSize)
          setTabSize(newSettings.tabSize)
          setWordWrap(newSettings.wordWrap)
        }}
      />

      <style jsx global>{`
        .breakpoint-glyph {
          background-color: #e51400;
          border-radius: 50%;
          width: 8px !important;
          height: 8px !important;
          margin-left: 5px;
        }
        .current-line-decoration {
          background-color: rgba(173, 214, 255, 0.15);
        }
        .dark .current-line-decoration {
          background-color: rgba(173, 214, 255, 0.1);
        }
      `}</style>
    </div>
  )
}
