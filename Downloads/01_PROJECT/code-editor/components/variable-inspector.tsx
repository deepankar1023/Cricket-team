"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, Variable } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface VariableValue {
  type: string
  value: any
  children?: Record<string, VariableValue>
}

interface VariableData {
  name: string
  value: VariableValue
  iteration?: number
}

interface VariableInspectorProps {
  variables: VariableData[]
}

export function VariableInspector({ variables }: VariableInspectorProps) {
  const [expandedVars, setExpandedVars] = useState<Record<string, boolean>>({})

  const toggleExpand = (varName: string) => {
    setExpandedVars((prev) => ({
      ...prev,
      [varName]: !prev[varName],
    }))
  }

  const renderVariableValue = (variable: VariableData) => {
    if (!variable || !variable.value) {
      return null
    }

    const { name, value } = variable
    const isExpanded = expandedVars[name]
    const hasChildren = value.type === "object" || value.type === "array"

    const displayValue = (() => {
      if (!value) return ""

      switch (value.type) {
        case "string":
          return `"${value.value}"`
        case "null":
          return "null"
        case "undefined":
          return "undefined"
        case "object":
          return isExpanded ? "" : "{...}"
        case "array":
          return isExpanded ? "" : "[...]"
        default:
          return String(value.value)
      }
    })()

    return (
      <>
        <TableRow key={name} className="hover:bg-gray-50 dark:hover:bg-gray-800">
          <TableCell className="font-medium">
            {hasChildren && (
              <button onClick={() => toggleExpand(name)} className="mr-1 inline-flex items-center justify-center">
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            )}
            {name}
            {variable.iteration !== undefined && (
              <span className="text-gray-500 ml-1">(iteration {variable.iteration})</span>
            )}
          </TableCell>
          <TableCell>{value.type}</TableCell>
          <TableCell className="font-mono">{displayValue}</TableCell>
        </TableRow>

        {isExpanded &&
          hasChildren &&
          value.children &&
          Object.entries(value.children).map(([childName, childValue]) => (
            <TableRow key={`${name}.${childName}`} className="bg-gray-50/50 dark:bg-gray-800/50">
              <TableCell className="pl-8 font-medium">{childName}</TableCell>
              <TableCell>{childValue?.type || "unknown"}</TableCell>
              <TableCell className="font-mono">
                {childValue?.type === "string" ? `"${childValue.value}"` : String(childValue?.value || "")}
              </TableCell>
            </TableRow>
          ))}
      </>
    )
  }

  return (
    <div className="h-full p-4 dark:bg-gray-900 dark:text-gray-200">
      <div className="flex items-center gap-1 mb-2">
        <Variable className="h-4 w-4" />
        <h3 className="text-sm font-medium">Variable Inspector</h3>
      </div>

      {variables.length === 0 ? (
        <div className="text-sm text-gray-500 dark:text-gray-400 h-full flex items-center justify-center">
          Run your code to inspect variables
        </div>
      ) : (
        <ScrollArea className="h-[calc(100%-2rem)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{variables.map((variable) => renderVariableValue(variable))}</TableBody>
          </Table>
        </ScrollArea>
      )}
    </div>
  )
}
