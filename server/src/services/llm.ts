/**
 * LLM Service — Groq via OpenAI-compatible API
 * Domain-agnostic: works for any job, any field.
 * Includes auto-detection & fallback across available Groq models.
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

function getBaseUrl(): string {
  const provider = (process.env.LLM_PROVIDER || 'groq').toLowerCase();
  if (provider === 'groq' || process.env.GROQ_API_KEY) {
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

// Model cascade: try user-configured model first, then auto-fallback to supported Groq models
const CANDIDATE_MODELS = [
  (process.env.GROQ_MODEL || 'llama-3.1-8b-instant').trim().replace(/^["']|["']$/g, ''),
  'llama-3.1-8b-instant',
  'llama-3.3-70b-versatile',
  'llama-3.1-70b-versatile',
  'llama3-70b-8192',
  'llama3-8b-8192',
  'mixtral-8x7b-32768',
];

// Deduplicate candidate models
const UNIQUE_MODELS = Array.from(new Set(CANDIDATE_MODELS));
let verifiedWorkingModel: string | null = null;

export async function testGroqConnection(): Promise<any> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return {
      status: 'error',
      reason: 'GROQ_API_KEY is missing or empty in .env',
      keyDetected: false,
    };
  }

  const maskedKey = apiKey.length > 8 ? `${apiKey.slice(0, 6)}...${apiKey.slice(-4)}` : '***';
  const client = createClient();
  const model = (process.env.GROQ_MODEL || 'llama-3.1-8b-instant').trim().replace(/^["']|["']$/g, '');

  try {
    const res = await client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: 'Say "hello" in 1 word.' }],
      max_tokens: 10,
    });
    return {
      status: 'success',
      modelUsed: model,
      keyMasked: maskedKey,
      reply: res.choices[0]?.message?.content,
    };
  } catch (err: any) {
    return {
      status: 'error',
      modelAttempted: model,
      keyMasked: maskedKey,
      statusCode: err?.status || err?.statusCode,
      errorMessage: err?.message,
      errorDetails: err?.error || err,
    };
  }
}

export async function callLLM(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn('[LLM] GROQ_API_KEY is missing or empty. Please check your .env file.');
    throw new Error('GROQ_API_KEY is not configured in .env');
  }

  const client = createClient();
  const modelsToTry = verifiedWorkingModel
    ? [verifiedWorkingModel, ...UNIQUE_MODELS.filter((m) => m !== verifiedWorkingModel)]
    : UNIQUE_MODELS;

  let lastError: any = null;

  for (const model of modelsToTry) {
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

      verifiedWorkingModel = model;
      return response.choices[0]?.message?.content || '';
    } catch (err: any) {
      lastError = err;
      const isNotFound = err?.status === 404 || err?.message?.includes('does not exist') || err?.message?.includes('not have access');
      if (isNotFound) {
        console.warn(`[LLM] Model "${model}" not available on this Groq account. Trying fallback model...`);
        continue;
      }
      console.error(`[LLM] Error with model "${model}":`, err?.message || err);
      throw new Error(`LLM call failed: ${err?.message || 'Unknown error'}`);
    }
  }

  throw new Error(`LLM call failed after trying models [${modelsToTry.join(', ')}]: ${lastError?.message || 'Unknown error'}`);
}

export async function callLLMJSON<T>(systemPrompt: string, userPrompt: string): Promise<T> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn('[LLM] GROQ_API_KEY is missing or empty. Please check your .env file.');
    throw new Error('GROQ_API_KEY is not configured in .env');
  }

  const client = createClient();
  const modelsToTry = verifiedWorkingModel
    ? [verifiedWorkingModel, ...UNIQUE_MODELS.filter((m) => m !== verifiedWorkingModel)]
    : UNIQUE_MODELS;

  let lastError: any = null;

  for (const model of modelsToTry) {
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

      verifiedWorkingModel = model;
      const content = response.choices[0]?.message?.content || '{}';
      return JSON.parse(content) as T;
    } catch (err: any) {
      lastError = err;
      const isNotFound = err?.status === 404 || err?.message?.includes('does not exist') || err?.message?.includes('not have access');
      if (isNotFound) {
        console.warn(`[LLM] Model "${model}" not available for JSON on this Groq account. Trying fallback model...`);
        continue;
      }
      console.error(`[LLM] Error with model "${model}":`, err?.message || err);
      throw new Error(`LLM JSON call failed: ${err?.message || 'Unknown error'}`);
    }
  }

  throw new Error(`LLM JSON call failed after trying models [${modelsToTry.join(', ')}]: ${lastError?.message || 'Unknown error'}`);
}
