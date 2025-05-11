import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code2, Share2, Save } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <Code2 className="h-6 w-6" />
            <span>CodeCraft</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container px-4 md:px-6 py-12 md:py-24 lg:py-32">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Code, Execute, Share</h1>
              <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                A powerful online code editor with real-time execution, variable inspection, and seamless sharing
                capabilities.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/editor">
                  <Button className="gap-1">
                    Start Coding <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[500px] aspect-video rounded-xl border bg-gray-100/40 p-2">
              <div className="rounded-lg bg-white shadow-sm h-full w-full overflow-hidden border">
                <div className="h-8 bg-gray-100 border-b flex items-center px-3 gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="ml-2 text-xs text-gray-500">CodeCraft Editor</div>
                </div>
                <div className="p-4 text-sm font-mono text-gray-800 bg-gray-50 h-[calc(100%-2rem)] overflow-hidden">
                  <pre className="text-xs">
                    <code className="language-javascript">
                      {`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculate first 10 Fibonacci numbers
for (let i = 0; i < 10; i++) {
  console.log(fibonacci(i));
}`}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="container px-4 md:px-6 py-12">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 rounded-full bg-primary/10">
                <Code2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Multiple Languages</h3>
              <p className="text-gray-500">
                Support for JavaScript, Python, Java, C++, and many more programming languages.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 rounded-full bg-primary/10">
                <Share2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Shareable Snippets</h3>
              <p className="text-gray-500">Generate short links to share your code with others instantly.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 rounded-full bg-primary/10">
                <Save className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Save Your Work</h3>
              <p className="text-gray-500">
                Authenticated users can save, organize, and access their code snippets anytime.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-2 sm:flex-row py-6 px-4 md:px-6 items-center justify-between">
          <p className="text-sm text-gray-500">© 2025 CodeCraft. All rights reserved.</p>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="#" className="text-sm hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="#" className="text-sm hover:underline underline-offset-4">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
