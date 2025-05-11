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

export function parseVariables(debugData: any, language: string): VariableData[] {
  const result: VariableData[] = []

  if (!debugData || !debugData.variables) {
    return result
  }

  // Process variables based on language
  if (language === "javascript") {
    const { variables, iterations } = debugData

    // Process regular variables
    for (const [name, value] of Object.entries(variables)) {
      result.push({
        name,
        value: parseValue(value),
      })
    }

    // Process iterations if available
    if (iterations) {
      for (const [varName, values] of Object.entries(iterations)) {
        if (Array.isArray(values)) {
          values.forEach((value, index) => {
            result.push({
              name: varName,
              value: parseValue(value),
              iteration: index,
            })
          })
        }
      }
    }
  } else if (language === "python") {
    // Process Python variables (mock implementation)
    const { variables } = debugData

    for (const [name, value] of Object.entries(variables)) {
      result.push({
        name,
        value: parseValue(value),
      })
    }
  }

  return result
}

function parseValue(value: any): VariableValue {
  if (value === null) {
    return { type: "null", value: null }
  }

  if (value === undefined) {
    return { type: "undefined", value: undefined }
  }

  const type = typeof value

  if (type === "object") {
    if (Array.isArray(value)) {
      const children: Record<string, VariableValue> = {}

      value.forEach((item, index) => {
        children[index.toString()] = parseValue(item)
      })

      return {
        type: "array",
        value: `Array(${value.length})`,
        children,
      }
    } else {
      const children: Record<string, VariableValue> = {}

      for (const [key, val] of Object.entries(value)) {
        children[key] = parseValue(val)
      }

      return {
        type: "object",
        value: `Object`,
        children,
      }
    }
  }

  return { type, value }
}
