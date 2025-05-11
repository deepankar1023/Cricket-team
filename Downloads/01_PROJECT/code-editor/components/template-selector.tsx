"use client"
import { FileCode, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TemplateSelectorProps {
  onSelectTemplate: (code: string, language: string) => void
}

export function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  const templates = [
    {
      name: "JavaScript - Fibonacci",
      language: "javascript",
      code: `// Fibonacci sequence generator
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculate first 10 Fibonacci numbers
for (let i = 0; i < 10; i++) {
  console.log(\`Fibonacci(\${i}) = \${fibonacci(i)}\`);
}`,
    },
    {
      name: "JavaScript - Sorting Algorithm",
      language: "javascript",
      code: `// Bubble sort implementation
function bubbleSort(arr) {
  const n = arr.length;
  let swapped;
  
  do {
    swapped = false;
    for (let i = 0; i < n - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        // Swap elements
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
    }
  } while (swapped);
  
  return arr;
}

// Test the sorting algorithm
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log("Original array:", numbers);
console.log("Sorted array:", bubbleSort([...numbers]));`,
    },
    {
      name: "Python - Hello World",
      language: "python",
      code: `# Simple Python program
def greet(name):
    return f"Hello, {name}!"

# Test the function
for name in ["World", "Python", "Programmer"]:
    print(greet(name))`,
    },
    {
      name: "Python - Data Analysis",
      language: "python",
      code: `# Simple data analysis example
data = [12, 45, 67, 23, 89, 34, 56, 78, 90, 32]

# Calculate statistics
def analyze_data(numbers):
    total = sum(numbers)
    count = len(numbers)
    average = total / count
    minimum = min(numbers)
    maximum = max(numbers)
    
    return {
        "total": total,
        "count": count,
        "average": average,
        "minimum": minimum,
        "maximum": maximum
    }

# Print results
results = analyze_data(data)
for key, value in results.items():
    print(f"{key.capitalize()}: {value}")`,
    },
    {
      name: "TypeScript - Interface Example",
      language: "typescript",
      code: `// TypeScript interface example
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  roles?: string[];
}

// Create some users
const users: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com", isActive: true, roles: ["admin"] },
  { id: 2, name: "Bob", email: "bob@example.com", isActive: false },
  { id: 3, name: "Charlie", email: "charlie@example.com", isActive: true, roles: ["editor"] }
];

// Filter active users
const activeUsers = users.filter(user => user.isActive);
console.log("Active users:", activeUsers);

// Find admin users
const adminUsers = users.filter(user => user.roles?.includes("admin"));
console.log("Admin users:", adminUsers);`,
    },
    {
      name: "C++ - Basic Example",
      language: "cpp",
      code: `#include <iostream>
#include <vector>
#include <string>

// Simple C++ program
int main() {
    // Create a vector of strings
    std::vector<std::string> names = {"Alice", "Bob", "Charlie", "David"};
    
    // Print all names
    std::cout << "Names:" << std::endl;
    for (const auto& name : names) {
        std::cout << "  - " << name << std::endl;
    }
    
    // Calculate the total length of all names
    int totalLength = 0;
    for (const auto& name : names) {
        totalLength += name.length();
    }
    
    std::cout << "Total length of all names: " << totalLength << std::endl;
    
    return 0;
}`,
    },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-1">
          <FileCode className="h-4 w-4 mr-1" />
          Templates
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Code Templates</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {templates.map((template, index) => (
            <DropdownMenuItem key={index} onClick={() => onSelectTemplate(template.code, template.language)}>
              {template.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
