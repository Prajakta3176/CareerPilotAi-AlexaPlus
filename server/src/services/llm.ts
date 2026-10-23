/**
 * LLM Service — Groq via OpenAI-compatible API
 * Domain-agnostic: works for any job, any field.
 */
import OpenAI from 'openai';

const groqClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || '',
  baseURL: 'https://api.groq.com/openai/v1',
});

const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

export async function callLLM(systemPrompt: string, userPrompt: string): Promise<string> {
  try {
    const response = await groqClient.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 4096,
    });
    return response.choices[0]?.message?.content || '';
  } catch (err: any) {
    console.error('[LLM] callLLM error:', err?.message || err);
    throw new Error(`LLM call failed: ${err?.message || 'Unknown error'}`);
  }
}

export async function callLLMJSON<T>(systemPrompt: string, userPrompt: string): Promise<T> {
  try {
    const response = await groqClient.chat.completions.create({
      model: MODEL,
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
    console.error('[LLM] callLLMJSON error:', err?.message || err);
    throw new Error(`LLM JSON call failed: ${err?.message || 'Unknown error'}`);
  }
}
