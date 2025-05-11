"use client"

import { useState } from "react"
import { executeCode } from "@/lib/code-execution"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const TEST_EXAMPLES = {
  javascript: `console.log("Hello from JavaScript!");
const sum = (a, b) => a + b;
console.log("Sum of 5 and 3:", sum(5, 3));`,
  
  python: `print("Hello from Python!")
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
print("Fibonacci of 5:", fibonacci(5))`,
  
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
        int sum = 0;
        for(int i = 1; i <= 5; i++) {
            sum += i;
        }
        System.out.println("Sum of first 5 numbers: " + sum);
    }
}`,
  
  cpp: `#include <iostream>
using namespace std;
int main() {
    cout << "Hello from C++!" << endl;
    int factorial = 1;
    for(int i = 1; i <= 5; i++) {
        factorial *= i;
    }
    cout << "Factorial of 5: " << factorial << endl;
    return 0;
}`
}

export default function TestExecution() {
  const [language, setLanguage] = useState("javascript")
  const [code, setCode] = useState(TEST_EXAMPLES.javascript)
  const [output, setOutput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRun = async () => {
    setIsLoading(true)
    setError("")
    setOutput("")
    
    try {
      const result = await executeCode(code, language, "")
      setOutput(result.output)
      if (result.status === "error") {
        setError(result.output)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    setCode(TEST_EXAMPLES[value as keyof typeof TEST_EXAMPLES] || "")
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Code Execution Test</h1>
      
      <div className="flex gap-4 mb-4">
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
          </SelectContent>
        </Select>
        
        <Button onClick={handleRun} disabled={isLoading}>
          {isLoading ? "Running..." : "Run Code"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Code</h2>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="h-[400px] font-mono"
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Output</h2>
          <div className="border rounded-md p-4 h-[400px] overflow-auto bg-gray-50 font-mono">
            {isLoading ? (
              <div className="text-gray-500">Running code...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : output ? (
              <pre className="whitespace-pre-wrap">{output}</pre>
            ) : (
              <div className="text-gray-500">Output will appear here</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 