export const JUDGE0_CONFIG = {
  // You can use the public Judge0 API or host your own instance
  API_URL: process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com',
  API_KEY: process.env.JUDGE0_API_KEY,
  RAPIDAPI_HOST: 'judge0-ce.p.rapidapi.com',
  
  // Language IDs mapping
  LANGUAGE_IDS: {
    javascript: 63,  // Node.js
    typescript: 74,  // TypeScript
    python: 71,      // Python 3
    java: 62,        // Java
    cpp: 54,         // C++
    c: 50,           // C
    go: 60,          // Go
    rust: 73,        // Rust
    php: 68,         // PHP
    ruby: 72,        // Ruby
  },
  
  // Default time and memory limits
  DEFAULT_TIME_LIMIT: 5000,  // 5 seconds
  DEFAULT_MEMORY_LIMIT: 128000,  // 128MB
}

// Log configuration (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('Judge0 Configuration:', {
    API_URL: JUDGE0_CONFIG.API_URL,
    API_KEY: JUDGE0_CONFIG.API_KEY ? '***' : 'Not set',
    RAPIDAPI_HOST: JUDGE0_CONFIG.RAPIDAPI_HOST,
  })
} 