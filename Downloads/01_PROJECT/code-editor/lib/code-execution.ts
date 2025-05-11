import { JUDGE0_CONFIG } from './judge0-config'

interface ExecutionOptions {
  stopAtLine?: number
  startAtLine?: number
  timeLimit?: number
  memoryLimit?: number
}

interface ExecutionResult {
  output: string
  status: "success" | "error"
  debug?: any
  executionTime?: number
  memoryUsed?: number
}

async function createSubmission(code: string, language: string, input: string, options: ExecutionOptions = {}) {
  const languageId = JUDGE0_CONFIG.LANGUAGE_IDS[language as keyof typeof JUDGE0_CONFIG.LANGUAGE_IDS]
  if (!languageId) {
    throw new Error(`Language ${language} is not supported`)
  }

  if (!JUDGE0_CONFIG.API_KEY) {
    throw new Error('Judge0 API key is not configured. Please set JUDGE0_API_KEY in your .env.local file')
  }

  const requestBody = {
    source_code: code,
    language_id: languageId,
    stdin: input,
    cpu_time_limit: options.timeLimit || JUDGE0_CONFIG.DEFAULT_TIME_LIMIT,
    memory_limit: options.memoryLimit || JUDGE0_CONFIG.DEFAULT_MEMORY_LIMIT,
  }

  console.log('Creating submission with:', {
    language,
    languageId,
    timeLimit: requestBody.cpu_time_limit,
    memoryLimit: requestBody.memory_limit,
  })

  try {
    const response = await fetch(`${JUDGE0_CONFIG.API_URL}/submissions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': JUDGE0_CONFIG.API_KEY,
        'X-RapidAPI-Host': JUDGE0_CONFIG.RAPIDAPI_HOST,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Judge0 API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      })
      throw new Error(`Failed to create submission: ${response.statusText} - ${errorText}`)
    }

    return response.json()
  } catch (error) {
    console.error('Error creating submission:', error)
    throw error
  }
}

async function getSubmission(token: string) {
  if (!JUDGE0_CONFIG.API_KEY) {
    throw new Error('Judge0 API key is not configured')
  }

  try {
    const response = await fetch(`${JUDGE0_CONFIG.API_URL}/submissions/${token}`, {
      headers: {
        'X-RapidAPI-Key': JUDGE0_CONFIG.API_KEY,
        'X-RapidAPI-Host': JUDGE0_CONFIG.RAPIDAPI_HOST,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Judge0 API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      })
      throw new Error(`Failed to get submission: ${response.statusText} - ${errorText}`)
    }

    return response.json()
  } catch (error) {
    console.error('Error getting submission:', error)
    throw error
  }
}

export async function executeCode(
  code: string,
  language: string,
  input: string,
  options: ExecutionOptions = {},
): Promise<ExecutionResult> {
  try {
    // Create submission
    const submission = await createSubmission(code, language, input, options)
    console.log('Submission created:', submission)
    
    // Poll for results
    let result
    let attempts = 0
    const maxAttempts = 10
    
    while (attempts < maxAttempts) {
      result = await getSubmission(submission.token)
      console.log('Submission status:', result.status)
      
      if (result.status.id !== 1 && result.status.id !== 2) {
        break
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      attempts++
    }

    if (!result) {
      throw new Error('Execution timed out')
    }

    // Process the result
    const status = result.status.id === 3 ? 'success' : 'error'
    let output = result.stdout || ''
    
    if (result.stderr) {
      output += `\nError: ${result.stderr}`
    }
    
    if (result.compile_output) {
      output += `\nCompilation: ${result.compile_output}`
    }

    return {
      output,
      status,
      debug: {
        executionTime: result.time,
        memoryUsed: result.memory,
        status: result.status.description,
      },
      executionTime: result.time,
      memoryUsed: result.memory,
    }
  } catch (error) {
    console.error('Code execution error:', error)
    return {
      output: `Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`,
      status: 'error',
      debug: {},
    }
  }
}
