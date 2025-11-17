import axios from 'axios';

const PERPLEXITY_API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY || '';
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  message: string;
  error?: string;
}

// System prompt to customize the assistant's behavior
const SYSTEM_PROMPT = `You are MiningMitra AI, an intelligent assistant specialized in mining safety, environmental monitoring, and industrial operations. You help users with:

- Mining corridor safety analysis
- Environmental compliance and DEES scores
- Worker health and safety protocols
- Equipment maintenance predictions
- Incident response and prevention
- Export certificate verification
- Blockchain technology in mining
- Mining regulations and best practices

Be concise, professional, and helpful. Use technical terms when appropriate but explain them clearly. Always prioritize safety and compliance in your responses. Keep responses under 150 words unless detailed explanation is requested.`;

export async function sendMessageToPerplexity(
  messages: Message[]
): Promise<ChatResponse> {
  try {
    // Prepend system prompt if not already included
    const messagesWithSystem = messages[0]?.role === 'system' 
      ? messages 
      : [{ role: 'system' as const, content: SYSTEM_PROMPT }, ...messages];

    const response = await axios.post(
      PERPLEXITY_API_URL,
      {
        model: 'llama-3.1-sonar-large-128k-online',
        messages: messagesWithSystem,
        temperature: 0.7,
        max_tokens: 500,
        stream: false,
      },
      {
        headers: {
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const assistantMessage = response.data.choices[0]?.message?.content || 'No response received';
    
    return {
      message: assistantMessage,
    };
  } catch (error: any) {
    console.error('Perplexity API Error:', error);
    
    return {
      message: 'Sorry, I encountered an error processing your request. Please try again.',
      error: error.response?.data?.error?.message || error.message || 'Unknown error',
    };
  }
}

// Predefined quick questions for mining safety
export const QUICK_QUESTIONS = [
  'What is a DEES score?',
  'How to improve corridor safety?',
  'Best practices for worker health monitoring',
  'What causes high pollution in mining corridors?',
  'How to reduce equipment downtime?',
  'Mining safety regulations overview',
];
