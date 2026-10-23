/**
 * LLM Service — Groq via OpenAI-compatible API
 * Domain-agnostic: works for any job, any field.
 */
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';

// Ensure .env is loaded from server dir or project root
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function getApiKey(): string {
  const raw = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || '';
  return raw.trim().replace(/^["']|["']$/g, '');
}

function getModel(): string {
  const raw = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  return raw.trim().replace(/^["']|["']$/g, '');
}

function getBaseUrl(): string {
  if (process.env.GROQ_API_KEY) {
    return 'https://api.groq.com/openai/v1';
  }
  return process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
}

function createClient(): OpenAI {
  const apiKey = getApiKey();
  return new OpenAI({
    apiKey: apiKey || 'dummy-key',
    baseURL: getBaseUrl(),
  });
}

export async function callLLM(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn('[LLM] GROQ_API_KEY is missing or empty. Please check your .env file.');
    throw new Error('GROQ_API_KEY is not configured in .env');
  }

  const client = createClient();
  const model = getModel();

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 4096,
    });
    return response.choices[0]?.message?.content || '';
  } catch (err: any) {
    console.error(`[LLM] callLLM error with model ${model}:`, err?.message || err);
    throw new Error(`LLM call failed: ${err?.message || 'Unknown error'}`);
  }
}

export async function callLLMJSON<T>(systemPrompt: string, userPrompt: string): Promise<T> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn('[LLM] GROQ_API_KEY is missing or empty. Please check your .env file.');
    throw new Error('GROQ_API_KEY is not configured in .env');
  }

  const client = createClient();
  const model = getModel();

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    });
    const content = response.choices[0]?.message?.content || '{}';
    return JSON.parse(content) as T;
  } catch (err: any) {
    console.error(`[LLM] callLLMJSON error with model ${model}:`, err?.message || err);
    throw new Error(`LLM JSON call failed: ${err?.message || 'Unknown error'}`);
  }
}
