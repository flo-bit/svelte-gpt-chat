import type { ChatGPTMessage } from '../../../openaistream';
import { chatComplete } from '../api-calls';
import { env } from '$env/dynamic/private';

export async function POST({ request }) {
  const body = await request.json();
  const messages: ChatGPTMessage[] = [];
  messages.push(...body?.messages);

  const temperature = body?.temperature ? parseFloat(body?.temperature) : 0.7;
  const max_tokens = body?.max_tokens ? parseInt(body?.max_tokens) : 100;

  return await chatComplete(messages, env.OPENAI_API_KEY, temperature, max_tokens);
}
