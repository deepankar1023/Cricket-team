# CodeCraft - Advanced Online Code Editor

CodeCraft is a feature-rich online code editor built with Next.js, Monaco Editor, and modern web technologies. It provides a comprehensive development environment with support for multiple programming languages, debugging, file management, and more.

## Features

### Core Editor
- Monaco Editor integration with syntax highlighting
- Support for multiple programming languages (JavaScript, TypeScript, Python, Java, C++)
- Code execution with input/output panels
- Variable inspection for debugging

### File System & Multi-Tab Support
- Tabbed interface for multiple files
- File explorer with add/delete/rename capabilities
- File content persistence

### Code Intelligence
- IntelliSense for JavaScript/TypeScript
- Language-specific features and syntax highlighting

### Linting & Error Highlighting
- Built-in linter for JavaScript/TypeScript
- Syntax error detection

### Debugging Support
- Breakpoint setting via gutter clicks
- Step-through execution
- Variable state tracking
- Real-time output logs

### Version Control Integration
- GitHub login integration
- Commit changes to repositories
- Repository management

### Customization & UX
- Theme switching (light/dark/GitHub themes)
- Font size, tab size, and word wrap settings
- Settings persistence via localStorage
- Responsive layout with resizable panels

### Templates & Starter Kits
- Language-specific code templates
- Quick-start examples

### Mobile Responsiveness
- Responsive design for all screen sizes
- Collapsible panels on small screens
- Touch-friendly interface

## Environment Variables

The following environment variables are required for full functionality:

\`\`\`
# GitHub OAuth for version control integration
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# For code execution service (if using Judge0 API)
JUDGE0_API_KEY=your_judge0_api_key
JUDGE0_API_URL=https://judge0-api-url.com

# Database connection (for saving code snippets)
DATABASE_URL=your_database_connection_string
\`\`\`

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables in `.env.local`
4. Run the development server with `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Implementation Notes

### Code Execution

The current implementation uses a mock execution service for demonstration purposes. In a production environment, you would integrate with:

- Judge0 API for multi-language code execution
- Language-specific sandboxes for secure code execution
- WebAssembly for client-side execution of certain languages

### Database Integration

To persist user code and projects, integrate with:

- Supabase, Firebase, or MongoDB for storing code snippets
- NextAuth.js for user authentication and session management

### Language Server Protocol (LSP)

For advanced code intelligence in languages like Python and C++:

1. Set up language servers on your backend
2. Create WebSocket connections to these servers
3. Implement the LSP client in the Monaco Editor

## License

MIT
